import { makeStyles } from "@mui/styles";
import { useEffect, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import { MockGraphData } from "../classes/MockData";
import { DependencyGraphFactory } from "../classes/DependencyGraphFactory";
import {
  useHoverHighlight,
  DependencyGraphUtils,
} from "../classes/DependencyGraphUtils";
import InformationWindow from "../components/InformationWindow";
import IDisplayNodeInfo from "../entites/IDisplayNodeInfo";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "calc(100vh - 64px)",
    overflow: "hidden",
  },
}));

export default function DependencyGraph() {
  const classes = useStyles();
  const [highlightInfo, setHighlightInfo] = useHoverHighlight();
  const [data, setData] = useState<any>();
  const [displayInfo, setDisplayInfo] = useState<IDisplayNodeInfo | null>(null);
  const graphRef = useRef<any>();

  useEffect(() => {
    // TODO: change to api call after backend is ready
    const rawData = MockGraphData;
    setData(DependencyGraphUtils.ProcessData(rawData));
  }, []);

  return (
    <div className={classes.root}>
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        {...DependencyGraphFactory.Create(
          highlightInfo,
          setHighlightInfo,
          graphRef,
          setDisplayInfo
        )}
      />
      <InformationWindow info={displayInfo} />
    </div>
  );
}
