export interface CustomersRepository {
    saveCustomer(customer: CustomerInterface): Promise<number>;
    findByDocument(document: string): Promise<CustomerInterfaceResponse | null>;
};

export interface CustomerInterface {
    fullName: string;
    document: string;
    email: string;
}
export interface CustomerInterfaceResponse {
    id: number;
    fullName: string;
    document: string;
    email: string;
}