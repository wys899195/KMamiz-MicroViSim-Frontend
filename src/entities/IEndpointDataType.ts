import { IRequestTypeUpper } from "./IRequestType";

export default interface IEndpointDataType {
  _id?: string;
  uniqueServiceName: string;
  uniqueEndpointName: string;
  service: string;
  namespace: string;
  version: string;
  // trace name
  labelName: string;
  method: IRequestTypeUpper;
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
