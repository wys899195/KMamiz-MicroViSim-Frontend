import Config from "../../Config";
import { TGraphData } from "../entities/TGraphData";



export default class SimulationService {
  private static instance?: SimulationService;
  static getInstance = () => this.instance || (this.instance = new this());
  private constructor() { }

  private readonly prefix = `${Config.apiPrefix}`;

  private async get<T>(path: string) {
    const res = await fetch(path);
    if (!res.ok) return null;
    return (await res.json()) as T;
  }

  async getDependencyGraphBySimulateYaml(yamlData: string, showEndpoint: boolean) {
    const res = await fetch(`${this.prefix}/simulation/yamlToDependency`, {
      method: "POST",
      body: JSON.stringify({
        yamlData,
        showEndpoint,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resBody = await res.json();
    return {
      graph: resBody.graph,
      message: resBody.message,
      resStatus: res.status
    }
  }

  async getSimulateYamlByEndpointDependencyGraph(endpointDependency: TGraphData) {
    const res = await fetch(`${this.prefix}/simulation/endpointDependencyToYaml`, {
      method: "POST",
      body: JSON.stringify(endpointDependency),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const graph = await res.json();
      return graph;
    } else {
      const errorText = await res.text();
      throw new Error(`Failed to generate dependency simulation yaml. status: ${res.statusText} error:  ${errorText}`);
    }
  }

  async retrieveDataBySimulateYaml(yamlData: string) {
    const res = await fetch(`${this.prefix}/simulation/retrieveDataByYAML`, {
      method: "POST",
      body: JSON.stringify({ yamlData }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resBody = await res.json();
    return {
      message: typeof resBody.message === 'string'
        ? String(resBody.message)
        : JSON.stringify(resBody.message),
      resStatus: res.status
    }
  }

  async generateSimConfigFromCurrentStaticData() {
    const path = `${this.prefix}/simulation/generateStaticSimConfig`;
    return await SimulationService.getInstance().get<
      {
        staticYamlStr: string,
        message: string
      }
    >(path) || {
      staticYamlStr: '',
      message: 'Error while trying to fetching static Simulation Yaml, Please check the response details for more information.'
    };
  }
}
