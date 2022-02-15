export default class ViewportUtils {
  private static instance?: ViewportUtils;
  static getInstance = () => this.instance || (this.instance = new this());

  private constructor() {
    window.addEventListener("resize", this.onViewportSizeChange);
  }
  private handlers = new Map<string, (viewport: number[]) => void>();

  /**
   * Subscribe to viewport change, remember to call the unsubscribe function to avoid side-effects.
   * @param onEmit Called on viewport change with parameter [vw, vh]
   * @returns Unsubscribe function
   */
  subscribe(onEmit: ([vw, vh]: number[]) => void) {
    const uniqueName = `${Math.random()}`;
    this.handlers.set(uniqueName, onEmit);
    onEmit([this.vw, this.vh]);
    return () => {
      this.handlers.delete(uniqueName);
    };
  }

  private onViewportSizeChange() {
    [...this.handlers.values()].forEach((h) => h([this.vw, this.vh]));
  }

  private get vw() {
    return Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
  }

  private get vh() {
    return Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
  }
}
