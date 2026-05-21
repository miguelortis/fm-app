"use client";

import { Navigation } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* 1. Barra de Navegación (Fija con Glassmorphism) */}
      <Navigation />

      <main>
        {/* 2. Hero Section: La primera impresión */}
        <HeroSection />

        {/* 3. Servicios y Especialidades: Con reveal al bajar */}
        <section id="servicios">
          <ServicesSection />
        </section>

        {/* 4. Sección de Características o Beneficios (Opcional) */}
        {/* Aquí podrías añadir un FeaturesSection si lo tienes listo */}

        {/* 5. Testimonios: Prueba social con tarjetas de cristal */}
        <section id="testimonios">
          <TestimonialsSection />
        </section>

        {/* 6. Call to Action: El banner dinámico azul/teal */}
        <ScrollReveal direction="up">
          <CTASection />
        </ScrollReveal>
      </main>

      {/* 7. Footer: Información institucional y links */}
      <Footer />

      {/* Decoración Global de Fondo (Sutil) */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-teal-50/50 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
