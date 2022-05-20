import { MonitorRisk } from "../classes/BackgruondTasks";
import AlertManager from "./AlertManager";
import DataService from "./DataService";
import GraphService from "./GraphService";

type TTask = (..._: any[]) => any;

export default class BackgroundTaskManager {
  private static instance?: BackgroundTaskManager;
  static getInstance = () => this.instance || (this.instance = new this());

  private _taskMap: Map<string, TTask>;
  private constructor() {
    this._taskMap = new Map();
    this.startTimer();
    setTimeout(() => this.setup(), 0);
  }

  private setup() {
    // risk monitor
    GraphService.getInstance().subscribeToAreaLineData(
      (data) => {
        const map = new Map<string, number[]>();
        data.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
        data.forEach((d) => {
          if (!d.risk) return;
          map.set(d.name, (map.get(d.name) || []).concat([d.risk]));
        });
        const violation = MonitorRisk(
          [...map.entries()].map(([name, risks]) => ({ name, risks })),
          2
        );
        violation.forEach((s) => {
          AlertManager.getInstance().create({
            id: `${s}-risk-violation`,
            context: `${s} violates Risk threshold (${new Date().toISOString()})`,
            severity: "warning",
            timestamp: Date.now() + 3600000,
            notified: false,
          });
        });
      },
      undefined,
      86400000
    );
  }

  register(name: string, task: TTask) {
    this._taskMap.set(name, task);
    task();
  }

  startTimer(interval = 5000) {
    setInterval(() => {
      [...this._taskMap.values()].forEach((t) => t());
    }, interval);
  }
}
