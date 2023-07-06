const express = require("express");
const cors = require("cors");
const app = express();

const stripe = require("stripe")(
  "sk_test_51NQSwQSDGsKHxz6UcMp9Boa4HA0ApNujXADhQ89ONhp3NWuVQNRjyouCq4Gnyd6wXfIFiBXrOaqZux8mDncHpzGs000Tdtfb10"
);

app.use(express.json());
app.use(cors());

app.post("/api/create-checkout-session", async (req, res) => {
  const { product } = req.body;
  if (!product) return res.json({ message: "Please pass required parameter" });
  product.image =
    "https://res.cloudinary.com/dihuxyiyl/image/upload/v1688632574/DMC_pfjrih.jpg";
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "INR",
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
    success_url: "https://stripe-gohel.netlify.app/success",
    cancel_url: "https://stripe-gohel.netlify.app/cancel",
  });
  res.res.json({ id: session.id, url: session.url });
});
app.get("/api/", (req, res) => {
  res.res.json({
    message: "Server is listening..",
  });
});

app.listen(5000, (req, res) => {
  console.log("listening on port 5000");
});
