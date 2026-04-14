import { useEffect, useState } from "react";

import { FormSegment, SplitColumn, WrappedInput } from "@/lib/ui";
import {
  handleBaseUnits,
  INFO_COPY,
  ValidateField,
} from "@/lib/utils";
import { getNetwork } from "@/lib/keychain-utils";

import { FORM_KEYS } from "@/features/summon/utils/formKeys";

const DEFAULT_ASSET_SYMBOL = "ETH";

export const AdvancedSegment = ({
  formDisabled,
  chainId,
}: {
  formDisabled: boolean;
  chainId?: string;
}) => {
  const [nativeSymbol, setNativeSymbol] = useState(DEFAULT_ASSET_SYMBOL);

  useEffect(() => {
    if (chainId) {
      const assetSymbol = getNetwork(chainId)?.symbol;
      setNativeSymbol(assetSymbol || DEFAULT_ASSET_SYMBOL);
      return;
    }

    setNativeSymbol(DEFAULT_ASSET_SYMBOL);
  }, [chainId]);

  return (
    <FormSegment
      title="Advanced Governance"
      description="Customize advanced governance features."
      formArea={
        <SplitColumn
          rows={[
            {
              rowId: "advanced1",
              left: (
                <WrappedInput
                  id={FORM_KEYS.QUORUM}
                  label="Quorum %"
                  full
                  info={INFO_COPY.QUORUM}
                  defaultValue="0"
                  disabled={formDisabled}
                  rules={{
                    required: "This value is required",
                    validate: (val) => ValidateField.percent(val),
                  }}
                />
              ),
              right: (
                <WrappedInput
                  id={FORM_KEYS.MIN_RETENTION}
                  label="Min Retention %"
                  defaultValue="66"
                  info={INFO_COPY.MIN_RETENTION}
                  full
                  disabled={formDisabled}
                  rules={{
                    required: "This value is required",
                    validate: (val) => ValidateField.percent(val),
                  }}
                />
              ),
            },
            {
              rowId: "advanced2",
              left: (
                <WrappedInput
                  id={FORM_KEYS.SPONSOR_THRESHOLD}
                  label="Sponsor Threshold"
                  defaultValue="0"
                  full
                  info={INFO_COPY.SPONSOR_THRESHOLD}
                  disabled={formDisabled}
                  rules={{
                    required: "This value is required",
                    setValueAs: (val) => handleBaseUnits(val),
                    validate: (val) => ValidateField.number(val),
                  }}
                />
              ),
              right: (
                <WrappedInput
                  id={FORM_KEYS.OFFERING}
                  label={`New Offering (${nativeSymbol})`}
                  defaultValue="0"
                  full
                  info={INFO_COPY.NEW_OFFERING}
                  disabled={formDisabled}
                  rules={{
                    required: "This value is required",
                    validate: (val) => ValidateField.number(val),
                    setValueAs: (val) => handleBaseUnits(val),
                  }}
                />
              ),
            },
          ]}
        />
      }
    />
  );
};
