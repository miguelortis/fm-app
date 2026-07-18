import {
  Key,
  Label,
  ListBox,
  ProgressCircle,
  Select as SelectHUI,
  TextField,
} from "@heroui/react";
import { FocusEvent } from "react";

interface ISelectProps {
  label?: string;
  name?: string;
  id?: string;
  options?: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  variant?: "primary" | "secondary";
  value?: Key | null | undefined;
  defaultValue?: Key | null | undefined;
  onChange?: ((value: Key | null) => void) | undefined;
  disabled?: boolean;
  onBlur?: ((e: FocusEvent<Element, Element>) => void) | undefined;
  isLoading?: boolean; // <--- Nueva prop opcional e independiente
}

export const Select = ({
  label,
  name,
  id,
  value,
  defaultValue,
  options,
  placeholder,
  className,
  required,
  variant = "primary",
  onChange,
  disabled = false,
  onBlur,
  isLoading = false, // <--- Por defecto es false
}: ISelectProps) => {
  return (
    <>
      <TextField isRequired={required}>
        <Label className="text-slate-600 text-xs font-bold mb-1.5 min-h-[16px]">
          {label}
        </Label>
        <SelectHUI
          name={name}
          id={id}
          className={className}
          placeholder={placeholder}
          isRequired={required}
          variant={variant}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          defaultValue={defaultValue}
          isDisabled={disabled || isLoading}
          aria-label={label || "Select"}
        >
          <SelectHUI.Trigger>
            <SelectHUI.Value />

            {/* Si está cargando, muestra el ProgressCircle; si no, muestra la flecha habitual */}
            {isLoading ? (
              <ProgressCircle isIndeterminate aria-label="Loading" size="sm">
                <ProgressCircle.Track>
                  <ProgressCircle.TrackCircle />
                  <ProgressCircle.FillCircle />
                </ProgressCircle.Track>
              </ProgressCircle>
            ) : (
              <SelectHUI.Indicator />
            )}
          </SelectHUI.Trigger>

          <SelectHUI.Popover>
            <ListBox>
              {(options?.length as number) > 0 &&
                options?.map(({ label, value }) => (
                  <ListBox.Item key={value} id={value} textValue={label}>
                    {label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
            </ListBox>
          </SelectHUI.Popover>
        </SelectHUI>
      </TextField>
    </>
  );
};
