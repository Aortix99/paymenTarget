import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum TransactionStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	DECLINED = 'DECLINED',
}

@Entity({ name: 'transactions' })
export class TransactionsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 150 })
	reference: string;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	amount: number;

	@Column({ type: 'varchar', default: 'PENDING', length: 20 })
	status: TransactionStatus;

	@Column({ type: 'varchar', length: 150 })
	wompiTransactionId: string;

	@Column({ type: 'int' })
	productId: number;

	@Column({ type: 'int' })
	customerId: number;

	@Column({ type: 'int' })
	deliveryId: number;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;
}

 