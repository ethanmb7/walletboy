import type { PublicKey } from "@solana/web3.js";
import type {
  ProviderInjection,
  ProviderUiInjection,
} from "@200ms/provider-injection";

declare global {
  interface Window {
    anchor: ProviderInjection;
    anchorUi: ProviderUiInjection;
    publicKey: PublicKey;
  }
}
