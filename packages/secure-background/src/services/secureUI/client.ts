import type { TransportSender } from "../../types";
import type {
  SECURE_UI_APPROVE_SIGN_MESSAGE,
  SECURE_UI_EVENTS,
} from "../secureUI/events";

export class SecureUIClient {
  constructor(private client: TransportSender<SECURE_UI_EVENTS>) {}

  public approveSignMessage(
    request: SECURE_UI_APPROVE_SIGN_MESSAGE["request"]
  ) {
    return this.client
      .send({
        name: "SECURE_UI_APPROVE_SIGN_MESSAGE",
        request,
      })
      .then(({ response }) => response?.approved);
  }
}
