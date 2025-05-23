import { buffer } from 'micro';
import Stripe from 'stripe';
import { initMongoose } from '../../lib/mongoose';
import Order from '../../models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Required for Stripe webhooks
  },
};

export default async function handler(req, res) {
  await initMongoose();

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Check for successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paid: 1,
      });
      console.log('Order marked as paid:', orderId);
    }
  }

  res.status(200).json({ received: true });
}


// import {initMongoose} from "../../lib/mongoose";
// import Order from "../../models/Order";
// import {buffer} from 'micro';
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// // localhost:3000/api/webhook
// export default async function handler(req, res) {
//   await initMongoose();
//   const signingSecret = 'whsec_712299b4b7e9e627209dfa27f658bfb560aec967a045c04f86e4cf714f50f0f4';
//   const payload = await buffer(req);
//   const signature = req.headers['stripe-signature'];
//   const event = stripe.webhooks.constructEvent(payload, signature, signingSecret);

//   if (event?.type === 'checkout.session.completed') {
//     const metadata = event.data?.object?.metadata;
//     const paymentStatus = event.data?.object?.payment_status;
//     if (metadata?.orderId && paymentStatus === 'paid') {
//       await Order.findByIdAndUpdate(metadata.orderId, {paid:1});
//     }
//   }

//   res.json('ok');
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   }
// };