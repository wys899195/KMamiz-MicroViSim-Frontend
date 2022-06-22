import { ApexOptions } from "apexcharts";
import { Props } from "react-apexcharts";
import { TServiceCoupling } from "../entities/TServiceCoupling";
import { TServiceInstability } from "../entities/TServiceInstability";
import { TTotalServiceInterfaceCohesion } from "../entities/TTotalServiceInterfaceCohesion";
import { Color } from "./ColorUtils";

export default class BarChartUtils {
  static CreateBarChart<T extends { name: string }>(
    title: string,
    data: T[],
    toSeriesStrategy: (_: T[]) => any[],
    stacked = false,
    overwriteOpts: Props = {},
    height = 600
  ): Props {
    return {
      type: "bar",
      height,
      options: {
        ...BarChartUtils.DefaultOptions(
          title,
          stacked,
          data.map(({ name }) => name)
        ),
        ...overwriteOpts,
      },
      series: toSeriesStrategy(data),
    };
  }

  static DefaultOptions(
    title: string,
    stacked: boolean,
    categories: any[]
  ): ApexOptions {
    return {
      title: {
        text: title,
        align: "center",
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

  static StackMixedChartOverwriteOpts<T>(
    markerName: string,
    data: T[],
    strategy: {
      x: (d: T) => string | number;
      y: (d: T) => number;
      markerLabel: (d: T) => string;
      tooltip: (
        y: number,
        seriesIndex: number,
        dataPointIndex: number
      ) => string;
    },
    overwriteYAxis = 0
  ) {
    const color = Color.generateFromString(markerName);
    return {
      stroke: {
        show: false,
      },
      dataLabels: {
        enabledOnSeries: [0, 1],
      },
      annotations: {
        points: data.map((d) => ({
          x: strategy.x(d),
          y: BarChartUtils.roundToDisplay(strategy.y(d)),
          yAxisIndex: overwriteYAxis,
          marker: {
            size: 5,
            shape: "square",
            fillColor: color.hex,
            strokeColor: color.darker(30).hex,
          },
          label: {
            borderColor: color.darker(30).hex,
            borderWidth: 2,
            offsetX: 15,
            offsetY: 15,
            textAnchor: "start",
            style: {
              color: "#fff",
              fontWeight: "bold",
              background: color.darker(50).hex,
              padding: {
                top: 4,
              },
            },

            text: strategy.markerLabel(d),
          },
        })),
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (
            y: number,
            {
              seriesIndex,
              dataPointIndex,
            }: { seriesIndex: number; dataPointIndex: number }
          ) => strategy.tooltip(y, seriesIndex, dataPointIndex),
        },
      },
    };
  }

  static ServiceCohesionOpts(
    cohesions: TTotalServiceInterfaceCohesion[]
  ): ApexOptions {
    const tsic = "Total Interface Cohesion (TSIC)";
    return BarChartUtils.StackMixedChartOverwriteOpts(tsic, cohesions, {
      x: (d) => d.name,
      y: (d) => d.totalInterfaceCohesion,
      markerLabel: (d) =>
        `TSIC: ${BarChartUtils.roundToDisplay(d.totalInterfaceCohesion)}`,
      tooltip: (y, seriesIndex, dataPointIndex) => {
        if (seriesIndex === 2) {
          const c = BarChartUtils.roundToDisplay(
            cohesions[dataPointIndex].totalInterfaceCohesion
          );
          return c.toString();
        }
        return y.toString();
      },
    });
  }

  static ServiceCouplingOpts(coupling: TServiceCoupling[]): ApexOptions {
    const acs = "Absolute Criticality (ACS)";
    const base = BarChartUtils.StackMixedChartOverwriteOpts(
      acs,
      coupling,
      {
        x: (d) => d.name,
        y: (d) => d.acs,
        markerLabel: (d) => `ACS: ${BarChartUtils.roundToDisplay(d.acs)}`,
        tooltip: (y, seriesIndex, dataPointIndex) => {
          if (seriesIndex === 2) {
            const c = BarChartUtils.roundToDisplay(
              coupling[dataPointIndex].acs
            );
            return c.toString();
          }
          return y.toString();
        },
      },
      2
    );

    const { maxY, maxRY } = coupling.reduce(
      ({ maxY, maxRY }, { ais, ads, acs }) => ({
        maxY: Math.max(maxY, ais + ads),
        maxRY: Math.max(maxRY, acs),
      }),
      { maxY: 0, maxRY: 0 }
    );

    const colorAis = Color.generateFromString("Absolute Importance (AIS)");
    const colorAds = Color.generateFromString("Absolute Dependence (ADS)");
    const colorAcs = Color.generateFromString("Absolute Criticality (ACS)");
    const mixedColor = colorAis.mixWith(colorAds);

    return {
      ...base,
      yaxis: [
        {
          title: {
            text: "AIS + ADS",
            style: {
              color: mixedColor.hex,
            },
          },
          ...BarChartUtils.generateTick(maxY),
        },
        {
          show: false,
          ...BarChartUtils.generateTick(maxY),
        },
        {
          opposite: true,
          title: {
            text: "ACS",
            style: {
              color: colorAcs.hex,
            },
          },
          ...BarChartUtils.generateTick(maxRY),
        },
      ],
    };
  }

  static ServiceInstabilityOpts(
    instability: TServiceInstability[]
  ): ApexOptions {
    const base = BarChartUtils.StackMixedChartOverwriteOpts(
      "Instability (SDP)",
      instability,
      {
        x: (d) => d.name,
        y: (d) => d.instability,
        markerLabel: (d) =>
          `SDP: ${BarChartUtils.roundToDisplay(d.instability)}`,
        tooltip: (y, seriesIndex, dataPointIndex) => {
          if (seriesIndex === 2) {
            const c = BarChartUtils.roundToDisplay(
              instability[dataPointIndex].instability
            );
            return c.toString();
          }
          return y.toString();
        },
      },
      2
    );

    return {
      ...base,
      yaxis: [
        {
          title: {
            text: "FanOut",
            style: {
              color: Color.generateFromString("FanOut").hex,
            },
          },
        },
        {
          title: {
            text: "FanIn",
            style: {
              color: Color.generateFromString("FanIn").hex,
            },
          },
        },
        {
          opposite: true,
          title: {
            text: "Instability (SDP)",
            style: {
              color: Color.generateFromString("Instability (SDP)").hex,
            },
          },
          min: 0,
          max: 1,
        },
      ],
    };
  }

  static SeriesFromServiceCohesion(
    cohesions: TTotalServiceInterfaceCohesion[]
  ) {
    const fields = [
      {
        f: "dataCohesion",
        name: "Data Cohesion (SIDC)",
      },
      {
        f: "usageCohesion",
        name: "Usage Cohesion (SIUC)",
      },
      {
        f: "totalInterfaceCohesion",
        name: "Total Interface Cohesion (TSIC)",
      },
    ];
    const base = BarChartUtils.mapFieldsToSeries(fields, cohesions);
    return BarChartUtils.markFieldToLine(
      "Total Interface Cohesion (TSIC)",
      base
    );
  }

  static SeriesFromServiceCoupling(coupling: TServiceCoupling[]) {
    const fields = [
      {
        f: "ais",
        name: "Absolute Importance (AIS)",
      },
      {
        f: "ads",
        name: "Absolute Dependence (ADS)",
      },
      { f: "acs", name: "Absolute Criticality (ACS)" },
    ];
    const base = BarChartUtils.mapFieldsToSeries(fields, coupling);
    return BarChartUtils.markFieldToLine("Absolute Criticality (ACS)", base);
  }

  static SeriesFromServiceInstability(instability: TServiceInstability[]) {
    const fields = [
      { f: "dependingOn", name: "FanOut" },
      { f: "dependingBy", name: "FanIn" },
      { f: "instability", name: "Instability (SDP)" },
    ];
    const base = BarChartUtils.mapFieldsToSeries(fields, instability);
    return BarChartUtils.markFieldToLine("Instability (SDP)", base);
  }

  private static roundToDisplay(n: number) {
    return Math.round(n * 100) / 100;
  }

  private static mapFieldsToSeries(
    fields: { f: string; name: string }[],
    data: any[]
  ) {
    return fields.map(({ f, name }) => ({
      name,
      color: Color.generateFromString(name).darker(50).hex,
      data: data.map((c) => BarChartUtils.roundToDisplay(c[f])),
    }));
  }

  private static generateTick(max: number) {
    return {
      max,
      min: 0,
      tickAmount: max,
    };
  }

  private static markFieldToLine(
    fName: string,
    series: ApexAxisChartSeries
  ): ApexAxisChartSeries {
    return series.map((s) => {
      if (s.name === fName) {
        return {
          ...s,
          data: s.data.map(() => 0),
          type: "line",
        };
      }
      return { ...s, type: "column" };
    });
  }
}
