import Config from "../../Config";
import { TGraphData } from "../entities/TGraphData";
import { TServiceCoupling } from "../entities/TServiceCoupling";
import { TServiceInstability } from "../entities/TServiceInstability";
import { TTotalServiceInterfaceCohesion } from "../entities/TTotalServiceInterfaceCohesion";
import { DataView } from "./DataView";

export default class DiffComparatorService {
  private static instance?: DiffComparatorService;
  static getInstance = () => this.instance || (this.instance = new this());
  private constructor() {}

  private readonly prefix = `${Config.apiPrefix}`;

  private subscribeToArray<T>(path: string, next: (data: T[]) => void) {
    return DataView.getInstance().subscribe<T[]>(path, (_, data) =>
      next(data || [])
    );
  }

  private async get<T>(path: string) {
    const res = await fetch(path);
    if (!res.ok) return null;
    return (await res.json()) as T;
  }

  async getDiffdataTags() {
    return (
      (await this.get<{ tag: string; time: number }[]>(
        `${this.prefix}/diffComparator/diffData/tags`
      )) || []
    );
  }

  async addTaggedDiffData(tag: string) {
    const res = await fetch(`${this.prefix}/diffComparator/diffData/tags`, {
      method: "POST",
      body: JSON.stringify({tag}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.ok;
  }

  async deleteTaggedDiffData(tag: string) {
    const res = await fetch(`${this.prefix}/diffComparator/diffData/tags`, {
      method: "DELETE",
      body: JSON.stringify({tag}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.ok;
  }

  async getTaggedDependencyGraphs(tag: string) {
    const path = `${this.prefix}/diffComparator/taggedDependency?tag=${tag}`;
    return await DiffComparatorService.getInstance().get<{
      endpointGraph: TGraphData;
      serviceGraph: TGraphData;
    }>(path) || {
      endpointGraph: null,
      serviceGraph: null,
    };
  }

  async getTaggedServiceInsights(tag: string) {
    const path = `${this.prefix}/diffComparator/taggedServiceInsights?tag=${tag}`;
    return await DiffComparatorService.getInstance().get<{
      cohesionData: TTotalServiceInterfaceCohesion[];
      couplingData: TServiceCoupling[];
      instabilityData: TServiceInstability[];
    }>(path) || {
      cohesionData: [],
      couplingData: [],
      instabilityData: [],
    };
  }

  subscribeToDiffdataTags(
    next: (data: { tag: string; time: number }[]) => void
  ) {
    const path = `${this.prefix}/diffComparator/diffData/tags`;
    return DiffComparatorService.getInstance().subscribeToArray(path, next);
  }
}
