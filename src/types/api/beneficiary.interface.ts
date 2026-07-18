import { IUser } from "./user.interface";

type IPhysicalDocumentStatus = {
  isProvided: boolean;
  verifiedBy: IUser | string;
  verifiedAt: Date | null;
};
export interface IBeneficiary {
  _id?: string;
  titular: IUser; // Opcional si es menor sin cédula
  beneficiary: IUser;
  relationship: "MADRE" | "PADRE" | "PAREJA" | "HIJO";
  isFolderComplete: boolean;
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

export type IBeneficiaryCreate = Omit<IBeneficiary, "_id"> & {
  titularId: string;
  beneficiaryId: string;
};
