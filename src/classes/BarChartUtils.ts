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
    height = 600
  ): Props {
    return {
      type: "bar",
      height,
      options: BarChartUtils.DefaultOptions(
        title,
        data.map(({ name }) => name)
      ),
      series: toSeriesStrategy(data),
    };
  }

  static DefaultOptions(title: string, categories: any[]): ApexOptions {
    return {
      title: {
        text: title,
        align: "center",
      },
      chart: {
        type: "bar",
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
          colors: ["#fff"],
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

  static MapFieldsToSeries(fields: { f: string; name: string }[], data: any[]) {
    return fields.map(({ f, name }) => ({
      name,
      color: Color.generateFromString(name).darker(50).hex,
      data: data.map((c) => Math.round(c[f] * 100) / 100),
    }));
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
      { f: "totalInterfaceCohesion", name: "Total Interface Cohesion (TSIC)" },
    ];
    return BarChartUtils.MapFieldsToSeries(fields, cohesions);
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
