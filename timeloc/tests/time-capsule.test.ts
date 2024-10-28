import { 
    describe,
    expect,
    it,
    beforeEach,
    Chain,
    Account,
    types,
} from '../deps.ts';

describe('time-capsule contract test', () => {
    let chain: Chain;
    let accounts: Map<string, Account>;
    let deployer: Account;
    let wallet1: Account;
    let wallet2: Account;

    beforeEach(() => {
        chain = new Chain();
        accounts = chain.accounts;
        deployer = accounts.get('deployer')!;
        wallet1 = accounts.get('wallet_1')!;
        wallet2 = accounts.get('wallet_2')!;
    });

    it('should allow users to create a time capsule', () => {
        const block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'create-capsule',
                [
                    types.utf8("Test message"),
                    types.uint(100)
                ],
                wallet1.address
            )
        ]);

        // Assert successful creation
        block.receipts[0].result.expectOk().expectUint(1);
        assertEquals(block.height, 2);
    });

    it('should not allow early reveal of capsules', () => {
        let block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'create-capsule',
                [
                    types.utf8("Test message"),
                    types.uint(100)
                ],
                wallet1.address
            )
        ]);

        block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'reveal-capsule',
                [types.uint(1)],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectErr(types.uint(103));
    });

    it('should allow reveal after unlock height', () => {
        const message = "Test message";
        let block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'create-capsule',
                [
                    types.utf8(message),
                    types.uint(10)
                ],
                wallet1.address
            )
        ]);

        // Mine blocks to pass unlock height
        chain.mineEmptyBlockUntil(12);

        block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'reveal-capsule',
                [types.uint(1)],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectOk().expectAscii(message);
    });

    it('should only allow owner to reveal message', () => {
        let block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'create-capsule',
                [
                    types.utf8("Test message"),
                    types.uint(10)
                ],
                wallet1.address
            )
        ]);

        chain.mineEmptyBlockUntil(12);

        block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'reveal-capsule',
                [types.uint(1)],
                wallet2.address
            )
        ]);

        block.receipts[0].result.expectErr(types.uint(105));
    });

    it('should allow owner to get capsule details', () => {
        let block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'create-capsule',
                [
                    types.utf8("Test message"),
                    types.uint(100)
                ],
                wallet1.address
            )
        ]);

        block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'get-capsule-details',
                [types.uint(1)],
                wallet1.address
            )
        ]);

        const result = block.receipts[0].result.expectOk().expectTuple();
        assertEquals(result['unlock-height'], types.uint(102));
        assertEquals(result['is-revealed'], types.bool(false));
    });

    it('should track total number of capsules correctly', () => {
        let block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'get-total-capsules',
                [],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectOk().expectUint(0);

        block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'create-capsule',
                [types.utf8("Message 1"), types.uint(100)],
                wallet1.address
            ),
            Tx.contractCall(
                'time-capsule',
                'create-capsule',
                [types.utf8("Message 2"), types.uint(100)],
                wallet1.address
            )
        ]);

        block = chain.mineBlock([
            Tx.contractCall(
                'time-capsule',
                'get-total-capsules',
                [],
                wallet1.address
            )
        ]);

        block.receipts[0].result.expectOk().expectUint(2);
    });
});