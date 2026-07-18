import { IBeneficiary } from "./beneficiary.interface";
import { IUser } from "./user.interface";

export interface IPhysicalDocumentStatus {
  isProvided: boolean; // Indica si el documento ha sido proporcionado
  verifiedBy: string | null; // ID del usuario que verificó el documento (puede ser un admin o el titular)
}

export interface IDependents {
  _id: string;
  titular: IUser;
  beneficiary: IBeneficiary;
  onModel: "User" | "Beneficiary";
  relationship: "PAREJA" | "MADRE" | "PADRE" | "HIJO";
  physicalDocuments: {
    parentBirthCertificate?: IPhysicalDocumentStatus;
    parentCedula?: IPhysicalDocumentStatus;
    childBirthCertificate?: IPhysicalDocumentStatus;
    titularCedula?: IPhysicalDocumentStatus;
    specialProof?: IPhysicalDocumentStatus;
    marriageCertificate?: IPhysicalDocumentStatus;
    partnerCedula?: IPhysicalDocumentStatus;
  };
}
