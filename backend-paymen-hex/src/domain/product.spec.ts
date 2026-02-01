import { Product } from "./product";


describe('Product', () => {
    let useCase: Product;

    beforeEach(() => {

        useCase = new Product(
            1,
            'string',
            'string',
            'string',
            1,
            1,
            new Date()
        );
    });

    it('should return all deliverys', async () => {
        useCase.id = 1;
    });
});