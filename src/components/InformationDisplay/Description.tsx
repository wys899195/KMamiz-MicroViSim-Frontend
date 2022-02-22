import { ReactElement, useEffect, useState } from "react";
import {
  IAggregateEndpointInfo,
  IAggregateServiceInfo,
} from "../../entities/IAggregateData";
import IDisplayNodeInfo from "../../entities/IDisplayNodeInfo";
import IEndpointDataType from "../../entities/IEndpointDataType";
import DataService from "../../services/DataService";
import EndpointInfo from "./EndpointInfo";
import ServiceInfo from "./ServiceInfo";

export default function Description(props: { info: IDisplayNodeInfo | null }) {
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
          console.log(info);
          const services = res?.services.find(
            (s) => s.uniqueServiceName === info.uniqueServiceName
          );
          console.log(services);
          const endpoint = services?.endpoints.find(
            (e) => e.labelName === info.labelName && e.method === info.method
          );
          console.log(endpoint);
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
          <ul>
            <li>Namespace: {props.info.namespace}</li>
          </ul>
          {serviceInfo ? <ServiceInfo services={serviceInfo} /> : null}
        </div>
      );
    case "EP":
      return (
        <div>
          <ul>
            <li>Namespace: {props.info.namespace}</li>
            <li>Service: {props.info.service}</li>
            <li>Version: {props.info.version}</li>
          </ul>
          <EndpointInfo
            endpointInfo={endpointInfo}
            dataType={endpointDataType}
          />
        </div>
      );
    default:
      return <div>Root</div>;
  }
}
