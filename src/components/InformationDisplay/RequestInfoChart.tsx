import { Card } from "@mui/material";
import { TRequestInfoChartData } from "../../entities/TRequestInfoChartData";
import RequestDonutChart from "../RequestDonutChart";

export type RequestInfoChartProps = {
  chartData?: TRequestInfoChartData;
};

export default function RequestInfoChart(props: RequestInfoChartProps) {
  const show =
    props.chartData &&
    (props.chartData.totalRequestCount ||
      props.chartData.totalClientErrors ||
      props.chartData.totalServerErrors);

  return show ? (
    <Card variant="outlined">
      <RequestDonutChart
        series={[
          props.chartData!.totalRequestCount,
          props.chartData!.totalClientErrors,
          props.chartData!.totalServerErrors,
        ]}
      />
    </Card>
  ) : (
    <></>
  );
}
