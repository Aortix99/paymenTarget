export interface DeliveryRepository {
    saveDelivery(delivery: DeliveryInterface): Promise<number>;
}

export interface DeliveryInterface {
    address: string;
    city: string;
    country: string;
}