import { TAlert } from "../entities/TAlert";

export default class AlertManager {
  private static readonly ALERT_TIMEOUT = 5000;
  private static instance?: AlertManager;
  static getInstance = () => this.instance || (this.instance = new this());

  private _alerts: Map<string, TAlert>;
  private _observers: ((alerts: TAlert[]) => void)[];
  private _rawObservers: ((alerts: TAlert[]) => void)[];
  private constructor() {
    this._alerts = new Map();
    this._observers = [];
    this._rawObservers = [];
    setInterval(() => this.interval(), AlertManager.ALERT_TIMEOUT);
  }

  create(alert: TAlert, update = false) {
    if (this._alerts.has(alert.id) && !update) {
      const existing = this._alerts.get(alert.id)!;
      this._alerts.set(alert.id, {
        ...existing,
        context: alert.context,
        timestamp: alert.timestamp,
      });
    } else this._alerts.set(alert.id, alert);
  }

  update(alert: TAlert) {
    this.create(alert, true);
    this.interval();
  }

  delete(id: string) {
    this._alerts.delete(id);
  }

  notifyAll() {
    this.modifyNotify(true);
  }

  resetNotify() {
    this.modifyNotify(false);
  }

  toggleNotify() {
    if (this.getIntervalAlerts().length === 0) this.resetNotify();
    else this.notifyAll();
  }

  private modifyNotify(notified: boolean) {
    this._alerts = new Map(
      [...this._alerts.entries()].map(([id, alert]) => [
        id,
        { ...alert, notified },
      ])
    );
    this.interval();
  }

  listen(observer: (alerts: TAlert[]) => void, listenRaw = false) {
    const observerList = listenRaw ? this._rawObservers : this._observers;
    const obs = observer;
    observerList.push(obs);
    obs(this.getIntervalAlerts(listenRaw));
    return () => {
      this._observers.filter((o) => o !== obs);
      this._rawObservers.filter((o) => o !== obs);
    };
  }

  private getIntervalAlerts(raw = false) {
    this._alerts = new Map(
      [...this._alerts.entries()].filter(([_, alert]) => {
        return Date.now() - alert.timestamp < AlertManager.ALERT_TIMEOUT;
      })
    );
    const baseAlerts = [...this._alerts.values()].sort(
      (a, b) => a.timestamp - b.timestamp
    );
    if (raw) return baseAlerts;
    const alerts = baseAlerts.filter((a) => !a.notified);
    return alerts;
  }

  private interval() {
    this._observers.forEach((o) => o(this.getIntervalAlerts()));
    this._rawObservers.forEach((o) => o(this.getIntervalAlerts(true)));
  }
}
