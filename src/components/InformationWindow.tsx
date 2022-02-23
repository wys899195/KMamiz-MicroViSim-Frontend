import { FiberManualRecord, Hexagon } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useRef } from "react";
import IDisplayNodeInfo from "../entities/IDisplayNodeInfo";
import Description from "./InformationDisplay/Description";

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
  },
  info: {
    display: "flex",
    flexDirection: "row",
    gap: "0.2em",
  },
}));

export default function InformationWindow(props: {
  info: IDisplayNodeInfo | null;
}) {
  const classes = useStyles();
  return props.info ? (
    <div className={classes.root}>
      {getTitle(props.info)}
      <div className={classes.info}>
        <Tooltip title={`Type: ${getTypeName(props.info?.type)}`}>
          <Chip
            label={getTypeName(props.info?.type)}
            color={getColorOfType(props.info?.type)}
            icon={getIcon(props.info?.type)}
          />
        </Tooltip>
        {props.info?.method ? (
          <Tooltip title={`HTTP Method: ${props.info?.method}`}>
            <Chip label={props.info?.method} color="success" />
          </Tooltip>
        ) : null}
      </div>
      <Description info={props.info} />
    </div>
  ) : null;
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
function getColorOfType(type: "EX" | "SRV" | "EP" | undefined) {
  switch (type) {
    case "SRV":
      return "primary";
    case "EP":
      return "secondary";
  }
  return "success";
}
function getIcon(type: "EX" | "SRV" | "EP" | undefined) {
  switch (type) {
    case "SRV":
      return <Hexagon sx={{ transform: "rotate(30deg)" }} />;
    case "EP":
      return <FiberManualRecord />;
  }
  return undefined;
}

function getTitle(info: IDisplayNodeInfo | null) {
  switch (info?.type) {
    case "EX":
      return <h2>External System</h2>;
    case "SRV":
      return <h2>{info.service}</h2>;
    case "EP":
      return <h2>{info.name?.split(" ")[2]}</h2>;
  }
  return <div></div>;
}
