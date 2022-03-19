import { ApexOptions } from "apexcharts";
import { Props } from "react-apexcharts";
import { TServiceCoupling } from "../entities/TServiceCoupling";
import { TTotalServiceInterfaceCohesion } from "../entities/TTotalServiceInterfaceCohesion";
import { Color } from "./ColorUtils";

export default class BarChartUtils {
  static CreateBarChart<T extends { name: string }>(
    title: string,
    data: T[],
    toSeriesStrategy: (_: T[]) => any[]
  ): Props {
    return {
      type: "bar",
      height: 600,
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
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
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

  private static mapFieldsToSeries(
    fields: { f: string; name: string }[],
    data: any[]
  ) {
    return fields.map(({ f, name }) => ({
      name,
      color: Color.generateFromString(name).darker(40).hex,
      data: data.map((c) => Math.round(c[f] * 1000) / 1000),
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
    return BarChartUtils.mapFieldsToSeries(fields, cohesions);
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
    return BarChartUtils.mapFieldsToSeries(fields, coupling);
  }
}
