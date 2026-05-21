"use client";
import { motion } from "framer-motion";
import { Card, Chip } from "@heroui/react";
import { Stethoscope, Activity, Brain, Eye, Bone, Baby } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const specialities = [
  {
    title: "Medicina General",
    desc: "Atención primaria completa con seguimiento personalizado.",
    icon: <Stethoscope className="text-unefm-blue" size={24} />,
    color: "bg-blue-50",
  },
  {
    title: "Cardiología",
    desc: "Diagnóstico y tratamiento de enfermedades cardiovasculares.",
    icon: <Activity className="text-unefm-teal" size={24} />,
    color: "bg-teal-50",
  },
  {
    title: "Neurología",
    desc: "Especialistas en sistema nervioso y trastornos neurológicos.",
    icon: <Brain className="text-purple-500" size={24} />,
    color: "bg-purple-50",
  },
  // Puedes agregar más aquí...
];

export const ServicesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Chip
              color="success"
              className="mb-4 bg-teal-50 text-unefm-teal font-bold border-none"
            >
              Nuestros Servicios
            </Chip>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Especialidades <span className="gradient-text">Médicas</span>
            </h2>
            <p className="text-slate-500">
              Contamos con un equipo multidisciplinario de profesionales de la
              salud listos para brindarte la mejor atención.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialities.map((item, index) => (
            <ScrollReveal key={index} delay={index * 0.15}>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="border-none shadow-sm hover:shadow-xl transition-shadow bg-slate-50/50 p-4 rounded-[2rem]">
                  <Card.Content className="gap-4">
                    <div
                      className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-sm`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-black text-slate-800">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </Card.Content>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
