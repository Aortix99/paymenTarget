import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'delivery' })
export class DeliveryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    address: string;

    @Column({ type: 'varchar', length: 100 })
    city: string;

    @Column({ type: 'varchar', length: 50 })
    country: string;
}