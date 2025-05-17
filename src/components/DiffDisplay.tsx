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
import ReactApexChart from "react-apexcharts";
import BarChartUtils from "../classes/BarChartUtils";
import { Element } from 'react-scroll';
import {
  DiffDependencyGraphFactory
} from "../classes/DiffDependencyGraphFactory";
import {
  useGraphDifference,
  DiffDisplayUtils,
} from "../classes/DiffDisplayUtils";
import {
  DependencyGraphUtils,
} from "../classes/DependencyGraphUtils";
import { TGraphData } from "../entities/TGraphData";
import { TTotalServiceInterfaceCohesion } from "../entities/TTotalServiceInterfaceCohesion";
import { TServiceCoupling } from "../entities/TServiceCoupling";
import { TServiceInstability } from "../entities/TServiceInstability";
import { TInsightDiffCohesion } from "../entities/TInsightDiffCohesion";
import { TInsightDiffCoupling } from "../entities/TInsightDiffCoupling";
import { TInsightDiffInstability } from "../entities/TInsightDiffInstability";
import TEndpointDataType from "../entities/TEndpointDataType";
import Loading from "./Loading";
import DiffComparatorService from "../services/DiffComparatorService";

const ForceGraph2D = lazy(() => import("react-force-graph-2d"));

type DiffDisplayProps = {
  olderVersionTag: string;
  newerVersionTag: string;
  latestVersionStr: string;
};
type VersionContext = {
  setEndpointGraphData: (data: any) => void;
  setGraphData: (data: any) => void;
  rawRef: React.MutableRefObject<string | undefined>;
  graphRef: React.MutableRefObject<any>;
  setCohesionData: (data: TTotalServiceInterfaceCohesion[]) => void;
  setCouplingData: (data: TServiceCoupling[]) => void;
  setInstabilityData: (data: TServiceInstability[]) => void;
  setEndpointDataTypesMap: (data: Record<string, TEndpointDataType>) => void;
};
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
    float: 'left',
  },
  graphTitle: {
    fontWeight: 'normal',
  },
  graphHeader: {
    borderBottom: '0.08em solid #ccc',
    boxShadow: '0.0em  0.4em 0.5em rgba(0, 0, 0, 0.1)',
    paddingLeft: '0.5em',
  },
  switch: {
    paddingLeft: "0.8em",
  },
}));
export default function DiffDisplay(props: DiffDisplayProps) {
  if (!props.newerVersionTag || !props.olderVersionTag) return <></>;
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

  // endpoint data types map
  const [olderEndpointDataTypesMap, setOlderEndpointDataTypesMap] = useState<Record<string, TEndpointDataType> | null>(null);
  const [newerEndpointDataTypesMap, setNewerEndpointDataTypesMap] = useState<Record<string, TEndpointDataType> | null>(null);

  // the diff graph data
  const diffGraphDataRef = useRef<any>();
  const rawDiffGraphDataRef = useRef<string>();
  // graph diff info
  const [diffGraphData, setDiffGraphData] = useState<any>();
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
  const [graphHeightRate, setCanvasHeightRate] = useState(0.8);


  const newerVersionContext: VersionContext = {
    setEndpointGraphData: setNewerEndpointGraphData,
    setGraphData: setNewerGraphData,
    rawRef: newerRawGraphDataRef,
    graphRef: newerGraphDataRef,
    setCohesionData: setNewerCohesionData,
    setCouplingData: setNewerCouplingData,
    setInstabilityData: setNewerInstabilityData,
    setEndpointDataTypesMap: setNewerEndpointDataTypesMap,
  };

  const olderVersionContext: VersionContext = {
    setEndpointGraphData: setOlderEndpointGraphData,
    setGraphData: setOlderGraphData,
    rawRef: olderRawGraphDataRef,
    graphRef: olderGraphDataRef,
    setCohesionData: setOlderCohesionData,
    setCouplingData: setOlderCouplingData,
    setInstabilityData: setOlderInstabilityData,
    setEndpointDataTypesMap: setOlderEndpointDataTypesMap,
  };

  /***useEffect for window size control***/
  useEffect(() => {
    const unsubscribe = [
      ViewportUtils.getInstance().subscribe(([vw]) => {
        setGridSize(vw > rwdWidth ? 6 : 12)
        setCanvasWidthRate(vw > rwdWidth ? 0.5 : 0.99);
        setCanvasHeightRate(vw > rwdWidth ? 0.8 : 0.8);
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


  /***  useEffect for diff  ***/
  useEffect(() => {
    fetchVersionData(
      olderVersionTag === latestVersionStr ? '' : olderVersionTag,
      olderVersionContext,
    );
  }, [olderVersionTag]);
  useEffect(() => {
    fetchVersionData(
      newerVersionTag === latestVersionStr ? '' : newerVersionTag,
      newerVersionContext,
    );
  }, [newerVersionTag]);

  useEffect(() => {

    if (
      newerEndpointGraphData &&
      olderEndpointGraphData &&
      olderEndpointDataTypesMap &&
      newerEndpointDataTypesMap
    ) {
      // console.log("newerEndpointGraphData=", newerEndpointGraphData);
      // console.log("olderEndpointGraphData", olderEndpointGraphData);
      const nextGraphDifferenceInfo = DiffDisplayUtils.CompareTwoGraphData(
        showEndpoint ? newerEndpointGraphData : DependencyGraphUtils.toServiceDependencyGraph(newerEndpointGraphData),
        showEndpoint ? olderEndpointGraphData : DependencyGraphUtils.toServiceDependencyGraph(olderEndpointGraphData),
        olderEndpointDataTypesMap,
        newerEndpointDataTypesMap
      );
      const nextDiffGraphData = JSON.stringify(nextGraphDifferenceInfo.diffGraphData);
      if (!rawDiffGraphDataRef.current) {
        const timer = setInterval(() => {
          if (!diffGraphDataRef.current) return;
          clearInterval(timer);
          setTimeout(() => {
            diffGraphDataRef.current.zoom(4, 0);
            diffGraphDataRef.current.centerAt(0, 0);
          }, 10);
        });
      }
      rawDiffGraphDataRef.current = nextDiffGraphData;

      // console.log("nextGraphDifferenceInfo",nextGraphDifferenceInfo);

      if (nextGraphDifferenceInfo && nextGraphDifferenceInfo.diffGraphData) {
        // console.log("nextDiffGraphData",nextDiffGraphData);
        setDiffGraphData(DependencyGraphUtils.ProcessData(JSON.parse(nextDiffGraphData)));
      }

      setGraphDifferenceInfo(nextGraphDifferenceInfo);
    }

  }, [
    newerEndpointGraphData,
    olderEndpointGraphData,
    newerEndpointDataTypesMap,
    olderEndpointDataTypesMap,
    showEndpoint,
  ]);


  //when switch showGraphDiff, zoom and center the graph.
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
      diffGraphDataRef.current.zoom(4, 0);
      diffGraphDataRef.current.centerAt(0, 0);
    }
  }, [showGraphDiff]);


  //insight diff
  useEffect(() => {
    const newDataDiff = DiffDisplayUtils.mergeCohesionDiffData(olderCohesionData, newerCohesionData);
    setCohesionDiff(newDataDiff);
  }, [olderCohesionData, newerCohesionData]);

  useEffect(() => {
    const newDataDiff = DiffDisplayUtils.mergeCouplingDiffData(olderCouplingData, newerCouplingData);
    setCouplingDiff(newDataDiff);
  }, [olderCouplingData, newerCouplingData]);

  useEffect(() => {
    const newDataDiff = DiffDisplayUtils.mergeInstabilityDiffData(olderInstabilityData, newerinstabilityData);
    setInstabilityDiff(newDataDiff);
  }, [olderInstabilityData, newerinstabilityData]);

  const fetchVersionData = async (
    tag: string, // empty string tag is latest version
    versionContext: VersionContext
  ) => {
    const data = await DiffComparatorService.getInstance().getTaggedDiffData(tag);

    // get raw graph data
    const endpointGraph = data.endpointGraph ? JSON.parse(JSON.stringify(data.endpointGraph)) : null;
    const showGraph = showEndpoint
      ? JSON.parse(JSON.stringify(data.endpointGraph))
      : JSON.parse(JSON.stringify(data.serviceGraph));

    // get raw insight data
    const cohesionData = data.cohesionData;
    const couplingData = data.couplingData;
    const instabilityData = data.instabilityData;

    // get raw endpointDataTypesMap data
    const endpointDataTypesMap = data.endpointDataTypes;

    // set graph data
    if (endpointGraph) {
      versionContext.setEndpointGraphData(endpointGraph);
    }
    if (showGraph) {
      const rawGraph = JSON.stringify(showGraph);
      if (versionContext.rawRef.current === rawGraph) return;
      if (!versionContext.rawRef.current) {
        const timer = setInterval(() => {
          if (!versionContext.graphRef.current) return;
          clearInterval(timer);
          setTimeout(() => {
            versionContext.graphRef.current.zoom(3, 0);
            versionContext.graphRef.current.centerAt(0, 0);
          }, 10);
        });
      }
      versionContext.rawRef.current = rawGraph;
      versionContext.setGraphData(DependencyGraphUtils.ProcessData(showGraph));
    }

    // set insight data 
    versionContext.setCohesionData(cohesionData);
    versionContext.setCouplingData(couplingData);
    versionContext.setInstabilityData(instabilityData);

    // set endpointDataTypesMap data
    versionContext.setEndpointDataTypesMap(endpointDataTypesMap);
  };

  return (
    <>
      {/* Graph diff*/}
      <Grid item xs={12}>
        <Element name="Graph Difference Title">
          <Typography variant="h6">
            Differences in Dependency Graph:&ensp;
            <span style={{ color: '#FFA500' }}>{olderVersionTag}</span>
            &ensp;vs&ensp;
            <span style={{ color: '#00a2ff' }}>{newerVersionTag}</span>
          </Typography>
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
      <Grid item xs={1} style={{ display: showGraphDiff ? 'block' : 'none' }}></Grid>
      <Grid item xs={10} style={{ display: showGraphDiff ? 'block' : 'none' }}>
        <div className={classes.graphContainer}>
          <Suspense fallback={<Loading />}>
            <ForceGraph2D
              ref={diffGraphDataRef}
              width={pageSize[0] * 10.0 / 12}
              height={pageSize[1] * graphHeightRate}
              graphData={diffGraphData}
              {...DiffDependencyGraphFactory.Create(
                graphDifferenceInfo,
                true,
              )}
            />
          </Suspense>
        </div>
      </Grid>
      <Grid item xs={1} style={{ display: showGraphDiff ? 'block' : 'none' }}></Grid>

      {/* Graph details*/}
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


      {/* Cohesion diff*/}
      <Grid item xs={12}>
        <Element name="Cohesion Difference Title">
          <Typography variant="h6">Differences in Service Cohesion</Typography>
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

      <Grid item xs={gridSize == 6 ? 3 : 0} style={{ display: showCohesionInsightDiffChart && gridSize == 6 ? 'block' : 'none' }}></Grid>
      <Grid item xs={gridSize - 0.5} style={{ display: showCohesionInsightDiffChart ? 'block' : 'none' }}>
        <ReactApexChart
          {...BarChartUtils.CreateDiffBarChart(
            "Service Cohesion",
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
      <Grid item xs={gridSize == 6 ? 3 : 0} style={{ display: showCohesionInsightDiffChart && gridSize == 6 ? 'block' : 'none' }}></Grid>

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
          <Typography variant="h6">Differences in Service Coupling</Typography>
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
      <Grid item xs={gridSize == 6 ? 3 : 0} style={{ display: showCouplingInsightDiffChart && gridSize == 6 ? 'block' : 'none' }}></Grid>
      <Grid item xs={gridSize - 0.5} style={{ display: showCouplingInsightDiffChart ? 'block' : 'none' }}>
        <ReactApexChart
          {...BarChartUtils.CreateDiffBarChart(
            "Service Coupling",
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
      <Grid item xs={gridSize == 6 ? 3 : 0} style={{ display: showCouplingInsightDiffChart && gridSize == 6 ? 'block' : 'none' }}></Grid>

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
          <Typography variant="h6">Differences in Service Instability</Typography>
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

      <Grid item xs={gridSize == 6 ? 3 : 0} style={{ display: showInstabilityInsightDiffChart && gridSize == 6 ? 'block' : 'none' }}></Grid>
      <Grid item xs={gridSize - 0.5} style={{ display: showInstabilityInsightDiffChart ? 'block' : 'none' }}>
        <ReactApexChart
          {...BarChartUtils.CreateDiffBarChart(
            "Service Instability",
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
      <Grid item xs={gridSize == 6 ? 3 : 0} style={{ display: showInstabilityInsightDiffChart && gridSize == 6 ? 'block' : 'none' }}></Grid>

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
