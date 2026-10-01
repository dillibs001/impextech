interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

interface PaystackInstance {
  openIframe: () => void;
}

interface PaystackPopConstructor {
  setup: new (config: PaystackConfig) => PaystackInstance;
}

interface Window {
  PaystackPop: PaystackPopConstructor;
}
