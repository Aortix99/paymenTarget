import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'customer' })
export class CustomerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    fullName: string;

    @Column({ type: 'varchar', length: 11 })
    document: string;

    @Column({ type: 'varchar', length: 30 })
    email: string;
}