import { makeStyles } from "@mui/styles";
import { useEffect, useRef } from "react";
import {
  GetEndpointDataType,
  GetServiceAggregateData,
  GetServiceAggregateDataWithAllVersion,
} from "../classes/MockData";
import {
  IAggregateEndpointInfo,
  IAggregateServiceInfo,
} from "../entities/IAggregateData";
import IDisplayNodeInfo from "../entities/IDisplayNodeInfo";
import IEndpointDataType from "../entities/IEndpointDataType";
const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    right: "1em",
    bottom: "1em",
    width: "20em",
    height: "28em",
    overflowY: "auto",
    backgroundColor: "white",
    boxShadow: "2px 2px 4px 1px lightgray",
    padding: "0em 1em 1em 1em",
    fontFamily: "sans-serif",
    display: "none",
  },
}));

export default function InformationWindow(props: {
  info: IDisplayNodeInfo | null;
}) {
  const classes = useStyles();
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (props.info && divRef) {
      divRef.current!.style.display = "block";
    } else if (divRef) {
      divRef.current!.style.display = "none";
    }
  }, [props.info]);

  return (
    <div ref={divRef} className={classes.root}>
      {getTitle(props.info)}
      <div>
        <i>Type: {getTypeName(props.info?.type)}</i>
      </div>
      {getDescription(props.info)}
    </div>
  );
}

function getTypeName(type: "EX" | "SRV" | "EP" | undefined) {
  switch (type) {
    case "EX":
      return "External Systems";
    case "SRV":
      return "Service";
    case "EP":
      return "Endpoint";
  }
  return "";
}
function getTitle(info: IDisplayNodeInfo | null) {
  switch (info?.type) {
    case "EX":
      return <h2>External System</h2>;
    case "SRV":
      return <h2>{info.service}</h2>;
    case "EP":
      return (
        <h2>{info.endpointName!.substring(info.endpointName!.indexOf("/"))}</h2>
      );
  }
  return <div></div>;
}

function getDescription(info: IDisplayNodeInfo | null) {
  switch (info?.type) {
    case "EX":
      return displaySystem();
    case "SRV":
      // TODO: change to api call
      const versionLessUniqueName = `${info?.service}\t${info?.namespace}`;
      const serviceInfo = GetServiceAggregateDataWithAllVersion(
        versionLessUniqueName
      );
      console.log(versionLessUniqueName);
      return (
        <div>
          <ul>
            <li>Namespace: {info.namespace}</li>
          </ul>
          {displayService(serviceInfo)}
        </div>
      );
    case "EP":
      // TODO: change to api call
      const uniqueName = `${info?.service}\t${info?.namespace}\t${info?.version}`;
      const endpointInfo =
        GetServiceAggregateData(uniqueName)?.endpoints.find(
          (e) => e.name === info.endpointName
        ) || null;
      const endpointDataType = GetEndpointDataType(
        uniqueName,
        info.endpointName!
      );
      return (
        <div>
          <ul>
            <li>Namespace: {info.namespace}</li>
            <li>Service: {info.service}</li>
            <li>Version: {info.version}</li>
          </ul>
          {displayEndpoint(endpointInfo, endpointDataType)}
        </div>
      );
  }
  return <div></div>;
}

function displaySystem() {
  return <div>Root</div>;
}
function displayService(serviceInfo: IAggregateServiceInfo[]) {
  serviceInfo.sort((a, b) => a.version.localeCompare(b.version));
  const sumField = (field: string) =>
    serviceInfo.reduce((prev, s: any) => prev + s[field], 0);
  const roundNumber = (num: number) => {
    return Math.round(num * 10000) / 10000;
  };
  const endpoints = [
    ...new Set<string>(
      serviceInfo
        .map((s) => s.endpoints)
        .flat()
        .map((e) => e.name)
    ),
  ].length;
  return (
    <div>
      Detail:
      <ul>
        <li>Endpoints: {endpoints}</li>
        <li>Requests: {sumField("totalRequests")}</li>
        <li>4XX Errors: {sumField("totalRequestErrors")}</li>
        <li>5XX Errors: {sumField("totalServerErrors")}</li>
        <li>
          Combined Risk: {roundNumber(sumField("avgRisk") / serviceInfo.length)}
        </li>
        <li>
          Active Versions:
          <ul>
            {serviceInfo.map((s) => (
              <li>{s.version}</li>
            ))}
          </ul>
        </li>
        <li>
          Risk Per Version:
          <ul>
            {serviceInfo.map((s) => (
              <li>
                {s.version}: {roundNumber(s.avgRisk)}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
function displayEndpoint(
  endpointInfo: IAggregateEndpointInfo | null,
  dataType: IEndpointDataType | null
) {
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
          <pre>
            <code>{dataType.schemas[dataType.schemas.length - 1].schema}</code>
          </pre>
          {/* Sample Object:
          <pre>
            <code>
              {JSON.stringify(
                dataType.schemas[dataType.schemas.length - 1].sampleObject,
                null,
                2
              )}
            </code>
          </pre> */}
        </div>
      ) : null}
    </div>
  );
}
