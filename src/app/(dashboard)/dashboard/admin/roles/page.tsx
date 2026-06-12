"use client";

import { useState } from "react";
import { Card, Button, Input, Checkbox, Tooltip, Spinner } from "@heroui/react";
import {
  ShieldCheck,
  Plus,
  UserCheck,
  Trash2,
  Edit3,
  Lock,
  Layers,
  Tv,
  ToggleLeft,
} from "lucide-react";
import Modal from "@/components/ui/Modal/Modal";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/hooks/admin/useRoleMutation";
import { IRole } from "@/types/api/role.interface";
import { IPermission } from "@/types/api/permissions.interface";
import { usePermissions } from "@/hooks/admin/usePermissionMutation";

export default function RolesPage() {
  // Conexión a tus nuevos Hooks asíncronos de TanStack Query
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();

  // 📡 apiPermissions ahora recibe directamente el Record<string, IPermission[]> desde la API agrupada
  const { data: apiPermissions = {}, isLoading: isLoadingPermissions } =
    usePermissions();

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  // Estados para el formulario del Modal
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [createOpenModal, setCreateOpenModal] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // 🌟 REESTRUCTURADO: Mapeamos el diccionario de la API a un array iterable ordenando por "type"
  const getGroupedPermissions = () => {
    if (!apiPermissions || typeof apiPermissions !== "object") return [];

    return Object.entries(apiPermissions).map(
      ([moduleName, permissionsArray]) => {
        // Ordenamos para que las pantallas ('screen') aparezcan primero arriba y las acciones abajo
        const sortedPermissions = [...(permissionsArray as IPermission[])].sort(
          (a, b) => {
            if (a.type === "screen" && b.type === "action") return -1;
            if (a.type === "action" && b.type === "screen") return 1;
            return 0;
          },
        );

        return {
          moduleName,
          permissions: sortedPermissions,
        };
      },
    );
  };

  // Manejador para abrir modal en modo creación
  const handleCreateOpen = () => {
    setModalMode("create");
    setRoleName("");
    setSelectedPermissions([]);
    setCreateOpenModal(true);
  };

  // Manejador para abrir modal en modo edición
  const handleEditOpen = (role: IRole) => {
    setModalMode("edit");
    setSelectedRoleId(role._id || null);
    setRoleName(role.name);

    // Saneamos los permisos asegurando extraer el ID único de la base de datos
    const currentPerms =
      role.permissions
        ?.map((p: IPermission) => (typeof p === "string" ? p : p?._id))
        .filter((perm): perm is string => typeof perm === "string") || [];

    setSelectedPermissions(currentPerms);
    setCreateOpenModal(true);
  };

  // Guardar datos interactuando directamente con tu API
  const handleSaveRole = async () => {
    if (!roleName.trim()) return;

    const rolePayload = {
      name: roleName,
      permissions: selectedPermissions,
    };

    try {
      if (modalMode === "create") {
        await createRoleMutation.mutateAsync(rolePayload);
      } else if (selectedRoleId) {
        await updateRoleMutation.mutateAsync({
          id: selectedRoleId,
          data: rolePayload,
        });
      }
      setCreateOpenModal(false);
    } catch (error) {
      console.error("Error al procesar la mutación del rol:", error);
    }
  };

  // Manejador para eliminar un rol con confirmación nativa
  const handleDeleteRole = (id: string | undefined) => {
    if (
      confirm(
        "¿Estás completamente seguro de que deseas eliminar este rol de la matriz? Esta acción es irreversible.",
      )
    ) {
      deleteRoleMutation.mutate(id || "");
    }
  };

  // Alternar selección de permisos interactiva
  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  // Loader global unificado mientras se sincronizan los datos de Render
  if (isLoadingRoles || isLoadingPermissions) {
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" className="text-[#006ae1]" />
        <p className="text-slate-500 font-bold text-sm animate-pulse">
          Sincronizando matriz de seguridad con Render...
        </p>
      </div>
    );
  }

  const groupedPermissions = getGroupedPermissions();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 select-none">
      {/* 1. HEADER HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#006ae1] to-[#00a6a0] rounded-[2.5rem] p-6 sm:p-8 text-white shadow-xl shadow-[#006ae1]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-16 translate-y-16 pointer-events-none">
          <Layers size={240} />
        </div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
            <ShieldCheck size={12} />
            Matriz de Control Atómico
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Gestión de Roles
          </h1>
          <p className="text-white/80 text-xs font-medium max-w-md">
            Define la jerarquía de seguridad de UNEFM Salud controlando qué
            capacidades tiene cada rango dentro de la plataforma.
          </p>
        </div>

        <Button
          onPress={handleCreateOpen}
          className="relative z-10 bg-white text-[#006ae1] hover:bg-slate-50 font-black text-xs uppercase tracking-wider h-12 px-6 rounded-2xl shadow-lg transition-all duration-200 flex items-center gap-2 group shrink-0"
        >
          <Plus
            size={16}
            className="group-hover:scale-110 transition-transform"
          />
          Crear Nuevo Rol
        </Button>
      </div>

      {/* 2. GRID DE ROLES ACTIVOS */}
      <div className="space-y-3 px-2">
        <h2 className="text-lg font-black text-slate-800 tracking-tight">
          Roles del Sistema
        </h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
          Matriz actual en base de datos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role: IRole) => {
          const roleId = role._id;
          return (
            <Card
              key={roleId}
              className="border border-slate-100 bg-white rounded-[2rem] p-6 shadow-[0_15px_40px_-15px_rgba(0,106,225,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,106,225,0.06)] transition-all duration-300 flex flex-col justify-between gap-6 group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-black text-slate-800 text-base tracking-tight group-hover:text-[#006ae1] transition-colors">
                      {role.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/80">
                      slug: {role.slug}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-[#006ae1]/5 group-hover:text-[#006ae1] transition-all">
                    <UserCheck size={18} />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                  <Lock size={13} className="text-slate-400" />
                  <span>
                    {role.permissions?.length || 0} capacidades autorizadas
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => handleEditOpen(role)}
                  className="w-full rounded-xl font-bold text-xs text-slate-600 hover:text-[#006ae1] hover:bg-slate-50 h-9 flex items-center gap-1.5"
                >
                  <Edit3 size={14} />
                  Modificar Permisos
                </Button>

                {!role.isRoot && (
                  <Tooltip closeDelay={100}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="outline"
                      onPress={() => handleDeleteRole(roleId)}
                      isPending={
                        deleteRoleMutation.isPending &&
                        deleteRoleMutation.variables === roleId
                      }
                      className="rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 h-9 w-9 shrink-0"
                    >
                      <Trash2 size={14} />
                    </Button>
                    <Tooltip.Content className="bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded">
                      Eliminar Rol
                    </Tooltip.Content>
                  </Tooltip>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. MODAL DINÁMICO TOTALMENTE CONECTADO */}
      <Modal
        title={modalMode === "create" ? "Registrar Nuevo Rol" : `Modificar Rol`}
        isOpen={createOpenModal}
        onOpenChange={(open) => setCreateOpenModal(open)}
        footer={
          <>
            <Button
              variant="outline"
              onPress={() => setCreateOpenModal(false)}
              className="rounded-xl font-bold text-xs uppercase tracking-wider h-11 px-4 text-slate-500 hover:bg-slate-50"
            >
              Cancelar
            </Button>
            <Button
              onPress={handleSaveRole}
              isPending={
                createRoleMutation.isPending || updateRoleMutation.isPending
              }
              className="bg-gradient-to-r from-[#006ae1] to-[#00a6a0] text-white font-black text-xs uppercase tracking-wider h-11 px-5 rounded-xl shadow-md shadow-[#006ae1]/10 hover:opacity-95"
            >
              {modalMode === "create" ? "Guardar Rol" : "Actualizar Cambios"}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Nombre del Rol */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider pl-1">
              Nombre del Rol
            </label>
            <Input
              placeholder="Ej. Secretaria Ejecutiva, Médico Residente..."
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              variant="primary"
              className="rounded-2xl"
            />
          </div>

          {/* Listado de Permisos Dinámicos Agrupados */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider pl-1">
                Asignación Atómica de Permisos
              </label>
              <p className="text-slate-400 text-[11px] font-medium pl-1">
                Selecciona qué secciones del Sidebar y APIs podrá usar este rol.
              </p>
            </div>

            <div className="space-y-6">
              {groupedPermissions.map((module) => (
                <div
                  key={module.moduleName}
                  className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 space-y-3 shadow-none"
                >
                  <h4 className="text-xs font-black text-slate-700 tracking-tight flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 bg-[#00a6a0] rounded-full"></span>
                    {module.moduleName}
                  </h4>

                  <div>
                    {module.permissions.map((perm: IPermission) => {
                      const permId = perm?._id as string;
                      const isChecked = selectedPermissions.includes(permId);

                      // 🔍 Identificamos visualmente si es pantalla o permiso de acción
                      const isScreen = perm.type === "screen";

                      return (
                        <div
                          key={perm.slug}
                          onClick={() => togglePermission(permId)}
                          className={`my-[5px] p-3 rounded-xl border transition-all duration-150 cursor-pointer flex items-start select-none ${
                            isChecked
                              ? "bg-white border-[#006ae1] shadow-[0_4px_20px_-10px_rgba(0,106,225,0.15)]"
                              : "bg-white/80 border-slate-100 hover:border-slate-200"
                          }`} // 🌟 Si es una acción, le damos una sangría visual
                        >
                          <Checkbox
                            isSelected={isChecked}
                            onChange={() => togglePermission(permId)}
                            className="pt-0.5"
                          />
                          <div className="space-y-1 pointer-events-none w-full">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-black text-slate-800 tracking-tight">
                                {perm.name}
                              </p>

                              {/* 🌟 BADGE INDICADOR DE TIPO (SCREEN O PERMISSION) */}
                              <span
                                className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded flex items-center gap-1 uppercase ${
                                  isScreen
                                    ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {isScreen ? (
                                  <Tv size={9} />
                                ) : (
                                  <ToggleLeft size={9} />
                                )}
                                {isScreen ? "Pantalla" : "Acción"}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-400 font-medium leading-tight">
                              {perm.description ||
                                "Sin descripción proporcionada por el sistema."}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
