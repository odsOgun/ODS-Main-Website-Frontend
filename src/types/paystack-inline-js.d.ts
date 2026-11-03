declare module '@paystack/inline-js' {
  interface ResumeTransactionCallbacks {
    onLoad?: () => void;
    onCancel?: () => void;
    onError?: (error: { message?: string }) => void;
    onSuccess?: (transaction: { reference: string }) => void | Promise<void>;
  }

  export default class PaystackPop {
    resumeTransaction(accessCode: string, callbacks?: ResumeTransactionCallbacks): void;
  }
}
