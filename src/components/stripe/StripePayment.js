import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE);
export default function StripePayment({
  amount,
  validarDatos,
  garantizarBoletos,
}) {
  return (
    <div className="App">
      <h2 className="my-2 text-center font-bold">Pagar con Tarjeta</h2>{" "}
      <div className="text-center">
        <img
          className="ml-auto"
          src="https://www.merchantequip.com/image/?logos=v|m|a&height=32"
          alt="Merchant Equipment Store Credit Card Logos"
        />
      </div>
      <Elements stripe={promise}>
        <CheckoutForm
          validarDatos={validarDatos}
          garantizarBoletos={garantizarBoletos}
          amount={amount}
        />
      </Elements>
    </div>
  );
}
