import { TRequestTypeUpper } from "./TRequestType";

export default interface IEndpointDataType {
  _id?: string;
  uniqueServiceName: string;
  uniqueEndpointName: string;
  service: string;
  namespace: string;
  version: string;
  // trace name
  labelName: string;
  method: TRequestTypeUpper;
  schemas: IEndpointDataSchema[];
}

export interface IEndpointDataSchema {
  time: Date;
  status: string;
  responseSample: any;
  responseSchema: string;
  requestSample?: any;
  requestSchema?: string;
  requestParams?: IEndpointRequestParam[];
}

export interface IEndpointRequestParam {
  param: string;
  type: string;
}
