"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Checkbox,
  CheckboxGroup,
  Card,
  Separator,
  Button,
  Input,
  Spinner,
  Label,
  Description,
} from "@heroui/react";
import {
  ShieldCheck,
  Save,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import api from "@/core/api/axios.instance";

interface Permission {
  _id: string;
  name: string;
  slug: string;
  module: string;
}

interface GroupedPermissions {
  [moduleName: string]: Permission[];
}

export default function RolesPage() {
  const queryClient = useQueryClient();
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Obtener Permisos de la API
  const {
    data: permissions = [],
    isLoading,
    isError,
  } = useQuery<Permission[]>({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await api.get("roles-setup/permissions");
      if (!response.data) throw new Error("Error al cargar los permisos");
      return response.data;
    },
  });

  // 2. Mutación para guardar el Rol
  const mutation = useMutation({
    mutationFn: async (newRole: { name: string; permissions: string[] }) => {
      const response = await api.post("roles-setup/roles", newRole);
      if (!response.data) throw new Error("Error al guardar el rol");
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage(
        `El rol "${roleName}" ha sido creado y configurado con éxito.`,
      );
      setErrorMessage(null);
      setRoleName("");
      setSelectedPermissions([]);
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Error inesperado al guardar el rol");
      setSuccessMessage(null);
    },
  });

  // Agrupar permisos por módulo
  const groupedPermissions = permissions.reduce<GroupedPermissions>(
    (acc, curr) => {
      if (!acc[curr.module]) acc[curr.module] = [];
      acc[curr.module].push(curr);
      return acc;
    },
    {},
  );

  const handleSaveRole = () => {
    if (!roleName.trim()) {
      setErrorMessage("Por favor, ingresa un nombre para el nuevo rol.");
      return;
    }
    if (selectedPermissions.length === 0) {
      setErrorMessage(
        "Selecciona al menos un permiso para poder crear el rol.",
      );
      return;
    }
    // Mapeamos los _id en lugar de los slugs para que coincida con tu seed de MongoDB
    const permissionIds = permissions
      .filter((p) => selectedPermissions.includes(p.slug))
      .map((p) => p._id);

    mutation.mutate({ name: roleName, permissions: permissionIds });
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-slate-50/50 rounded-[2rem]">
        <Spinner size="lg" className="text-[#006ae1]" />
        <p className="text-slate-500 font-bold text-sm animate-pulse">
          Cargando matriz de seguridad corporativa...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-100 shadow-2xl rounded-[2rem] text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
          <ShieldAlert size={24} />
        </div>
        <h3 className="font-black text-slate-800 text-lg">
          Error de Sincronización
        </h3>
        <p className="text-sm text-slate-500 font-medium">
          No pudimos conectar con el servidor de credenciales. Por favor,
          verifica el estado de la API.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Botón de retorno de sesión integrado */}
      <div className="flex items-center justify-between">
        <Button
          /* as={Link}
          href="/dashboard" */
          variant="outline"
          className="text-slate-500 hover:text-slate-800 font-bold gap-2 border-slate-200 hover:border-slate-300 rounded-xl text-xs transition-all"
        >
          <ArrowLeft size={14} />
          Volver al panel
        </Button>
      </div>

      {/* Tarjeta Principal Unificada (Idéntica estructura al Login Card) */}
      <Card className="border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,106,225,0.08)] rounded-[2rem] p-3 sm:p-6 bg-white">
        <Card.Header className="flex flex-col items-start gap-2 pt-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Contenedor del Icono con degradado corporativo sutil de fondo */}
            <div className="p-3 bg-gradient-to-tr from-[#006ae1]/10 to-[#00a6a0]/10 rounded-2xl text-[#006ae1]">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                Configuración de <span className="text-[#006ae1]">Roles</span>
              </h1>
              <p className="text-slate-400 text-xs font-bold">
                Asigna privilegios del sistema a nuevos perfiles de usuario
              </p>
            </div>
          </div>
        </Card.Header>

        <Card.Content className="flex flex-col gap-6 px-4 sm:px-6 pb-6 mt-6">
          {/* Input estilizado con el patrón exacto de tu Login */}
          <div className="max-w-md w-full space-y-2">
            <Label
              htmlFor="roleName"
              className="font-black text-slate-800 text-sm tracking-tight"
            >
              Nombre del Rol
            </Label>
            <Input
              id="roleName"
              placeholder="Ej: Personal Administrativo, Coordinador Médico"
              variant="primary"
              className="rounded-2xl border-slate-200 focus-within:border-[#006ae1] h-12 bg-slate-50/40 text-sm font-semibold shadow-inner"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>

          {/* Mensajes de Feedback */}
          {successMessage && (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-emerald-100 shadow-sm animate-appearance-in">
              <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-50 text-rose-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-rose-100 shadow-sm animate-appearance-in">
              <ShieldAlert className="text-rose-500 shrink-0" size={18} />
              {errorMessage}
            </div>
          )}

          <div className="space-y-1 pt-2">
            <h3 className="font-black text-slate-800 text-base tracking-tight">
              Privilegios por Módulo de Software
            </h3>
            <p className="text-xs text-slate-400 font-bold">
              Selecciona las acciones específicas que este rol tendrá permitido
              ejecutar
            </p>
          </div>

          <Separator className="bg-slate-100" />

          {/* Grilla de Módulos con hover dinámico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(groupedPermissions).map((moduleName) => (
              <div
                key={moduleName}
                className="border border-slate-100 bg-slate-50/40 rounded-[1.8rem] p-5 hover:bg-white hover:shadow-[0_10px_30px_-10px_rgba(0,106,225,0.05)] hover:border-slate-200/60 transition-all duration-300"
              >
                {/* Cabecera del Módulo usando el degradado del sistema */}
                <h4 className="font-black text-slate-800 text-sm tracking-tight mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-tr from-[#006ae1] to-[#00a6a0] rounded-full shadow-sm"></span>
                  {moduleName}
                </h4>

                <CheckboxGroup
                  value={selectedPermissions}
                  onChange={(value) => setSelectedPermissions(value)}
                  variant="primary"
                  className="gap-3"
                >
                  {groupedPermissions[moduleName].map((perm) => (
                    <Checkbox
                      key={perm.slug}
                      value={perm.slug}
                      className="group flex items-start gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none"
                    >
                      <Checkbox.Control className="mt-0.5 border-slate-300 group-data-[checked=true]:bg-gradient-to-tr group-data-[checked=true]:from-[#006ae1] group-data-[checked=true]:to-[#00a6a0] group-data-[checked=true]:border-transparent rounded-md transition-all">
                        <Checkbox.Indicator className="text-white" />
                      </Checkbox.Control>
                      <Checkbox.Content className="flex flex-col">
                        <Label className="text-sm text-slate-600 font-bold tracking-tight cursor-pointer">
                          {perm.name}
                        </Label>
                        <Description className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          {perm.slug}
                        </Description>
                      </Checkbox.Content>
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            ))}
          </div>

          <Separator className="bg-slate-100 mt-4" />

          {/* Botón de Guardado con el degradado fluido exacto y sombra de tu Login */}
          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              isPending={mutation.isPending}
              className="w-full sm:w-auto bg-gradient-to-r from-[#006ae1] to-[#00a6a0] text-white rounded-2xl font-black shadow-lg shadow-[#006ae1]/20 hover:opacity-95 transition-all px-10 h-12 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              onPress={handleSaveRole}
            >
              <Save size={16} />
              Confirmar y Crear Rol
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
