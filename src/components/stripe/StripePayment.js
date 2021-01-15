import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const promise = loadStripe(
  "pk_test_51I9PaNAY1jQpuEbfQNDyULCe5f5umRn3tP6e8eIF0Gq1AdWQ166MnmH1O6ZN0jqedNofTU83zhbYEqvvywkODheB008TtUDfRS"
);
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
