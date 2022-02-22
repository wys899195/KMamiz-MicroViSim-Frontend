import { Chip, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import {
  IAggregateEndpointInfo,
  IAggregateServiceInfo,
} from "../../entities/IAggregateData";
import IDisplayNodeInfo from "../../entities/IDisplayNodeInfo";
import IEndpointDataType from "../../entities/IEndpointDataType";
import DataService from "../../services/DataService";
import EndpointInfo from "./EndpointInfo";
import ServiceInfo from "./ServiceInfo";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  info: {
    margin: "0.5em 0",
    display: "flex",
    flexDirection: "row",
    gap: "0.2em",
  },
}));

export default function Description(props: { info: IDisplayNodeInfo | null }) {
  const classes = useStyles();
  const [serviceInfo, setServiceInfo] = useState<IAggregateServiceInfo[]>();
  const [endpointInfo, setEndpointInfo] = useState<IAggregateEndpointInfo>();
  const [endpointDataType, setEndpointDataType] = useState<IEndpointDataType>();

  useEffect(() => {
    const { info } = props;
    if (!info) return;
    if (info.type === "SRV") {
      DataService.getInstance()
        .getAggregateData()
        .then((res) => {
          setServiceInfo(
            res?.services.filter(
              (s) =>
                s.service === info.service && s.namespace === info.namespace
            )
          );
        });
    }
    if (info.type === "EP") {
      DataService.getInstance()
        .getAggregateData()
        .then((res) => {
          const services = res?.services.find(
            (s) => s.uniqueServiceName === info.uniqueServiceName
          );
          const endpoint = services?.endpoints.find(
            (e) => e.labelName === info.labelName && e.method === info.method
          );
          setEndpointInfo(endpoint);
        });

      const uniqueLabelName = `${info.uniqueServiceName}\t${info.method}\t${info.labelName}`;
      DataService.getInstance()
        .getEndpointDataType(uniqueLabelName)
        .then((res) => {
          setEndpointDataType(res);
        });
    }
  }, [props.info]);

  switch (props.info?.type) {
    case "SRV":
      return (
        <div>
          <div className={classes.info}>
            <Tooltip title="Namespace">
              <Chip color="success" size="small" label={props.info.namespace} />
            </Tooltip>
          </div>
          {serviceInfo ? <ServiceInfo services={serviceInfo} /> : null}
        </div>
      );
    case "EP":
      return (
        <div>
          <div className={classes.info}>
            <Tooltip title="Namespace">
              <Chip color="success" size="small" label={props.info.namespace} />
            </Tooltip>
            <Tooltip title="Service">
              <Chip color="info" size="small" label={props.info.service} />
            </Tooltip>
            <Tooltip title="Version">
              <Chip color="warning" size="small" label={props.info.version} />
            </Tooltip>
          </div>
          <EndpointInfo
            endpointInfo={endpointInfo}
            dataType={endpointDataType}
          />
        </div>
      );
    default:
      return <div></div>;
  }
}
