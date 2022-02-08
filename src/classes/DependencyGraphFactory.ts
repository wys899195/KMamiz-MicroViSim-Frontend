import { DependencyGraphUtils, HighlightInfo } from "./DependencyGraphUtils";

export class DependencyGraphFactory {
  private constructor() {}

  static Create(
    highlightInfo: HighlightInfo,
    setHighlightInfo: (info: HighlightInfo) => void,
    graphRef: any
  ) {
    const { highlightLinks, highlightNodes, focusNode } = highlightInfo;
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
          focusNode
        ),
      onNodeClick: (node: any) => {
        // this.OnClick(node, graphRef);
        setHighlightInfo(this.HighlightOnNodeHover(node, highlightInfo));
      },
      onNodeHover: (node: any) => {},
      onLinkClick: (link: any) => {
        setHighlightInfo(this.HighlightOnLinkHover(link, highlightInfo));
      },
      onLinkHover: (link: any) => {},
      onNodeRightClick: () => {
        setHighlightInfo(this.ClearHighlight(highlightInfo));
      },
      onLinkRightClick: () => {
        setHighlightInfo(this.ClearHighlight(highlightInfo));
      },
      onBackgroundRightClick: () => {
        setHighlightInfo(this.ClearHighlight(highlightInfo));
      },
    };
  }

  static OnClick(node: any, graphRef: any) {
    DependencyGraphUtils.ZoomOnClick(node, graphRef);
  }

  static HighlightOnNodeHover(node: any, info: HighlightInfo): HighlightInfo {
    const { highlightNodes, highlightLinks } = this.ClearHighlight(info);
    if (node) {
      highlightNodes.add(node);
      node.highlight.forEach((n: any) => highlightNodes.add(n));
      node.links.forEach((l: any) => highlightLinks.add(l));
    }
    return { ...info, highlightNodes, highlightLinks, focusNode: node || null };
  }

  static HighlightOnLinkHover(link: any, info: HighlightInfo): HighlightInfo {
    const { highlightNodes, highlightLinks } = this.ClearHighlight(info);
    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }
    return { ...info, highlightNodes, highlightLinks };
  }

  static ClearHighlight(info: HighlightInfo): HighlightInfo {
    const { highlightNodes, highlightLinks } = info;
    highlightNodes.clear();
    highlightLinks.clear();
    return { ...info, highlightNodes, highlightLinks };
  }
}
