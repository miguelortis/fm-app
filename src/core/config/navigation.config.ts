import { INavigationSection } from "@/types/navigation-config.interface";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileText,
  Activity,
  ShieldAlert,
  CalendarDays,
  History, // 🌟 Nuevo ícono para la Mesa de Validación
} from "lucide-react";

export const SIDEBAR_NAVIGATION: INavigationSection[] = [
  {
    sectionTitle: "Panel General",
    requiredPermissions: [],
    items: [{ title: "Inicio", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    sectionTitle: "Validación de Expedientes",
    requiredPermissions: ["beneficiaries:view"], // Oculta o muestra el bloque completo
    items: [
      {
        title: "Mesa de Validación",
        href: "/dashboard/admin/policy-reviews",
        icon: ShieldAlert, // Asegúrate de importar ShieldAlert de "lucide-react" arriba
        permission: "beneficiaries:view", // Enlace protegido por el slug tipo "screen"
      },
    ],
  },
  {
    sectionTitle: "Control de Coberturas",
    requiredPermissions: ["policies:view"], // Muestra el bloque si puede ver la pantalla
    items: [
      {
        title: "Bandeja de Renovaciones",
        href: "/dashboard/admin/insurance-renewal-reviews",
        icon: FileText,
        permission: "policies:view",
      },
    ],
  },
  {
    sectionTitle: "Admisión y Taquilla",
    requiredPermissions: ["policies:coverage-check"],
    items: [
      {
        title: "Verificar Paciente",
        href: "/dashboard/admin/coverage-verifier",
        icon: Activity,
        permission: "policies:coverage-check", // Protegido con el slug tipo "screen"
      },
    ],
  },
  {
    sectionTitle: "Gestión de Jornadas Anuales",
    requiredPermissions: [
      "policies:renewal-control",
      "policies:period-closure",
    ],
    items: [
      {
        title: "Control de Renovación",
        href: "/dashboard/admin/insurance-renewal",
        icon: CalendarDays,
        permission: "policies:renewal-control",
      },
      {
        title: "Cierre de Lapso",
        href: "/dashboard/admin/period-closure",
        icon: History,
        permission: "policies:period-closure",
      },
    ],
  },
  {
    sectionTitle: "Gestión Interna",
    requiredPermissions: ["users:view"],
    items: [
      {
        title: "Control de Usuarios",
        href: "/dashboard/admin/users",
        icon: Users,
        permission: "users:view",
      },
    ],
  },
  {
    sectionTitle: "Configuración Avanzada",
    requiredPermissions: ["users:view", "roles:manage", "audit-logs:view"],
    items: [
      {
        title: "Gestión de Roles",
        href: "/dashboard/admin/roles",
        icon: ShieldCheck,
        permission: "roles:manage",
      },
      {
        title: "Auditoría de Cambios (Logs)",
        href: "/dashboard/admin/audit-logs",
        icon: FileText,
        permission: "audit-logs:view",
      },
    ],
  },
];
