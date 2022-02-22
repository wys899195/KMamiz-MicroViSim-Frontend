import Config from "../../Config";
import { Color } from "../classes/ColorUtils";
import IAreaLineChartData from "../entities/IAreaLineChartData";
import IChordNode from "../entities/IChordNode";
import IChordRadius from "../entities/IChordRadius";
import IGraphData from "../entities/IGraphData";

type RawChordData = {
  nodes: {
    id: string;
    name: string;
  }[];
  links: {
    from: string;
    to: string;
    value: number;
  }[];
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

  private async getChordData(
    path: string
  ): Promise<{ nodes: IChordNode[]; links: IChordRadius[] } | null> {
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
}
