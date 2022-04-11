import { ApexOptions } from "apexcharts";
import { TServiceCoupling } from "../entities/TServiceCoupling";
import { TServiceInstability } from "../entities/TServiceInstability";
import BarChartUtils from "./BarChartUtils";
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
        enabled: true,
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
      { f: "dependingOn", name: "FanOut" },
      { f: "dependingBy", name: "FanIn" },
      { f: "instability", name: "Instability (SDP)" },
    ];

    return BarChartUtils.MapFieldsToSeries(fields, instability).map((f) => ({
      ...f,
      type: "column",
    }));
  }

  static SeriesFromServiceCoupling(coupling: TServiceCoupling[]) {
    return BarChartUtils.SeriesFromServiceCoupling(coupling).map((f) => ({
      ...f,
      type: "column",
    }));
  }

  static YAxisForServiceInstability(): ApexYAxis[] {
    return [
      {
        ...StackedLineChartUtils.createBasicAxisSetting("FanOut"),
        tooltip: {
          enabled: true,
        },
      },
      {
        ...StackedLineChartUtils.createBasicAxisSetting("FanIn"),
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

  static YAxisForServiceCoupling(): ApexYAxis[] {
    return [
      {
        ...StackedLineChartUtils.createBasicAxisSetting("AIS"),
        tooltip: {
          enabled: true,
        },
      },
      {
        ...StackedLineChartUtils.createBasicAxisSetting("ADS"),
        tooltip: {
          enabled: true,
        },
        opposite: true,
        labels: {
          offsetX: -7,
        },
      },
      {
        ...StackedLineChartUtils.createBasicAxisSetting("ACS"),
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
