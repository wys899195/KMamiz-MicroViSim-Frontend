import {
  Card, FormControlLabel, FormGroup, Switch, Grid, Typography, Box, Tooltip
  , List, ListItem, ListItemIcon, ListItemText,
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
import DiffMenu from "./DiffMenu";

const ForceGraph2D = lazy(() => import("react-force-graph-2d"));

type DiffDisplayProps = {
  olderVersionTag: string;
  newerVersionTag: string;
  currentVersionStr: string;
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
    position: 'relative',
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
  const currentVersionStr = props.currentVersionStr;

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
  const [fadeNodes, setFadeNodes] = useState<string[]>([]);


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
  const [isInSmallScreen, setIsInSmallScreen] = useState(true);
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
        setIsInSmallScreen(vw > rwdWidth ? false : true)
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
      olderVersionTag === currentVersionStr ? '' : olderVersionTag,
      olderVersionContext,
    );
  }, [olderVersionTag]);
  useEffect(() => {
    fetchVersionData(
      newerVersionTag === currentVersionStr ? '' : newerVersionTag,
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

      // set showing graph data
      updateGraphData(newerEndpointGraphData, newerVersionContext);
      updateGraphData(olderEndpointGraphData, olderVersionContext,);

      // set graph diff info and diff graph data
      const nextGraphDifferenceInfo = DiffDisplayUtils.CompareTwoGraphData(
        JSON.parse(JSON.stringify(newerEndpointGraphData)),
        JSON.parse(JSON.stringify(olderEndpointGraphData)),
        olderEndpointDataTypesMap,
        newerEndpointDataTypesMap,
        showEndpoint
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
        setDiffGraphData(DependencyGraphUtils.ProcessData(showEndpoint ? JSON.parse(nextDiffGraphData) : DependencyGraphUtils.toServiceDependencyGraph(JSON.parse(nextDiffGraphData))));
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
    tag: string, // if tag is empty string, it means current version
    versionContext: VersionContext
  ) => {
    const data = await DiffComparatorService.getInstance().getTaggedDiffData(tag);

    // get raw graph data
    const endpointGraph = JSON.parse(JSON.stringify(data.graphData));

    // get raw insight data
    const cohesionData = data.cohesionData;
    const couplingData = data.couplingData;
    const instabilityData = data.instabilityData;

    // get raw endpointDataTypesMap data
    const endpointDataTypesMap = data.endpointDataTypesMap;

    // set graph data
    if (endpointGraph) {
      versionContext.setEndpointGraphData(endpointGraph);
    }

    // set insight data 
    versionContext.setCohesionData(cohesionData);
    versionContext.setCouplingData(couplingData);
    versionContext.setInstabilityData(instabilityData);

    // set endpointDataTypesMap data
    versionContext.setEndpointDataTypesMap(endpointDataTypesMap);
  };

  const handleFadeNodesInDiffGraph = (nonFadedNodeIds: string[]) => {
    if (nonFadedNodeIds.length > 0) {
      const allNodeIds = graphDifferenceInfo.diffGraphData.nodes.map(node => node.id);
      const fadeNodes = allNodeIds.filter(id => !nonFadedNodeIds.includes(id));
      setFadeNodes(fadeNodes);
    } else {
      setFadeNodes([]);
    }
  };

  const updateGraphData = (
    endpointGraphData: TGraphData,
    versionContext: VersionContext
  ) => {
    const rawGraphStr = JSON.stringify(endpointGraphData);
    // console.log("showEndpoint =", showEndpoint);
    // console.log("versionContext.rawRef.current",JSON.stringify(versionContext.rawRef.current, null, 2));
    // console.log("rawGraphStr",JSON.stringify(rawGraphStr, null, 2));
    console.log("endpointGraphData", JSON.stringify(endpointGraphData, null, 2));
    // if (versionContext.rawRef.current === rawGraphStr) return;
    if (!versionContext.rawRef.current) {
      const timer = setInterval(() => {
        if (!versionContext.graphRef.current) return;
        clearInterval(timer);
        setTimeout(() => {
          versionContext.graphRef.current!.zoom(3, 0);
          versionContext.graphRef.current!.centerAt(0, 0);
        }, 10);
      });
    }
    versionContext.rawRef.current = rawGraphStr;

    const rawshowingGraph = JSON.parse(rawGraphStr);
    const showingGraph = showEndpoint
      ? rawshowingGraph
      : DependencyGraphUtils.toServiceDependencyGraph(rawshowingGraph);
    versionContext.setGraphData(DependencyGraphUtils.ProcessData(showingGraph));
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
      <Grid item xs={isInSmallScreen ? 12 : 4} style={{ display: showGraphDiff ? 'block' : 'none' }}>
        <Box
          sx={{
            height: isInSmallScreen ? pageSize[1] * 0.3 : pageSize[1] * graphHeightRate,
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '0.2em 0.1em 0.2em 0.1em',
            backgroundColor: '#fafafa',
          }}
        >
          <DiffMenu
            addedNodeIds={graphDifferenceInfo.addedNodeIds}
            deletedNodeIds={graphDifferenceInfo.deletedNodeIds}
            changedEndpointNodesId={graphDifferenceInfo.changedEndpointNodesId}
            showEndpoint={showEndpoint}
          />
        </Box>
      </Grid>
      <Grid item xs={isInSmallScreen ? 12 : 8} style={{ display: showGraphDiff ? 'block' : 'none' }}>
        <div className={classes.graphContainer}>
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 10,
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: '0.5em',
              padding: '0.5em',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Tooltip
              title="Endpoint or service existing in the second version but not in the first will be marked as added nodes."
              componentsProps={{
                tooltip: {
                  sx: { fontSize: '1em' }
                }
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                onMouseEnter={() => handleFadeNodesInDiffGraph(graphDifferenceInfo.addedNodeIds)}
                onMouseLeave={() => handleFadeNodesInDiffGraph([])}
              >
                <Box sx={{ width: 20, height: 20, bgcolor: "rgba(0, 255, 0, 0.7)", borderRadius: '50%' }} />
                <Typography variant="body2" sx={{ cursor: "help" }}>Add</Typography>
              </Box>
            </Tooltip>
            <Tooltip
              title="Endpoint or service existing in the first version but not in the second will be marked as deleted nodes."
              componentsProps={{
                tooltip: {
                  sx: { fontSize: '1em' }
                }
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                onMouseEnter={() => handleFadeNodesInDiffGraph(graphDifferenceInfo.deletedNodeIds)}
                onMouseLeave={() => handleFadeNodesInDiffGraph([])}
              >
                <Box sx={{ width: 20, height: 20, bgcolor: "rgba(255, 0, 0, 0.7)", borderRadius: '50%' }} />
                <Typography variant="body2" sx={{ cursor: "help" }}>Delete</Typography>
              </Box>
            </Tooltip>
            {showEndpoint && (
              <Tooltip
                title="Endpoints whose data types differ between the two versions will be marked as changed nodes."
                componentsProps={{
                  tooltip: {
                    sx: { fontSize: '1em' }
                  }
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  onMouseEnter={() => handleFadeNodesInDiffGraph(showEndpoint ? graphDifferenceInfo.changedEndpointNodesId : [])}
                  onMouseLeave={() => handleFadeNodesInDiffGraph([])}
                >
                  <Box sx={{ width: 20, height: 20, bgcolor: "rgba(255, 165, 0, 0.7)", borderRadius: '50%' }} />
                  <Typography variant="body2" sx={{ cursor: "help" }}>Change</Typography>
                </Box>
              </Tooltip>
            )}
          </Box>
          <Suspense fallback={<Loading />}>
            <ForceGraph2D
              ref={diffGraphDataRef}
              width={isInSmallScreen ? pageSize[0] * 0.98 - 20 : pageSize[0] * 7.7 / 12}
              height={pageSize[1] * graphHeightRate}
              graphData={diffGraphData}
              {...DiffDependencyGraphFactory.Create(
                graphDifferenceInfo,
                true,
                fadeNodes,
              )}
            />
          </Suspense>
        </div>
      </Grid>

      {/* Graph details*/}
      <Grid item xs={gridSize} style={{ display: showGraphDiff ? 'none' : 'block' }}>
        <div className={classes.graphContainer}>
          <Grid item xs={12} className={classes.graphHeader}>
            <h3 className={classes.graphTitle}>{olderVersionTag || currentVersionStr}</h3>
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
            <h3 className={classes.graphTitle}>{newerVersionTag || currentVersionStr}</h3>
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
            olderVersionTag || currentVersionStr,
            newerVersionTag || currentVersionStr,
            false,
            BarChartUtils.ServiceCohesionDiffOpts(
              cohesionDiff,
              olderVersionTag || currentVersionStr,
              newerVersionTag || currentVersionStr,
            )
          )}
        ></ReactApexChart>
      </Grid>
      <Grid item xs={gridSize == 6 ? 3 : 0} style={{ display: showCohesionInsightDiffChart && gridSize == 6 ? 'block' : 'none' }}></Grid>

      {/* Cohesion details*/}
      <Grid item xs={gridSize - 0.5} style={{ display: showCohesionInsightDiffChart ? 'none' : 'block' }}>
        <ReactApexChart
          {...BarChartUtils.CreateBarChart(
            `Service Cohesion (${olderVersionTag || currentVersionStr})`,
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
            `Service Cohesion (${newerVersionTag || currentVersionStr})`,
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
            olderVersionTag || currentVersionStr,
            newerVersionTag || currentVersionStr,
            false,
            BarChartUtils.ServiceCouplingDiffOpts(
              couplingDiff,
              olderVersionTag || currentVersionStr,
              newerVersionTag || currentVersionStr,
            )
          )}
        ></ReactApexChart>
      </Grid>
      <Grid item xs={gridSize == 6 ? 3 : 0} style={{ display: showCouplingInsightDiffChart && gridSize == 6 ? 'block' : 'none' }}></Grid>

      {/* Coupling details*/}
      <Grid item xs={gridSize - 0.5} style={{ display: showCouplingInsightDiffChart ? 'none' : 'block' }}>
        <ReactApexChart
          {...BarChartUtils.CreateBarChart(
            `Service Coupling (${olderVersionTag || currentVersionStr})`,
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
            `Service Coupling (${newerVersionTag || currentVersionStr})`,
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
            olderVersionTag || currentVersionStr,
            newerVersionTag || currentVersionStr,
            false,
            BarChartUtils.ServiceInstabilityDiffOpts(
              instabilityDiff,
              olderVersionTag || currentVersionStr,
              newerVersionTag || currentVersionStr,
            )
          )}
        ></ReactApexChart>
      </Grid>
      <Grid item xs={gridSize == 6 ? 3 : 0} style={{ display: showInstabilityInsightDiffChart && gridSize == 6 ? 'block' : 'none' }}></Grid>

      {/* Instability details*/}
      <Grid item xs={gridSize - 0.5} style={{ display: showInstabilityInsightDiffChart ? 'none' : 'block' }}>
        <ReactApexChart
          {...BarChartUtils.CreateBarChart(
            `Service Instability (${olderVersionTag || currentVersionStr})`,
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
            `Service Instability (${newerVersionTag || currentVersionStr})`,
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
