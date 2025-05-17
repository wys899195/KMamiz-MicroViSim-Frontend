import { DependencyGraphUtils } from "./DependencyGraphUtils";
import { DiffDisplayUtils, GraphDifferenceInfo } from "./DiffDisplayUtils";

export class DiffDependencyGraphFactory {
  private constructor() { }

  static Create(
    graphDifferenceInfo: GraphDifferenceInfo,
    showDiff: boolean
  ) {
    const { addedNodeIds, deletedNodeIds, addedLinkIds, deletedLinkIds, changedEndpointNodesId } = graphDifferenceInfo;
    const getNodeRingType = (nodeId: string): "added" | "deleted" | "changed" | "default" => {
      if (addedNodeIds.includes(nodeId)) return "added";
      if (deletedNodeIds.includes(nodeId)) return "deleted";
      if (changedEndpointNodesId.includes(nodeId)) return "changed";
      return "default";
    };
    const getLinkId = (link: any): string =>
      DependencyGraphUtils.TLinkToId({ source: link.source.id, target: link.target.id });


    if (showDiff) {
      return {
        ...DependencyGraphUtils.GraphBasicSettings,
        linkDirectionalArrowLength: () => 3,
        linkWidth: (link: any) =>
          addedLinkIds.includes(getLinkId(link))
            || deletedLinkIds.includes(getLinkId(link))
            ? 1.5 : 1,
        linkDirectionalParticleWidth: (link: any) =>
          4,
        linkColor: (link: any) => {
          if (addedLinkIds.includes(getLinkId(link))) {
            return 'rgba(0, 255, 0, 1)';
          }
          if (deletedLinkIds.includes(getLinkId(link))) {
            return 'rgba(255, 0, 0, 1)';
          }
          return '';
        },
        linkLineDash: (link: any) => {
          if (deletedLinkIds.includes(getLinkId(link))) {
            return [2, 2];
          }
          return [];
        },

        nodeCanvasObject: (node: any, ctx: any) =>
          DiffDisplayUtils.PaintNodeRingForShowDifference(
            node,
            ctx,
            getNodeRingType(node.id)
          ),

        onNodeClick: (node: any) => { },
        onNodeHover: (node: any) => { },
        onLinkClick: (link: any) => { },
        onLinkHover: (link: any) => { },
      };
    } else {
      return {
        ...DependencyGraphUtils.GraphBasicSettings,
        linkDirectionalArrowLength: 3,
        linkWidth: 1,
        linkDirectionalParticleWidth: 4,
        nodeCanvasObject: (node: any, ctx: any) =>
          DiffDisplayUtils.PaintNodeRingForShowDifference(
            node,
            ctx,
            "default"
          ),
        onNodeClick: (node: any) => { },
        onNodeHover: (node: any) => { },
        onLinkClick: (link: any) => { },
        onLinkHover: (link: any) => { },
      };
    }

  }
}
