import { ApexOptions } from "apexcharts";
import { Props } from "react-apexcharts";
import { TInsightDiffCohesion } from "../entities/TInsightDiffCohesion";
import { TInsightDiffCoupling } from "../entities/TInsightDiffCoupling";
import { TInsightDiffInstability } from "../entities/TInsightDiffInstability";
import { Color } from "./ColorUtils";


export default class BarDiffChartUtils {
  static readonly DIFF_COLORS = {
    v1: "#FFA500", v2: "#00a2ff"
  };

  static CreateDiffBarChart<T extends { name: string }>(
    title: string,
    data: T[],
    toSeriesStrategy: (_: T[], versionTag1: string, versionTag2: string) => any[],
    versionTag1: string,
    versionTag2: string,
    stacked = false,
    overwriteOpts: Props = {},
    height: number,
    subtitle?: string
  ): Props {
    return {
      type: "bar",
      height,
      options: {
        ...BarDiffChartUtils.DefaultOptions(
          stacked,
          data.map(({ name }) => name),
          title,
          subtitle
        ),
        ...overwriteOpts,
      },
      series: toSeriesStrategy(data, versionTag1, versionTag2),
    };
  }

  static DefaultOptions(

    stacked: boolean,
    categories: any[],
    title: string,
    subtitle: string = "",
  ): ApexOptions {
    return {
      title: {
        text: title.trim() === "" ? undefined : title,
        align: "center",
        offsetY: 0,
      },
      subtitle: {
        text: subtitle.trim() === "" ? undefined : subtitle,
        align: "center",
        style: {
          fontSize: "14px",
          color: "#666",
        },
      },
      chart: {
        type: "bar",
        stacked,
        animations: {
          enabled: false,
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "12px",
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["transparent"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories,
        labels: {
          trim: true,
        },
      },
      legend: {
        position: "top",
        showForSingleSeries: true,
      },
    };
  }

  static StackMixedDiffChartOverwriteOpts<T>(
    data: T[],
    strategy: {
      x: (d: T) => string | number;
      y: (d: T) => number;
      tooltip: (y: number, seriesIndex: number, dataPointIndex: number) => string;
    }
  ): ApexOptions {
    return {
      stroke: { show: false },
      dataLabels: {
        enabledOnSeries: [0, 1],
        formatter: (value: number) => (value === 0 ? "0" : value.toString()),
        style: { colors: ["#000000", "#000000"] },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (
            y: number,
            { seriesIndex, dataPointIndex }: { seriesIndex: number; dataPointIndex: number }
          ) => strategy.tooltip(y, seriesIndex, dataPointIndex),
        },
      },
      colors: [BarDiffChartUtils.DIFF_COLORS.v1, BarDiffChartUtils.DIFF_COLORS.v2],
    };
  }

  // Comparison chart
  static ServiceCohesionComparisonOpts(
    cohesionDiff: TInsightDiffCohesion[],
    versionTag1: string,
    versionTag2: string
  ): ApexOptions {
    const base = BarDiffChartUtils.StackMixedDiffChartOverwriteOpts(
      cohesionDiff,
      {
        x: (d) => d.name,
        y: (d) => d.totalInterfaceCohesionV2,
        tooltip: (y) => y.toString(),
      }
    );

    const maxY = cohesionDiff.reduce(
      (max, { totalInterfaceCohesionV1, totalInterfaceCohesionV2 }) =>
        Math.max(max, totalInterfaceCohesionV1, totalInterfaceCohesionV2),
      0
    );

    return {
      ...base,
      xaxis: {
        categories: cohesionDiff.map((d) => d.name),
        labels: {
          trim: true,
          style: {
            fontSize: "20px",
          },
        },
      },
      yaxis: [
        {
          title: {
            text: `${versionTag1}`,
            style: {
              color: BarDiffChartUtils.DIFF_COLORS.v1,
              fontSize: "18px"
            }
          },
          ...BarDiffChartUtils.generateIntervalTick(0, maxY, 0.1),
        },
        {
          opposite: true,
          title: {
            text: `${versionTag2}`,
            style: {
              color: BarDiffChartUtils.DIFF_COLORS.v2,
              fontSize: "18px"
            }
          },
          ...BarDiffChartUtils.generateIntervalTick(0, maxY, 0.1),
        },
      ],
    };
  }
  static ServiceCouplingComparisonOpts(
    couplingDiff: TInsightDiffCoupling[],
    versionTag1: string,
    versionTag2: string
  ): ApexOptions {
    const base = BarDiffChartUtils.StackMixedDiffChartOverwriteOpts(
      couplingDiff,
      {
        x: (d) => d.name,
        y: (d) => d.acsV2,
        tooltip: (y) => y.toString(),
      }
    );

    const { maxY } = couplingDiff.reduce(
      ({ maxY }, { acsV1, acsV2 }) => ({
        maxY: Math.max(maxY, acsV1, acsV2),
      }),
      { maxY: 1 }
    );

    return {
      ...base,
      xaxis: {
        categories: couplingDiff.map((d) => d.name),
        labels: {
          trim: true,
          style: {
            fontSize: "20px",
          },
        },
      },
      yaxis: [
        {
          title: {
            text: `${versionTag1}`,
            style: {
              color: BarDiffChartUtils.DIFF_COLORS.v1,
              fontSize: "18px",
            },
          },
          ...BarDiffChartUtils.generateIntervalTick(0, maxY, 1),
        },
        {
          opposite: true,
          title: {
            text: `${versionTag2}`,
            style: {
              color: BarDiffChartUtils.DIFF_COLORS.v2,
              fontSize: "18px",
            },
          },
          ...BarDiffChartUtils.generateIntervalTick(0, maxY, 1),
        },
      ],
    };
  }
  static ServiceInstabilityComparisonOpts(
    instabilityDiff: TInsightDiffInstability[],
    versionTag1: string,
    versionTag2: string
  ): ApexOptions {
    const base = BarDiffChartUtils.StackMixedDiffChartOverwriteOpts(
      instabilityDiff,
      {
        x: (d) => d.name,
        y: (d) => d.instabilityV2,
        tooltip: (y) => y.toString(),
      }
    );
    const maxY = instabilityDiff.reduce(
      (max, { instabilityV1, instabilityV2 }) =>
        Math.max(max, instabilityV1, instabilityV2),
      0
    );

    return {
      ...base,
      xaxis: {
        categories: instabilityDiff.map((d) => d.name),
        labels: {
          trim: true,
          style: {
            fontSize: "20px",
          },
        },
      },
      yaxis: [
        {
          title: {
            text: `${versionTag1}`,
            style: {
              color: BarDiffChartUtils.DIFF_COLORS.v1,
              fontSize: "18px",
            },
          },
          ...BarDiffChartUtils.generateIntervalTick(0, maxY, 0.1),
        },
        {
          opposite: true,
          title: {
            text: `${versionTag2}`,
            style: {
              color: BarDiffChartUtils.DIFF_COLORS.v2,
              fontSize: "18px",
            },
          },
          ...BarDiffChartUtils.generateIntervalTick(0, maxY, 0.1),
        },
      ],
    };
  }

  static SeriesFromServiceCohesionComparison(
    cohesionDiff: TInsightDiffCohesion[],
    versionTag1: string,
    versionTag2: string,
  ) {
    const seriesV1 = {
      name: versionTag1,
      data: cohesionDiff.map((d) => ({
        x: d.name,
        y: BarDiffChartUtils.roundToDisplay(d.totalInterfaceCohesionV1),
        fillColor: BarDiffChartUtils.DIFF_COLORS.v1,
      })),
    };

    const seriesV2 = {
      name: versionTag2,
      data: cohesionDiff.map((d) => ({
        x: d.name,
        y: BarDiffChartUtils.roundToDisplay(d.totalInterfaceCohesionV2),
        fillColor: BarDiffChartUtils.DIFF_COLORS.v2,
      })),
    };

    return [seriesV1, seriesV2];
  }
  static SeriesFromServiceCouplingComparison(
    couplingDiff: TInsightDiffCoupling[],
    versionTag1: string,
    versionTag2: string,
  ) {
    const seriesV1 = {
      name: versionTag1,
      data: couplingDiff.map((d) => {
        return {
          x: d.name,
          y: BarDiffChartUtils.roundToDisplay(d.acsV1),
          fillColor: BarDiffChartUtils.DIFF_COLORS.v1,
        };
      }),
    };

    const seriesV2 = {
      name: versionTag2,
      data: couplingDiff.map((d) => {
        return {
          x: d.name,
          y: BarDiffChartUtils.roundToDisplay(d.acsV2),
          fillColor: BarDiffChartUtils.DIFF_COLORS.v2,
        };
      }),
    };

    return [seriesV1, seriesV2];
  }
  static SeriesFromServiceInstabilityComparison(
    instabilityDiff: TInsightDiffInstability[],
    versionTag1: string,
    versionTag2: string,
  ) {
    const seriesV1 = {
      name: versionTag1,
      data: instabilityDiff.map((d) => {
        return {
          x: d.name,
          y: BarDiffChartUtils.roundToDisplay(d.instabilityV1),
          fillColor: BarDiffChartUtils.DIFF_COLORS.v1,
        };
      }),
    };

    const seriesV2 = {
      name: versionTag2,
      data: instabilityDiff.map((d) => {
        return {
          x: d.name,
          y: BarDiffChartUtils.roundToDisplay(d.instabilityV2),
          fillColor: BarDiffChartUtils.DIFF_COLORS.v2,
        };
      }),
    };

    return [seriesV1, seriesV2];
  }

  // Changes chart
  private static createChangeBarChartOpts<T>(
    data: T[],
    getName: (d: T) => string,
    getChange: (d: T) => number,
    getYAxisTitle: () => string,
    tickInterval: number,
    getColorFromChange?: (change: number) => string
  ): ApexOptions {
    const changes = data.map(getChange);
    const min = Math.min(...changes);
    const max = Math.max(...changes);
    const maxAbs = Math.max(Math.abs(min), Math.abs(max));
    const labelZeroThreshold = tickInterval / 2;

    const createYAxis = (opposite = false) => ({
      opposite,
      title: {
        text: getYAxisTitle(),
        style: {
          fontSize: "18px",
        },
      },
      labels: {
        formatter: (val: number) => {
          if (val < 0 && val > -labelZeroThreshold) return "0";
          return val.toFixed(1);
        }
      },
      ...BarDiffChartUtils.generateIntervalTick(-maxAbs, maxAbs, tickInterval),
    });

    return {
      chart: {
        type: "bar",
        animations: { enabled: false },
      },
      plotOptions: {
        bar: {
          dataLabels: { position: "top" },
          distributed: true,
          columnWidth: "40%",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toString(),
        style: {
          colors: ["#000"],
        },
      },
      xaxis: {
        categories: data.map(getName),
        labels: {
          style: {
            fontSize: "20px",
          },
        },
      },
      yaxis: [createYAxis(false), createYAxis(true)],
      grid: {
        yaxis: {
          lines: { show: true },
        },
        row: { colors: undefined },
        strokeDashArray: 0,
      },
      annotations: {
        yaxis: [{
          y: 0,
          borderColor: "#000000",
          strokeDashArray: 0,
        }],
      },
      tooltip: {
        y: { formatter: (y: number) => y.toString() },
      },
      colors: data.map((d) => {
        const change = getChange(d);
        if (getColorFromChange) return getColorFromChange(change);
        return change >= 0 ? "#28a745" : "#dc3545";
      }),
      legend: {
        position: "top",
        show: true,
        customLegendItems: ['Improvement', 'deterioration'],
        markers: {
          fillColors: ['#28a745', '#dc3545'],
        }
      }

    };
  }
  static CohesionChangeBarChartOpts(cohesionDiff: TInsightDiffCohesion[]): ApexOptions {
    return this.createChangeBarChartOpts(
      cohesionDiff,
      (d) => d.name,
      (d) => d.totalInterfaceCohesionV2 - d.totalInterfaceCohesionV1,
      () => "TSIC Change",
      0.1
    );
  }
  static CouplingChangeBarChartOpts(couplingDiff: TInsightDiffCoupling[]): ApexOptions {
    return this.createChangeBarChartOpts(
      couplingDiff,
      (d) => d.name,
      (d) => d.acsV2 - d.acsV1,
      () => "ACS Change",
      1,
    );
  }
  static InstabilityChangeBarChartOpts(instabilityDiff: TInsightDiffInstability[]): ApexOptions {
    return this.createChangeBarChartOpts(
      instabilityDiff,
      (d) => d.name,
      (d) => d.instabilityV2 - d.instabilityV1,
      () => "SDP Change ",
      0.1,
    );
  }

  static SeriesFromCohesionChange(
    cohesionDiff: TInsightDiffCohesion[]
  ) {
    return [
      {
        name: "TSIC Change",
        data: cohesionDiff.map((d) => {
          const diff = BarDiffChartUtils.roundToDisplay(d.totalInterfaceCohesionV2 - d.totalInterfaceCohesionV1);
          return {
            x: d.name,
            y: diff,
            fillColor: diff >= 0 ? "#28a745" : "#dc3545", // green for positive, red for negative
          };
        }),
      },
    ];
  }
  static SeriesFromCouplingChange(
    couplingDiff: TInsightDiffCoupling[]
  ) {
    return [
      {
        name: "ACS Change",
        data: couplingDiff.map((d) => {
          const diff = BarDiffChartUtils.roundToDisplay(d.acsV2 - d.acsV1);
          return {
            x: d.name,
            y: diff,
            fillColor: diff >= 0 ? "#dc3545" : "#28a745", // red for positive, green for negative
          };
        }),
      },
    ];
  }
  static SeriesFromInstabilityChange(
    instabilityDiff: TInsightDiffInstability[]
  ) {
    return [
      {
        name: "SDP Change ",
        data: instabilityDiff.map((d) => {
          const diff = BarDiffChartUtils.roundToDisplay(d.instabilityV2 - d.instabilityV1);
          return {
            x: d.name,
            y: diff,
            fillColor: diff >= 0 ? "#dc3545" : "#28a745", // red for positive, green for negative
          };
        }),
      },
    ];
  }


  private static roundToDisplay(n: number) {
    return Math.round(n * 100) / 100;
  }

  private static generateIntervalTick(min: number, max: number, interval: number) {
    const safeMin = min == 0 ? 0 : Math.min(min, -interval);
    const safeMax = Math.max(interval, max);

    const roundedMin = Math.floor(safeMin / interval) * interval;
    const roundedMax = Math.ceil(safeMax / interval) * interval;

    return {
      min: roundedMin,
      max: roundedMax,
      tickAmount: Math.round((roundedMax - roundedMin) / interval),
    };
  }
}
