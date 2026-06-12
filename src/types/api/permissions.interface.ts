export interface IPermission {
  _id?: string;
  name: string; // Ej: "Crear Usuarios"
  slug: string; // Ej: "users:create"
  type: "screen" | "action"; // Para diferenciar permisos de pantalla vs acciones específicas
  module: string; // Ej: "Administración", "Consultas" (Para agrupar en la UI)
  description?: string;
}
