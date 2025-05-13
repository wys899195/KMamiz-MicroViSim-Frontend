import { DependencyGraphUtils } from "./DependencyGraphUtils";
import { DiffDisplayUtils, GraphDifferenceInfo } from "./DiffDisplayUtils";

export class DiffDependencyGraphFactory {
  private constructor() { }

  static Create(
    graphDifferenceInfo: GraphDifferenceInfo,
    showDiff: boolean
  ) {
    const { addedNodeIds, deletedNodeIds, addedLinkIds, deletedLinkIds } = graphDifferenceInfo;
    if (showDiff) {
      return {
        ...DependencyGraphUtils.GraphBasicSettings,
        linkDirectionalArrowLength: () => 3,
        linkWidth: (link: any) =>
          addedLinkIds.includes(DependencyGraphUtils.TLinkToId({ source: link.source.id, target: link.target.id }))
            || deletedLinkIds.includes(DependencyGraphUtils.TLinkToId({ source: link.source.id, target: link.target.id }))
            ? 1.5 : 1,
        linkDirectionalParticleWidth: (link: any) =>
          4,
        linkColor: (link: any) => {
          if (addedLinkIds.includes(DependencyGraphUtils.TLinkToId({ source: link.source.id, target: link.target.id }))) {
            return 'rgba(0, 255, 0, 1)';
          }
          if (deletedLinkIds.includes(DependencyGraphUtils.TLinkToId({ source: link.source.id, target: link.target.id }))) {
            return 'rgba(255, 0, 0, 1)';
          }
          return '';
        },
        linkLineDash: (link: any) => {
          if (deletedLinkIds.includes(DependencyGraphUtils.TLinkToId({ source: link.source.id, target: link.target.id }))) {
            return [2, 2];
          }
          return [];
        },

        nodeCanvasObject: (node: any, ctx: any) =>
          DiffDisplayUtils.PaintNodeRingForShowDifference(
            node,
            ctx,
            addedNodeIds.includes(node.id),
            deletedNodeIds.includes(node.id)
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
            false,
            false
          ),
        onNodeClick: (node: any) => { },
        onNodeHover: (node: any) => { },
        onLinkClick: (link: any) => { },
        onLinkHover: (link: any) => { },
      };
    }

  }
}
