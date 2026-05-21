import { INavigationSection } from "@/types/navigation-config.interface";
import {
  LayoutDashboard,
  Calendar,
  Users,
  ShieldCheck,
  FileText,
  Activity,
} from "lucide-react";

export const SIDEBAR_NAVIGATION: INavigationSection[] = [
  {
    sectionTitle: "Panel General",
    requiredPermissions: [],
    items: [
      { title: "Inicio", href: "/dashboard", icon: LayoutDashboard },
      {
        title: "Mis Citas",
        href: "/dashboard/appointments",
        icon: Calendar,
        permission: "appointments:view",
      },
    ],
  },
  {
    sectionTitle: "Área Médica",
    requiredPermissions: ["medical-records:create", "medical-records:view"],
    items: [
      {
        title: "Consultas Activas",
        href: "/dashboard/doctor/consultations",
        icon: Activity,
        permission: "medical-records:create",
      },
      {
        title: "Historias Clínicas",
        href: "/dashboard/doctor/records",
        icon: FileText,
        permission: "medical-records:view",
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
    sectionTitle: "Seguridad Informatica",
    requiredPermissions: ["roles:manage"],
    items: [
      {
        title: "Control de Personal",
        href: "/dashboard/admin/users",
        icon: Users,
        permission: "users:view",
      },
      {
        title: "Gestionar Roles",
        href: "/dashboard/admin/roles",
        icon: ShieldCheck,
        permission: "roles:manage",
      },
      {
        title: "Asignar Roles",
        href: "/dashboard/admin/assign-roles",
        icon: ShieldCheck,
        permission: "roles:manage",
      },
    ],
  },
];
