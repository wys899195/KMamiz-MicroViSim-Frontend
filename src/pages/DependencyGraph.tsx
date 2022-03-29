import { makeStyles } from "@mui/styles";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import { DependencyGraphFactory } from "../classes/DependencyGraphFactory";
import {
  useHoverHighlight,
  DependencyGraphUtils,
} from "../classes/DependencyGraphUtils";
import InformationWindow from "../components/InformationWindow";
import { TDisplayNodeInfo } from "../entities/TDisplayNodeInfo";
import ViewportUtils from "../classes/ViewportUtils";
import GraphService from "../services/GraphService";
import { Card, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { TGraphData } from "../entities/TGraphData";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "calc(100vh - 64px)",
    overflow: "hidden",
  },
  switch: {
    position: "absolute",
    top: "5em",
    right: "1em",
    paddingLeft: "0.8em",
  },
}));

export default function DependencyGraph() {
  const classes = useStyles();
  const graphRef = useRef<any>();
  const rawDataRef = useRef<string>();
  const [size, setSize] = useState([0, 0]);
  const [data, setData] = useState<any>();
  const [highlightInfo, setHighlightInfo] = useHoverHighlight();
  const [displayInfo, setDisplayInfo] = useState<TDisplayNodeInfo | null>(null);
  const [showEndpoint, setShowEndpoint] = useState(true);

  useLayoutEffect(() => {
    const unsubscribe = ViewportUtils.getInstance().subscribe(([vw, vh]) =>
      setSize([vw, vh])
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const next = (nextData?: TGraphData) => {
      const nextRawData = JSON.stringify(nextData);
      if (rawDataRef.current === nextRawData) return;
      if (!rawDataRef.current) {
        setTimeout(() => {
          graphRef.current.zoom(4, 0);
        }, 10);
      }
      rawDataRef.current = nextRawData;
      setData(nextData && DependencyGraphUtils.ProcessData(nextData));
    };

    const unSub = showEndpoint
      ? GraphService.getInstance().subscribeToEndpointDependencyGraph(next)
      : GraphService.getInstance().subscribeToServiceDependencyGraph(next);
    return () => {
      unSub();
    };
  }, [showEndpoint]);

  return (
    <div className={classes.root}>
      <div>
        <ForceGraph2D
          ref={graphRef}
          width={size[0]}
          height={size[1]}
          graphData={data}
          {...DependencyGraphFactory.Create(
            highlightInfo,
            setHighlightInfo,
            graphRef,
            setDisplayInfo
          )}
        />
      </div>
      <InformationWindow info={displayInfo} />
      <Card className={classes.switch}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={showEndpoint}
                onChange={(e) => setShowEndpoint(e.target.checked)}
              />
            }
            label="Show endpoints"
          />
        </FormGroup>
      </Card>
    </div>
  );
}
