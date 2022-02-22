import Config from "../../Config";
import IAggregateData from "../entities/IAggregateData";
import IEndpointDataType from "../entities/IEndpointDataType";
import IHistoryData from "../entities/IHistoryData";

export default class DataService {
  private static instance?: DataService;
  static getInstance = () => this.instance || (this.instance = new this());

  private readonly prefix = `${Config.ApiHost}${Config.ApiPrefix}`;

  async getAggregateData(namespace?: string) {
    const res = await fetch(
      `${this.prefix}/data/aggregate${namespace ? "/" + namespace : ""}`
    );
    if (!res.ok) return null;
    return (await res.json()) as IAggregateData;
  }

  async getHistoryData(namespace?: string) {
    const res = await fetch(
      `${this.prefix}/data/history${namespace ? "/" + namespace : ""}`
    );
    if (!res.ok) return [];
    return (await res.json()) as IHistoryData[];
  }

  async getEndpointDataType(uniqueLabelName: string) {
    const res = await fetch(
      `${this.prefix}/data/datatype/${encodeURIComponent(uniqueLabelName)}`
    );
    if (!res.ok) return undefined;
    return (await res.json()) as IEndpointDataType;
  }
}
