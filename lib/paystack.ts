const base = process.env.PAYSTACK_BASE_URL || "https://api.paystack.co"

export const paystack = {
  createOrder: async function createOrder(email: string, price: number) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    const url = `${base}/transaction/initialize`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        email: email,
        amount: Number(price * 100),
        currency: 'NGN'
      })
    });
    const jsonData = await handleResponse(response);
    // console.log(jsonData)
    return jsonData;
  },

  capturePayment: async function capturePayment(transactionRef: string) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    const url = `${base}/transaction/verify/${transactionRef}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`
      }
    });
    const jsonData = await handleResponse(response);
    return jsonData;
  }
}

// async function generateAccessToken() {
//   const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;

//   const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

//   const response = await fetch(`${base}/v1/oauth2/token`, {
//     method: "POST",
//     headers: {
//       Authorization: `Basic ${auth}`,
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       grant_type: "client_credentials",
//     }),
//   });

//   const jsonData = await handleResponse(response);
//   return jsonData.access_token;
// }

async function handleResponse(response: Response) {
  if (response.ok) {
    const jsonData = await response.json();
    return jsonData;
  } else {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}