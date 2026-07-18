export const DEPENDENCY_AREAS = {
  RECTORADO: "Rectorado (Sede Administrativa)",
  CUBO_AZUL: "Complejo Académico Cubo Azul (Ciencias de la Salud)",
  LOS_PEROZOS: "Complejo Académico Los Perozos",
  EL_SABINO: "Complejo Académico El Sabino (Punto Fijo)",
  EL_HATILLO: "Complejo Académico El Hatillo (Agro y Mar)",
  BORREGALES: "Sede Los Borregales",
  SANTA_ANA: "Edificio Santa Ana",
  CAPUNEFM: "Caja de Ahorro (CAPUNEFM)",
  FMUNEFM: "Fondo de Mutualidad (FMUNEFM)",
  BALCON_ARCAYA: "Sede Balcón de los Arcaya",
  CABE: "Sede CABE",
  LA_VELA: "Sede La Vela",
  CUMAREBO: "Núcleo Cumarebo",
  CHURUGUARA: "Núcleo Churuguara",
  DABAJURO: "Núcleo Dabajuro",
  TUCACAS: "Sede Tucacas",
} as const;

export const getMunicipiosAsArray = () => {
  return Object.entries(DEPENDENCY_AREAS).map(([id, nombre]) => ({
    value: id,
    label: nombre,
  }));
};
