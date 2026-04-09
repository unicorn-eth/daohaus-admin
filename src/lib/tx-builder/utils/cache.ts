import { ABI, ArbitraryState, CACHE_CONFIG, CacheStoreName } from '@/lib/utils';
import { ValidNetwork } from '@/lib/keychain-utils';

const localforage = import('localforage').then(async (lf) => {
  if (typeof window === 'object') await lf.default.ready();
  return lf.default;
});

const defaultABIStore: ArbitraryState = {
  '0x1': {},
  '0x4': {},
  '0x2a': {},
  '0xa': {},
  '0x64': {},
  '0x89': {},
  '0xa4b1': {},
  '0xa4ec': {},
};

export const getABIstore = async () => {
  const local = await localforage;
  return (await local.getItem(CacheStoreName.ABI)) as ArbitraryState;
};

export const getCachedABI = async ({
  address,
  chainId,
}: {
  address: string;
  chainId: ValidNetwork;
}) => {
  const abiStore = await getABIstore();
  return abiStore?.[chainId]?.[address] as ABI | undefined;
};

export const cacheABI = async ({
  address,
  chainId,
  abi,
}: {
  address: string;
  chainId: ValidNetwork;
  abi: ABI;
}) => {
  const abiStore = await getABIstore();
  const newStore = {
    ...abiStore,
    [chainId]: {
      ...abiStore?.[chainId],
      [address.toLowerCase()]: abi,
    },
  };

  const local = await localforage;
  try {
    await local.setItem(CacheStoreName.ABI, newStore);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const initABIs = async () => {
  const local = await localforage;
  local.config(CACHE_CONFIG);
  const store = await getABIstore();
  if (!store) {
    local.setItem(CacheStoreName.ABI, defaultABIStore);
  }
};

initABIs();
