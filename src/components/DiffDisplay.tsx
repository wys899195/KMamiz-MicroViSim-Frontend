import {
  Card, FormControlLabel, FormGroup, Switch, Grid, Typography

} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ViewportUtils from "../classes/ViewportUtils";
import GraphService from "../services/GraphService";
import ReactApexChart from "react-apexcharts";
import BarChartUtils from "../classes/BarChartUtils";
import { Element } from 'react-scroll';
import { 
  DiffDependencyGraphFactory
} from "../classes/DiffDependencyGraphFactory";
import {
  useGraphDifference,
  DependencyGraphUtils,
} from "../classes/DependencyGraphUtils";

import { TGraphData } from "../entities/TGraphData";
import { TTotalServiceInterfaceCohesion } from "../entities/TTotalServiceInterfaceCohesion";
import { TServiceCoupling } from "../entities/TServiceCoupling";
import { TServiceInstability } from "../entities/TServiceInstability";
import { TInsightDiffCohesion } from "../entities/TInsightDiffCohesion";
import { TInsightDiffCoupling } from "../entities/TInsightDiffCoupling";
import { TInsightDiffInstability } from "../entities/TInsightDiffInstability";
import Loading from "./Loading";

const CodeDisplay = lazy(() => import("./CodeDisplay"));
const InterfaceDiffDisplay = lazy(() => import("./InterfaceDiffDisplay"));
const ForceGraph2D = lazy(() => import("react-force-graph-2d"));

type DiffDisplayProps = {
  olderVersionTag: string;
  newerVersionTag: string;
  latestVersionStr: string;
};
type SchemaItem = { req: string; res: string; id: number; bounded?: boolean };




const useStyles = makeStyles(() => ({
  actions: {
    height: "3em",
    display: "flex",
    flexDirection: "row",
    placeItems: "center",
    justifyContent: "center",
    gap: "1em",
    padding: "1em",
  },
  graphContainer: {
    border: '0.08em solid #ccc',
    boxShadow: '0.4em 0em 0.5em rgba(0, 0, 0, 0.1)',
    float:'left',
  },
  graphTitle: {
    fontWeight:'normal',
  },
  graphHeader: {
    borderBottom: '0.08em solid #ccc',
    boxShadow: '0.0em  0.4em 0.5em rgba(0, 0, 0, 0.1)',
    paddingLeft:'0.5em',
  },
  switch: {
    paddingLeft: "0.8em",
  },
}));
export default function DiffDisplay(props: DiffDisplayProps) {
  if ( !props.newerVersionTag || !props.olderVersionTag) return <></>;
  console.log("props:",props)
  const classes = useStyles();
  const olderVersionTag = props.olderVersionTag;
  const newerVersionTag = props.newerVersionTag;
  const latestVersionStr = props.latestVersionStr;

  /***  graph ***/
  // the older version graph data
  const olderGraphDataRef = useRef<any>();
  const olderRawGraphDataRef = useRef<string>();
  const [olderGraphData, setOlderGraphData] = useState<any>();
  const [olderEndpointGraphData, setOlderEndpointGraphData] = useState<TGraphData | null>(null);
  //the newer version graph data
  const newerGraphDataRef = useRef<any>();
  const newerRawGraphDataRef = useRef<string>();
  const [newerGraphData, setNewerGraphData] = useState<any>();
  const [newerEndpointGraphData, setNewerEndpointGraphData] = useState<TGraphData | null>(null);
  // the diff graph data
  const diffGraphDataRef = useRef<any>();
  const rawDiffGraphDataRef = useRef<string>();
  // graph diff info
  const [diffGraphData, setDiffGraphData] = useState<any>();
  const [rawDiffGraphData, setRawDiffGraphData] = useState<TGraphData | null>(null);
  const [graphDifferenceInfo, setGraphDifferenceInfo] = useGraphDifference();

  // graph display control
  const [showEndpoint, setShowEndpoint] = useState(true);
  const [showGraphDiff, setShowGraphDiff] = useState(true);
  


  /*** insight ***/
  //the older version insight data
  const [olderCohesionData, setOlderCohesionData] = useState<TTotalServiceInterfaceCohesion[]>([]);
  const [olderCouplingData, setOlderCouplingData] = useState<TServiceCoupling[]>([]);
  const [olderInstabilityData, setOlderInstabilityData] = useState<TServiceInstability[]>([]);
  //the newer version insight data
  const [newerCohesionData, setNewerCohesionData] = useState<TTotalServiceInterfaceCohesion[]>([]);
  const [newerCouplingData, setNewerCouplingData] = useState<TServiceCoupling[]>([]);
  const [newerinstabilityData, setNewerInstabilityData] = useState<TServiceInstability[]>([]);
  // insight diff data
  const [cohesionDiff, setCohesionDiff] = useState<TInsightDiffCohesion[]>([]);
  const [couplingDiff, setCouplingDiff] = useState<TInsightDiffCoupling[]>([]);
  const [instabilityDiff, setInstabilityDiff] = useState<TInsightDiffInstability[]>([]);
  const [showCohesionInsightDiffChart, setShowCohesionInsightDiffChart] = useState(true);
  const [showCouplingInsightDiffChart, setShowCouplingInsightDiffChart] = useState(true);
  const [showInstabilityInsightDiffChart, setShowInstabilityInsightDiffChart] = useState(true);


  /***window size control***/
  const rwdWidth = 1300
  const [pageSize, setPageSize] = useState([0, 0]);
  const [gridSize, setGridSize] = useState(12);
  const [graphWidthRate, setCanvasWidthRate] = useState(0.5);
  const [graphHeightRate, setCanvasHeightRate] = useState(0.75);


  /***useEffect for window size control***/
  useEffect(() => {
    const unsubscribe = [
      ViewportUtils.getInstance().subscribe(([vw]) =>{
        setGridSize(vw > rwdWidth ? 6 : 12)
        setCanvasWidthRate(vw > rwdWidth ? 0.5 : 0.99);
        setCanvasHeightRate(vw > rwdWidth ? 0.8 : 0.65);
      }),
    ];
    return () => {
      unsubscribe.forEach((un) => un());
    };
  }, []);
  useLayoutEffect(() => {
    const unsubscribe = [
      ViewportUtils.getInstance().subscribe(([vw, vh]) =>
        setPageSize([vw, vh])
      ),
    ];
    return () => {
      unsubscribe.forEach((un) => un());
    };
  }, []);

  /***  useEffect for graph diff  ***/
  //the older version
  useEffect(() => {
    GraphService.getInstance().getTaggedDependencyGraph(true,olderVersionTag).then((nextRawDataV2) => {
      if (nextRawDataV2){
        setOlderEndpointGraphData(nextRawDataV2);
      }
    });
    GraphService.getInstance().getTaggedDependencyGraph(showEndpoint,olderVersionTag).then((nextOlderGraphData) => {
      if (nextOlderGraphData){
        const nextRawOlderGraphData = JSON.stringify(nextOlderGraphData);
        if (olderRawGraphDataRef.current === nextRawOlderGraphData) return;
        if (!olderRawGraphDataRef.current) {
          const timer = setInterval(() => {
            if (!olderGraphDataRef.current) return;
            clearInterval(timer);
            setTimeout(() => {
              olderGraphDataRef.current.zoom(3, 0);
              olderGraphDataRef.current.centerAt(0, 0);
            }, 10);
          });
        }
        olderRawGraphDataRef.current = nextRawOlderGraphData;
        ;
        setOlderGraphData(DependencyGraphUtils.ProcessData(nextOlderGraphData));
      }
    });
  }, [showEndpoint,olderVersionTag]);
  //the newer version
  useEffect(() => {
    GraphService.getInstance().getTaggedDependencyGraph(true,newerVersionTag).then((nextNewerEndpointGraphData) => {
      if (nextNewerEndpointGraphData){
        setNewerEndpointGraphData(nextNewerEndpointGraphData);
      }
    });
    GraphService.getInstance().getTaggedDependencyGraph(showEndpoint,newerVersionTag).then((nextNewerGraphData) => {
      if (nextNewerGraphData){
        const nextRawNewerGraphData = JSON.stringify(nextNewerGraphData);
        if (newerRawGraphDataRef.current === nextRawNewerGraphData) return;
        if (!newerRawGraphDataRef.current) {
          const timer = setInterval(() => {
            if (!newerGraphDataRef.current) return;
            clearInterval(timer);
            setTimeout(() => {
              newerGraphDataRef.current.zoom(3, 0);
              newerGraphDataRef.current.centerAt(0, 0);
            }, 10);
          });
        }
        newerRawGraphDataRef.current = nextRawNewerGraphData;
        setNewerGraphData(DependencyGraphUtils.ProcessData(nextNewerGraphData));
      }
    });
  }, [showEndpoint,newerVersionTag]);
  //graph diff 
  useEffect(() => {
    if (!showGraphDiff && newerGraphDataRef.current) {
      newerGraphDataRef.current.zoom(3, 0);
      newerGraphDataRef.current.centerAt(0, 0);
    }
    if (!showGraphDiff && olderGraphDataRef.current) {
      olderGraphDataRef.current.zoom(3, 0);
      olderGraphDataRef.current.centerAt(0, 0);
    }
    if (showGraphDiff && diffGraphDataRef.current) {
      diffGraphDataRef.current.zoom(3, 0);
      diffGraphDataRef.current.centerAt(0, 0);
    }
  }, [showGraphDiff]);
  useEffect(() => {
    if(newerEndpointGraphData && olderEndpointGraphData){
      console.log("newerEndpointGraphData):",newerEndpointGraphData);
      console.log("olderEndpointGraphData:",olderEndpointGraphData);
      const nextGraphDifferenceInfo = DependencyGraphUtils.CompareTwoGraphData(newerEndpointGraphData,olderEndpointGraphData,showEndpoint) ;
      const nextDiffGraphData = JSON.stringify(nextGraphDifferenceInfo.diffGraphData);
      if (!rawDiffGraphDataRef.current) {
        const timer = setInterval(() => {
          if (!diffGraphDataRef.current) return;
          clearInterval(timer);
          setTimeout(() => {
            diffGraphDataRef.current.zoom(3, 0);
            diffGraphDataRef.current.centerAt(0, 0);
          }, 10);
        });
      }
      rawDiffGraphDataRef.current = nextDiffGraphData;

      if (nextGraphDifferenceInfo && nextGraphDifferenceInfo.diffGraphData){
        setDiffGraphData(DependencyGraphUtils.ProcessData(JSON.parse(nextDiffGraphData)));
      }
     
      setGraphDifferenceInfo(nextGraphDifferenceInfo);
    }
  }, [newerEndpointGraphData,olderEndpointGraphData,showEndpoint]);

  
  /***useEffect for insight diff***/
  //the older version
  useEffect(() => {
    //Cohesion
    GraphService.getInstance().getTaggedServiceCohesion(olderVersionTag).then((nextCohesionDataV2) => {
      if (nextCohesionDataV2){
        setOlderCohesionData(nextCohesionDataV2);
      }
    }); 
    //Coupling
    GraphService.getInstance().getTaggedServiceCoupling(olderVersionTag).then((nextCouplingDataV2) => {
      if (nextCouplingDataV2){
        setOlderCouplingData(nextCouplingDataV2);
      }
    });
    //Instability
    GraphService.getInstance().getTaggedServiceInstability(olderVersionTag).then((nextInstabilityDataV2) => {
      if (nextInstabilityDataV2){
        setOlderInstabilityData(nextInstabilityDataV2);
      }
    }); 
  }, [olderVersionTag]);
  //the newer version
  useEffect(() => {
    //Cohesion
    GraphService.getInstance().getTaggedServiceCohesion(newerVersionTag).then((nextNewerCohesionData) => {
      if (nextNewerCohesionData){
        setNewerCohesionData(nextNewerCohesionData);
      }
    });
    //Coupling
    GraphService.getInstance().getTaggedServiceCoupling(newerVersionTag).then((nextNewerCouplingData) => {
      if (nextNewerCouplingData){
        setNewerCouplingData(nextNewerCouplingData);
      }
    }); 
    //Instability
    GraphService.getInstance().getTaggedServiceInstability(newerVersionTag).then((nextNewerInstabilityData) => {
      if (nextNewerInstabilityData){
        setNewerInstabilityData(nextNewerInstabilityData);
      }
    });
  }, [newerVersionTag]);

  //insight diff
  useEffect(() => {
    const newDataDiff = mergeCohesionData(olderCohesionData,newerCohesionData);
    setCohesionDiff(newDataDiff);
  }, [olderCohesionData,newerCohesionData]); 

  useEffect(() => {
    const newDataDiff = mergeCouplingData(olderCouplingData,newerCouplingData);
    setCouplingDiff(newDataDiff);
  }, [olderCouplingData,newerCouplingData]); 
  
  useEffect(() => {
    const newDataDiff = mergeInstabilityData(olderInstabilityData,newerinstabilityData);
    setInstabilityDiff(newDataDiff);
  }, [olderInstabilityData,newerinstabilityData]); 


  const mergeCohesionData = (
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

  const mergeCouplingData = (
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
  
  const mergeInstabilityData = (
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
  


  return (
    <>
      {/* Graph diff*/}
      <Grid item xs={12} >
        <Element name="Graph Difference Title">
          <Typography variant="h6">Dependency Graph (Differences between the two versions: {olderVersionTag} and {newerVersionTag})</Typography>
        </Element>
      </Grid>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-start", gap: "0.5em" }}>
        <Card className={classes.switch}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showGraphDiff}
                  onChange={(e) => setShowGraphDiff(e.target.checked)}
                />
              }
              label="Show difference"
            />
          </FormGroup>
        </Card>
        <Card className={classes.switch}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showEndpoint}
                  onChange={(e) => setShowEndpoint(e.target.checked)}
                />
              }
              label="Show endpoints"
            />
          </FormGroup>
        </Card>
      </Grid>
      <Grid item xs={gridSize} style={{ display: showGraphDiff ? 'block' : 'none' }}>
        <div className={classes.graphContainer}>
          <Suspense fallback={<Loading />}>
            <ForceGraph2D
              ref={diffGraphDataRef}
              width={pageSize[0] - 40}
              height={pageSize[1] * graphHeightRate - 40}
              graphData={diffGraphData}
              {...DiffDependencyGraphFactory.Create(
                graphDifferenceInfo,
                true,
              )}
            />
          </Suspense>
        </div>
      </Grid>

      {/* Graph details*/}
      <Grid item xs={gridSize} style={{ display: showGraphDiff ? 'none' : 'block' }}>
        <div className={classes.graphContainer}>
          <Grid item xs={12} className={classes.graphHeader}>
            <h3 className={classes.graphTitle}>{newerVersionTag || latestVersionStr}</h3>
          </Grid>
          <Suspense fallback={<Loading />}>
            <ForceGraph2D
              ref={newerGraphDataRef}
              width={pageSize[0] * graphWidthRate - 20}
              height={pageSize[1] * graphHeightRate - 40}
              graphData={newerGraphData}
              {...DiffDependencyGraphFactory.Create(
                graphDifferenceInfo,
                false,
              )}
            />
          </Suspense>
        </div>
      </Grid>
      <Grid item xs={gridSize} style={{ display: showGraphDiff ? 'none' : 'block' }}>
        <div className={classes.graphContainer}>
          <Grid item xs={12} className={classes.graphHeader}>
            <h3 className={classes.graphTitle}>{olderVersionTag || latestVersionStr}</h3>
          </Grid>
          <Suspense fallback={<Loading />}>
            <ForceGraph2D
              ref={olderGraphDataRef}
              width={pageSize[0] * graphWidthRate - 20}
              height={pageSize[1] * graphHeightRate - 40}
              graphData={olderGraphData}
              {...DiffDependencyGraphFactory.Create(
                graphDifferenceInfo,
                false,
              )}
            />
          </Suspense>
        </div>
      </Grid>

      {/* Cohesion diff*/}
      <Grid item xs={12}>
        <Element name="Cohesion Difference Title">
          <Typography variant="h6">Service Cohesion Difference</Typography>
        </Element>
      </Grid>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-start", gap: "0.5em" }}>
        <Card className={classes.switch}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showCohesionInsightDiffChart}
                  onChange={(e) => setShowCohesionInsightDiffChart(e.target.checked)}
                />
              }
              label="Show difference"
            />
          </FormGroup>
        </Card>
      </Grid>

      <Grid item xs={gridSize==6?3:0} style={{ display: showCohesionInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid> 
      <Grid item xs={gridSize - 0.5} style={{ display: showCohesionInsightDiffChart ? 'block' : 'none' }}>
      <ReactApexChart
          {...BarChartUtils.CreateDiffBarChart( 
            "Service Cohesion", 
            "(Differences between the two versions)",
            cohesionDiff,
            BarChartUtils.SeriesFromServiceCohesionDiff, 
            olderVersionTag || latestVersionStr, 
            newerVersionTag || latestVersionStr,
            false,
            BarChartUtils.ServiceCohesionDiffOpts( 
              cohesionDiff,
              olderVersionTag || latestVersionStr,
              newerVersionTag || latestVersionStr,
            )
          )}
        ></ReactApexChart> 
      </Grid>
      <Grid item xs={gridSize==6?3:0} style={{ display: showCohesionInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid>

      {/* Cohesion details*/}
      <Grid item xs={gridSize - 0.5} style={{ display: showCohesionInsightDiffChart ? 'none' : 'block' }}>
        <ReactApexChart
          {...BarChartUtils.CreateBarChart(
            `Service Cohesion (${olderVersionTag || latestVersionStr})`,
            olderCohesionData,
            BarChartUtils.SeriesFromServiceCohesion,
            true,
            BarChartUtils.ServiceCohesionOpts(olderCohesionData)
          )}
        ></ReactApexChart>
      </Grid>
      <Grid item xs={1} style={{ display: showCohesionInsightDiffChart ? 'none' : 'block' }}></Grid>
      <Grid item xs={gridSize - 0.5} style={{ display: showCohesionInsightDiffChart ? 'none' : 'block' }} >
        <ReactApexChart
          {...BarChartUtils.CreateBarChart(
            `Service Cohesion (${newerVersionTag || latestVersionStr})`,
            newerCohesionData,
            BarChartUtils.SeriesFromServiceCohesion,
            true,
            BarChartUtils.ServiceCohesionOpts(newerCohesionData)
          )}
        ></ReactApexChart>
      </Grid>

      {/* Coupling diff*/}
      <Grid item xs={12}>
        <Element name="Coupling Difference Title">
          <Typography variant="h6">Service Coupling Difference</Typography>
        </Element>
      </Grid>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-start", gap: "0.5em" }}>
        <Card className={classes.switch}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showCouplingInsightDiffChart}
                  onChange={(e) => setShowCouplingInsightDiffChart(e.target.checked)}
                />
              }
              label="Show difference"
            />
          </FormGroup>
        </Card>
      </Grid>
      <Grid item xs={gridSize==6?3:0} style={{ display: showCouplingInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid>
      <Grid item xs={gridSize - 0.5} style={{ display: showCouplingInsightDiffChart ? 'block' : 'none' }}>
      <ReactApexChart
          {...BarChartUtils.CreateDiffBarChart( 
            "Service Coupling", 
            "(Differences between the two versions)",
            couplingDiff,
            BarChartUtils.SeriesFromServiceCouplingDiff, 
            olderVersionTag || latestVersionStr, 
            newerVersionTag || latestVersionStr,
            false,
            BarChartUtils.ServiceCouplingDiffOpts(  
              couplingDiff,
              olderVersionTag || latestVersionStr, 
              newerVersionTag || latestVersionStr,
            )
          )}
        ></ReactApexChart> 
      </Grid>
      <Grid item xs={gridSize==6?3:0} style={{ display: showCouplingInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid> 

      {/* Coupling details*/}
      <Grid item xs={gridSize - 0.5} style={{ display: showCouplingInsightDiffChart ? 'none' : 'block' }}>
        <ReactApexChart
          {...BarChartUtils.CreateBarChart(
            `Service Coupling (${olderVersionTag || latestVersionStr})`,
            olderCouplingData,
            BarChartUtils.SeriesFromServiceCoupling,
            true,
            BarChartUtils.ServiceCouplingOpts(olderCouplingData)
          )}
        ></ReactApexChart>
      </Grid>
      <Grid item xs={1} style={{ display: showCouplingInsightDiffChart ? 'none' : 'block' }}></Grid>
      <Grid item xs={gridSize - 0.5} style={{ display: showCouplingInsightDiffChart ? 'none' : 'block' }}>
        <ReactApexChart
          {...BarChartUtils.CreateBarChart(
            `Service Coupling (${newerVersionTag || latestVersionStr})`,
            newerCouplingData,
            BarChartUtils.SeriesFromServiceCoupling,
            true,
            BarChartUtils.ServiceCouplingOpts(newerCouplingData)
          )}
        ></ReactApexChart>
      </Grid>

      {/* Instabilitydiff*/}
      <Grid item xs={12}>
        <Element name="Instability Difference Title">
          <Typography variant="h6">Service Instability Difference</Typography>
        </Element>
      </Grid>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-start", gap: "0.5em" }}>
        <Card className={classes.switch}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showInstabilityInsightDiffChart}
                  onChange={(e) => setShowInstabilityInsightDiffChart(e.target.checked)}
                />
              }
              label="Show difference"
            />
          </FormGroup>
        </Card>
      </Grid>

      <Grid item xs={gridSize==6?3:0} style={{ display: showInstabilityInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid>
      <Grid item xs={gridSize - 0.5} style={{ display: showInstabilityInsightDiffChart ? 'block' : 'none' }}>
      <ReactApexChart
          {...BarChartUtils.CreateDiffBarChart( 
            "Service Instability", 
            "(Differences between the two versions)",
            instabilityDiff,
            BarChartUtils.SeriesFromServiceInstabilityDiff, 
            olderVersionTag || latestVersionStr, 
            newerVersionTag || latestVersionStr, 
            false,
            BarChartUtils.ServiceInstabilityDiffOpts(
              instabilityDiff,
              olderVersionTag || latestVersionStr, 
              newerVersionTag || latestVersionStr, 
            )
          )}
        ></ReactApexChart> 
      </Grid>
      <Grid item xs={gridSize==6?3:0} style={{ display: showInstabilityInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid> 

      {/* Instability details*/}
      <Grid item xs={gridSize - 0.5} style={{ display: showInstabilityInsightDiffChart ? 'none' : 'block' }}>
        <ReactApexChart
          {...BarChartUtils.CreateBarChart(
            `Service Instability (${olderVersionTag || latestVersionStr})`,
            olderInstabilityData,
            BarChartUtils.SeriesFromServiceInstability,
            false,
            BarChartUtils.ServiceInstabilityOpts(olderInstabilityData)
          )}
        ></ReactApexChart>
      </Grid>
      <Grid item xs={1} style={{ display: showInstabilityInsightDiffChart ? 'none' : 'block' }}></Grid>
      <Grid item xs={gridSize - 0.5} style={{ display: showInstabilityInsightDiffChart ? 'none' : 'block' }}>
        <ReactApexChart
          {...BarChartUtils.CreateBarChart(
            `Service Instability (${newerVersionTag || latestVersionStr})`,
            newerinstabilityData,
            BarChartUtils.SeriesFromServiceInstability,
            false,
            BarChartUtils.ServiceInstabilityOpts(newerinstabilityData)
          )}
        ></ReactApexChart>
      </Grid>

    </>
  );
}
