export class Customer {
    id: number;
    fullName: string;
    document: string;
    email: string;

    constructor(id: number, fullName: string, document: string, email: string) {
        this.id = id;
        this.fullName = fullName;
        this.document = document;
        this.email = email;
    }
}