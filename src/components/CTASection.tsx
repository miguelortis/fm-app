"use client";
import { Button } from "@heroui/react";
import { Calendar } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="gradient-bg rounded-[3rem] p-12 lg:p-20 text-center text-white shadow-2xl shadow-teal-500/20 relative overflow-hidden">
          {/* Círculos decorativos para el Glassmorphism */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight">
              ¿Necesitas una consulta?
            </h2>
            <p className="text-blue-50 text-lg lg:text-xl max-w-2xl mx-auto opacity-90">
              Nuestro equipo está listo para atenderte. Agenda tu cita hoy y da
              el primer paso hacia una vida más saludable.
            </p>
            <Button
              size="lg"
              className="bg-white text-unefm-blue font-black h-16 px-12 rounded-2xl shadow-xl hover:scale-105 transition-transform"
              //startContent={<Calendar size={20} />}
            >
              Agendar Cita Ahora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
