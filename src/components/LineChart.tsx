import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import LineChartUtils from "../classes/LineChartUtils";

export default function AreaLineChart(props: {
  title: string;
  series: ApexAxisChartSeries;
  overrideOptions?: ApexOptions;
}) {
  const options: ApexOptions = {
    ...LineChartUtils.DefaultOptions(props.title),
    ...props.overrideOptions,
  };

  return (
    <ReactApexChart
      type="line"
      height={350}
      options={options}
      series={props.series}
    ></ReactApexChart>
  );
}
