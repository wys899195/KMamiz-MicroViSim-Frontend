import { ApexOptions } from "apexcharts";
import {
  FieldIndex,
  TLineChartData,
  TLineChartDataFields,
} from "../entities/TLineChartData";
import { Color } from "./ColorUtils";

export default class LineChartUtils {
  static DefaultOptions(title: string): ApexOptions {
    return {
      title: {
        text: title,
        align: "center",
      },
      chart: {
        type: "line",
        animations: {
          enabled: false,
        },
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
    data: TLineChartData,
    field: TLineChartDataFields
  ): ApexAxisChartSeries {
    const fIndex = FieldIndex.indexOf(field);
    return data.services.map((s, i) => ({
      name: s,
      color: Color.generateFromString(s).hex,
      data: data.dates.map((d, j) => ({
        x: d,
        y: Math.round((data.metrics[j][i][fIndex] || 0) * 1000) / 1000,
        fillColor: Color.generateFromString(s).hex,
      })),
    }));
  }
}
