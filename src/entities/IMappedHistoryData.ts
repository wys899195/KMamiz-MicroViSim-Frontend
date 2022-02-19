export type IMappedHistoryDataAvailableFields =
  | "requests"
  | "serverErrors"
  | "requestErrors"
  | "risk"
  | "latencyCV";

export default interface IMappedHistoryData {
  name: string;
  x: Date;
  requests: number;
  serverErrors: number;
  requestErrors: number;
  latencyCV: number;
  risk?: number;
}
