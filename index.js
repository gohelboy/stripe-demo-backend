const express = require("express");
const cors = require("cors");
const app = express();
const stripe = require("stripe")("sk_test_51NQSwQSDGsKHxz6UcMp9Boa4HA0ApNujXADhQ89ONhp3NWuVQNRjyouCq4Gnyd6wXfIFiBXrOaqZux8mDncHpzGs000Tdtfb10");

app.use(express.json());
app.use(cors());

const base_url_front = 'https://stripe-demo-gohel.netlify.app'

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { product } = req.body;
    if (!product) return res.json({ message: "Please pass required parameter" });

    product.image = "https://res.cloudinary.com/dezd4yvc4/image/upload/v1701771711/gtasix_fqhu4w.jpg";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.name,
              images: [product.image],
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        },
      ],
      mode: "payment",
      success_url: `${base_url_front}/success`,
      cancel_url: `${base_url_front}/failed`
    });
    return res.json({ id: session.id, url: session.url });
  } catch (e) { console.log(e) }

});

app.get("/api/", (req, res) => {
  res.json({
    message: "Server is listening..",
  });
});

app.listen(5000, () => { console.log("listening on port 5000"); });
