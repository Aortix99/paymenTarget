import { Body, Controller, Inject, Post } from "@nestjs/common";
// import { HandleWompiWebhook } from "src/application/webhooks/handleWompiWebhook";
import { WEBHOOK_HANDLER } from "./tokens";

@Controller("transactions")
export class WebhookController {
  constructor(
    // @Inject(WEBHOOK_HANDLER)
    // private readonly handleWebhook: HandleWompiWebhook,
  ) {}
  // Como no tengo los permisos de wompi no podre usaR ESTE ENDPOINT, bueno no sera consumodo por el evento. todca registrar
  @Post("webhook")
  async wompiWebhook(@Body() body: Record<string, unknown>): Promise<{ received: true }> {
    // await this.handleWebhook.run(body as any  );
    return { received: true };
  }
}
