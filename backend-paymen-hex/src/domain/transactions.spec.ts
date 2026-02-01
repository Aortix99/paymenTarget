import { Transactions } from "./transactions";


describe('Transactions', () => {
    let useCase: Transactions;

    beforeEach(() => {
        Transactions
        useCase = new Transactions(1,
            'string',
            1,
            'string',
            'string',
            1,
            1,
            1,
            new Date());
    });

    it('should return all deliverys', async () => {
        useCase.id = 1;
    });
});