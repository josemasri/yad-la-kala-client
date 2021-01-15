import React from "react";

export const FormularioDatos = ({ boleto, setBoleto, pedido, setPedido }) => {
  return (
    <div
      className="rounded-lg block p-1 text-center text-xl"
    >
      <h3>Ingresa tus datos</h3>
      <div className="mt-2">
        <label htmlFor="nombre">Nombre</label>
        <input
          autoFocus
          id="nombre"
          className="block w-full bg-transparent text-center border-b border-gray-500 p-1"
          type="text"
          name="nombre"
          value={boleto.nombre}
          onChange={({ target: { value } }) =>
            setBoleto({ ...boleto, nombre: value })
          }
        />
      </div>
      <div className="mt-2">
        <label htmlFor="celular">Celular</label>
        <input
          id="celular"
          className="block w-full bg-transparent text-center border-b border-gray-500 p-1"
          type="text"
          name="celular"
          value={boleto.celular}
          onChange={({ target: { value } }) =>
            setBoleto({ ...boleto, celular: value })
          }
        />
      </div>
      <div className="mt-2">
        <label htmlFor="correo">Mail</label>

        <input
          id="correo"
          className="block w-full bg-transparent text-center border-b border-gray-500 p-1"
          type="mail"
          name="correo"
          value={boleto.mail}
          onChange={({ target: { value } }) =>
            setBoleto({ ...boleto, mail: value })
          }
        />
      </div>
      <div className="mt-2 text-base">
        <div className="flex items-center justify-center">
          <h5 className="text-center mr-2">Pedido (*opcional)</h5>
        </div>

        <div className="lg:flex text-center">
          <select
            className="w-full bg-transparent text-center border-b border-gray-500 p-1 placeholder-gray-600"
            style={{
              textAlignLast: "center",
            }}
            onChange={(e) => setPedido({ ...pedido, option: e.target.value })}
            value={pedido.option}
          >
            <option value="Leiluy Nishmat">Leiluy Nishmat (Fallecido)</option>
            <option value="Refua Shelema">Refua Shelema (Enfermo)</option>
            <option value="Beraja y Hatzlaja">
              Beraja y Hatzlaja (Bendiciones y éxito)
            </option>
            <option value="Zibug Hagun">Zibug Hagun (Conseguir Pareja)</option>
            <option value="Zera Shel Kayama">
              Zera Shel Kayama (Tener Hijos)
            </option>
          </select>
          <input
            className="w-full bg-transparent text-center border-b border-gray-500 p-1 mb-2"
            type="text"
            placeholder="Nombre (ej. Yosef Ben Sara)"
            onChange={(e) => setPedido({ ...pedido, nombre: e.target.value })}
            value={pedido.nombre}
          />
        </div>
      </div>
    </div>
  );
};
