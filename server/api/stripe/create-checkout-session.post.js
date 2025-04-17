import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default defineEventHandler(async (event) => {
  try {
    const { customerId, priceId } = await readBody(event);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card", "paypal"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NUXT_PUBLIC_BASE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NUXT_PUBLIC_BASE_URL}/subscription/canceled`,
      metadata: {
        userId: event.context.auth.user.id,
      },
    });

    return {
      url: session.url,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create checkout session",
    });
  }
});
