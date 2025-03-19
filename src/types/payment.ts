export type PaymentMetadata = {
  title: string;
  reason: string;
  recipient?: number;
};

export const premiumMetadata: PaymentMetadata = {
  title: "Premium",
  reason: "Premium account",
};
