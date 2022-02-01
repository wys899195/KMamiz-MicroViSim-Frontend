import { DependencyGraphUtils, HighlightInfo } from "./DependencyGraphUtils";

export class DependencyGraphFactory {
  private constructor() {}

  static Create(
    highlightInfo: HighlightInfo,
    setHighlightInfo: (info: HighlightInfo) => void,
    graphRef: any
  ) {
    const { highlightLinks, highlightNodes, hoverNode } = highlightInfo;
    return {
      ...DependencyGraphUtils.GraphBasicSettings,
      linkDirectionalArrowLength: (link: any) =>
        highlightLinks.has(link) ? 6 : 3,
      linkWidth: (link: any) => (highlightLinks.has(link) ? 7 : 1),
      linkDirectionalParticleWidth: (link: any) =>
        highlightLinks.has(link) ? 6 : 4,
      nodeCanvasObject: (node: any, ctx: any) =>
        DependencyGraphUtils.PaintNodeRing(
          node,
          ctx,
          highlightNodes.has(node),
          hoverNode
        ),
      onNodeClick: (node: any) => {
        this.OnClick(node, graphRef);
      },
      onNodeHover: (node: any) => {
        setHighlightInfo(this.HandleNodeHover(node, highlightInfo));
      },
      onLinkHover: (link: any) => {
        setHighlightInfo(this.HandleLinkHover(link, highlightInfo));
      },
    };
  }

  static OnClick(node: any, graphRef: any) {
    DependencyGraphUtils.ZoomOnClick(node, graphRef);
  }

  static HandleLinkHover(link: any, info: HighlightInfo): HighlightInfo {
    const { highlightNodes, highlightLinks } = info;
    highlightNodes.clear();
    highlightLinks.clear();
    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }
    return { ...info, highlightNodes, highlightLinks };
  }

  static HandleNodeHover(node: any, info: HighlightInfo): HighlightInfo {
    const { highlightNodes, highlightLinks } = info;
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      node.neighbors.forEach((neighbor: any) => highlightNodes.add(neighbor));
      node.links.forEach((link: any) => highlightLinks.add(link));
    }
    return { ...info, highlightNodes, highlightLinks, hoverNode: node || null };
  }
}
