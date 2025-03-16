import { Dispatch, SetStateAction, useState } from "react";
import { TGraphData, TLink, TNode } from "../entities/TGraphData";
import { Color } from "./ColorUtils";
import Config from "../../Config";

// to highlight node in the dependency graph
export type HighlightInfo = {
  highlightLinks: Set<any>;
  highlightNodes: Set<any>;
  focusNode: any;
};
const useHoverHighlight = (): [
  HighlightInfo,
  Dispatch<SetStateAction<HighlightInfo>>
] => {
  const [highlight, setHighlight] = useState<HighlightInfo>({
    highlightLinks: new Set<any>(),
    highlightNodes: new Set<any>(),
    focusNode: null,
  });
  return [highlight, setHighlight];
};


// to show deprecated service or endpoint
const parseThresholdToMilliseconds = (thresholdStr:string): number => {
  if (!thresholdStr) return 0;
  const regex = /(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
  const match = thresholdStr.match(regex);
  if (!match) return 0;

  const days = match[1] ? parseInt(match[1], 10) : 0;
  const hours = match[2] ? parseInt(match[2], 10) : 0;
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  const seconds = match[4] ? parseInt(match[4], 10) : 0;

  return ((days * 86400) + (hours * 3600) + (minutes * 60) + seconds) * 1000;
}
const GRAPH_IDLE_NODE_THRESHOLD = parseThresholdToMilliseconds(Config.InactiveEndpointThreshold || "");
const GRAPH_DEPRECATED_NODE_THRESHOLD = Math.max(GRAPH_IDLE_NODE_THRESHOLD, parseThresholdToMilliseconds(Config.DeprecatedEndpointThreshold || ""));

export type GraphObsoleteNodesInfo = {
  inactiveNodeIds: Set<string>; 
  deprecatedNodeIds: Set<string>; 
  deprecatedLinkIds: Set<string>; 
}

const useGraphObsoleteNodes = (): [
  GraphObsoleteNodesInfo,
  Dispatch<SetStateAction<GraphObsoleteNodesInfo>>
] => {
  const [graphObsoleteNodes, setGraphObsoleteNodes] = useState<GraphObsoleteNodesInfo>({
    inactiveNodeIds: new Set<string>(),
    deprecatedNodeIds: new Set<string>(),
    deprecatedLinkIds: new Set<string>(),
  });
  return [graphObsoleteNodes, setGraphObsoleteNodes];
};

// to compare two dependency graphs
export type GraphDifferenceInfo = {
  // display at the Overview area
  addedNodeIds: string[]; 
  deletedNodeIds: string[];
  addedLinkIds: string[]; 
  deletedLinkIds: string[];
  diffGraphData: TGraphData;
};

const useGraphDifference = (): [
  GraphDifferenceInfo,
  Dispatch<SetStateAction<GraphDifferenceInfo>>
] => {
  const [graphDifference, setGraphDifference] = useState<GraphDifferenceInfo>({
    addedNodeIds: [],
    deletedNodeIds: [],
    addedLinkIds: [],
    deletedLinkIds: [],
    diffGraphData: {
      nodes: [],
      links: []
    }
  });
  return [graphDifference, setGraphDifference];
};

export class DependencyGraphUtils {
  private constructor() {}

  static readonly GraphBasicSettings = {
    linkDirectionalArrowColor: () => "dimgray",
    // linkDirectionalParticles: 1,
    linkDirectionalArrowRelPos: 1,
    nodeRelSize: 4,
    // nodeAutoColorBy: "group",
    nodePointerAreaPaint: DependencyGraphUtils.PaintNode,
    linkLabel: (d: any) => `${d.source.name} ➔ ${d.target.name}`,
  };

  static ProcessData(data: TGraphData) {
    const graphData: {
      nodes: (TNode & { highlight: TNode[]; links: TLink[] })[];
      links: TLink[];
    } = {
      nodes: data.nodes.map((n) => ({
        ...n,
        highlight: [],
        links: [],
      })),
      links: data.links,
    };

    graphData.nodes.forEach((node) => {
      node.highlight = node.dependencies.map(
        (d) => graphData.nodes.find((n) => n.id === d)!
      );
      node.linkInBetween.forEach(({ source, target }) => {
        const link = graphData.links.find(
          (l) => l.source === source && l.target === target
        );
        if (link) node.links.push(link);
      });
    });
    return graphData;
  }

  static filterDeprecatedNodeAndLinks(data: TGraphData,graphObsoleteNodesInfo: GraphObsoleteNodesInfo):TGraphData{
    if (!data){
      return {
        nodes:[],
        links:[]
      }
    }
    console.log("graphObsoleteNodesInfo:",graphObsoleteNodesInfo)
    const { deprecatedNodeIds, deprecatedLinkIds } = graphObsoleteNodesInfo;
    const filteredNodes = data.nodes.filter(
      (node) => !deprecatedNodeIds.has(node.id)
    );
    const filteredLinks = data.links.filter(
      (link) => !deprecatedLinkIds.has(DependencyGraphUtils.TLinkToId(link))
    );
    return {
      nodes:filteredNodes,
      links:filteredLinks
    }
  }

  static TLinkToId(link:TLink):string {
    return `${link.source}==>${link.target}`
  }

  static findObsoleteNodes(graphData:TGraphData):GraphObsoleteNodesInfo {
    if (!graphData){
      return {
        inactiveNodeIds: new Set<string>(),
        deprecatedNodeIds: new Set<string>(),
        deprecatedLinkIds: new Set<string>(),
      }
    }else{
      console.log("graphDataaa:",graphData)
      const now = Date.now();
      const inactiveTimestamp = now - GRAPH_IDLE_NODE_THRESHOLD;
      const deprecatedTimestamp = now - GRAPH_DEPRECATED_NODE_THRESHOLD ;
      const inactiveNodeIds = graphData.nodes
      .filter(node => node.id !== "null" && node.lastTimestamp < inactiveTimestamp)
      .map(node => node.id);
      const deprecatedNodeIds = graphData.nodes
      .filter(node => node.id !== "null" && node.lastTimestamp < deprecatedTimestamp)
      .map(node => node.id);

      const deprecatedLinkIds = graphData.links
      .filter(link => deprecatedNodeIds.includes(link.target))
      .map(link => this.TLinkToId(link));

      console.log("inactiveNodeIds:",inactiveNodeIds);
      console.log("deprecatedNodeIds:",deprecatedNodeIds)
      console.log("deprecatedLinkIds:",deprecatedLinkIds)
      return {
        inactiveNodeIds:  new Set(inactiveNodeIds),
        deprecatedNodeIds: new Set(deprecatedNodeIds),
        deprecatedLinkIds: new Set(deprecatedLinkIds)
      }
    }
  }

  static toServiceDependencyGraph(endpointGraph:TGraphData){
    const linkSet = new Set<string>();
    endpointGraph.links.forEach((l) => {
      const source = l.source.split("\t").slice(0, 2).join("\t");
      const target = l.target.split("\t").slice(0, 2).join("\t");
      linkSet.add(`${source}\n${target}`);
    });

    const links = [...linkSet]
      .map((l) => l.split("\n"))
      .map(([source, target]) => ({ source, target }));

    const nodes = endpointGraph.nodes.filter((n) => n.id === n.group);
    nodes.forEach((n) => {
      n.linkInBetween = links.filter((l) => l.source === n.id);
      n.dependencies = n.linkInBetween.map((l) => l.target);
    });

    const serviceGraph: TGraphData = {
      nodes,
      links,
    };
    return serviceGraph;
  }

  static CompareTwoGraphData(newData:TGraphData,oldData:TGraphData,showEndpoint:boolean):GraphDifferenceInfo{
    if (!newData || !oldData){
      return {
        addedNodeIds: [],
        deletedNodeIds: [],
        addedLinkIds: [],
        deletedLinkIds: [],
        diffGraphData: {
          nodes: [],
          links: []
        }
      }
    }else{
      if (!showEndpoint) {
        newData = this.toServiceDependencyGraph(newData);
        oldData = this.toServiceDependencyGraph(oldData);
      }

      // ids of all nodes
      const nodeIdsInNewData: string[] = newData.nodes.map(node => node.id);
      const nodeIdsInOldData: string[] = oldData.nodes.map(node => node.id);
      const addedNodeIds: Set<string> = new Set(nodeIdsInNewData.filter(id => !nodeIdsInOldData.includes(id)));
      const deletedNodeIds: Set<string> = new Set(nodeIdsInOldData.filter(id => !nodeIdsInNewData.includes(id)));

      // ids of all links excluding external nodes
      const linkIdsInNewData: string[] = newData.links.map(link => this.TLinkToId(link));
      const linkIdsInOldData: string[] = oldData.links.map(link => this.TLinkToId(link));
      const addedLinkIds: Set<string> = new Set(linkIdsInNewData.filter(id => !linkIdsInOldData.includes(id)));
      const deletedLinkIds: Set<string> = new Set(linkIdsInOldData.filter(id => !linkIdsInNewData.includes(id)));

      const mergedNodes = [
        ...newData.nodes,
        ...oldData.nodes
          .filter(node => deletedNodeIds.has(node.id))
      ];

      const mergedLinks = [
        ...newData.links,
        ...oldData.links
          .filter(link => deletedLinkIds.has(this.TLinkToId(link)))
      ];

      const diffGraphData:TGraphData = {
        nodes: mergedNodes,
        links: mergedLinks
      }

      
      // console.log("CompareTwoGraphData result:",{
      //   newData:newData,
      //   oldData:oldData,
      //   linkIdsInNewData: Array.from(linkIdsInNewData),
      //   linkIdsInOldData: Array.from(linkIdsInOldData),
      //   addedNodeIds: Array.from(addedNodeIds),
      //   deletedNodeIds: Array.from(deletedNodeIds),
      //   addedLinkIds: Array.from(addedLinkIds),
      //   deletedLinkIds: Array.from(deletedLinkIds),
      //   diffGraphData:diffGraphData
      // })

      return {
        addedNodeIds: Array.from(addedNodeIds),
        deletedNodeIds: Array.from(deletedNodeIds),
        addedLinkIds: Array.from(addedLinkIds),
        deletedLinkIds: Array.from(deletedLinkIds),
        diffGraphData:diffGraphData
      }
    }
  }

  static DrawHexagon(x: any, y: any, r: number, ctx: CanvasRenderingContext2D) {
    ctx.moveTo(x, y + 2 * r);
    ctx.lineTo(x + Math.sqrt(3) * r, y + r);
    ctx.lineTo(x + Math.sqrt(3) * r, y - r);
    ctx.lineTo(x, y - 2 * r);
    ctx.lineTo(x - Math.sqrt(3) * r, y - r);
    ctx.lineTo(x - Math.sqrt(3) * r, y + r);
    ctx.closePath();
  }

  static DrawText(
    text: string,
    color: string,
    node: any,
    ctx: CanvasRenderingContext2D,
    offsetUnitY: number = 0,
    globalScale: number = DependencyGraphUtils.GraphBasicSettings.nodeRelSize
  ) {
    const label = text;
    const fontSize = 12 / globalScale;

    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(label, node.x, node.y + offsetUnitY * globalScale);
  }

  static PaintNode(node: any, color: string, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = color;
    const r = DependencyGraphUtils.GraphBasicSettings.nodeRelSize * 0.6;
    const { x, y } = node;

    ctx.beginPath();
    // paint hexagon if node is a service (group center)
    if (node.id === node.group) {
      DependencyGraphUtils.DrawHexagon(x, y, r, ctx);
    } else {
      ctx.arc(
        x,
        y,
        DependencyGraphUtils.GraphBasicSettings.nodeRelSize,
        0,
        2 * Math.PI,
        false
      );
    }
    ctx.fill();

    let label = "";
    if (node.id === "null") {
      label = "EX";
    } else if (node.id === node.group) {
      label = "SRV";
    } else {
      label = "EP";
    }

    DependencyGraphUtils.DrawText(
      label,
      Color.fromHex(color)!.decideForeground()!.hex,
      node,
      ctx
    );
    if (label !== "EP") {
      DependencyGraphUtils.DrawText(node.name, "#000", node, ctx, 1.5);
    } else {
      let path = node.name;
      if (node.name.length > 30)
        path =
          path.substring(0, 15) + " ... " + path.substring(path.length - 15);
      DependencyGraphUtils.DrawText(path, "#000", node, ctx, 1.5);
    }
  }

  static PaintNodeRing(
    node: any,
    ctx: CanvasRenderingContext2D,
    highlight: boolean,
    focusNode: any
  ) {
    // add ring just for highlighted nodes
    if (highlight) {
      ctx.fillStyle = node === focusNode ? "navy" : "orange";
      const { x, y } = node;
      ctx.beginPath();
      if (node.id === node.group) {
        const r = DependencyGraphUtils.GraphBasicSettings.nodeRelSize * 0.85;
        DependencyGraphUtils.DrawHexagon(x, y, r, ctx);
      } else {
        ctx.arc(
          x,
          y,
          DependencyGraphUtils.GraphBasicSettings.nodeRelSize * 1.4,
          0,
          2 * Math.PI,
          false
        );
      }
      ctx.fill();
    }

    // paint underlying style on top of ring
    const color = Color.generateFromString(node.group);
    DependencyGraphUtils.PaintNode(node, color.hex, ctx);

  }

  static PaintNodeRingForShowDifference(
    node: any,
    ctx: CanvasRenderingContext2D,
    isAddedNode: boolean,
    isDeletedNode: boolean
  ) {
    // add ring just for difference nodes
    if (isAddedNode && isDeletedNode){
      // do nothing
    }
    else if(isAddedNode || isDeletedNode){
      if (isAddedNode){
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
      }
      else if(isDeletedNode){
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      }
      const { x, y } = node;
      ctx.beginPath();
      if (node.id === node.group) {
        const r = DependencyGraphUtils.GraphBasicSettings.nodeRelSize * 1;
        DependencyGraphUtils.DrawHexagon(x, y, r, ctx);
      } else {
        ctx.arc(
          x,
          y,
          DependencyGraphUtils.GraphBasicSettings.nodeRelSize * 1.65,
          0,
          2 * Math.PI,
          false
        );
      }
      ctx.fill();
    }

    // paint underlying style on top of ring
    const color = Color.generateFromString(node.group);
    DependencyGraphUtils.PaintNode(node, color.hex, ctx);
  }

  static ZoomOnClick(node: any, graphRef: any) {
    if (!graphRef.current) return;
    graphRef.current.centerAt(node.x, node.y, 800);
    graphRef.current.zoom(4, 1000);
  }
}

export { useHoverHighlight };

export { useGraphObsoleteNodes };

export { useGraphDifference };
