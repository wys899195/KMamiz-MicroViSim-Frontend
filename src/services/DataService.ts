import Config from "../../Config";
import { TAggregateData } from "../entities/TAggregateData";
import IEndpointDataType from "../entities/TEndpointDataType";
import { THistoryData } from "../entities/THistoryData";
import { DataView } from "./DataView";

export default class DataService {
  private static instance?: DataService;
  static getInstance = () => this.instance || (this.instance = new this());
  private constructor() {}

  private readonly prefix = `${Config.ApiHost}${Config.ApiPrefix}`;

  private async get<T>(path: string) {
    const res = await fetch(path);
    if (!res.ok) return null;
    return (await res.json()) as T;
  }

  async getAggregateData(namespace?: string) {
    const path = `${this.prefix}/data/aggregate${
      namespace ? "/" + namespace : ""
    }`;
    return await DataService.getInstance().get<TAggregateData>(path);
  }

  async getHistoryData(namespace?: string) {
    const path = `${this.prefix}/data/history${
      namespace ? "/" + namespace : ""
    }`;
    return await DataService.getInstance().get<THistoryData[]>(path);
  }

  async getEndpointDataType(uniqueLabelName: string) {
    const path = `${this.prefix}/data/datatype/${encodeURIComponent(
      uniqueLabelName
    )}`;
    return (
      (await DataService.getInstance().get<IEndpointDataType>(path)) ||
      undefined
    );
  }

  subscribeToAggregateData(
    next: (data?: TAggregateData) => void,
    namespace?: string
  ) {
    const url = `${this.prefix}/data/aggregate${
      namespace ? "/" + namespace : ""
    }`;
    return DataView.getInstance().subscribe<TAggregateData>(url, (_, data) => {
      next(data);
    });
  }

  subscribeToHistoryData(
    next: (data: THistoryData[]) => void,
    namespace?: string
  ) {
    const url = `${this.prefix}/data/history${
      namespace ? "/" + namespace : ""
    }`;
    return DataView.getInstance().subscribe<THistoryData[]>(url, (_, data) => {
      next(data || []);
    });
  }

  subscribeToEndpointDataType(
    next: (data?: IEndpointDataType) => void,
    uniqueLabelName: string
  ) {
    const url = `${this.prefix}/data/datatype/${encodeURIComponent(
      uniqueLabelName
    )}`;
    return DataView.getInstance().subscribe<IEndpointDataType>(
      url,
      (_, data) => {
        next(data);
      }
    );
  }
}
