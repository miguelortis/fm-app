"use client";

import React, { createContext, useContext } from "react";
import {
  useForm,
  FormProvider,
  FieldValues,
  UseFormReturn,
  Controller, // 🌟 Importamos Controller
} from "react-hook-form";
import { Label } from "@heroui/react";
import { FormItemProps, FormProps } from "./types/form.interface";

const FormContext = createContext<{
  methods: UseFormReturn<FieldValues>;
} | null>(null);

export function CForm<TFieldValues extends FieldValues = FieldValues>({
  children,
  onFinish,
  onFinishFailed,
  form,
  className = "space-y-4",
}: FormProps<TFieldValues>) {
  const localMethods = useForm<TFieldValues>();
  const methods = (form || localMethods) as UseFormReturn<FieldValues>;

  const handleSubmit = methods.handleSubmit(
    (data) => onFinish?.(data as TFieldValues),
    (errors) => onFinishFailed?.(errors),
  );

  return (
    <FormProvider {...methods}>
      <FormContext.Provider value={{ methods }}>
        <form onSubmit={handleSubmit} className={className} noValidate>
          {children}
        </form>
      </FormContext.Provider>
    </FormProvider>
  );
}

/**
 * 🌟 COMPONENTE INTERNO: CForm.Item (Corregido con Controller)
 */
CForm.Item = function FormItem({
  children,
  name,
  label,
  required,
  pattern,
  validate,
  className = "flex flex-col gap-1.5",
}: FormItemProps) {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error(
      "<Form.Item> debe ser utilizado estrictamente dentro de un contenedor <Form>",
    );
  }

  const {
    control,
    formState: { errors },
  } = context.methods;
  const error = errors[name];

  // Armamos las reglas de validación
  const validationRules: Record<string, unknown> = {};
  if (required) validationRules.required = required;
  if (pattern) validationRules.pattern = pattern;
  if (validate) validationRules.validate = validate;

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={name} className="text-slate-600 text-xs font-bold">
          {label}
        </Label>
      )}

      {/* 🌟 Usamos Controller para interceptar y pasar correctamente el valor al input */}
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({
          field: { onChange: registryOnChange, onBlur, value, ref },
        }) => {
          if (!React.isValidElement(children)) {
            return <>{children}</>;
          }

          // 1. Capturamos si el hijo (tu Input) ya traía un onChange propio
          const childOnChange = (children.props as Record<string, unknown>)
            .onChange as (e: Event) => void;

          // 2. Creamos una función que ejecute AMBOS
          const handleOnChange = (e: Event) => {
            // Primero le avisa a React Hook Form (guarda el valor)
            registryOnChange(e);
            // Luego ejecuta tu función personalizada si existe
            if (typeof childOnChange === "function") {
              childOnChange(e);
            }
          };

          return React.cloneElement(
            children as React.ReactElement<Record<string, unknown>>,
            {
              name,
              onChange: handleOnChange,
              onBlur,
              // 🌟 Si usa Select/Autocomplete de HeroUI pasamos la key, si no, undefined
              selectedKey: value,
              // 🌟 Eliminamos el ?? "" para que viaje undefined si está vacío.
              // Solo dejamos "" si necesitas estrictamente evitar warnings en inputs puros de HTML.
              value: value,
              isInvalid: !!error,
              ref,
            },
          );
        }}
      />
      {error && (
        <span className="text-rose-600 text-[11px] font-bold mt-0.5 animate-pulse">
          {String(error.message || "Este campo es requerido")}
        </span>
      )}
    </div>
  );
};
