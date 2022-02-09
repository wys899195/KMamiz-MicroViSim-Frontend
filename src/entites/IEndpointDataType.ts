export default interface IEndpointDataType {
  _id?: string;
  service: string;
  namespace: string;
  version: string;
  endpoint: string;
  schemas: {
    time: Date;
    sampleObject: any;
    schema: string;
  }[];
}
