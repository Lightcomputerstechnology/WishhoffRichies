// supabase/functions/create-wish/index.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAILS') || '').split(',').map(e => e.trim()).filter(Boolean);
const SITE_URL = Deno.env.get('NEXT_PUBLIC_SITE_URL') || '';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { name, email, title, description, amount } = body;

    if (!name || !email || !title || !description || !amount) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    // ✅ Get or create user
    let { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    let userId = existing?.id;

    if (!userId) {
      const { data: newUser, error: userErr } = await supabase
        .from('users')
        .insert([{ name, email }])
        .select()
        .single();
      if (userErr) throw userErr;
      userId = newUser.id;
    }

    // ✅ Create wish record
    const { data, error } = await supabase
      .from('wishes')
      .insert([
        {
          user_id: userId,
          name,
          title,
          description,
          amount,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // ✅ Optional: Send email notification (use Resend, Brevo, etc. via webhook)
    if (ADMIN_EMAILS.length > 0) {
      const subject = `New wish submitted: ${title}`;
      const html = `
        <p>A new wish has been submitted:</p>
        <ul>
          <li><strong>Title:</strong> ${title}</li>
          <li><strong>Name:</strong> ${name} (${email})</li>
          <li><strong>Amount:</strong> $${amount}</li>
        </ul>
        <p><a href="${SITE_URL}/moderation">Review in moderation</a></p>
      `;

      // Example: send to a 3rd-party mail API endpoint
      for (const to of ADMIN_EMAILS) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ from: 'Light <no-reply@dealcross.net>', to, subject, html })
        }).catch(() => {});
      }
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error('create-wish error:', err);
    return new Response(JSON.stringify({ error: 'Failed to create wish' }), { status: 500 });
  }
});
