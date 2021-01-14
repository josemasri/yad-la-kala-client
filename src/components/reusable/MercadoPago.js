import React from "react";
import ScriptTag from "react-script-tag";

export const MercadoPago = ({ precio, action, email, precio }) => {
  return (
    <div>
      <form method="post" action={action}>
        <input type="hidden" value={email} />
        <input type="hidden" precio={precio} />
        <ScriptTag
          src="https://www.mercadopago.com.mx/integrations/v1/web-tokenize-checkout.js"
          data-public-key={process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY}
          data-transaction-amount={precio}
        ></ScriptTag>
      </form>
    </div>
  );
};
