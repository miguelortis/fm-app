import {
  Label,
  TextField,
  Description,
  ProgressCircle,
  InputGroup,
  FieldError,
} from "@heroui/react";
import { ChangeEventHandler, InputEventHandler, ReactNode } from "react";

interface InputProps {
  label?: string | ReactNode;
  name?: string;
  id?: string;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement, HTMLInputElement> | undefined;
  placeholder?: string;
  description?: string;
  type?: string;
  maxLength?: number | undefined;
  minLength?: number | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  className?: string;
  readOnly?: boolean | undefined;
  onBlur?: ChangeEventHandler<HTMLInputElement, HTMLInputElement> | undefined;
  startContent?: ReactNode;
  endContent?: ReactNode;
  isLoading?: boolean; // <--- Nueva prop independiente para el estado de carga
  pattern?: string;
  onInput?: InputEventHandler<HTMLInputElement> | undefined;
  isInvalid?: boolean;
  errorMessage?: string;
}

const Input = ({
  label,
  name,
  id,
  value,
  onChange,
  placeholder,
  description,
  type,
  maxLength,
  minLength,
  required,
  disabled,
  className,
  readOnly,
  onBlur,
  startContent,
  endContent,
  isLoading = false,
  defaultValue,
  pattern,
  onInput,
  isInvalid,
  errorMessage,
}: InputProps) => {
  return (
    <TextField
      name={name}
      value={value}
      defaultValue={defaultValue}
      id={id}
      isInvalid={isInvalid ? isInvalid : required && !value && !defaultValue}
      isRequired={required}
    >
      <Label className="text-slate-600 text-xs font-bold mb-1.5 min-h-[16px]">
        {label}
      </Label>
      <InputGroup>
        {/* Prefix condicional */}
        {startContent && <InputGroup.Prefix>{startContent}</InputGroup.Prefix>}

        <InputGroup.Input
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
          minLength={minLength}
          required={required}
          onChange={onChange}
          disabled={disabled || isLoading}
          pattern={pattern}
          className={`${className} ${isLoading && "max-w-[80%]"} whitespace-nowrap overflow-hidden text-ellipsis`}
          readOnly={readOnly}
          onBlur={onBlur}
          onInput={onInput}
        />

        {/* Suffix condicional e independiente */}
        {(isLoading || endContent) && (
          <InputGroup.Suffix>
            {isLoading ? (
              <ProgressCircle isIndeterminate aria-label="Loading" size="sm">
                <ProgressCircle.Track>
                  <ProgressCircle.TrackCircle />
                  <ProgressCircle.FillCircle />
                </ProgressCircle.Track>
              </ProgressCircle>
            ) : (
              endContent
            )}
          </InputGroup.Suffix>
        )}
      </InputGroup>

      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage || "Este campo es requerido."}</FieldError>
    </TextField>
  );
};

export { Input };
