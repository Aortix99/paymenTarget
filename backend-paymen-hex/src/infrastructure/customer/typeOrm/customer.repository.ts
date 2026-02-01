import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CustomerInterface, CustomerInterfaceResponse, CustomersRepository } from "src/domain/customer.repository";
import { CustomerEntity } from "./customer.entity";


@Injectable()
export class CustomerRepository implements CustomersRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly ormRepo: Repository<CustomerEntity>,
  ) {}

  async saveCustomer(body: CustomerInterface): Promise<number> {
    const rows = await this.ormRepo.save(body);
    return rows.id;
  }
  async findByDocument(document: string): Promise<CustomerInterfaceResponse | null> {
    const row =  await this.ormRepo.findOne({where: {document}});
    if(!row) return null;
    return {
        id: row.id,
        fullName: row.fullName,
        document: row.document,
        email: row.email,
    };
  } 
}
