import axios from 'axios';
import { hideAlert, showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51IvqtlAKkeLqkGzZXUxSrS2Na7IvuGqPy83DzhT6n4LkzBwEzxJvkb5Qr6ORjLUADhylPmhrUXBTXUdnY4zI3a7M00v28RIUNy'
    );
    // Get session from server
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
