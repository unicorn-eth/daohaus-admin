import { LOCAL_ABI } from '@/lib/abis/lib/abis';
import {
  CONTRACT_KEYCHAINS,
  isValidNetwork,
  ValidNetwork,
} from '@/lib/keychain-utils';
import {
  ArgType,
  ContractLego,
  encodeFunction,
  encodeValues,
  getNonce,
  isArray,
  isBoolean,
  isNumberish,
  isString,
  POSTER_TAGS,
  toBaseUnits,
  TXLego,
  ZERO_ADDRESS,
} from '@/lib/utils';

export type SummonParams = {
  daoName?: string;
  tokenName?: string;
  tokenSymbol?: string;
  lootTokenName?: string;
  lootTokenSymbol?: string;
  votingTransferable?: boolean;
  nvTransferable?: boolean;
  quorum?: string;
  minRetention?: string;
  sponsorThreshold?: string;
  newOffering?: string;
  votingPeriod?: string;
  votingPeriodInSeconds?: number;
  gracePeriod?: string;
  gracePeriodInSeconds?: number;
  shamans?:
    | ''
    | {
        shamanAddresses: string[];
        shamanPermissions: string[];
      };
  members?:
    | ''
    | {
        memberAddresses: string[];
        memberShares: string[];
        memberLoot: string[];
      };
};

const summonContract: ContractLego = {
  contractName: 'BaalSummoner',
  type: 'static',
  abi: LOCAL_ABI.BAAL_ADV_TOKEN_SUMMONER,
  targetAddress: CONTRACT_KEYCHAINS.V3_FACTORY_ADV_TOKEN,
};

const ensureEncoded = (
  encoded: string | { error: true; message: string },
  message: string,
) => {
  if (typeof encoded === 'string') {
    return encoded;
  }

  throw new Error(message);
};

export const SUMMON_TX: TXLego = {
  id: 'SummonTX',
  contract: summonContract,
  method: 'summonBaalFromReferrer',
  staticArgs: [],
};

const encodeMintParams = (formValues: SummonParams) => {
  const { members } = formValues;

  if (
    !members ||
    !isArray(members.memberAddresses) ||
    members.memberAddresses.some((addr) => !isString(addr)) ||
    !isArray(members.memberShares) ||
    members.memberShares.some((shares) => !isNumberish(shares)) ||
    !isArray(members.memberLoot) ||
    members.memberLoot.some((loot) => !isNumberish(loot))
  ) {
    throw new Error('Members are missing or invalid.');
  }

  const sharesInBaseUnits = members.memberShares.map((shares) =>
    toBaseUnits(shares),
  );
  const lootInBaseUnits = members.memberLoot.map((loot) =>
    toBaseUnits(loot.toString()),
  );

  return encodeValues(
    ['address[]', 'uint256[]', 'uint256[]'],
    [members.memberAddresses, sharesInBaseUnits, lootInBaseUnits],
  );
};

const encodeTokenParams = (formValues: SummonParams) => {
  const {
    tokenName,
    tokenSymbol,
    lootTokenName,
    lootTokenSymbol,
    votingTransferable,
    nvTransferable,
  } = formValues;

  if (
    !isString(tokenName) ||
    !isString(tokenSymbol) ||
    !isString(lootTokenName) ||
    !isString(lootTokenSymbol) ||
    !isBoolean(votingTransferable) ||
    !isBoolean(nvTransferable)
  ) {
    throw new Error('Token settings are missing or invalid.');
  }

  return encodeValues(
    ['string', 'string', 'string', 'string', 'bool', 'bool'],
    [
      tokenName,
      tokenSymbol,
      lootTokenName,
      lootTokenSymbol,
      votingTransferable,
      nvTransferable,
    ],
  );
};

const governanceConfigTx = (formValues: SummonParams) => {
  const {
    votingPeriodInSeconds,
    gracePeriodInSeconds,
    newOffering,
    quorum,
    sponsorThreshold,
    minRetention,
  } = formValues;

  if (
    !isNumberish(votingPeriodInSeconds) ||
    !isNumberish(gracePeriodInSeconds) ||
    !isNumberish(newOffering) ||
    !isNumberish(quorum) ||
    !isNumberish(sponsorThreshold) ||
    !isNumberish(minRetention)
  ) {
    throw new Error('Governance settings are missing or invalid.');
  }

  const encodedValues = encodeValues(
    ['uint32', 'uint32', 'uint256', 'uint256', 'uint256', 'uint256'],
    [
      votingPeriodInSeconds,
      gracePeriodInSeconds,
      newOffering,
      quorum,
      sponsorThreshold,
      minRetention,
    ],
  );

  return ensureEncoded(
    encodeFunction(LOCAL_ABI.BAAL, 'setGovernanceConfig', [encodedValues]),
    'Could not encode governance configuration.',
  );
};

const shamanConfigTx = (formValues: SummonParams) => {
  const { shamans } = formValues;

  if (shamans === '' || !shamans) {
    return ensureEncoded(
      encodeFunction(LOCAL_ABI.BAAL, 'setShamans', [[], []]),
      'Could not encode empty shaman configuration.',
    );
  }

  if (
    !isArray(shamans.shamanAddresses) ||
    shamans.shamanAddresses.some((addr) => !isString(addr)) ||
    !isArray(shamans.shamanPermissions) ||
    shamans.shamanPermissions.some((permission) => !isNumberish(permission))
  ) {
    throw new Error('Shaman settings are missing or invalid.');
  }

  return ensureEncoded(
    encodeFunction(LOCAL_ABI.BAAL, 'setShamans', [
      shamans.shamanAddresses,
      shamans.shamanPermissions,
    ]),
    'Could not encode shaman configuration.',
  );
};

const metadataConfigTx = (formValues: SummonParams, posterAddress: string) => {
  const { daoName } = formValues;

  if (!isString(daoName)) {
    throw new Error('DAO name is required.');
  }

  const metadataTx = ensureEncoded(
    encodeFunction(LOCAL_ABI.POSTER, 'post', [
      JSON.stringify({ name: daoName }),
      POSTER_TAGS.summoner,
    ]),
    'Could not encode DAO metadata.',
  );

  return ensureEncoded(
    encodeFunction(LOCAL_ABI.BAAL, 'executeAsBaal', [
      posterAddress,
      0,
      metadataTx,
    ]),
    'Could not encode metadata initialization action.',
  );
};

const getKeychains = (chainId: ValidNetwork) => {
  const poster = CONTRACT_KEYCHAINS.POSTER[chainId];
  const summoner = CONTRACT_KEYCHAINS.V3_FACTORY_ADV_TOKEN[chainId];

  if (!poster || !summoner) {
    throw new Error('Could not find summon contracts for this network.');
  }

  return {
    poster,
    summoner,
  };
};

export const canSummonOnNetwork = (chainId: string | undefined) =>
  isValidNetwork(chainId, CONTRACT_KEYCHAINS.V3_FACTORY_ADV_TOKEN);

export const assembleSummonTxArgs = (
  formValues: Record<string, unknown>,
  chainId: ValidNetwork,
  safeAddress?: string,
): ArgType[] => {
  const {
    tokenName,
    tokenSymbol,
    lootTokenName,
    lootTokenSymbol,
  } = formValues as SummonParams;

  if (
    !isString(tokenName) ||
    !isString(tokenSymbol) ||
    !isString(lootTokenName) ||
    !isString(lootTokenSymbol)
  ) {
    throw new Error('Summon token configuration is incomplete.');
  }

  const { poster } = getKeychains(chainId);

  const mintParams = encodeMintParams(formValues as SummonParams);
  const tokenParams = encodeTokenParams(formValues as SummonParams);
  const initActions = [
    governanceConfigTx(formValues as SummonParams),
    shamanConfigTx(formValues as SummonParams),
    metadataConfigTx(formValues as SummonParams, poster),
  ];

  return [
    safeAddress || ZERO_ADDRESS,
    ZERO_ADDRESS,
    getNonce(),
    mintParams,
    tokenParams,
    initActions,
  ];
};
