import { useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { useChainId } from 'wagmi';

import { TXLifeCycleFns, useTxBuilder } from '@/lib/tx-builder';
import { FormBuilderBase, FormLego } from '@/lib/form-builder/base';
import { FormLayout, useToast } from '@/lib/ui';
import { handleErrorMessage, LookupType } from '@/lib/utils';

import { CoreFieldLookup } from './components';
import { FormFooter } from './components/formFooter';

type BuilderProps = {
  form: FormLego;
  defaultValues?: FieldValues;
  customFields?: LookupType;
  onSubmit?: (
    formValues: FieldValues
  ) => void | Promise<(formValues: FieldValues) => void>;
  lifeCycleFns?: TXLifeCycleFns;
  targetNetwork?: string;
  submitButtonText?: string;
};

export const StatusMsg = {
  Compile: 'Compiling Transaction Data',
  Request: 'Requesting Signature',
  Await: 'Transaction Submitted',
  TxErr: 'Transaction Error',
  TxSuccess: 'Transaction Success',
  PollStart: 'Syncing TX (Subgraph)',
  PollSuccess: 'Success: TX Confirmed!',
  PollError: 'Sync Error (Subgraph)',
  NoContext: 'Missing TXBuilder Context',
} as const;

export type StatusMsg = (typeof StatusMsg)[keyof typeof StatusMsg];

export const FormBuilder = ({
  form,
  defaultValues,
  customFields = CoreFieldLookup,
  submitButtonText = 'Submit',
  targetNetwork,
  lifeCycleFns,
  onSubmit,
}: BuilderProps) => {
  const wagmiChainId = useChainId();
  const chainId = wagmiChainId ? `0x${wagmiChainId.toString(16)}` : undefined;
  const { fireTransaction } = useTxBuilder();
  const { defaultToast, errorToast, successToast } = useToast();
  const { title, description, subtitle } = form;

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<null | StatusMsg>(null);
  const [txHash, setTxHash] = useState<null | string>(null);

  const isSameNetwork = targetNetwork ? targetNetwork === chainId : true;
  const submitDisabled = isLoading || !isSameNetwork;

  const handleSubmit = async (formValues: FieldValues) => {
    if (form.tx) {
      setIsLoading(true);
      setTxHash(null);
      setStatus(StatusMsg.Compile);
      const executed = await fireTransaction({
        tx: form.tx,
        callerState: {
          formValues,
        },
        lifeCycleFns: {
          onRequestSign() {
            setStatus(StatusMsg.Request);
            lifeCycleFns?.onRequestSign?.();
          },
          onTxHash(txHash) {
            setTxHash(txHash);
            setStatus(StatusMsg.Await);
            lifeCycleFns?.onTxHash?.(txHash);
          },
          onTxError(error) {
            setStatus(StatusMsg.TxErr);
            const errMsg = handleErrorMessage({
              error,
              fallback: 'Could not decode error message',
            });
            setIsLoading(false);
            lifeCycleFns?.onTxError?.(error);
            errorToast({ title: StatusMsg.TxErr, description: errMsg });
          },
          onTxSuccess(...args) {
            setStatus(
              form.tx?.disablePoll ? StatusMsg.PollSuccess : StatusMsg.TxSuccess
            );
            lifeCycleFns?.onTxSuccess?.(...args);
            defaultToast({
              title: StatusMsg.TxSuccess,
              description: form.tx?.disablePoll
                ? 'Transaction cycle complete.'
                : 'Please wait for subgraph to sync',
            });
          },
          onPollStart() {
            setStatus(StatusMsg.PollStart);
            lifeCycleFns?.onPollStart?.();
          },
          onPollError(error) {
            setStatus(StatusMsg.PollError);
            const errMsg = handleErrorMessage({
              error,
              fallback: 'Could not decode poll error message',
            });
            setIsLoading(false);
            lifeCycleFns?.onPollError?.(error);
            errorToast({ title: StatusMsg.PollError, description: errMsg });
          },
          onPollSuccess(...args) {
            setStatus(StatusMsg.PollSuccess);
            setIsLoading(false);
            successToast({
              title: StatusMsg.PollSuccess,
              description: 'Transaction cycle complete.',
            });
            lifeCycleFns?.onPollSuccess?.(...args);
          },
        },
      });
      if (executed === undefined) {
        setStatus(StatusMsg.NoContext);
        return;
      }
      return executed;
    }
    if (onSubmit) {
      return await onSubmit?.(formValues);
    }
    console.error('FormBuilder: onSubmit not implemented');
  };

  return (
    <FormLayout title={title} description={description} subtitle={subtitle}>
      <FormBuilderBase
        form={form}
        fieldObj={customFields}
        defaultValues={defaultValues}
        fieldSpacing="3.6rem"
        applyToEach={{ full: true }}
        formDisabled={isLoading}
        submitDisabled={submitDisabled}
        onSubmit={handleSubmit}
        footer={
          <FormFooter
            submitButtonText={form.submitButtonText || submitButtonText}
            status={status}
            txHash={txHash}
          />
        }
      />
    </FormLayout>
  );
};
