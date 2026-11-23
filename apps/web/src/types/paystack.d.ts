// Paystack Inline JS v2 (https://js.paystack.co/v2/inline.js)
interface PaystackTransactionCallbacks {
  onSuccess?: (transaction: { reference: string; status?: string; trans?: string }) => void;
  onCancel?: () => void;
  onLoad?: (transaction: unknown) => void;
  onError?: (error: { message?: string }) => void;
}

interface PaystackPopInstance {
  /** Opens the popup for a transaction initialised on the server (checkout). */
  resumeTransaction: (accessCode: string, callbacks?: PaystackTransactionCallbacks) => unknown;
}

/** Legacy v1-style API, still used by the sourcing deposit on /request. */
interface PaystackLegacyConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

interface PaystackPopConstructor {
  new (): PaystackPopInstance;
  setup: new (config: PaystackLegacyConfig) => { openIframe: () => void };
}

interface Window {
  PaystackPop: PaystackPopConstructor;
}
