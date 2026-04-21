# Settings Feature Guide

## Purpose

`src/features/settings` owns DAO settings display sections such as metadata, contract addresses, governance values, tokens, and shamans.

Settings route composition lives in `src/app/routes`. This folder should hold settings-specific presentation components, while settings update forms use shared form and lego infrastructure.

## Folder Map

- `components`
  Settings display sections for DAO metadata, contracts, governance, tokens, and shamans

## Key Entry Points

- Settings display route: [`../../app/routes/Settings.tsx`](../../app/routes/Settings.tsx)
- Settings update route: [`../../app/routes/UpdateSettings.tsx`](../../app/routes/UpdateSettings.tsx)
- Metadata display: [`components/MetadataSettings.tsx`](components/MetadataSettings.tsx)
- Contract display: [`components/ContractSettings.tsx`](components/ContractSettings.tsx)
- Governance display: [`components/GovernanceSettings.tsx`](components/GovernanceSettings.tsx)
- Token display: [`components/TokenSettings.tsx`](components/TokenSettings.tsx)
- Shaman display: [`components/ShamanList.tsx`](components/ShamanList.tsx)

## Common Tasks

- Change settings page layout or loading/error behavior:
  start in `src/app/routes/Settings.tsx`
- Change one settings section:
  inspect the matching component under `components/`
- Change metadata update form defaults:
  start in `src/app/routes/UpdateSettings.tsx`
- Change metadata update transaction behavior:
  inspect `@/lib/legos` and `@/lib/tx-builder`

## Guardrails

- Keep display-only settings components in this feature.
- Keep update form rendering in `@/lib/form-builder` and form definitions in `@/lib/legos`.
- Keep shared DAO fetching in `@/lib/dao-hooks`.
- Keep chain explorer and contract metadata in `@/lib/keychain-utils`.

## Related Areas

- Shared DAO queries: [`../../lib/dao-hooks/AGENT.md`](../../lib/dao-hooks/AGENT.md)
- Shared form definitions: [`../../lib/legos/AGENT.md`](../../lib/legos/AGENT.md)
- Shared form rendering: [`../../lib/form-builder/AGENT.md`](../../lib/form-builder/AGENT.md)
- Shared tx execution: [`../../lib/tx-builder/AGENT.md`](../../lib/tx-builder/AGENT.md)
- System overview: [`../../../docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md)
