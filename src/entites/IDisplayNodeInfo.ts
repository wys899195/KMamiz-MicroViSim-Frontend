export default interface IDisplayNodeInfo {
  type: "SRV" | "EP" | "EX";
  service?: string;
  namespace?: string;
  version?: string;
  endpointName?: string;
}
