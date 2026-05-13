# Domain Glossary

## Purpose

This glossary defines project terms that appear in code, docs, and bug reports.

## Terms

- DAO:
  A decentralized autonomous organization. In this app, a DAO is usually a Moloch V3 organization with members, proposals, tokens, vaults, and settings.
- DAOhaus:
  The product/ecosystem this admin app supports.
- Moloch V3:
  The DAO contract architecture used by DAOhaus. DAO routes use the `/molochv3/:daochain/:daoid` shape.
- Baal:
  The core Moloch V3 DAO contract. Code and ABI names often use `baal` for DAO governance contract interactions.
- proposal:
  A DAO governance item that members can inspect, vote on, process, cancel, or use to execute encoded actions.
- summon:
  The DAO creation flow. The `/summon` route collects setup values and submits the transactions needed to create a DAO.
- ragequit:
  A member exit flow where a member leaves or reduces DAO position by burning DAO tokens for a share of assets.
- Safe:
  A Gnosis Safe or Safe{Wallet} vault associated with a DAO. Safe pages show balances and proposal shortcuts.
- shaman:
  A contract or address with special DAO permissions. Shaman display and permission helpers live across settings and utilities.
- shares:
  Voting and economic membership units in a DAO.
- loot:
  Non-voting economic membership units in a DAO.
- vault:
  A treasury or asset-holding account associated with a DAO, often represented by a Safe.
- graph/query data:
  Remote DAO data fetched through graph/query helpers in `src/lib/dao-hooks`.
- transaction lego:
  A reusable transaction definition in `src/lib/legos` that describes how to assemble a DAO transaction.
- form lego:
  A reusable form definition in `src/lib/legos` rendered by `src/lib/form-builder`.

## Related Docs

- Architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md)
- Debugging: [`DEBUGGING.md`](DEBUGGING.md)
- Legos guide: [`../src/lib/legos/AGENT.md`](../src/lib/legos/AGENT.md)
- Transaction builder guide: [`../src/lib/tx-builder/AGENT.md`](../src/lib/tx-builder/AGENT.md)
