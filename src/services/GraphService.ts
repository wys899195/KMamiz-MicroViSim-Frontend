import Config from "../../Config";
import { Color } from "../classes/ColorUtils";
import IAreaLineChartData from "../entities/IAreaLineChartData";
import IChordData from "../entities/IChordData";
import IChordRadius from "../entities/IChordRadius";
import IGraphData from "../entities/IGraphData";
import { DataView } from "./DataView";

type RawChordData = {
  nodes: {
    id: string;
    name: string;
  }[];
  links: IChordRadius[];
};
export default class GraphService {
  private static instance?: GraphService;
  static getInstance = () => this.instance || (this.instance = new this());

  private readonly prefix = `${Config.ApiHost}${Config.ApiPrefix}`;

  async getDependencyGraph() {
    const res = await fetch(`${this.prefix}/graph/dependency`);
    if (!res.ok) return null;
    return (await res.json()) as IGraphData;
  }

  async getAreaLineData(uniqueServiceName?: string) {
    const postfix = uniqueServiceName
      ? `/${encodeURIComponent(uniqueServiceName)}`
      : "";
    const res = await fetch(`${this.prefix}/graph/line${postfix}`);
    if (!res.ok) return [];
    return (await res.json()) as IAreaLineChartData[];
  }

  async getDirectChord() {
    return await this.getChordData("/graph/chord/direct");
  }

  async getInDirectChord() {
    return await this.getChordData("/graph/chord/indirect");
  }

  private async getChordData(path: string): Promise<IChordData | null> {
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

  subscribeToDependencyGraph(next: (data?: IGraphData) => void) {
    return DataView.getInstance().subscribe<IGraphData>(
      `${this.prefix}/graph/dependency`,
      (_, data) => next(data)
    );
  }

  subscribeToAreaLineData(
    next: (data: IAreaLineChartData[]) => void,
    uniqueServiceName?: string
  ) {
    const postfix = uniqueServiceName
      ? `/${encodeURIComponent(uniqueServiceName)}`
      : "";

    return DataView.getInstance().subscribe<IAreaLineChartData[]>(
      `${this.prefix}/graph/line${postfix}`,
      (_, data) => next(data || [])
    );
  }

  subscribeToDirectChord(next: (data?: IChordData) => void) {
    return GraphService.getInstance().subscribeToChord(
      next,
      "/graph/chord/direct"
    );
  }
  subscribeToInDirectChord(next: (data?: IChordData) => void) {
    return GraphService.getInstance().subscribeToChord(
      next,
      "/graph/chord/indirect"
    );
  }
  private subscribeToChord(next: (data?: IChordData) => void, path: string) {
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
}
