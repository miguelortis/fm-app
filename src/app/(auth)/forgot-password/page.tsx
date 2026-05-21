"use client";
import { useForm } from "react-hook-form";
import { Button, Input, Label } from "@heroui/react";
import { useForgotPasswordMutation } from "@/hooks/auth/useAuthMutation";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm<ForgotPasswordFormData>();
  const { mutate, isPending, isSuccess } = useForgotPasswordMutation();

  const onSubmit = (data: ForgotPasswordFormData) => mutate(data.email);

  return (
    <>
      <h1 className="text-3xl font-black text-slate-900 mb-2">
        {isSuccess ? "¡Correo enviado!" : "¿Olvidaste tu clave?"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-sm font-bold text-slate-700">
            Correo electrónico
          </Label>
          <Input
            id="email"
            {...register("email", { required: true })}
            type="email"
          />
        </div>
        <Button
          isPending={isPending}
          type="submit"
          className="w-full py-7 text-base font-bold text-white gradient-hero shadow-glow rounded-2xl mt-4"
        >
          Enviar Instrucciones
        </Button>
      </form>
    </>
  );
}
