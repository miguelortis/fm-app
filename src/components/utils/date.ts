import { formatInTimeZone } from "date-fns-tz";

/**
 * Formatea una fecha basándose en una zona horaria específica.
 *
 * @param date - La fecha a formatear (puede ser un string ISO, timestamp o un objeto Date)
 * @param formatStr - El patrón de formato deseado (ejemplo: 'dd/MM/yyyy')
 * @param timeZone - La zona horaria a aplicar (opcional, por defecto: 'UTC')
 * @returns La fecha formateada como un string
 */
export function formatWithTZ(
  date: string | number | Date,
  formatStr: string,
  timeZone: string = "UTC",
): string {
  try {
    return formatInTimeZone(date, timeZone, formatStr);
  } catch (error) {
    console.error("Error formateando la fecha:", error);
    return "Fecha inválida";
  }
}
