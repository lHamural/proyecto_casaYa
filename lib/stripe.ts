// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
  appInfo: {
    name: 'Casa Ya',
    version: '1.0.0',
  },
})