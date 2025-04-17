import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default defineEventHandler(async (event) => {
  try {
    const { subscriptionId } = await readBody(event);

    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to cancel subscription",
    });
  }
});
