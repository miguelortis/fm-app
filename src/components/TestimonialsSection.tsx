"use client";

import { Card, Chip } from "@heroui/react";
import { Star, Quote } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal"; // Asegúrate de tener el componente que creamos

const testimonials = [
  {
    name: "María González",
    role: "Paciente de Cardiología",
    content:
      "La atención fue excepcional. Los médicos se tomaron el tiempo de explicar cada detalle de mi diagnóstico con mucha paciencia.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    role: "Paciente de Traumatología",
    content:
      "Después de mi cirugía, el seguimiento fue impecable. Me sentí acompañado en cada paso de la recuperación. ¡Gracias UNEFM!",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    role: "Paciente de Pediatría",
    content:
      "Mis hijos adoran a la Dra. López. El equipo de pediatría es increíblemente cálido, profesional y las instalaciones son de primera.",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-slate-50/50 relative overflow-hidden">
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] -mr-48 -mt-48" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <ScrollReveal>
            <Chip
              //variant="flat"
              className="mb-4 bg-unefm-blue/10 text-unefm-blue font-bold border-none px-4"
            >
              Testimonios
            </Chip>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Lo que dicen nuestros{" "}
              <span className="gradient-text">pacientes</span>
            </h2>
            <p className="text-slate-500 text-lg">
              La confianza de nuestra comunidad es el mejor indicador de nuestra
              excelencia médica.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <ScrollReveal key={index} delay={index * 0.2} direction="up">
              <Card className="border-none bg-white/70 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2.5rem] p-4 group">
                <Card.Content className="gap-6">
                  {/* Icono de Comilla Flotante */}
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-slate-100 rounded-2xl text-slate-400 group-hover:bg-unefm-blue group-hover:text-white transition-colors duration-500">
                      <Quote size={20} />
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-unefm-teal text-unefm-teal"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed italic text-lg">
                    {item.content}
                  </p>

                  <div className="pt-4 border-t border-slate-100">
                    {/* <User
                      name={item.name}
                      description={item.role}
                      avatarProps={{
                        src: item.avatar,
                        className: "rounded-2xl w-12 h-12 shadow-md",
                      }}
                      classNames={{
                        name: "font-black text-slate-800",
                        description: "text-unefm-blue font-medium text-xs",
                      }}
                    /> */}
                  </div>
                </Card.Content>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
