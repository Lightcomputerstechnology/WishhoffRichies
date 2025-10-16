// lib/stripe.js
import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) throw new Error('Missing Stripe Secret Key')

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16'
})
