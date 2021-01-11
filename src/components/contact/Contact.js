import React from 'react'
import Link from "next/link";


export const Contact = () => {
    return (
        <div className="w-2/3 mx-auto text-center text-xl mb-5">
            <h3 className="w-full font-bold text-2xl mt-2">Contáctanos</h3>
            <input className="w-full shadow-2xl border border-gray-300 mb-2 py-2 px-1 rounded-lg mt-2" type="text" placeholder="Tú Nombre"/>
            <input className="w-full shadow-2xl border border-gray-300 mb-2 py-2 px-1 rounded-lg" type="tel" placeholder="Tú Celular"/>
            <textarea className="w-full shadow-2xl border border-gray-300 py-2 px-1 rounded-lg" placeholder="Escribe tu mensaje" name="mensaje" id="mensaje"></textarea>
            <Link href="/rifas/1">
              <a
                className="w-full py-1 px-5 block mx-auto mt-5 text-center text-xl rounded font-semibold text-white shadow-lg"
                style={{
                  backgroundColor: "#6adad7",
                }}
              >
                Enviar
              </a>
            </Link>
        </div>
    )
}
