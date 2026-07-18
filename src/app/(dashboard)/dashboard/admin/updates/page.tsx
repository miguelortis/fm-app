"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Input,
  Switch,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Label,
} from "@heroui/react";
import { Calendar, ShieldAlert } from "lucide-react";
import { toast } from "@heroui/react";

interface IJornada {
  id: string;
  name: string;
  year: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export default function JornadasPage() {
  // Simulador de estado local ajustado a HeroUI 3.0.3
  const [jornadas, setJornadas] = useState<IJornada[]>([
    {
      id: "JOR-2026-1",
      name: "Censo de Actualización Docente y Administrativo 2026",
      year: "2026",
      isActive: true,
      startDate: "2026-06-01",
      endDate: "2026-07-01",
    },
    {
      id: "JOR-2025-2",
      name: "Jornada Extraordinaria de Carga Familiar Obrera",
      year: "2025",
      isActive: false,
      startDate: "2025-11-15",
      endDate: "2025-12-15",
    },
  ]);

  const toggleJornadaStatus = (id: string, currentStatus: boolean) => {
    setJornadas((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isActive: !currentStatus } : j)),
    );

    toast.success(currentStatus ? "Jornada Clausurada" : "Jornada Activada", {
      description: currentStatus
        ? "El formulario público de registro ahora está deshabilitado."
        : "El formulario público de registro ya se encuentra abierto para los trabajadores.",
    });
  };

  const handleCreateJornada = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newJornada: IJornada = {
      id: `JOR-${Date.now()}`,
      name: formData.get("name") as string,
      year: formData.get("year") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      isActive: false,
    };

    setJornadas((prev) => [newJornada, ...prev]);
    toast.success("Jornada Creada", {
      description:
        "La jornada se registró en modo inactivo. Actívala cuando desees iniciar el censo.",
    });
    e.currentTarget.reset();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 antialiased text-slate-800">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <Calendar className="text-[#006ae1]" size={28} />
          Control de Jornadas de Actualización
        </h1>
        <p className="text-slate-500 text-sm">
          Abre o cierra los procesos de censo institucional. Cuando una jornada
          esté activa, se permitirá el registro público de nuevos usuarios y la
          actualización de su carga familiar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORMULARIO DE CREACIÓN */}
        <Card className="shadow-sm border border-slate-100 lg:col-span-1 h-fit">
          <Card.Content className="p-5">
            <form onSubmit={handleCreateJornada} className="space-y-4">
              <h2 className="text-md font-black text-slate-700 uppercase tracking-wider">
                Nueva Jornada
              </h2>
              <div>
                <Label
                  htmlFor="name"
                  className="text-slate-600 text-xs font-medium mb-1"
                >
                  Nombre del Proceso Institucional
                </Label>
                <Input
                  name="name"
                  //label="Nombre del Proceso"
                  placeholder="Ej: Censo Unificado 2026"
                  //isRequired
                  variant="primary"
                  className="font-semibold"
                />
              </div>

              <Input
                name="year"
                //label="Año Fiscal / Escolar"
                placeholder="Ej: 2026"
                //isRequired
                variant="primary"
                className="font-semibold"
              />

              <Input
                name="startDate"
                //label="Fecha de Apertura"
                type="date"
                //isRequired
                variant="primary"
                className="font-semibold"
              />

              <Input
                name="endDate"
                //label="Fecha de Cierre"
                type="date"
                //isRequired
                variant="primary"
                className="font-semibold"
              />

              <Button
                type="submit"
                //startContent={<Plus size={18} />}
                className="w-full font-bold bg-[#006ae1] rounded-xl"
              >
                Crear Configuración
              </Button>
            </form>
          </Card.Content>
        </Card>

        {/* TABLA DE MONITOREO Y ACCIÓN */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs font-semibold">
            <ShieldAlert size={18} className="shrink-0" />
            <span>
              Nota de Seguridad: Solo puede existir una (1) jornada en estado
              activo en paralelo para evitar colisiones de registros en las
              bases de datos de nómina.
            </span>
          </div>

          <Table
            aria-label="Tabla de control de jornadas"
            className="shadow-sm border border-slate-100 rounded-2xl overflow-hidden"
          >
            <TableHeader>
              <TableColumn>PROCESO INSTITUCIONAL</TableColumn>
              <TableColumn>AÑO</TableColumn>
              <TableColumn>PERIODO VIGENTE</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>INTERRUPTOR</TableColumn>
            </TableHeader>
            <TableBody /* emptyContent="No se han configurado jornadas en el sistema." */
            >
              {jornadas.map((j) => (
                <TableRow key={j.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm leading-tight">
                        {j.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 uppercase">
                        {j.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-600 text-sm">
                    {j.year}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs text-slate-600 font-medium">
                      <span>Apertura: {j.startDate}</span>
                      <span>Clausura: {j.endDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="primary"
                      color={j.isActive ? "success" : "default"}
                      className="font-black text-[10px] uppercase tracking-wider"
                    >
                      {j.isActive ? "Abierta" : "Cerrada"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Switch
                      isSelected={j.isActive}
                      //onValueChange={() => toggleJornadaStatus(j.id, j.isActive)}
                      //color="success"
                      size="sm"
                      /* thumbIcon={({ isSelected, className }) =>
                        isSelected ? (
                          <Power className={`${className} text-emerald-600 p-0.5`} />
                        ) : (
                          <Power className={`${className} text-slate-400 p-0.5`} />
                        )
                      } */
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
