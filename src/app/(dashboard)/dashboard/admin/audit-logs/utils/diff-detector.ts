export interface Difference {
  path: string;
  before: unknown;
  after: unknown;
}

export function getObjectDiff(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null,
  currentPath = "",
): Difference[] {
  const diffs: Difference[] = [];

  // Si es una creación (no hay estado anterior), extraemos todo el estado nuevo como asignación
  if (!before && after) {
    Object.keys(after).forEach((key) => {
      if (["updatedAt", "createdAt", "__v"].includes(key)) return;
      diffs.push({ path: key, before: null, after: after[key] });
    });
    return diffs;
  }

  if (!before || !after) return diffs;

  // Unificamos todas las llaves de ambos estados para no perder ninguna mutación
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  allKeys.forEach((key) => {
    // Ignoramos metadatos repetitivos del ciclo de vida de Mongoose
    if (["updatedAt", "createdAt", "__v"].includes(key)) return;

    const beforeVal = before[key];
    const afterVal = after[key];
    const newPath = currentPath ? `${currentPath}.${key}` : key;

    // Si la propiedad fue removida por completo en el estado nuevo
    if (!(key in after)) {
      diffs.push({ path: newPath, before: beforeVal, after: null });
      return;
    }

    // Saneamiento de tipos especiales (ObjectIds de Mongo, Buffers o sub-objetos con toString propio)
    const cleanBefore =
      beforeVal &&
      typeof beforeVal === "object" &&
      "toString" in beforeVal &&
      !(beforeVal instanceof Date) &&
      !Array.isArray(beforeVal)
        ? String(beforeVal)
        : beforeVal;

    const cleanAfter =
      afterVal &&
      typeof afterVal === "object" &&
      "toString" in afterVal &&
      !(afterVal instanceof Date) &&
      !Array.isArray(afterVal)
        ? String(afterVal)
        : afterVal;

    // Si ambos elementos siguen siendo objetos puros después del saneamiento (como estructuras anidadas de Historias Clínicas)
    if (
      cleanBefore &&
      cleanAfter &&
      typeof cleanBefore === "object" &&
      typeof cleanAfter === "object" &&
      !Array.isArray(cleanBefore) &&
      !Array.isArray(cleanAfter) &&
      !(cleanBefore instanceof Date)
    ) {
      diffs.push(
        ...getObjectDiff(
          cleanBefore as Record<string, unknown>,
          cleanAfter as Record<string, unknown>,
          newPath,
        ),
      );
    } else {
      // Comparación atómica final de valores primitivos, arrays o cadenas normalizadas
      if (JSON.stringify(cleanBefore) !== JSON.stringify(cleanAfter)) {
        diffs.push({ path: newPath, before: cleanBefore, after: cleanAfter });
      }
    }
  });

  return diffs;
}
