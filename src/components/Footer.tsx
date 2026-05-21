"use client";

import NextLink from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="text-2xl font-black tracking-tighter text-slate-900">
            UNEFM<span className="text-unefm-teal font-light">Salud</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Comprometidos con la excelencia médica y el bienestar de toda la
            comunidad universitaria.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Plataforma</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-medium">
            <li>
              <NextLink
                href="#"
                className="hover:text-unefm-blue transition-colors"
              >
                Servicios
              </NextLink>
            </li>
            <li>
              <NextLink
                href="#"
                className="hover:text-unefm-blue transition-colors"
              >
                Especialistas
              </NextLink>
            </li>
            <li>
              <NextLink
                href="#"
                className="hover:text-unefm-blue transition-colors"
              >
                Telemedicina
              </NextLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Soporte</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-medium">
            <li>
              <NextLink
                href="#"
                className="hover:text-unefm-blue transition-colors"
              >
                Preguntas Frecuentes
              </NextLink>
            </li>
            <li>
              <NextLink
                href="#"
                className="hover:text-unefm-blue transition-colors"
              >
                Contacto
              </NextLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-slate-500 font-medium">
            <li>
              <NextLink
                href="#"
                className="hover:text-unefm-blue transition-colors"
              >
                Términos
              </NextLink>
            </li>
            <li>
              <NextLink
                href="#"
                className="hover:text-unefm-blue transition-colors"
              >
                Privacidad
              </NextLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-xs">
          © {new Date().getFullYear()} UNEFM Salud. Todos los derechos
          reservados.
        </p>
        <div className="flex gap-6">
          {/* Aquí irían iconos de redes sociales si lo deseas */}
        </div>
      </div>
    </footer>
  );
};
