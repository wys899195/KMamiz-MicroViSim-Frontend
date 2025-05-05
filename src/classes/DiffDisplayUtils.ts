import { Dispatch, SetStateAction, useState } from "react";
import { TGraphData } from "../entities/TGraphData";
import { Color } from "./ColorUtils";
import {DependencyGraphUtils} from "./DependencyGraphUtils"

import { TTotalServiceInterfaceCohesion } from "../entities/TTotalServiceInterfaceCohesion";
import { TServiceCoupling } from "../entities/TServiceCoupling";
import { TServiceInstability } from "../entities/TServiceInstability";
import { TInsightDiffCohesion } from "../entities/TInsightDiffCohesion";
import { TInsightDiffCoupling } from "../entities/TInsightDiffCoupling";
import { TInsightDiffInstability } from "../entities/TInsightDiffInstability";

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

export class DiffDisplayUtils {
  private constructor() {}

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
        newData = DependencyGraphUtils.toServiceDependencyGraph(newData);
        oldData = DependencyGraphUtils.toServiceDependencyGraph(oldData);
      }

      // ids of all nodes
      const nodeIdsInNewData: string[] = newData.nodes.map(node => node.id);
      const nodeIdsInOldData: string[] = oldData.nodes.map(node => node.id);
      const addedNodeIds: Set<string> = new Set(nodeIdsInNewData.filter(id => !nodeIdsInOldData.includes(id)));
      const deletedNodeIds: Set<string> = new Set(nodeIdsInOldData.filter(id => !nodeIdsInNewData.includes(id)));

      // ids of all links excluding external nodes
      const linkIdsInNewData: string[] = newData.links.map(link => DependencyGraphUtils.TLinkToId(link));
      const linkIdsInOldData: string[] = oldData.links.map(link => DependencyGraphUtils.TLinkToId(link));
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
          .filter(link => deletedLinkIds.has(DependencyGraphUtils.TLinkToId(link)))
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
        const r = DependencyGraphUtils.GraphBasicSettings.nodeRelSize * 0.85;
        DependencyGraphUtils.DrawHexagon(x, y, r, ctx);
      } else {
        ctx.arc(
          x,
          y,
          DependencyGraphUtils.GraphBasicSettings.nodeRelSize * 1.45,
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

  static mergeCohesionDiffData = (
    datav1: TTotalServiceInterfaceCohesion[],
    datav2: TTotalServiceInterfaceCohesion[]
  ): TInsightDiffCohesion[] => {
    const allServiceNames = new Set([
      ...datav1.map(item => item.name),
      ...datav2.map(item => item.name),
    ]);
    const mergedData: TInsightDiffCohesion[] = [];

    allServiceNames.forEach(serviceName => {
      const v1 = datav1.find(item => item.name === serviceName) || {
        uniqueServiceName: serviceName,
        name: serviceName,
        dataCohesion: 0,
        usageCohesion: 0,
        totalInterfaceCohesion: 0,
        endpointCohesion: [],
        totalEndpoints: 0,
        consumers: []
      };
      const v2 = datav2.find(item => item.name === serviceName) || {
        uniqueServiceName: serviceName,
        name: serviceName,
        dataCohesion: 0,
        usageCohesion: 0,
        totalInterfaceCohesion: 0,
        endpointCohesion: [],
        totalEndpoints: 0,
        consumers: []
      };
      const diff: TInsightDiffCohesion = {
        uniqueServiceName: serviceName,
        name: serviceName,
        dataCohesionV1: v1.dataCohesion,
        usageCohesionV1: v1.usageCohesion,
        totalInterfaceCohesionV1: v1.totalInterfaceCohesion,
        dataCohesionV2: v2.dataCohesion,
        usageCohesionV2: v2.usageCohesion,
        totalInterfaceCohesionV2: v2.totalInterfaceCohesion
      };
      mergedData.push(diff);
    });
    return mergedData;
  };

  static mergeCouplingDiffData = (
    datav1: TServiceCoupling[],
    datav2: TServiceCoupling[]
  ): TInsightDiffCoupling[] => {
    const allServiceNames = new Set([
      ...datav1.map(item => item.name),
      ...datav2.map(item => item.name),
    ]);

    const mergedData: TInsightDiffCoupling[] = [];

    allServiceNames.forEach(serviceName => {
      const v1 = datav1.find(item => item.name === serviceName) || {
        uniqueServiceName: serviceName,
        name: serviceName,
        ais: 0,
        ads: 0,
        acs: 0,
      };
      const v2 = datav2.find(item => item.name === serviceName) || {
        uniqueServiceName: serviceName,
        name: serviceName,
        ais: 0,
        ads: 0,
        acs: 0,
      };

      const diff: TInsightDiffCoupling = {
        uniqueServiceName: serviceName,
        name: serviceName,
        aisV1: v1.ais,
        adsV1: v1.ads,
        acsV1: v1.acs,
        aisV2: v2.ais,
        adsV2: v2.ads,
        acsV2: v2.acs,
      };

      mergedData.push(diff);
    });
    return mergedData;
  };

  static mergeInstabilityDiffData = (
    datav1: TServiceInstability[],
    datav2: TServiceInstability[]
  ): TInsightDiffInstability[] => {
    const allServiceNames = new Set([
      ...datav1.map(item => item.name),
      ...datav2.map(item => item.name),
    ]);

    const mergedData: TInsightDiffInstability[] = [];

    allServiceNames.forEach(serviceName => {
      const v1 = datav1.find(item => item.name === serviceName) || {
        uniqueServiceName: serviceName,
        name: serviceName,
        dependingBy: 0,
        dependingOn: 0,
        instability: 0,
      };

      const v2 = datav2.find(item => item.name === serviceName) || {
        uniqueServiceName: serviceName,
        name: serviceName,
        dependingBy: 0,
        dependingOn: 0,
        instability: 0,
      };

      const diff: TInsightDiffInstability = {
        uniqueServiceName: serviceName,
        name: serviceName,
        dependingByV1: v1.dependingBy,
        dependingOnV1: v1.dependingOn,
        instabilityV1: v1.instability,
        dependingByV2: v2.dependingBy,
        dependingOnV2: v2.dependingOn,
        instabilityV2: v2.instability,
      };

      mergedData.push(diff);
    });

    return mergedData;
  };

}

export { useGraphDifference };
