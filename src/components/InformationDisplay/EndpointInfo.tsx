import { Card, CardContent, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IAggregateEndpointInfo } from "../../entities/IAggregateData";
import IEndpointDataType from "../../entities/IEndpointDataType";
import RequestDonutChart from "../RequestDonutChart";

const useStyles = makeStyles(() => ({
  code: {
    fontFamily: "monospace",
    overflow: "auto",
    padding: "0 1em",
    backgroundColor: "#262335",
    color: "white",
  },
}));

export default function EndpointInfo(props: {
  endpointInfo?: IAggregateEndpointInfo;
  dataType?: IEndpointDataType;
}) {
  const classes = useStyles();
  const { endpointInfo, dataType } = props;
  if (!endpointInfo) return <div></div>;
  const schema = dataType?.schemas[dataType?.schemas.length - 1].responseSchema;

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
      {schema ? (
        <div>
          <h4>Schema (Typescript)</h4>
          <Card variant="outlined" className={classes.code}>
            <pre>
              <code>{schema}</code>
            </pre>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
