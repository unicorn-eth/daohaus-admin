# Keychain And Network Guide

## Purpose

`src/lib/keychain-utils` owns chain metadata, supported-network helpers, contract keychains, explorer utilities, endpoint helpers, and viem network utilities.

Use this folder when behavior depends on network identity, contract addresses, explorer URLs, or supported chains.

## Folder Map

- `chainIds.ts`
  Chain ID constants and conversion helpers
- `networkData.ts` and `networkUtils.ts`
  Network names, metadata, and lookup helpers
- `contractKeychains.ts`
  Contract address metadata by network
- `validNetworks.ts`
  Supported network lists and validation helpers
- `endpoints.ts`
  Network-aware external endpoint helpers
- `explorerUtils.ts`
  Block explorer URL helpers
- `viemUtils.ts`
  Viem chain/client helpers
- `types.ts`
  Shared keychain/network types

## Key Entry Points

- Public exports: [`index.ts`](index.ts)
- Network metadata: [`networkData.ts`](networkData.ts)
- Network helpers: [`networkUtils.ts`](networkUtils.ts)
- Contract keychains: [`contractKeychains.ts`](contractKeychains.ts)
- Supported networks: [`validNetworks.ts`](validNetworks.ts)
- Explorer helpers: [`explorerUtils.ts`](explorerUtils.ts)

## Common Tasks

- Add or update supported-network metadata:
  inspect `networkData.ts`, `validNetworks.ts`, and `chainIds.ts`
- Change contract addresses or contract lookup behavior:
  inspect `contractKeychains.ts`
- Change explorer links:
  inspect `explorerUtils.ts`
- Change RPC or viem chain behavior:
  inspect `viemUtils.ts` and `src/lib/wagmi-config.ts`

## Guardrails

- Keep network and contract metadata here rather than scattering it across features.
- Keep transaction execution behavior in `@/lib/tx-builder`.
- Keep tx/form definitions in `@/lib/legos`.
- Prefer exported helpers from `@/lib/keychain-utils` over deep imports.

## Related Areas

- Wagmi config: [`../wagmi-config.ts`](../wagmi-config.ts)
- Transaction builder: [`../tx-builder/AGENT.md`](../tx-builder/AGENT.md)
- Legos: [`../legos/AGENT.md`](../legos/AGENT.md)
- System overview: [`../../../docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md)
