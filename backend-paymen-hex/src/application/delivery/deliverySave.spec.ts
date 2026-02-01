import { DeliveryRepository } from "src/domain/delivery.repository";
import { DeliverySave } from "./deliverySave";


describe('DeliverySave', () => {
  let repository: jest.Mocked<DeliveryRepository>;
  let useCase: DeliverySave;

  beforeEach(() => {
    repository = {
      saveDelivery: jest.fn(),
    } as jest.Mocked<DeliveryRepository>;

    useCase = new DeliverySave(repository);
  });

  it('should return all deliverys', async () => {
    await useCase.run('123 Main St', 'Cityville', 'Countryland');
    expect(repository.saveDelivery).toHaveBeenCalledTimes(1);
    expect(repository.saveDelivery).toHaveBeenCalledWith({
      address: '123 Main St',
      city: 'Cityville',
      country: 'Countryland',
    });
  });
});