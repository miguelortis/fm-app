import { ReactNode } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  children: ReactNode;
  onFinish?: (values: TFieldValues) => void;
  onFinishFailed?: (errors: unknown) => void;
  form?: UseFormReturn<TFieldValues>; // Opcional, por si quieren pasar un ref externo
  className?: string;
}

export interface FormItemProps {
  children: ReactNode;
  name: string; // El path de la propiedad del objeto
  label?: string;
  required?: boolean | string;
  pattern?: { value: RegExp; message: string };
  validate?: (value: void) => boolean | string;
  className?: string;
}
