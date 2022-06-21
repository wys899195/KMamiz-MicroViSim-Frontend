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

  static RoundToDisplay(n: number) {
    return Math.round(n * 100) / 100;
  }
  static MapFieldsToSeries(fields: { f: string; name: string }[], data: any[]) {
    return fields.map(({ f, name }) => ({
      name,
      color: Color.generateFromString(name).darker(50).hex,
      data: data.map((c) => BarChartUtils.RoundToDisplay(c[f])),
    }));
  }

  static ServiceCohesionOpts(
    cohesions: TTotalServiceInterfaceCohesion[]
  ): ApexOptions {
    const tsic = "Total Interface Cohesion (TSIC)";
    const color = Color.generateFromString(tsic);
    return {
      stroke: {
        show: false,
      },
      dataLabels: {
        enabledOnSeries: [0, 1],
      },
      annotations: {
        points: cohesions.map((c) => ({
          x: c.name,
          y: BarChartUtils.RoundToDisplay(c.totalInterfaceCohesion),
          marker: {
            size: 5,
            shape: "square",
            fillColor: color.hex,
            strokeColor: color.darker(30).hex,
          },
          label: {
            borderColor: color.darker(30).hex,
            borderWidth: 2,
            offsetX: 45,
            offsetY: 15,
            style: {
              color: "#fff",
              fontWeight: "bold",
              background: color.darker(50).hex,
              padding: {
                top: 4,
              },
            },

            text: `TSIC: ${BarChartUtils.RoundToDisplay(
              c.totalInterfaceCohesion
            )}`,
          },
        })),
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value, { seriesIndex, dataPointIndex }) => {
            if (seriesIndex === 2) {
              const c = BarChartUtils.RoundToDisplay(
                cohesions[dataPointIndex].totalInterfaceCohesion
              );
              return c.toString();
            }
            return value.toString();
          },
        },
      },
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
    const base = BarChartUtils.MapFieldsToSeries(fields, cohesions);
    return base.map((b) => {
      if (b.name === "Total Interface Cohesion (TSIC)") {
        return {
          ...b,
          data: b.data.map((_) => 0),
          type: "line",
        };
      }
      return { ...b, type: "column" };
    });
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
    return BarChartUtils.MapFieldsToSeries(fields, coupling);
  }

  static FanSeriesFromServiceInstability(instability: TServiceInstability[]) {
    const fields = [
      { f: "dependingOn", name: "FanOut" },
      { f: "dependingBy", name: "FanIn" },
    ];
    return BarChartUtils.MapFieldsToSeries(fields, instability);
  }

  static InstabilitySeriesFromServiceInstability(
    instability: TServiceInstability[]
  ) {
    const fields = [{ f: "instability", name: "Instability (SDP)" }];
    return BarChartUtils.MapFieldsToSeries(fields, instability);
  }
}
