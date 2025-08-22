export enum ContactStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export interface IContact {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
}
