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
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.4,
          opacityTo: 0.6,
        },
      },
      legend: {
        horizontalAlign: "left",
      },
      xaxis: {
        type: "datetime",
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
          y: d[field] || 0,
          fillColor: Color.generateFromString(name).hex,
        })),
      };
    });
  }
}
