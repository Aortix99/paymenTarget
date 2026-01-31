
export interface TransactionRepository {
    saveTransaction(transaction: RequestTransaction): Promise<number>;
    updateTransaction(id: number, status: string, idPay: string): Promise<void>;
    validateCard(payload: Payload): Promise<ResponseCard>;
    transactions(payload: CreateTransactionPayload): Promise<ResponseTransactionsCard>;
    validatePayment(id: string): Promise<any>;
}

export interface RequestTransaction {
    reference: string;
    amount: number;
    status: string;
    wompiTransactionId: string;
    productId: number;
    customerId: number;
    deliveryId: number;
}

export interface Payload {
    validateCard: Cad,
    amount: number,
    idTransaction: number,
    idPrroduct: number
}

export interface Cad {
    type: string,
    token: string,
    customer_email: string,
    acceptance_token: string,
    accept_personal_auth: string
}

export interface ResponseCard {
  id: number;
  public_data: TransactionsCard;
  token: string;
  type: string;
  status: string;
  customer_email: string;
}

export interface TransactionsCard {
    bin: string;
    last_four: string;
    card_holder: string;
    validity_ends_at: string;
    type: string
  }
export interface ResponseTransactionsCard {
    id: string;
    created_at: string;
    finalized_at: any;
    amount_in_cents: number;
    reference: string;
    customer_email: string;
    currency: string;
    payment_method_type: string;
    payment_method: any,
    status: string,
    status_message: any,
    billing_data: any,
    shipping_address: any;
    redirect_url: any;
    payment_source_id: number;
    payment_link_id: any;
    customer_data: any;
    bill_id: any;
    taxes: any[],
    tip_in_cents: any
  }

export interface CreateTransactionPayload {
  amount: number;
  idTransaction: number;
  customer_email: string;
  payment_source_id: number;
}