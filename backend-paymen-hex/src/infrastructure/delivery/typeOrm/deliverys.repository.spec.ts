import { DeliverysRepository } from "./deliverys.repository";
import { Repository } from "typeorm";
import { DeliveryEntity } from "./delivery.entity";


describe('DeliverysRepository', () => {
    let repository: jest.Mocked<Repository<DeliveryEntity>>;
    let useCase: DeliverysRepository;

    beforeEach(() => {
        repository = {
            save: jest.fn().mockImplementation(() => Promise.resolve({
                id: 1, address: 'asad',
                city: 'ada',
                country: 'country'
            })),
        } as unknown as jest.Mocked<Repository<DeliveryEntity>>;

        useCase = new DeliverysRepository(repository);
    });

    it('should call ormRepo.save and return delivery id', async () => {
        const savedEntity = {
            id: 1,
            address: 'address',
            city: 'city',
            country: 'country',
        } as DeliveryEntity;
        repository.save.mockResolvedValueOnce(savedEntity);

        const result = await useCase.saveDelivery({
            address: 'address',
            city: 'city',
            country: 'country',
        });

        expect(repository.save).toHaveBeenCalledTimes(1);
        expect(repository.save).toHaveBeenCalledWith({
            address: 'address',
            city: 'city',
            country: 'country',
        });
        expect(result).toBe(1);
    });
});