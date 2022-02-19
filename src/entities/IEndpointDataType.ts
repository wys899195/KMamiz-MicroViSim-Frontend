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
  schemas: {
    time: Date;
    sampleObject: any;
    schema: string;
  }[];
}
