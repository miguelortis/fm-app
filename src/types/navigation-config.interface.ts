import { LucideIcon } from "lucide-react";

export interface INavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: string; // Si se omite, es público para todos los autenticados
}

export interface INavigationSection {
  sectionTitle: string;
  requiredPermissions: string[]; // Qué permisos son necesarios para ver esta sección completa
  items: INavigationItem[];
}
