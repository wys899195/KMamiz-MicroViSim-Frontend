export default interface IMappedHistoryData {
  name: string;
  x: Date;
  requests: number;
  serverErrors: number;
  requestErrors: number;
  risk?: number;
}
