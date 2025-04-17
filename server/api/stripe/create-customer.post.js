import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default defineEventHandler(async (event) => {
  try {
    const { email, name } = await readBody(event);

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId: event.context.auth.user.id,
      },
    });

    return {
      customerId: customer.id,
    };
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create Stripe customer",
    });
  }
}); 