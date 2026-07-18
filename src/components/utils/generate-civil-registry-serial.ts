export interface IBirthCertificateDetails {
  state: string;
  municipality: string;
  year: string;
  book: string;
  actNumber: string;
}

export const generateCivilRegistrySerial = (
  details: IBirthCertificateDetails,
): string => {
  const raw = `${details?.state}${details?.municipality}${details?.year}${details?.book}${details?.actNumber}`;
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toUpperCase();
};
