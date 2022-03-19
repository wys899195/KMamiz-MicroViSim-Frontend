import Config from "../../Config";
import { Color } from "../classes/ColorUtils";
import { TAreaLineChartData } from "../entities/TAreaLineChartData";
import { TChordData, TChordRadius } from "../entities/TChordData";
import { TGraphData } from "../entities/TGraphData";
import { TServiceCoupling } from "../entities/TServiceCoupling";
import { TServiceInstability } from "../entities/TServiceInstability";
import { TTotalServiceInterfaceCohesion } from "../entities/TTotalServiceInterfaceCohesion";
import { DataView } from "./DataView";

type RawChordData = {
  nodes: {
    id: string;
    name: string;
  }[];
  links: TChordRadius[];
};
export default class GraphService {
  private static instance?: GraphService;
  static getInstance = () => this.instance || (this.instance = new this());

  private readonly prefix = `${Config.ApiHost}${Config.ApiPrefix}`;

  async getDependencyGraph(showEndpoint: boolean) {
    const res = await fetch(
      `${this.prefix}/graph/dependency/${showEndpoint ? "endpoint" : "service"}`
    );
    if (!res.ok) return null;
    return (await res.json()) as TGraphData;
  }

  async getAreaLineData(uniqueServiceName?: string) {
    const postfix = uniqueServiceName
      ? `/${encodeURIComponent(uniqueServiceName)}`
      : "";
    const res = await fetch(`${this.prefix}/graph/line${postfix}`);
    if (!res.ok) return [];
    return (await res.json()) as TAreaLineChartData[];
  }

  async getDirectChord() {
    return await this.getChordData("/graph/chord/direct");
  }

  async getInDirectChord() {
    return await this.getChordData("/graph/chord/indirect");
  }

  private async getChordData(path: string): Promise<TChordData | null> {
    const res = await fetch(`${this.prefix}${path}`);
    if (!res.ok) return null;
    const rawData = (await res.json()) as RawChordData;
    return {
      ...rawData,
      nodes: rawData.nodes.map((n) => ({
        ...n,
        fill: Color.generateFromString(n.id).hex,
      })),
    };
  }

  subscribeToDependencyGraph(next: (data?: TGraphData) => void) {
    return DataView.getInstance().subscribe<TGraphData>(
      `${this.prefix}/graph/dependency`,
      (_, data) => next(data)
    );
  }

  subscribeToAreaLineData(
    next: (data: TAreaLineChartData[]) => void,
    uniqueServiceName?: string
  ) {
    const postfix = uniqueServiceName
      ? `/${encodeURIComponent(uniqueServiceName)}`
      : "";

    return DataView.getInstance().subscribe<TAreaLineChartData[]>(
      `${this.prefix}/graph/line${postfix}`,
      (_, data) => next(data || [])
    );
  }

  subscribeToDirectChord(next: (data?: TChordData) => void) {
    return GraphService.getInstance().subscribeToChord(
      next,
      "/graph/chord/direct"
    );
  }
  subscribeToInDirectChord(next: (data?: TChordData) => void) {
    return GraphService.getInstance().subscribeToChord(
      next,
      "/graph/chord/indirect"
    );
  }
  private subscribeToChord(next: (data?: TChordData) => void, path: string) {
    return DataView.getInstance().subscribe<RawChordData>(
      `${this.prefix}${path}`,
      (_, data) => {
        next(
          data
            ? {
                ...data,
                nodes: data.nodes.map((n) => ({
                  ...n,
                  fill: Color.generateFromString(n.id).hex,
                })),
              }
            : data
        );
      }
    );
  }

  subscribeToArray<T>(path: string, next: (data: T[]) => void) {
    return DataView.getInstance().subscribe<T[]>(path, (_, data) =>
      next(data || [])
    );
  }

  subscribeToServiceCohesion(
    next: (data: TTotalServiceInterfaceCohesion[]) => void,
    namespace?: string
  ) {
    const path = `${this.prefix}/graph/cohesion${
      namespace ? `/${namespace}` : ""
    }`;
    return GraphService.getInstance().subscribeToArray(path, next);
  }

  subscribeToServiceInstability(
    next: (data: TServiceInstability[]) => void,
    namespace?: string
  ) {
    const path = `${this.prefix}/graph/instability${
      namespace ? `/${namespace}` : ""
    }`;
    return GraphService.getInstance().subscribeToArray(path, next);
  }

  subscribeToServiceCoupling(
    next: (data: TServiceCoupling[]) => void,
    namespace?: string
  ) {
    const path = `${this.prefix}/graph/coupling${
      namespace ? `/${namespace}` : ""
    }`;
    return GraphService.getInstance().subscribeToArray(path, next);
  }
}
