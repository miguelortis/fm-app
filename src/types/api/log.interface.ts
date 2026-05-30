export interface ILog {
  _id: string;
  userName: string;
  ipAddress: string;
  action: string;
  module: string;
  createdAt: Date;
  previousState: Record<string, unknown> | null;
  newState: Record<string, unknown> | null;
}
