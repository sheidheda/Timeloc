# TimeLoc: Decentralized Time Capsule Smart Contract

TimeLoc is a decentralized time capsule system built on the Stacks blockchain using Clarity smart contracts. It allows users to securely store messages that can only be revealed after a specified time period, creating digital time capsules on the blockchain.

## Features

- 🔒 **Secure Message Storage**: Store encrypted messages on the Stacks blockchain
- ⏰ **Time-Locked Access**: Messages can only be revealed after a specified block height
- 🔐 **Owner-Only Access**: Only message owners can reveal their time capsules
- 📊 **Status Tracking**: Monitor capsule status and unlock times
- ⚡ **Gas Efficient**: Optimized contract design for minimal gas usage
- 🧪 **Fully Tested**: Comprehensive test suite for all functionality

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Clarinet](https://github.com/hirosystems/clarinet)
- [Git](https://git-scm.com/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sheidheda/Timeloc.git
cd timeloc
```

2. Install Clarinet (if not already installed):
```bash
curl -sL https://install.clarinet.sh | sh
```

3. Initialize the project:
```bash
clarinet check
```

## Contract Functions

### create-capsule
Create a new time capsule with a message and lock duration.
```clarity
(create-capsule (message (string-utf8 500)) (blocks-locked uint))
```

### reveal-capsule
Reveal a capsule's message after the unlock height is reached.
```clarity
(reveal-capsule (capsule-id uint))
```

### get-capsule-details
Get details about a specific capsule (owner only).
```clarity
(get-capsule-details (capsule-id uint))
```

### get-total-capsules
Get the total number of capsules created.
```clarity
(get-total-capsules)
```

## Testing

Run the test suite:
```bash
clarinet check
```

The test suite covers:
- Capsule creation
- Time-lock enforcement
- Access control
- Owner operations
- Edge cases and error conditions

## Usage Examples

1. Creating a new time capsule:
```clarity
(contract-call? .time-capsule create-capsule "My secret message" u100)
```

2. Revealing a capsule:
```clarity
(contract-call? .time-capsule reveal-capsule u1)
```

3. Checking capsule details:
```clarity
(contract-call? .time-capsule get-capsule-details u1)
```

## Directory Structure

```
timeloc/
├── contracts/
│   └── time-capsule.clar
├── tests/
│   └── time-capsule_test.ts
├── settings/
│   └── Devnet.toml
├── Clarinet.toml
├── deps.ts
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Add support for multiple message types (text, JSON, etc.)
- [ ] Implement batch operations for multiple capsules
- [ ] Add capsule modification capabilities
- [ ] Create a web interface for easy interaction
- [ ] Add event emission for important state changes

## Security Considerations

- Messages are stored on-chain and visible to blockchain observers
- Time locks are based on block height, not wall clock time
- Only capsule owners can reveal messages
- Contract includes protection against common attack vectors

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Stacks Blockchain team for the Clarity language
- Hiro Systems for Clarinet testing framework
- The Stacks community for feedback and support

## Contact
Project Link: [https://github.com/sheidheda/Timeloc](https://github.com/sheidheda/Timeloc)