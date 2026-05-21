"use client";

import { useAuthStore } from "@/store/auth.store";
import { Card } from "@heroui/react";
import {
  Calendar,
  Users,
  ShieldCheck,
  Activity,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  LucideIcon,
} from "lucide-react";

// Interfaces para el tipado
interface WidgetLink {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  colorClass: string; // Colores temáticos para los iconos
  permission?: string;
  size: "large" | "normal"; // Define el tamaño en la Bento Grid
}

export default function DashboardPage() {
  // SIMULACIÓN DE USUARIO (Esto vendrá de tu Zustand Store o Contexto)
  // Cambia el rol y permisos aquí para probar cómo se adapta la interfaz dinámicamente
  const { user } = useAuthStore();

  // Definición de todos los bloques (Widgets) posibles en el sistema
  const bentoWidgets: WidgetLink[] = [
    {
      title: "Consultas Activas",
      description:
        "Ingresa al área clínica para atender pacientes en tiempo real y registrar diagnósticos.",
      href: "/dashboard/doctor/consultations",
      icon: Activity,
      colorClass: "from-[#006ae1] to-[#006ae1]/80 text-[#006ae1]",
      permission: "medical-records:create",
      size: "large", // Ocupará 2 columnas en pantallas grandes
    },
    {
      title: "Agenda de Citas",
      description:
        "Gestiona, consulta y aprueba las citas médicas programadas para la semana.",
      href: "/dashboard/appointments",
      icon: Calendar,
      colorClass: "from-[#00a6a0] to-[#00a6a0]/80 text-[#00a6a0]",
      permission: "appointments:view",
      size: "normal",
    },
    {
      title: "Historias Clínicas",
      description:
        "Expedientes médicos, antecedentes y evoluciones de los afiliados al fondo.",
      href: "/dashboard/doctor/records",
      icon: FileText,
      colorClass: "from-blue-600 to-cyan-500 text-blue-600",
      permission: "medical-records:view",
      size: "normal",
    },
    {
      title: "Control de Personal",
      description:
        "Administra el catálogo de usuarios del sistema, médicos contratados y afiliados.",
      href: "/dashboard/admin/users",
      icon: Users,
      colorClass: "from-indigo-600 to-purple-500 text-indigo-600",
      permission: "users:view",
      size: "normal",
    },
    {
      title: "Matriz de Seguridad",
      description:
        "Configuración avanzada de roles y permisos atómicos para el personal informático.",
      href: "/dashboard/admin/roles",
      icon: ShieldCheck,
      colorClass: "from-slate-900 to-slate-700 text-slate-800",
      permission: "roles:manage",
      size: "large",
    },
  ];

  // FILTRADO DINÁMICO: Solo mostrar lo que el usuario tiene permitido ver
  const allowedWidgets = bentoWidgets.filter(
    (widget) =>
      !widget.permission ||
      user?.role?.permissions
        ?.map((p) => p.slug)
        ?.includes(widget?.permission) ||
      user?.isRoot,
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 animate-fade-in">
      {/* Sección Hero: Bienvenida con el Degradado Corporativo de tus capturas */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#006ae1] to-[#00a6a0] rounded-[2.5rem] p-6 sm:p-10 text-white shadow-xl shadow-[#006ae1]/10">
        {/* Efecto sutil de fondo */}
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
          <Sparkles size={300} />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
            <Clock size={12} />
            Sistema Operativo Activo
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            ¡Bienvenido de vuelta, <br className="sm:hidden" />
            <span className="underline decoration-white/30">
              {user?.firstName} {user?.lastName}
            </span>
            !
          </h1>
          <p className="text-white/80 text-sm font-medium max-w-md">
            Panel centralizado de UNEFM Salud. Accede de forma segura a tus
            herramientas de trabajo asignadas.
          </p>
        </div>
      </div>

      {/* Título de la Grilla */}
      <div className="space-y-1 px-2">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Accesos Directos
        </h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
          Módulos autorizados para tu rango
        </p>
      </div>

      {/* Bento Grid Adaptativa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allowedWidgets.map((widget) => {
          const Icon = widget.icon;
          const isLarge = widget.size === "large";

          return (
            <Card
              key={widget.title}
              //as={Link}
              //href={widget.href}
              className={`group border border-slate-100 bg-white hover:border-slate-200/80 rounded-[2rem] p-6 shadow-[0_15px_40px_-15px_rgba(0,106,225,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,106,225,0.08)] hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between gap-6 ${
                isLarge ? "sm:col-span-2" : "col-span-1"
              }`}
            >
              <Card.Header className="p-0 flex justify-between items-start">
                {/* Icono con fondo sutil del color que le corresponde */}
                <div
                  className={`p-3 bg-slate-50 rounded-2xl group-hover:bg-gradient-to-tr ${widget.colorClass.split(" ")[0]} ${widget.colorClass.split(" ")[1]} group-hover:text-white transition-all duration-300 shadow-sm`}
                >
                  <Icon size={24} className="transition-colors duration-300" />
                </div>

                {/* Flecha indicadora que reacciona al hover */}
                <div className="text-slate-300 group-hover:text-[#006ae1] group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRight size={18} />
                </div>
              </Card.Header>

              <Card.Content className="p-0 space-y-2">
                <h3 className="font-black text-slate-800 text-lg tracking-tight group-hover:text-[#006ae1] transition-colors">
                  {widget.title}
                </h3>
                <p className="text-slate-400 text-xs font-bold leading-relaxed">
                  {widget.description}
                </p>
              </Card.Content>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
