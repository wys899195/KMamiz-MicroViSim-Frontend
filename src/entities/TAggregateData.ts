import { TRequestTypeUpper } from "./TRequestType";

export type TAggregateData = {
  _id?: string;
  fromDate: Date;
  toDate: Date;
  services: TAggregateServiceInfo[];
};

export type TAggregateServiceInfo = {
  uniqueServiceName: string;
  service: string;
  namespace: string;
  version: string;
  totalRequests: number;
  totalServerErrors: number;
  totalRequestErrors: number;
  avgRisk: number;
  avgLatencyCV: number;
  endpoints: TAggregateEndpointInfo[];
};
export type TAggregateEndpointInfo = {
  uniqueServiceName: string;
  uniqueEndpointName: string;
  labelName: string;
  method: TRequestTypeUpper;
  totalRequests: number;
  totalServerErrors: number;
  totalRequestErrors: number;
  avgLatencyCV: number;
};
