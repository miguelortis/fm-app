export interface ILog {
  _id: string;
  userId: string;
  userName: string;
  ipAddress: string;
  action: string;
  module: string;
  createdAt: Date;
  updatedAt: Date;
  previousState: Record<string, unknown> | null;
  newState: Record<string, unknown> | null;
  __v: number;
}
