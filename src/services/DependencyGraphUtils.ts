import { Dispatch, SetStateAction, useState } from "react";
import { Color } from "./ColorUtils";

type HighlightInfo = {
  highlightLinks: Set<any>;
  highlightNodes: Set<any>;
  hoverNode: any;
};

const useHoverHighlight = (): [
  HighlightInfo,
  Dispatch<SetStateAction<HighlightInfo>>
] => {
  const [highlight, setHighlight] = useState<HighlightInfo>({
    highlightLinks: new Set<any>(),
    highlightNodes: new Set<any>(),
    hoverNode: null,
  });
  return [highlight, setHighlight];
};

const preprocessData = (data: { nodes: any[]; links: any[] }) => {
  const graphData = {
    nodes: data.nodes.map((n) => ({ ...n, neighbors: [], links: [] })),
    links: data.links,
  };

  graphData.links.forEach((l: any) => {
    const source = graphData.nodes.find((n: any) => n.id === l.source);
    const target = graphData.nodes.find((n: any) => n.id === l.target);
    source.neighbors.push(target);
    target.neighbors.push(source);
    source.links.push(l);
    target.links.push(l);
  });
  return graphData;
};

const handleLinkHover = (link: any, info: HighlightInfo): HighlightInfo => {
  const { highlightNodes, highlightLinks } = info;
  highlightNodes.clear();
  highlightLinks.clear();
  if (link) {
    highlightLinks.add(link);
    highlightNodes.add(link.source);
    highlightNodes.add(link.target);
  }
  return { ...info, highlightNodes, highlightLinks };
};

const handleNodeHover = (node: any, info: HighlightInfo): HighlightInfo => {
  const { highlightNodes, highlightLinks } = info;
  highlightNodes.clear();
  highlightLinks.clear();
  if (node) {
    highlightNodes.add(node);
    node.neighbors.forEach((neighbor: any) => highlightNodes.add(neighbor));
    node.links.forEach((link: any) => highlightLinks.add(link));
  }
  return { ...info, highlightNodes, highlightLinks, hoverNode: node || null };
};

const getColor = (id: string) => {
  const n = [...id].reduce((prev, curr) => prev + curr.charCodeAt(0), 0);
  return "#" + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, "0");
};

const drawHexagon = (
  x: any,
  y: any,
  r: number,
  ctx: CanvasRenderingContext2D
) => {
  ctx.moveTo(x, y + 2 * r);
  ctx.lineTo(x + Math.sqrt(3) * r, y + r);
  ctx.lineTo(x + Math.sqrt(3) * r, y - r);
  ctx.lineTo(x, y - 2 * r);
  ctx.lineTo(x - Math.sqrt(3) * r, y - r);
  ctx.lineTo(x - Math.sqrt(3) * r, y + r);
  ctx.closePath();
};

const paintNode = (node: any, color: string, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = color;
  const r = GraphBasicSettings.nodeRelSize * 0.6;
  const { x, y } = node;

  ctx.beginPath();
  // paint hexagon if node is a service (group center)
  if (node.id === node.group) {
    drawHexagon(x, y, r, ctx);
  } else {
    ctx.arc(x, y, GraphBasicSettings.nodeRelSize, 0, 2 * Math.PI, false);
  }
  ctx.fill();
};

const paintNodeRing = (
  node: any,
  ctx: CanvasRenderingContext2D,
  highlight: boolean,
  hoverNode: any
) => {
  // add ring just for highlighted nodes
  if (highlight) {
    ctx.fillStyle = node === hoverNode ? "navy" : "orange";
    const { x, y } = node;
    ctx.beginPath();
    if (node.id === node.group) {
      const r = GraphBasicSettings.nodeRelSize * 0.85;
      drawHexagon(x, y, r, ctx);
    } else {
      ctx.arc(
        x,
        y,
        GraphBasicSettings.nodeRelSize * 1.4,
        0,
        2 * Math.PI,
        false
      );
    }
    ctx.fill();
  }

  // paint underlying style on top of ring
  let color = Color.generateFromString(node.group);
  const { h, s, l } = color.hsl;
  if (node.id !== node.group) {
    color = Color.fromHSL(h, s - 10, l + 10)!;
  }
  paintNode(node, color.hex, ctx);
};

const zoomOnClick = (node: any, graphRef: any) => {
  if (!graphRef.current) return;
  graphRef.current.centerAt(node.x, node.y, 1000);
  graphRef.current.zoom(8, 2000);
};

const GraphBasicSettings = {
  linkDirectionalArrowColor: () => "dimgray",
  linkDirectionalParticles: 1,
  linkDirectionalArrowRelPos: 1,
  nodeRelSize: 4,
  // nodeAutoColorBy: "group",
  nodePointerAreaPaint: paintNode,
  linkLabel: (d: any) => `${d.source.name} ➔ ${d.target.name}`,
};

const CanvasSettingFactory = (
  highlightLinkStrategy: (link: any) => boolean,
  highlightNodeStrategy: (node: any) => boolean,
  hoverNode: any
) => ({
  // nodeCanvasObjectMode: ((node: any) => {
  //   if (node.id === node.group && !highlightNodeStrategy(node)) return "before";
  //   return highlightNodeStrategy(node) ? "before" : undefined;
  // }) as any,
  linkDirectionalArrowLength: (link: any) =>
    highlightLinkStrategy(link) ? 6 : 3,
  linkWidth: (link: any) => (highlightLinkStrategy(link) ? 7 : 1),
  linkDirectionalParticleWidth: (link: any) =>
    highlightLinkStrategy(link) ? 6 : 4,
  nodeCanvasObject: (node: any, ctx: any) =>
    paintNodeRing(node, ctx, highlightNodeStrategy(node), hoverNode),
});

export {
  handleLinkHover,
  handleNodeHover,
  GraphBasicSettings,
  useHoverHighlight,
  preprocessData,
  CanvasSettingFactory,
  zoomOnClick,
};

export type { HighlightInfo };
