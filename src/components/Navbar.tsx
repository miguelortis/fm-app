"use client";

import { useState, useEffect } from "react";
import { Button, Link } from "@heroui/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Efecto para el glassmorphism al hacer scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-100 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <NextLink href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-teal-500/20 group-hover:rotate-6 transition-transform">
            U
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            UNEFM<span className="text-unefm-teal font-light">Salud</span>
          </span>
        </NextLink>

        {/* LINKS DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">
          {["Inicio", "Servicios", "Especialidades", "Nosotros"].map((item) => (
            <NextLink
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-bold text-slate-600 hover:text-unefm-blue transition-colors"
            >
              {item}
            </NextLink>
          ))}
        </div>

        {/* ACCIONES */}
        <div className="hidden lg:flex items-center gap-4">
          <NextLink
            href="/login"
            className="text-sm font-bold text-slate-700 hover:opacity-70 px-4"
          >
            Iniciar Sesión
          </NextLink>
          <Button
            //as={NextLink}
            //href="/register"
            className="gradient-bg text-white font-bold px-8 rounded-full shadow-lg shadow-teal-500/30"
          >
            Registrarse
          </Button>
        </div>

        {/* BOTÓN MÓVIL */}
        <button
          className="lg:hidden p-2 text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MENÚ MÓVIL (Simple) */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl"
        >
          <NextLink href="/login" className="text-center font-bold py-2">
            Iniciar Sesión
          </NextLink>
          <Button
            //as={NextLink}
            //href="/register"
            className="gradient-bg text-white font-bold w-full"
          >
            Registrarse
          </Button>
        </motion.div>
      )}
    </nav>
  );
};
