import { ApexOptions } from "apexcharts";
import { TServiceInstability } from "../entities/TServiceInstability";
import { Color } from "./ColorUtils";

export default class StackedLineChartUtils {
  static DefaultOptions(title: string, categories: any[]): ApexOptions {
    return {
      title: {
        text: title,
        align: "center",
      },
      chart: {
        type: "line",
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: { categories },
      legend: {
        position: "top",
      },
    };
  }

  static SeriesFromServiceInstability(instability: TServiceInstability[]) {
    const fields = [
      { f: "dependsOn", name: "FanOut (DependsOn)", type: "column" },
      { f: "dependBy", name: "FanIn (DependBy)", type: "column" },
      { f: "instability", name: "Instability (SDP)", type: "column" },
    ];

    return fields.map(({ f, type, name }) => ({
      name,
      type,
      color: Color.generateFromString(name).darker(30).hex,
      data: instability.map(
        ({ [f]: field }: any) => Math.floor(field * 100) / 100
      ),
    }));
  }

  static YAxisForServiceInstability(): ApexYAxis[] {
    return [
      {
        ...StackedLineChartUtils.createBasicAxisSetting("FanOut (DependsOn)"),
        tooltip: {
          enabled: true,
        },
      },
      {
        ...StackedLineChartUtils.createBasicAxisSetting("FanIn (DependBy)"),
        tooltip: {
          enabled: true,
        },
        opposite: true,
        labels: {
          offsetX: -7,
        },
      },
      {
        ...StackedLineChartUtils.createBasicAxisSetting("Instability (SDP)"),
        tooltip: {
          enabled: true,
        },
        opposite: true,
      },
    ];
  }
  private static createBasicAxisSetting(name: string): ApexYAxis {
    const color = Color.generateFromString(name).darker(30).hex;
    return {
      seriesName: name,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color,
      },
      labels: {
        style: {
          colors: color,
        },
      },
      title: {
        text: name,
        style: {
          color,
        },
      },
    };
  }
}
