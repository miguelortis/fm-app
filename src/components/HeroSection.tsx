"use client";
import { motion } from "framer-motion";
import { Button, Chip } from "@heroui/react";
import { ArrowRight, Heart } from "lucide-react";
import NextLink from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Texto e Interacción */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Chip
            //startContent={<Heart size={14} className="fill-unefm-blue" />}
            //variant="flat"
            //color="primary"
            className="mb-6 bg-blue-50 text-unefm-blue font-bold px-4 border-none"
          >
            Tu salud, nuestra prioridad
          </Chip>

          <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">
            Cuidamos tu <br />
            <span className="tracking-tighter text-unefm-teal font-extrabold">
              bienestar integral
            </span>
          </h1>

          <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
            Atención médica de vanguardia con tecnología de última generación.
            Profesionales comprometidos con tu salud y la de tu familia.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              //as={NextLink}
              //href="/login"
              size="lg"
              className="gradient-bg text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-teal-500/20"
              //endContent={<ArrowRight size={20} />}
            >
              Iniciar Sesión
            </Button>
            <Button
              //variant="bordered"
              size="lg"
              className="border-slate-200 text-slate-600 font-bold h-14 px-10 rounded-2xl bg-white"
            >
              Registrarse
            </Button>
          </div>

          <div className="mt-12 flex gap-8">
            <div>
              <p className="text-3xl font-black text-slate-900">15k+</p>
              <p className="text-slate-400 text-sm">Pacientes</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">50+</p>
              <p className="text-slate-400 text-sm">Especialistas</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">98%</p>
              <p className="text-slate-400 text-sm">Satisfacción</p>
            </div>
          </div>
        </motion.div>

        {/* Visual e Imagen Decorativa */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
            {/* Aquí simularíamos la tarjeta de Cardiología de la imagen */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 gradient-bg rounded-2xl text-white shadow-lg shadow-teal-500/30">
                <Heart size={32} />
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-800">
                  Cardiología
                </h3>
                <p className="text-slate-400 text-sm italic">
                  Atención avanzada
                </p>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "98%" }}
                transition={{ duration: 1.5, delay: 1 }}
                className="h-full gradient-bg"
              />
            </div>
            <p className="text-right text-xs font-bold text-unefm-teal mt-2">
              98% Éxito
            </p>
          </div>

          {/* Elementos flotantes estilo Lovable */}
          <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-50">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
              ✓
            </div>
            <p className="text-sm font-bold text-slate-700">ISO 9001:2025</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
