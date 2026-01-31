import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliveryEntity } from "./delivery.entity";
import { DeliveryInterface, DeliveryRepository } from "src/domain/delivery.repository";


@Injectable()
export class DeliverysRepository implements DeliveryRepository {
  constructor(
    @InjectRepository(DeliveryEntity)
    private readonly ormRepo: Repository<DeliveryEntity>,
  ) {}

  async saveDelivery(body: DeliveryInterface): Promise<number> {
    const rows = await this.ormRepo.save(body);
    return rows.id;
  } 
}
