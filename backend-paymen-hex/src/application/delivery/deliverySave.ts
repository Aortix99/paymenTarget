import { DeliveryInterface, DeliveryRepository } from "src/domain/delivery.repository";

export class DeliverySave {
    constructor(private readonly repository: DeliveryRepository) {}
    async run(
        address: string,
        city: string,
        country: string
    ): Promise<number> {
        const delivery: DeliveryInterface = {
            address,
            city,
            country
        };
        return await this.repository.saveDelivery(delivery);
    }
}