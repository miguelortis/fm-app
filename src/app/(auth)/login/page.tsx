"use client";

import { useState } from "react";
import { Input, Button, toast, Label } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/hooks/auth/useAuthMutation";
import Link from "next/link";

interface LoginFormData {
  nationalId: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const { mutate, isPending } = useLoginMutation();

  const onSubmit = (data: LoginFormData) =>
    mutate({ nationalId: data.nationalId, password: data.password });

  return (
    <>
      <h1 className="text-3xl font-black text-slate-900 mb-2">
        ¡Bienvenido de vuelta!
      </h1>
      <p className="text-slate-500 text-sm mb-8">
        Ingresa tus credenciales para acceder
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="nationalId"
            className="text-sm font-bold text-slate-700"
          >
            Cédula de Identidad
          </Label>
          <Input
            id="nationalId"
            {...register("nationalId", { required: true })}
            placeholder="V-12345678"
            // ... estilos anteriores
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="password"
            className="text-sm font-bold text-slate-700"
          >
            Contraseña
          </Label>
          <Input
            {...register("password", { required: true })}
            id="password"
            type="password"
            // ... estilos anteriores
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-unefm-blue font-bold">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
        <Button
          isPending={isPending}
          type="submit"
          className="w-full py-7 text-base font-bold text-white gradient-hero shadow-glow rounded-2xl mt-4"
        >
          Iniciar Sesión
        </Button>
      </form>
    </>
  );
}
