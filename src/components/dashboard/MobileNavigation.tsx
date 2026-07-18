"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* SIDEBAR FLOTANTE PARA MÓVILES */}
      <div
        className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`relative flex w-full max-w-xs flex-1 flex-col bg-white transition-transform duration-300 ease-out shadow-2xl ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="absolute right-4 top-4 z-50">
            <Button
              isIconOnly
              variant="outline"
              className="rounded-xl text-slate-500"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>
          <Sidebar />
        </div>
      </div>

      {/* NAVBAR SUPERIOR RESPONSIVA MÓVIL */}
      <header className="w-full flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6 shadow-sm">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#006ae1] to-[#00a6a0] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#006ae1]/20">
            U
          </div>
          <span className="font-black text-lg text-slate-800 tracking-tight">
            UNEFM<span className="text-[#00a6a0]">Salud</span>
          </span>
        </div>

        <Button
          isIconOnly
          variant="outline"
          className="rounded-xl border border-slate-100 bg-slate-50 text-slate-700 lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={20} />
        </Button>
      </header>
    </>
  );
}
