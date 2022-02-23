export type Unsubscribe = () => boolean;

export class DataView {
  private static instance?: DataView;
  static getInstance = () => this.instance || (this.instance = new this());

  private readonly observers: Map<string, (res: Response, data?: any) => void>;
  private timer: number = 0;
  private constructor() {
    this.observers = new Map<string, (data: any) => void>();
    this.startTimer();
  }

  subscribe<T>(
    url: string,
    next: (res: Response, data?: T) => void
  ): Unsubscribe {
    DataView.getInstance().observers.set(url, next);
    DataView.getInstance().trigger(url);
    return () => DataView.getInstance().observers.delete(url);
  }

  startTimer(interval = 5000) {
    this.timer = setInterval(() => {
      DataView.getInstance().observers.forEach((_, url) =>
        DataView.getInstance().trigger(url)
      );
    }, interval);
  }
  stopTimer() {
    clearInterval(this.timer);
  }

  private async trigger(url: string) {
    const next = DataView.getInstance().observers.get(url);
    if (!next) return;
    const res = await fetch(url);
    const data = res.ok ? await res.json() : undefined;
    next(res, data);
  }
}
