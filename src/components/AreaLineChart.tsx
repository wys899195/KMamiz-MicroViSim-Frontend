import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import AreaLineChartUtils from "../classes/AreaLineChartUtils";

export default function AreaLineChart(props: {
  title: string;
  series: ApexAxisChartSeries;
  overrideOptions?: ApexOptions;
}) {
  const options: ApexOptions = {
    ...AreaLineChartUtils.DefaultOptions(props.title),
    ...props.overrideOptions,
  };

  return (
    <ReactApexChart
      type="area"
      height={350}
      options={options}
      series={props.series}
    ></ReactApexChart>
  );
}
