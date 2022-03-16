import { ApexOptions } from "apexcharts";
import { TTotalServiceInterfaceCohesion } from "../entities/TTotalServiceInterfaceCohesion";
import { Color } from "./ColorUtils";

export default class BarChartUtils {
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

  static SerialFromServiceCohesion(
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
    return fields.map(({ f, name }) => ({
      name,
      color: Color.generateFromString(name).darker(40).hex,
      data: cohesions.map((c) => Math.floor((c as any)[f] * 100) / 100),
    }));
  }
}
