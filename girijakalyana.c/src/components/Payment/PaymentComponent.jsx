import { toast } from "react-toastify";
import { post } from "../api/authHooks";
const PaymentComponent = () => {

    const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

    const handlePayment = async () => {
          const res = await loadRazorpayScript();
  if (!res) {
    alert("Razorpay SDK failed to load");
    return;
  }

  const amount = 500; // Example: ₹500

     // 1. Create Razorpay Order via backend
    // Step 1: Create order on backend
  const order = await fetch("http://localhost:5000/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 500 }), // amount in rupees
  }).then((res) => res.json());

  const options = {
    key: "rzp_test_xo6iwTlJevKgmd", // 🔁 Replace with your Razorpay Key ID
    amount: order.amount,
    currency: order.currency,
    name: "Your App Name",
    description: "Test Transaction",
    order_id: order.id, // 👈 this must come from backend
    handler: async function (response) {
      // 🔁 Optionally, verify on backend
     const verify = await fetch("http://localhost:5000/api/payment/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      }).then((res) => res.json());
      if(verify.verified) {
        toast.success("Payment successful!");
      }else {
        toast.error("Payment failed!");
      }
    },
    prefill: {
      name: "Abubakar Nadaf",
      email: "test@example.com",
      contact: "9999999999",
    },
    theme: {
      color: "#F37254",
    },
  };

  const paymentObject = new (window).Razorpay(options);
  paymentObject.open();
};
  return (
    <button onClick={handlePayment}>Pay Now</button>
  )
}

export default PaymentComponent