import { ApexOptions } from "apexcharts";
import {
  TAreaLineChartData,
  TAreaLineChartDataFields,
} from "../entities/TAreaLineChartData";
import { Color } from "./ColorUtils";

export default class AreaLineChartUtils {
  static DefaultOptions(title: string): ApexOptions {
    return {
      title: {
        text: title,
        align: "center",
      },
      chart: {
        type: "line",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      legend: {
        horizontalAlign: "left",
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: (_, ts) => {
            const tok = new Date(ts as any).toISOString().split("T");
            const dateTok = tok[0].split("-");
            const timeTok = tok[1].split(":");
            return `${dateTok[1]}/${dateTok[2]} ${timeTok[0]}:${timeTok[1]}`;
          },
        },
      },
    };
  }

  static MappedBaseDataToSeriesData(
    data: TAreaLineChartData[],
    field: TAreaLineChartDataFields
  ): ApexAxisChartSeries {
    const serviceMap = new Map<string, TAreaLineChartData[]>();

    data.forEach((d) => {
      serviceMap.set(d.name, [...(serviceMap.get(d.name) || []), d]);
    });

    return [...serviceMap.entries()].map(([name, data]) => {
      return {
        name,
        color: Color.generateFromString(name).hex,
        data: data.map((d) => ({
          x: d.x,
          y: Math.round((d[field] || 0) * 1000) / 1000,
          fillColor: Color.generateFromString(name).hex,
        })),
      };
    });
  }
}
