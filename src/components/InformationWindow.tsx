import { makeStyles } from "@mui/styles";
import { useEffect, useRef } from "react";
import {
  GetEndpointDataType,
  GetServiceAggregateData,
  GetServiceAggregateDataWithAllVersion,
} from "../classes/MockData";
import IDisplayNodeInfo from "../entities/IDisplayNodeInfo";
import EndpointInfo from "./InformationDisplay/EndpointInfo";
import ServiceInfo from "./InformationDisplay/ServiceInfo";

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
      return (
        <div>
          <ul>
            <li>Namespace: {info.namespace}</li>
          </ul>
          <ServiceInfo services={serviceInfo} />
        </div>
      );
    case "EP":
      // TODO: change to api call
      const uniqueName = `${info?.service}\t${info?.namespace}\t${info?.version}`;
      const endpointInfo = GetServiceAggregateData(uniqueName)?.endpoints.find(
        (e) => e.name === info.endpointName
      );
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
          <EndpointInfo
            endpointInfo={endpointInfo}
            dataType={endpointDataType}
          />
        </div>
      );
  }
  return <div></div>;
}

function displaySystem() {
  return <div>Root</div>;
}
