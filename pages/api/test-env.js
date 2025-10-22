// pages/api/test-env.js
export default function handler(req, res) {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_FLW_PUBLIC: !!process.env.NEXT_PUBLIC_FLW_PUBLIC,
    NEXT_PUBLIC_NOWPAY_PUBLIC: !!process.env.NEXT_PUBLIC_NOWPAY_PUBLIC,
    NEXT_PUBLIC_PAYSTACK_PUBLIC: !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC,
    NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    SENDGRID_FROM: !!process.env.SENDGRID_FROM,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  res.status(200).json({
    success: true,
    detected: envVars,
    note: "true = available | false = missing in Render runtime",
  });
}
