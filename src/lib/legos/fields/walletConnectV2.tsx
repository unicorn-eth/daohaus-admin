import { useState, useCallback, useEffect } from 'react';
import { ValidNetwork } from '@/lib/keychain-utils';
import { SignClientTypes, SessionTypes } from '@walletconnect/types';
import {
  WCParams,
  WCPayload,
  encodeSafeSignMessage,
  isObjectEIP712TypedData,
} from './walletConnect';

type SessionRequestEvent = {
  topic: string;
  id: number;
  params: {
    request: { method: string; params: any[] };
    chainId: string;
  };
};
type SessionProposal = {
  id: number;
  params: {
    requiredNamespaces: Record<
      string,
      { methods: string[]; chains?: string[]; events?: string[] }
    >;
  };
};
type Web3WalletType = {
  on(event: 'session_request', listener: (e: SessionRequestEvent) => void): void;
  on(event: 'session_proposal', listener: (p: SessionProposal) => void): void;
  on(event: 'session_delete', listener: () => void): void;
  approveSession(args: {
    id: number;
    namespaces: Record<string, { accounts: string[]; chains: string[]; methods: string[]; events: string[] }>;
  }): Promise<SessionTypes.Struct>;
  disconnectSession(args: { topic: string; reason: { code: number; message: string } }): Promise<void>;
  respondSessionRequest(args: { topic: string; response: unknown }): Promise<void>;
  rejectSession(args: { id: number; reason: { code: number; message: string } }): Promise<void>;
  getActiveSessions(): Record<string, SessionTypes.Struct>;
  core: { pairing: { pair(args: { uri: string }): Promise<void> } };
};

const WALLETCONNECT_V2_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_ID as string | undefined;
const WC_V2_DISABLED = !WALLETCONNECT_V2_PROJECT_ID;

const WALLET_METADATA = {
  name: 'DAOHaus Admin',
  description: 'Interact with external contracts and applications',
  url: 'https://admin.daohaus.club',
  icons: [],
};

const EVMBasedNamespaces = 'eip155';

export const compatibleSafeMethods: string[] = [
  'eth_accounts', 'net_version', 'eth_chainId', 'personal_sign', 'eth_sign',
  'eth_signTypedData', 'eth_signTypedData_v4', 'eth_sendTransaction',
  'eth_blockNumber', 'eth_getBalance', 'eth_getCode', 'eth_getTransactionCount',
  'eth_getStorageAt', 'eth_getBlockByNumber', 'eth_getBlockByHash',
  'eth_getTransactionByHash', 'eth_getTransactionReceipt', 'eth_estimateGas',
  'eth_call', 'eth_getLogs', 'eth_gasPrice', 'wallet_getPermissions',
  'wallet_requestPermissions', 'safe_setSettings',
];

const UNSUPPORTED_CHAIN_ERROR_CODE = 5100;
const INVALID_METHOD_ERROR_CODE = 1001;
const USER_REJECTED_REQUEST_CODE = 4001;
const USER_DISCONNECTED_CODE = 6000;

export type wcConnectType = (params: WCParams) => Promise<void>;
export type wcDisconnectType = () => Promise<void>;

type useWalletConnectType = {
  wcClientData?: SignClientTypes.Metadata;
  wcConnect: wcConnectType;
  wcDisconnect: wcDisconnectType;
  isWallectConnectInitialized: boolean;
  txPayload?: WCPayload;
  error?: string;
};

const rejectResponse = (id: number, code: number, message: string) => ({
  id,
  jsonrpc: '2.0',
  error: { code, message },
});

const useWalletConnectV2 = (): useWalletConnectType => {
  const [web3wallet, setWeb3wallet] = useState<Web3WalletType>();
  const [wcSession, setWcSession] = useState<SessionTypes.Struct>();
  const [isWallectConnectInitialized, setIsWallectConnectInitialized] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>();
  const [safeAddress, setSafeAddress] = useState<string>();
  const [txPayload, setTxPayload] = useState<WCPayload>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (WC_V2_DISABLED) {
      setIsWallectConnectInitialized(true);
      return;
    }
    const initializeWalletConnectV2Client = async () => {
      try {
        const [{ Core }, { Web3Wallet }] = await Promise.all([
          import('@walletconnect/core'),
          import('@walletconnect/web3wallet'),
        ]);
        const core = new Core({ projectId: WALLETCONNECT_V2_PROJECT_ID as string });
        const web3walletInstance = await Web3Wallet.init({
          core: core as any,
          metadata: WALLET_METADATA,
        });
        if (web3walletInstance && typeof web3walletInstance.on === 'function' && typeof web3walletInstance.core === 'object') {
          setWeb3wallet(web3walletInstance as unknown as Web3WalletType);
        } else {
          console.warn('Unexpected Web3Wallet instance shape');
          setIsWallectConnectInitialized(true);
        }
      } catch (error) {
        console.log('Error on walletconnect version 2 initialization: ', error);
        setIsWallectConnectInitialized(true);
      }
    };
    initializeWalletConnectV2Client();
  }, []);

  useEffect(() => {
    if (isWallectConnectInitialized && web3wallet && wcSession) {
      web3wallet.on('session_request', async (event: SessionRequestEvent) => {
        const { topic, id } = event;
        const { request, chainId: transactionChainId } = event.params;
        const { method, params } = request;

        const isSafeChainId = transactionChainId === `${EVMBasedNamespaces}:${chainId}`;

        if (!isSafeChainId) {
          const errorMessage = `Transaction rejected: the connected Dapp is not set to the correct chain.`;
          setError(errorMessage);
          await web3wallet.respondSessionRequest({ topic, response: rejectResponse(id, UNSUPPORTED_CHAIN_ERROR_CODE, errorMessage) });
          return;
        }

        try {
          setError(undefined);
          switch (method) {
            case 'eth_sendTransaction': {
              setTxPayload({ id, jsonrpc: '2.0', method, params });
              break;
            }
            case 'personal_sign': {
              const [message] = params;
              if (message.startsWith('0x')) {
                const tx = encodeSafeSignMessage(`0x${chainId?.toString(16)}` as ValidNetwork, message);
                if (tx) { setTxPayload({ id, jsonrpc: '2.0', method, params: [tx] }); break; }
              }
              const errorMsg = 'Tx personal_sign has the wrong format';
              setError(errorMsg);
              await web3wallet.respondSessionRequest({ topic, response: rejectResponse(id, INVALID_METHOD_ERROR_CODE, errorMsg) });
              break;
            }
            case 'eth_signTypedData':
            case 'eth_signTypedData_v4': {
              const [, typedDataString] = params;
              const typedData = JSON.parse(typedDataString);
              if (isObjectEIP712TypedData(typedData)) {
                const tx = encodeSafeSignMessage(`0x${chainId?.toString(16)}` as ValidNetwork, typedData);
                if (tx) { setTxPayload({ id, jsonrpc: '2.0', method, params: [tx] }); break; }
              }
              const errorMsg = 'Tx eth_signTypedData has the wrong format';
              setError(errorMsg);
              await web3wallet.respondSessionRequest({ topic, response: rejectResponse(id, INVALID_METHOD_ERROR_CODE, errorMsg) });
              break;
            }
            case 'eth_estimateGas': {
              await web3wallet.respondSessionRequest({ topic, response: { id, jsonrpc: '2.0', result: '0x0' } });
              break;
            }
            default: {
              const errorMsg = 'Tx type not supported';
              setError(errorMsg);
              await web3wallet.respondSessionRequest({ topic, response: rejectResponse(id, INVALID_METHOD_ERROR_CODE, errorMsg) });
              break;
            }
          }
        } catch (error) {
          const errorMsg = (error as Error)?.message;
          setError(errorMsg);
          const isUserRejection = errorMsg?.includes?.('Transaction was rejected');
          const code = isUserRejection ? USER_REJECTED_REQUEST_CODE : INVALID_METHOD_ERROR_CODE;
          await web3wallet.respondSessionRequest({ topic, response: rejectResponse(id, code, errorMsg) });
        }
      });
    }
  }, [chainId, wcSession, isWallectConnectInitialized, web3wallet]);

  useEffect(() => {
    if (WC_V2_DISABLED) return;
    if (!isWallectConnectInitialized && web3wallet && chainId && safeAddress) {
      const activeSessions = web3wallet.getActiveSessions();
      const compatibleSession = Object.keys(activeSessions)
        .map((topic) => activeSessions[topic])
        .find((session) => session.namespaces[EVMBasedNamespaces].accounts[0] === `${EVMBasedNamespaces}:${chainId}:${safeAddress}`);
      if (compatibleSession) {
        setWcSession(compatibleSession);
        setIsWallectConnectInitialized(true);
      }
    }
  }, [chainId, safeAddress, web3wallet, isWallectConnectInitialized]);

  const wcConnect = useCallback<wcConnectType>(
    async ({ chainId, safeAddress, uri }: WCParams) => {
      if (WC_V2_DISABLED) return;
      if (web3wallet) {
        setChainId(Number(chainId));
        setSafeAddress(safeAddress);
        web3wallet.on('session_proposal', async (proposal: SessionProposal) => {
          const { id, params } = proposal;
          const { requiredNamespaces } = params;
          const safeAccount = `${EVMBasedNamespaces}:${Number(chainId)}:${safeAddress}`;
          const safeChain = `${EVMBasedNamespaces}:${Number(chainId)}`;
          const safeEvents = requiredNamespaces[EVMBasedNamespaces]?.events || [];
          try {
            const wcSession = await web3wallet.approveSession({
              id,
              namespaces: {
                eip155: {
                  accounts: [safeAccount],
                  chains: [safeChain],
                  methods: compatibleSafeMethods,
                  events: safeEvents,
                },
              },
            });
            setWcSession(wcSession);
            setError(undefined);
          } catch (error) {
            console.log('session_proposal error: ', error);
            setError((error as Error).message);
            const errorMessage = `Connection refused: This Safe Account is in chain ${chainId} but the Wallet Connect session proposal is invalid`;
            await web3wallet.rejectSession({ id: proposal.id, reason: { code: UNSUPPORTED_CHAIN_ERROR_CODE, message: errorMessage } });
          }
        });
        web3wallet.on('session_delete', async () => {
          setWcSession(undefined);
          setError(undefined);
        });
        setIsWallectConnectInitialized(true);
        await web3wallet.core.pairing.pair({ uri });
      }
    },
    [web3wallet]
  );

  const wcDisconnect = useCallback<wcDisconnectType>(async () => {
    if (WC_V2_DISABLED) return;
    if (wcSession && web3wallet) {
      await web3wallet.disconnectSession({
        topic: wcSession.topic,
        reason: { code: USER_DISCONNECTED_CODE, message: 'User disconnected. Safe Wallet Session ended by the user' },
      });
      setWcSession(undefined);
      setError(undefined);
    }
  }, [web3wallet, wcSession]);

  const wcClientData = wcSession?.peer.metadata;

  if (WC_V2_DISABLED) {
    return {
      wcConnect: async () => undefined,
      wcClientData: undefined,
      wcDisconnect: async () => undefined,
      txPayload: undefined,
      isWallectConnectInitialized: true,
      error: undefined,
    };
  }

  return { wcConnect, wcClientData, wcDisconnect, txPayload, isWallectConnectInitialized, error };
};

export default useWalletConnectV2;
