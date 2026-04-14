import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import {
  Bold,
  Button,
  Divider,
  H1,
  Link,
  ParMd,
  WrappedInput,
  useToast,
} from "@/lib/ui";
import { handleErrorMessage, ReactSetter, TXLego } from "@/lib/utils";
import { useTxBuilder } from "@/lib/tx-builder";
import { isValidNetwork, ValidNetwork } from "@/lib/keychain-utils";

import { AdvancedSegment } from "./AdvancedSegment";
import { MembersSegment } from "./MemberSegment";
import { ShamanSegment } from "./ShamanSegment";
import { StakeTokensSegment } from "./StakeTokenSegment";
import { TimingSegment } from "./TimingSegment";
import { ConnectBox } from "./ConnectBox";
import { FORM_KEYS } from "@/features/summon/utils/formKeys";
import {
  assembleSummonTxArgs,
  canSummonOnNetwork,
  SummonParams,
  SUMMON_TX,
} from "@/features/summon/utils/transactions";
import type { SummonState } from "./types";

type SummonerFormProps = {
  chainId?: string;
  isConnected: boolean;
  setSummonState: ReactSetter<SummonState>;
  setTxHash: ReactSetter<string>;
  setDaoAddress: ReactSetter<string>;
  setErrMsg: ReactSetter<string>;
};

export const SummonerForm = ({
  chainId,
  isConnected,
  setSummonState,
  setTxHash,
  setDaoAddress,
  setErrMsg,
}: SummonerFormProps) => {
  const methods = useForm<SummonParams>({
    mode: "onTouched",
    defaultValues: {
      quorum: "0",
      minRetention: "66",
      sponsorThreshold: "0",
      newOffering: "0",
      votingTransferable: false,
      nvTransferable: false,
    },
  });
  const {
    formState: { isValid },
    handleSubmit,
  } = methods;
  const { fireTransaction } = useTxBuilder();
  const { errorToast, successToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDisabled =
    !isValid || isSubmitting || !chainId || !canSummonOnNetwork(chainId);
  const formDisabled = isSubmitting;

  const handleFormSubmit: SubmitHandler<SummonParams> = async (formValues) => {
    if (!chainId || !isValidNetwork(chainId)) {
      setErrMsg("Please connect to a supported network before summoning.");
      setSummonState("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const args = assembleSummonTxArgs(
        formValues as Record<string, unknown>,
        chainId as ValidNetwork,
      );

      const executed = await fireTransaction({
        tx: {
          ...SUMMON_TX,
          staticArgs: args,
        } as TXLego,
        lifeCycleFns: {
          onTxHash(txHash) {
            setTxHash(txHash);
            setSummonState("loading");
          },
          onPollSuccess(result) {
            const nextDaoAddress = result?.data?.transaction?.daoAddress;

            if (nextDaoAddress) {
              successToast({
                title: "DAO Summoned",
                description: "Your Moloch V3 has been summoned!",
              });
              setDaoAddress(nextDaoAddress);
              setSummonState("success");
              setIsSubmitting(false);
              return;
            }

            setErrMsg(
              "Subgraph poll did not include a DAO address. Check the transaction receipt for summon details.",
            );
            errorToast({
              title: "Summon Error",
              description: "No DAO address found in the indexed result.",
            });
            setSummonState("error");
            setIsSubmitting(false);
          },
          onTxError(error) {
            const message = handleErrorMessage({ error });
            setErrMsg(message);
            errorToast({ title: "Summon Error", description: message });
            setSummonState("error");
            setIsSubmitting(false);
          },
          onPollError(error) {
            const message = handleErrorMessage({ error });
            setErrMsg(message);
            errorToast({ title: "Summon Error", description: message });
            setSummonState("error");
            setIsSubmitting(false);
          },
        },
      });

      if (!executed) {
        setIsSubmitting(false);
      }
    } catch (error) {
      const message = handleErrorMessage({ error });
      setErrMsg(message);
      errorToast({ title: "Summon Error", description: message });
      setSummonState("error");
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="main-column" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <div className="title-section">
          <H1 className="title">
            <Bold>Summon a DAO</Bold>
          </H1>
          <ParMd>
            Learn more about{" "}
            <Link href="https://daohaus.mirror.xyz/U_JQtheSzdpRFqQwf9Ow3LgLNG0WMZ6ibAyrjWDu_fc">
              Moloch v3
            </Link>
          </ParMd>
        </div>
        <div>
          <WrappedInput
            id={FORM_KEYS.DAO_NAME}
            label="DAO Name"
            placeholder="DAO Name"
            full
            disabled={formDisabled}
            rules={{
              required: "DAO name is required",
              maxLength: {
                value: 128,
                message: "DAO name must be 128 characters or less",
              },
            }}
          />
          <Divider className="top-divider" />
        </div>
        <StakeTokensSegment formDisabled={formDisabled} />
        <TimingSegment formDisabled={formDisabled} />
        <AdvancedSegment formDisabled={formDisabled} chainId={chainId} />
        <MembersSegment formDisabled={formDisabled} />
        <ShamanSegment formDisabled={formDisabled} />
        {!isConnected && <ConnectBox />}
        <Button fullWidth size="lg" type="submit" disabled={submitDisabled}>
          Summon DAO
        </Button>
      </form>
    </FormProvider>
  );
};
