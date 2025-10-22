export default function handler(req, res) {
  const paymentVars = {
    NEXT_PUBLIC_FLW_PUBLIC: process.env.NEXT_PUBLIC_FLW_PUBLIC || null,
    NEXT_PUBLIC_NOWPAY_PUBLIC: process.env.NEXT_PUBLIC_NOWPAY_PUBLIC || null,
    NEXT_PUBLIC_PAYSTACK_PUBLIC: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC || null,
  };

  res.status(200).json(paymentVars);
}
