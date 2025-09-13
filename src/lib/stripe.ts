import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const createPaymentIntent = async (amount: number, currency = 'usd') => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  })
}

export const createConnectedAccount = async (email: string, companyName: string) => {
  return await stripe.accounts.create({
    type: 'standard',
    country: 'US',
    email,
    business_profile: {
      name: companyName,
    },
  })
}

export const createAccountLink = async (accountId: string, returnUrl: string, refreshUrl: string) => {
  return await stripe.accountLinks.create({
    account: accountId,
    return_url: returnUrl,
    refresh_url: refreshUrl,
    type: 'account_onboarding',
  })
}

