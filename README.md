# @dcl/hashing

> **This library has moved.** The hashing primitives previously published
> from this repository now live in-tree at
> [decentraland/core-cli](https://github.com/decentraland/core-cli), under
> `src/hashing`.

This repository is no longer the source of truth for ADR32/ADR62 hashing
or for `hashV0`/`hashV1`. All new work — bug fixes, dependency upgrades,
API changes — should be proposed against `core-cli`.

## Why the move

The library was effectively consumed by a single project (`core-cli`), so
every change required a publish + version bump + upstream upgrade round
trip for no practical benefit. Inlining the code keeps hashing evolving
in lockstep with its only caller and removes the release coordination
overhead.

## Where to go

- Source, tests, and issue tracking:
  [decentraland/core-cli](https://github.com/decentraland/core-cli)
- Hashing code path inside the repo: `src/hashing/`

Existing published versions on npm remain available for consumers that
need them, but will not receive further updates from this repository.
