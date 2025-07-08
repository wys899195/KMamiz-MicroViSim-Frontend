import Config from "../../Config";

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

  async retrieveDataBySimulateYaml(simConfigYAML: string) {
    const res = await fetch(`${this.prefix}/simulation/startSimulation`, {
      method: "POST",
      body: JSON.stringify({ simConfigYAML }),
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
