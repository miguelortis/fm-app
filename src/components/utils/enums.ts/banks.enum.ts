export const Banks = Object.freeze({
  "0102": "Banco de Venezuela",
  "0175": "Banco Digital de los Trabajadores",
  "0163": "Banco del Tesoro",
  "0191": "Banco Nacional de Crédito (BNC)",
  "0134": "Banesco",
  "0105": "Mercantil Banco",
  "0108": "BBVA Provincial",
  "0172": "Bancamiga",
  "0114": "Bancaribe",
  "0115": "Banco Exterior",
  "0128": "Banco Caroní",
  "0138": "Banco Plaza",
  "0151": "BFC Banco Fondo Común",
  "0166": "Banco Agrícola de Venezuela",
  "0168": "Bancrecer",
  "0169": "Mi Banco",
  "0171": "Banco Activo",
  "0174": "Banplus",
  "0177": "Banfanb",
  "0104": "Banco Venezolano de Crédito",
  "0137": "Banco Sofitasa",
} as const); // El "as const" le da el toque final de TypeScript para que sea totalmente de solo lectura

// Tipo opcional por si necesitas usar los códigos en tus interfaces de TypeScript
export type BancoCodigo = keyof typeof Banks;

export const bankOptions = Object.entries(Banks).map(([code, name]) => ({
  label: name,
  value: code,
}));
