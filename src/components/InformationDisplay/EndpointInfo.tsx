import { Card } from "@mui/material";
import { TAggregatedEndpointInfo } from "../../entities/TAggregatedData";
import TEndpointDataType from "../../entities/TEndpointDataType";
import CodeDisplay from "../CodeDisplay";
import RequestDonutChart from "../RequestDonutChart";

export default function EndpointInfo(props: {
  endpointInfo?: TAggregatedEndpointInfo;
  dataType?: TEndpointDataType;
}) {
  const { endpointInfo, dataType } = props;
  if (!endpointInfo) return <div></div>;

  const schema = dataType?.schemas
    ?.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .find((s) => s.status.startsWith("2"));
  const resSchema = schema?.responseSchema;
  const reqSchema = schema?.requestSchema;
  const reqTime = schema?.time;

  const {
    totalRequests,
    totalRequestErrors: reqErrors,
    totalServerErrors: srvErrors,
  } = endpointInfo;

  return (
    <div>
      <Card variant="outlined">
        <RequestDonutChart
          series={[totalRequests - reqErrors - srvErrors, reqErrors, srvErrors]}
        />
      </Card>
      {reqSchema && (
        <div>
          <h4>Request Schema (Typescript)</h4>
          {reqTime && (
            <small>
              <i>Schema from: {reqTime}</i>
            </small>
          )}
          <CodeDisplay code={reqSchema} />
        </div>
      )}
      {resSchema && (
        <div>
          <h4>Response Schema (Typescript)</h4>
          {reqTime && (
            <small>
              <i>Schema from: {reqTime}</i>
            </small>
          )}
          <CodeDisplay code={resSchema} />
        </div>
      )}
    </div>
  );
}
