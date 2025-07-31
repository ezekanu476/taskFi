# TaskFi – Decentralized Productivity & Task Marketplace

A blockchain-based platform enabling transparent, trustless, and tokenized productivity through task creation, assignment, and rewards—ideal for remote teams, DAOs, and freelancers.

## Overview

This system consists of seven core smart contracts that collectively manage decentralized task workflows, from creation and assignment to reward distribution and reputation tracking.

1. **Task Contract** – Handles task creation, metadata, deadlines, and ownership
2. **Assignment Contract** – Manages applications, approvals, and team assignment
3. **Escrow Contract** – Holds payments until task milestones are confirmed
4. **Verification Contract** – Enables decentralized task review and proof-of-work validation
5. **Reputation Contract** – Tracks on-chain productivity scores and performance history
6. **Dispute Resolution Contract** – Provides decentralized arbitration and voting
7. **Payment Contract** – Facilitates crypto or stablecoin payouts to contributors
8. **DAO Coordination Contract** *(optional)* – Enables DAOs to fund and manage task boards
9. **Badge NFT Contract** – Issues on-chain NFTs as productivity credentials
10. **Referral Contract** – Manages referral rewards and network growth incentives

## Features

- Decentralized task board with verifiable task completion
- Escrowed payments tied to task milestones
- Contributor reputation & score system
- Token-based incentives & referral bonuses
- DAO integration for collaborative team workflows
- NFT-based productivity credentials
- Community-driven dispute resolution

## Smart Contracts

### Task Contract

- Create, edit, archive tasks
- Define scope, deadlines, and rewards
- Track task lifecycle

### Assignment Contract

- Contributor application and approval
- Team assignment logic
- Withdrawal or re-application mechanisms

### Escrow Contract

- Token/stablecoin deposit and lock-up
- Release upon milestone validation
- Optional time-based partial release

### Verification Contract

- Multi-signer review system
- Proof-of-work submission and audit
- Reviewer incentives

### Reputation Contract

- Scoring system based on task history
- Peer and client feedback recording
- Productivity badge minting eligibility

### Dispute Resolution Contract

- Trigger arbitration for failed/verifiable disputes
- Token-holder voting mechanism
- Penalties for malicious actors

### Payment Contract

- Reward distribution (flat or milestone-based)
- Referral payout logic
- DAO payout integrations

### DAO Coordination Contract *(optional)*

- DAO task board funding and governance
- Task curation and DAO-only permissions
- Token-gated submissions

### Badge NFT Contract

- Productivity badges based on achievements
- On-chain verifiable identity markers
- Optional soulbound NFTs

### Referral Contract

- Track referrers and referees
- Multi-level bonus logic
- Referral limits and cooldowns

## Installation

1. Install Clarinet CLI  
2. Clone this repository  
3. Run tests: `npm test`  
4. Deploy contracts: `clarinet deploy`

## Usage

Each contract module is deployable independently and interacts through shared principals and tokens. Refer to each contract's documentation for usage, parameters, and expected outputs.

## Testing

Contracts are tested using Clarinet and Vitest. Run all tests using:

```bash
npm test
```

## License

MIT License