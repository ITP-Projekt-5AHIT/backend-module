import Stripe from "stripe";
import config from "./config";

const KEY = config.STRIPE_API;

const stripeProvider = new Stripe(KEY);

export default stripeProvider;
