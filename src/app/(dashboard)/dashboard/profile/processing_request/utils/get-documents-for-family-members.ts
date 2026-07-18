import { IBeneficiary } from "@/types/api";

export interface BeneficiaryDocuments {
  relationship: string;
  documents: string[];
}

export function getDocumentsForFamilyMembers(
  beneficiaries: IBeneficiary[] | [],
): BeneficiaryDocuments[] {
  if (!beneficiaries || beneficiaries.length === 0) return [];

  // 1. Separamos los beneficiarios por parentesco
  const baseGroups = beneficiaries.reduce(
    (acc, item) => {
      const key = item.relationship;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, IBeneficiary[]>,
  );

  const result: BeneficiaryDocuments[] = [];

  // 2. Procesamos cada grupo de parentesco
  Object.entries(baseGroups).forEach(([relationship, group]) => {
    const documents: string[] = [];
    let customLabel = relationship;

    switch (relationship) {
      case "PADRE":
      case "MADRE":
        documents.push("Copia de Cédula");
        break;

      case "PAREJA":
        documents.push("Copia de Cédula");
        documents.push("Acta de Matrimonio o Concubinato");
        break;

      case "HIJO":
        // Cambiamos la etiqueta según la cantidad
        customLabel = group.length > 1 ? "HIJOS" : "HIJO/A";
        documents.push("Acta de Nacimiento");

        // Si al menos uno de los hijos es especial, se pide la constancia
        const hasSpecialChild = group.some(
          (item) => item.beneficiary?.isSpecial,
        );
        if (hasSpecialChild) {
          documents.push("Certificado de Discapacidad");
        }
        break;

      default:
        documents.push("Copia Cédula de identidad");
        break;
    }

    result.push({
      relationship: customLabel,
      documents,
    });
  });

  return result;
}
