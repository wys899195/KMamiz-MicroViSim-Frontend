import { makeStyles } from "@mui/styles";
import { useMemo, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import {
  CanvasSettingFactory,
  GraphBasicSettings,
  zoomOnClick,
  handleLinkHover,
  handleNodeHover,
  paintRing,
  preprocessData,
  useHoverHighlight,
} from "../services/DependencyGraphUtils";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "calc(100vh - 64px)",
    overflow: "hidden",
  },
}));

const graphData: any = {
  nodes: [
    { id: "a", name: "test_a", color: "steelblue", neighbors: [], links: [] },
    { id: "b", name: "test_b", color: "navy", neighbors: [], links: [] },
    { id: "c", name: "test_c", color: "steelblue", neighbors: [], links: [] },
  ],
  links: [
    { source: "a", target: "b" },
    { source: "b", target: "c" },
  ],
};

export default function DependencyGraph() {
  const classes = useStyles();
  const [highlightInfo, setHighlightInfo] = useHoverHighlight();
  const graphRef = useRef<any>();
  const data = useMemo(() => preprocessData(graphData), []);

  return (
    <div className={classes.root}>
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        {...GraphBasicSettings}
        {...CanvasSettingFactory(
          (link: any) => highlightInfo.highlightLinks.has(link),
          (node: any) => highlightInfo.highlightNodes.has(node)
        )}
        onNodeClick={(node) => zoomOnClick(node, graphRef)}
        nodeCanvasObject={(node, ctx) =>
          paintRing(node, ctx, highlightInfo.hoverNode)
        }
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
