import { Card } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IAggregateEndpointInfo } from "../../entities/IAggregateData";
import IEndpointDataType from "../../entities/IEndpointDataType";

const useStyles = makeStyles(() => ({
  code: {
    fontFamily: "monospace",
    overflow: "auto",
    padding: "0 1em",
    marginTop: "1em",
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
  const schema = dataType?.schemas[dataType?.schemas.length - 1].schema;

  return (
    <div>
      <div>
        Detail:
        <ul>
          <li>Requests: {endpointInfo.totalRequests}</li>
          <li>4XX Errors: {endpointInfo.totalRequestErrors}</li>
          <li>5XX Errors: {endpointInfo.totalServerErrors}</li>
        </ul>
      </div>
      {schema ? (
        <div>
          Schema (Typescript):
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
