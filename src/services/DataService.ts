import Config from "../../Config";
import { TAggregateData } from "../entities/TAggregateData";
import IEndpointDataType from "../entities/TEndpointDataType";
import { TEndpointLabel, TEndpointLabelType } from "../entities/TEndpointLabel";
import { THistoryData } from "../entities/THistoryData";
import { TRequestTypeUpper } from "../entities/TRequestType";
import { TTaggedInterface } from "../entities/TTaggedInterface";
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

  async getLabelMap() {
    const path = `${this.prefix}/data/label`;
    return (
      (await DataService.getInstance().get<[string, string][]>(path)) || []
    );
  }

  async getUserDefinedLabels() {
    const path = `${this.prefix}/data/label/user`;
    return await DataService.getInstance().get<TEndpointLabel>(path);
  }
  async updateUserDefinedLabels(labels: TEndpointLabel) {
    const path = `${this.prefix}/data/label/user`;
    const res = await fetch(path, {
      method: "POST",
      body: JSON.stringify(labels),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.status === 201;
  }
  async deleteUserDefinedLabels(label: TEndpointLabelType) {
    const path = `${this.prefix}/data/label/user`;
    const res = await fetch(path, {
      method: "DELETE",
      body: JSON.stringify(label),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.status === 204;
  }

  async getTaggedInterface(uniqueLabelName: string) {
    const path = `${
      this.prefix
    }/data/interface?uniqueLabelName=${encodeURIComponent(uniqueLabelName)}`;
    return (
      (await DataService.getInstance().get<TTaggedInterface[]>(path)) || []
    );
  }
  async addTaggedInterface(tagged: TTaggedInterface) {
    const path = `${this.prefix}/data/interface`;
    const res = await fetch(path, {
      method: "POST",
      body: JSON.stringify(tagged),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.status === 201;
  }
  async deleteTaggedInterface(tagged: TTaggedInterface) {
    if (!tagged._id) return false;
    const path = `${this.prefix}/data/interface`;
    const res = await fetch(path, {
      method: "DELETE",
      body: JSON.stringify({ id: tagged._id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.status === 204;
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
