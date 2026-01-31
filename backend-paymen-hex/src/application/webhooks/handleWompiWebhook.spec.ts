import { HandleWompiWebhook } from "./handleWompiWebhook";
import { TransactionRepository } from "src/domain/transactions.repository";
import { ProductRepository } from "src/domain/product.repository";

describe("HandleWompiWebhook", () => {
  let transactionRepo: jest.Mocked<Pick<TransactionRepository, "findById" | "updateTransaction">>;
  let productRepo: jest.Mocked<Pick<ProductRepository, "decrementStock">>;

  beforeEach(() => {
    transactionRepo = {
      findById: jest.fn(),
      updateTransaction: jest.fn(),
    };
    productRepo = {
      decrementStock: jest.fn(),
    };
  });

  it("does nothing when event is not transaction.updated", async () => {
    const handler = new HandleWompiWebhook(
      transactionRepo as TransactionRepository,
      productRepo as ProductRepository,
      -1,
    );
    await handler.run({ event: "merchant.updated", data: {} });
    expect(transactionRepo.findById).not.toHaveBeenCalled();
    expect(productRepo.decrementStock).not.toHaveBeenCalled();
  });

  it("does nothing when status is not APPROVED", async () => {
    const handler = new HandleWompiWebhook(
      transactionRepo as TransactionRepository,
      productRepo as ProductRepository,
      -1,
    );
    await handler.run({
      event: "transaction.updated",
      data: { reference: "pay-1", status: "DECLINED" },
    });
    expect(transactionRepo.findById).not.toHaveBeenCalled();
    expect(productRepo.decrementStock).not.toHaveBeenCalled();
  });

  it("does nothing when reference does not match pay-{id}", async () => {
    const handler = new HandleWompiWebhook(
      transactionRepo as TransactionRepository,
      productRepo as ProductRepository,
      -1,
    );
    await handler.run({
      event: "transaction.updated",
      data: { reference: "other-1", status: "APPROVED" },
    });
    expect(transactionRepo.findById).not.toHaveBeenCalled();
  });

  it("updates transaction and decrements stock when APPROVED and reference pay-{id}", async () => {
    (transactionRepo.findById as jest.Mock).mockResolvedValue({ productId: 10 });
    const handler = new HandleWompiWebhook(
      transactionRepo as TransactionRepository,
      productRepo as ProductRepository,
      -1,
    );
    await handler.run({
      event: "transaction.updated",
      data: { reference: "pay-1", status: "APPROVED", id: "wompi-123" },
    });
    expect(transactionRepo.findById).toHaveBeenCalledWith(1);
    expect(transactionRepo.updateTransaction).toHaveBeenCalledWith(1, "APPROVED", "wompi-123");
    expect(productRepo.decrementStock).toHaveBeenCalledWith(10, -1);
  });

  it("uses custom stockDecrement from constructor", async () => {
    (transactionRepo.findById as jest.Mock).mockResolvedValue({ productId: 5 });
    const handler = new HandleWompiWebhook(
      transactionRepo as TransactionRepository,
      productRepo as ProductRepository,
      -2,
    );
    await handler.run({
      event: "transaction.updated",
      data: { reference: "pay-2", status: "APPROVED" },
    });
    expect(productRepo.decrementStock).toHaveBeenCalledWith(5, -2);
  });

  it("does nothing when transaction not found", async () => {
    (transactionRepo.findById as jest.Mock).mockResolvedValue(null);
    const handler = new HandleWompiWebhook(
      transactionRepo as TransactionRepository,
      productRepo as ProductRepository,
      -1,
    );
    await handler.run({
      event: "transaction.updated",
      data: { reference: "pay-99", status: "APPROVED" },
    });
    expect(transactionRepo.updateTransaction).not.toHaveBeenCalled();
    expect(productRepo.decrementStock).not.toHaveBeenCalled();
  });
});
