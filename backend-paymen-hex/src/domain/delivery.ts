export class Delivery {
    id: number;
    address: string;
    city: string;
    country: string;

    constructor(
        id: number,
        address: string,
        city: string,
        country: string
    ) {
        this.id = id;
        this.address = address;
        this.city = city;
        this.country = country;
    }
}