"use client";

import { Input, Button, Label } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@/hooks/auth/useAuthMutation";
import { IUserRegisterData } from "@/types/api";

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<IUserRegisterData>();
  const { mutate, isPending } = useRegisterMutation();

  const onSubmit = (data: IUserRegisterData) => mutate(data);

  return (
    <>
      <h1 className="text-3xl font-black text-slate-900 mb-2">
        Crear una cuenta
      </h1>
      <p className="text-slate-500 text-sm mb-8">
        Completa los datos para registrarte
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="firstName"
            className="text-sm font-bold text-slate-700"
          >
            Nombre
          </Label>
          <Input {...register("firstName")} id="firstName" placeholder="Juan" />
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="lastName"
            className="text-sm font-bold text-slate-700"
          >
            Apellido
          </Label>
          <Input {...register("lastName")} id="lastName" placeholder="Pérez" />
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="nationalId"
            className="text-sm font-bold text-slate-700"
          >
            Cédula de Identidad
          </Label>
          <Input
            {...register("nationalId")}
            id="nationalId"
            placeholder="V-00000000"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-sm font-bold text-slate-700">
            Correo Electrónico
          </Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="usuario@unefm.edu.ve"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="password"
            className="text-sm font-bold text-slate-700"
          >
            Contraseña
          </Label>
          <Input {...register("password")} id="password" type="password" />
        </div>

        <Button
          isPending={isPending}
          type="submit"
          className="w-full py-7 text-base font-bold text-white gradient-hero shadow-glow rounded-2xl mt-4"
        >
          Crear Cuenta
        </Button>
      </form>
    </>
  );
}
