import { Card } from "@mui/material";
import { TRequestInfoChartData } from "../../entities/TRequestInfoChartData";
import RequestDonutChart from "../RequestDonutChart";

export type RequestInfoChartProps = {
  chartData?: TRequestInfoChartData;
};

export default function RequestInfoChart(props: RequestInfoChartProps) {
  return props.chartData ? (
    <Card variant="outlined">
      <RequestDonutChart
        series={[
          props.chartData.totalRequestCount,
          props.chartData.totalClientErrors,
          props.chartData.totalServerErrors,
        ]}
      />
    </Card>
  ) : (
    <></>
  );
}
