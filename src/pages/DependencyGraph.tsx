import { makeStyles } from "@mui/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import {
  CanvasSettingFactory,
  GraphBasicSettings,
  zoomOnClick,
  handleLinkHover,
  handleNodeHover,
  preprocessData,
  useHoverHighlight,
} from "../services/DependencyGraphUtils";
import { MockGraphData } from "../services/MockData";

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
  const graphRef = useRef<any>();
  const [data, setData] = useState<any>();
  const [services, setServices] = useState(new Set<string>());

  useEffect(() => {
    // TODO: change to api call after backend is ready
    const rawData = MockGraphData;
    setData(preprocessData(rawData));
    rawData.services.forEach((s) => services.add(s));
  }, []);

  return (
    <div className={classes.root}>
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        {...GraphBasicSettings}
        {...CanvasSettingFactory(
          (link: any) => highlightInfo.highlightLinks.has(link),
          (node: any) => highlightInfo.highlightNodes.has(node),
          highlightInfo.hoverNode
        )}
        onNodeClick={(node) => zoomOnClick(node, graphRef)}
        onNodeHover={(node) =>
          setHighlightInfo(handleNodeHover(node, highlightInfo))
        }
        onLinkHover={(link) =>
          setHighlightInfo(handleLinkHover(link, highlightInfo))
        }
      />
    </div>
  );
}
