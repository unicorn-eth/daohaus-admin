# Security Remediation Plan

## Purpose

This document captures the remaining npm audit remediation work for `haus-admin` after pinning `hono` to `4.12.12`.

The goal is to separate:

- low-risk housekeeping we can do quickly
- meaningful runtime risk in active app paths
- larger upgrade work that should be treated as planned product or platform changes

## What We Already Remediated

- Pinned `hono` to `4.12.12` via `package.json` `overrides`.
- This addresses the moderate-severity `hono` advisories that arrive transitively through `wagmi -> @wagmi/connectors -> porto`.

## Remaining Findings Summary

The remaining audit findings cluster around two dependency chains:

1. `@walletconnect/web3wallet`
2. `@coinbase/cdp-sdk` via `wagmi` connectors

There are also low-severity findings in `ethers-multisend` and older `ethersproject/*` packages.

## Priority Order

### 1. Decide the future of WalletConnect proposal support

Status:

- Highest-value remaining remediation decision.
- Also the highest support-cost dependency surface in the app.

Why this matters:

- Most of the critical audit count is tied to `@walletconnect/web3wallet` and its transitive chain:
  - `@walletconnect/core`
  - `@walletconnect/sign-client`
  - `@walletconnect/utils`
  - `elliptic`
  - `@stablelib/ed25519`
- This package is directly used in the WalletConnect proposal flow.

Relevant files:

- [walletConnectV2.tsx](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/legos/fields/walletConnectV2.tsx)
- [WalletConnectLink.tsx](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/legos/fields/WalletConnectLink.tsx)
- [wagmi-config.ts](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/wagmi-config.ts)

Important constraint:

- `@walletconnect/web3wallet@1.16.1` is already the latest stable release currently available.
- There is no clean in-place version bump that resolves this cluster.

Recommended decision paths:

1. Keep
   - Accept the audit noise temporarily.
   - Document WalletConnect as an intentionally owned exception.
   - Add focused tests around proposal and session behavior.
2. Isolate
   - Move WalletConnect proposal code behind a clearly bounded feature surface.
   - Keep the rest of the app free from direct dependency on this subsystem.
3. Deprecate
   - Remove WalletConnect proposal support if product usage is low.
   - This is the cleanest way to eliminate most of the remaining critical findings.

Risk of updating:

- High implementation risk if we try to replace this stack without a product decision first.
- Low security payoff from minor package churn, because the latest stable package is already installed.

### 2. Reassess `wagmi` major upgrade as a wallet-stack project

Status:

- Potential medium-term remediation path.
- Not appropriate as a quick audit fix.

Why this matters:

- `wagmi@2.19.5` pulls connector dependencies that bring in:
  - `porto`
  - `@base-org/account`
  - `@coinbase/cdp-sdk`
- A major `wagmi` upgrade may improve the connector graph over time, but it will also affect the app’s wallet integration surface.

Current situation:

- Current: `wagmi@2.19.5`
- Latest: `wagmi@3.6.1`

Risk of updating:

- High compatibility risk.
- Likely requires coordinated validation of:
  - RainbowKit integration
  - connector setup
  - Safe wallet flows
  - WalletConnect wallet behavior
  - connected account and chain handling

Recommendation:

- Treat this as a scheduled platform upgrade, not a remediation hotfix.
- Bundle it with wallet regression testing instead of doing it opportunistically.

### 3. Track the transitive Coinbase CDP / Axios advisory

Status:

- Real advisory, but lower practical exposure than the severity label implies in this browser app.

Why this matters:

- The `axios` critical advisory is arriving via:
  - `wagmi`
  - `@wagmi/connectors`
  - `@base-org/account`
  - `@coinbase/cdp-sdk`
- The app does not directly import or manage `@coinbase/cdp-sdk`.

Current situation:

- Installed chain includes `@coinbase/cdp-sdk@1.46.1`
- Current published release is `1.47.0`
- The published package metadata still depends on `axios@1.13.6`

Interpretation:

- A direct package bump here does not currently produce a clear fix path.
- Because this is a client-side Vite app, the SSRF framing is less representative than it would be for a server process making backend requests with `NO_PROXY`.

Recommendation:

- Track this as an upstream dependency issue.
- Re-evaluate after any future `wagmi` or connector upgrade.
- If Coinbase wallet support becomes unnecessary, consider whether removing that connector path is justified.

### 4. Review `ethers-multisend` ownership and replacement options

Status:

- Lower severity than the wallet stack issues, but still worth cleanup.

Why this matters:

- `ethers-multisend` is directly used by tx decoding utilities.
- Audit suggestions for this package are not reliable enough to apply automatically.

Relevant files:

- [decoding.ts](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/tx-builder/utils/decoding.ts)
- [deepDecoding.ts](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/tx-builder/utils/deepDecoding.ts)
- [multicall.ts](/home/skuhl/Documents/ody/haus/haus-admin/src/lib/tx-builder/utils/multicall.ts)

Risk of updating:

- Medium risk.
- These helpers sit in transaction-building and decoding logic, so regressions would be costly.

Recommendation:

- Keep as-is for now.
- Add it to the dependency ownership review already planned in post-migration cleanup.
- Revisit only with tests around decode behavior.

## Safe Near-Term Actions

These can be done without taking on major migration risk:

1. Re-run `npm audit` after lockfile refresh to confirm `hono` findings are cleared.
2. Keep WalletConnect proposal support explicitly documented as a high-cost subsystem while product ownership is decided.
3. Add focused tests around WalletConnect proposal handling and tx decoding helpers before any larger wallet-stack upgrades.
4. Group any future `wagmi` major upgrade into a dedicated wallet integration project.

## Changes We Should Avoid Doing Blindly

- Running `npm audit fix --force`
- Treating `wagmi` `2.x -> 3.x` as a routine patch
- Replacing WalletConnect packages without validating the proposal flow
- Downgrading `ethers-multisend` because audit output suggests it

## Recommended Follow-Up Tickets

1. Refresh lockfile and verify `hono` remediation.
2. WalletConnect decision memo: keep, isolate, or deprecate proposal support.
3. Add tests for WalletConnect proposal flow and tx decoding helpers.
4. Create a wallet-stack upgrade spike for `wagmi` and connector compatibility.
5. Dependency ownership review for `ethers-multisend`, WalletConnect, and other legacy runtime packages.

## Success Criteria

This remediation work is in good shape when:

- `hono` is no longer reported in audit output.
- WalletConnect is either intentionally retained with documented ownership or removed.
- Any `wagmi` major upgrade happens in a planned and tested effort.
- Transaction decoding dependencies are covered by enough tests to support future cleanup safely.
