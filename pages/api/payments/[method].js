// /pages/api/payments/[method].js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { wishId, donor_name, donor_email, amount, method } = req.body;
  if (!wishId || !donor_name || !donor_email || !amount || !method)
    return res.status(400).json({ error: 'Missing required fields' });

  try {
    // 1️⃣ Get the current admin percentage
    const { data: setting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin_percent')
      .single();

    const adminPercent = parseFloat(setting?.value || '10');
    const adminCut = (amount * adminPercent) / 100;
    const wishCut = amount - adminCut;

    // 2️⃣ Save payment (pending status)
    const { data: payment, error: insertError } = await supabase
      .from('payments')
      .insert([
        {
          wish_id: wishId,
          donor_name,
          donor_email,
          amount,
          currency: 'USD',
          method,
          status: 'pending',
          admin_cut: adminCut,
          wish_cut: wishCut
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // 3️⃣ Handle payment routing
    let paymentUrl = null;
    if (method === 'card') {
      // Paystack redirect link
      paymentUrl = 'https://paystack.com/pay/demo'; // Replace later with API call
    } else if (method === 'bank') {
      // Flutterwave redirect link
      paymentUrl = 'https://flutterwave.com/pay/demo'; // Replace later with API call
    } else if (method === 'crypto') {
      // NowPayments redirect link
      paymentUrl = 'https://nowpayments.io/payment/demo'; // Replace later with API call
    }

    return res.status(200).json({
      message: 'Payment initialized successfully',
      payment,
      redirect: paymentUrl
    });
  } catch (err) {
    console.error('Payment init error:', err);
    return res.status(500).json({ error: 'Payment initialization failed' });
  }
}
