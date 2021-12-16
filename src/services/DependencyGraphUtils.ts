import { Dispatch, SetStateAction, useEffect, useState } from "react";

type HighlightInfo = {
  highlightLinks: Set<any>;
  highlightNodes: Set<any>;
  hoverNode: any;
};

const GraphBasicSettings = {
  linkDirectionalArrowColor: () => "dimgray",
  linkDirectionalParticles: 1,
  linkDirectionalArrowRelPos: 1,
  nodeRelSize: 4,
  linkLabel: (d: any) => `${d.source.id} -> ${d.target.id}`,
};

const CanvasSettingFactory = (
  highlightLinkStrategy: (link: any) => boolean,
  highlightNodeStrategy: (node: any) => boolean
) => ({
  nodeCanvasObjectMode: ((node: any) =>
    highlightNodeStrategy(node) ? "before" : undefined) as any,
  linkDirectionalArrowLength: (link: any) =>
    highlightLinkStrategy(link) ? 6 : 3,
  linkWidth: (link: any) => (highlightLinkStrategy(link) ? 7 : 1),
  linkDirectionalParticleWidth: (link: any) =>
    highlightLinkStrategy(link) ? 6 : 4,
});

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

const paintRing = (
  node: any,
  ctx: CanvasRenderingContext2D,
  hoverNode: any
) => {
  // add ring just for highlighted nodes
  ctx.beginPath();
  ctx.arc(
    node.x,
    node.y,
    GraphBasicSettings.nodeRelSize * 1.4,
    0,
    2 * Math.PI,
    false
  );
  ctx.fillStyle = node === hoverNode ? "red" : "orange";
  ctx.fill();
};

const zoomOnClick = (node: any, graphRef: any) => {
  if (!graphRef.current) return;
  graphRef.current.centerAt(node.x, node.y, 1000);
  graphRef.current.zoom(8, 2000);
};

export {
  handleLinkHover,
  handleNodeHover,
  paintRing,
  GraphBasicSettings,
  useHoverHighlight,
  preprocessData,
  CanvasSettingFactory,
  zoomOnClick,
};

export type { HighlightInfo };
