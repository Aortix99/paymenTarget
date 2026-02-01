import { Delivery } from "./delivery";


describe('Delivery', () => {
  let useCase: Delivery;

  beforeEach(() => {

    useCase = new Delivery(1,
      'aqui',
      'alla',
      'aca');
  });

  it('should return all deliverys', async () => {
      useCase.id = 1;
      useCase.address = 'new address';
      useCase.city = 'new city';
      useCase.country = 'new country';
  });
});