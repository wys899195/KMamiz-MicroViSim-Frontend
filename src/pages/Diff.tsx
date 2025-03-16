import { makeStyles } from "@mui/styles";
import {
  lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from "react";
import { 
  Box, Card, FormControlLabel, FormGroup, Switch, Button, Grid, Tooltip, TextField, Typography, FormControl, 
  MenuItem, Select, InputLabel,Divider,
} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import ReactApexChart from "react-apexcharts";
import BarChartUtils from "../classes/BarChartUtils";
import { Element, scroller } from 'react-scroll';
import { 
  DiffDependencyGraphFactory
} from "../classes/DiffDependencyGraphFactory";
import {
  useGraphDifference,
  DependencyGraphUtils,
} from "../classes/DependencyGraphUtils";
import ViewportUtils from "../classes/ViewportUtils";
import GraphService from "../services/GraphService";
import Loading from "../components/Loading";
import { TGraphData } from "../entities/TGraphData";
import { TTotalServiceInterfaceCohesion } from "../entities/TTotalServiceInterfaceCohesion";
import { TServiceCoupling } from "../entities/TServiceCoupling";
import { TServiceInstability } from "../entities/TServiceInstability";
import { TInsightDiffCohesion } from "../entities/TInsightDiffCohesion";
import { TInsightDiffCoupling } from "../entities/TInsightDiffCoupling";
import { TInsightDiffInstability } from "../entities/TInsightDiffInstability";
import { useLocation, useNavigate } from "react-router-dom";


// import GraphDiffTabs from '../components/GraphDiffTabs';
const ForceGraph2D = lazy(() => import("react-force-graph-2d"));

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    overflowX: "clip",
    marginBottom: "5em",
  },
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
  pageHeader: {
    borderBottom: '0.2em solid #ccc',
    boxShadow: '0.0em  0.4em 0.5em rgba(0, 0, 0, 0.1)',
    position: "fixed",
    top: "4em",
    left: "0em",
    backgroundColor:'white',
    zIndex:99,
  },
  pageBody: {
    marginTop:'8em',
  },
  switch: {
    paddingLeft: "0.8em",
  },
  graphMessage: {
    textAlign: 'center',
    color:'gray',
    marginTop:'0.08em',
    width:'100%',
    height:'0.01em',
  }
}));

export default function Diff() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { search } = useLocation();
  
  /***graph data references***/
  //version 1
  const graphDataRefV1 = useRef<any>();
  const rawGraphDataRefV1 = useRef<string>();
  
  // version2
  const graphDataRefV2 = useRef<any>();
  const rawGraphDataRefV2 = useRef<string>();

  
  /*** data ***/
  //latest version (to create new verion)
  const [latestRawGraphData, setLatestRawGraphData] = useState<TGraphData | null>(null);
  const [latestCohesion, setLatestCohesion] = useState<TTotalServiceInterfaceCohesion[]>([]);
  const [latestCoupling, setLatestCoupling] = useState<TServiceCoupling[]>([]);
  const [latestInstability, setLatestInstability] = useState<TServiceInstability[]>([]);

  //version1
  const [graphDataV1, setGraphDataV1] = useState<any>();
  const [rawGraphDataV1, setRawGraphDataV1] = useState<TGraphData | null>(null);
  const [cohesionV1, setCohesionV1] = useState<TTotalServiceInterfaceCohesion[]>([]);
  const [couplingV1, setCouplingV1] = useState<TServiceCoupling[]>([]);
  const [instabilityV1, setInstabilityV1] = useState<TServiceInstability[]>([]);

  //version2
  const [graphDataV2, setGraphDataV2] = useState<any>();
  const [rawGraphDataV2, setRawGraphDataV2] = useState<TGraphData | null>(null);
  const [cohesionV2, setCohesionV2] = useState<TTotalServiceInterfaceCohesion[]>([]);
  const [couplingV2, setCouplingV2] = useState<TServiceCoupling[]>([]);
  const [instabilityV2, setInstabilityV2] = useState<TServiceInstability[]>([]);

  /***graph diff info***/
  const diffGraphDataRef = useRef<any>();
  const rawDiffGraphDataRef = useRef<string>();
  const [diffGraphData, setDiffGraphData] = useState<any>();
  const [rawDiffGraphData, setRawDiffGraphData] = useState<TGraphData | null>(null);
  const [graphDifferenceInfo, setGraphDifferenceInfo] = useGraphDifference();

  /***insight diff***/
  const [cohesionDiff, setCohesionDiff] = useState<TInsightDiffCohesion[]>([]);
  const [couplingDiff, setCouplingDiff] = useState<TInsightDiffCoupling[]>([]);
  const [instabilityDiff, setInstabilityDiff] = useState<TInsightDiffInstability[]>([]);

  /***for graph display***/
  const [showEndpoint, setShowEndpoint] = useState(true);
  const [showGraphDiffChart, setShowGraphDiffChart] = useState(true);
  const [showCohesionInsightDiffChart, setShowCohesionInsightDiffChart] = useState(true);
  const [showCouplingInsightDiffChart, setShowCouplingInsightDiffChart] = useState(true);
  const [showInstabilityInsightDiffChart, setShowInstabilityInsightDiffChart] = useState(true);

  /***window size control***/
  const rwdWidth = 1300
  const [pageSize, setPageSize] = useState([0, 0]);
  const [gridSize, setGridSize] = useState(12);
  const [graphWidthRate, setCanvasWidthRate] = useState(0.5);
  const [graphHeightRate, setCanvasHeightRate] = useState(0.75);

  /***to get a specific version diff data***/
  const latestVersionStr = "Latest"
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const tagV1 = query.get("tagV1") as string || ""; //version1 tag
  const tagV2 = query.get("tagV2") as string || ""; //version2 tag
  const [tags, setTags] = useState<string[]>([]);
  const [newVersion, setNewVersion] = useState<string>("");


  useEffect(() => {
    const unsubscribe = [
      ViewportUtils.getInstance().subscribe(([vw]) =>{
        setGridSize(vw > rwdWidth ? 6 : 12)
        setCanvasWidthRate(vw > rwdWidth ? 0.5 : 0.99);
        setCanvasHeightRate(vw > rwdWidth ? 0.65 : 0.65);
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

  useEffect(() => {
    GraphService.getInstance().getTagsOfDiffdata().then(setTags);
  }, [query]);


  /***useEffect for graph diff and insight diff***/
  //latest version
  useEffect(() => {
    console.log("useEffect executed at:", new Date().toLocaleTimeString());
    GraphService.getInstance().getDependencyGraph(true).then((nextLatestRawData) => {
      if (nextLatestRawData){
        setLatestRawGraphData(nextLatestRawData);
      }
    });
    //Cohesion
    GraphService.getInstance().getServiceCohesion().then((nextLatestCohesionData) => {
      if (nextLatestCohesionData){
        setLatestCohesion(nextLatestCohesionData);
      }
    });
    //Coupling
    GraphService.getInstance().getServiceCoupling().then((nextLatestCouplingData) => {
      if (nextLatestCouplingData){
        setLatestCoupling(nextLatestCouplingData);
      }
    }); 
    //Instability
    GraphService.getInstance().getServiceInstability().then((nextLatestInstabilityData) => {
      if (nextLatestInstabilityData){
        setLatestInstability(nextLatestInstabilityData);
      }
    }); 
  }, [showEndpoint,query]);


  //version1
  useEffect(() => {
    GraphService.getInstance().getTaggedDependencyGraph(true,tagV1).then((nextRawDataV1) => {
      if (nextRawDataV1){
        setRawGraphDataV1(nextRawDataV1);
      }
    });
    GraphService.getInstance().getTaggedDependencyGraph(showEndpoint,tagV1).then((nextDataV1) => {
      if (nextDataV1){
        const nextRawData = JSON.stringify(nextDataV1);
        if (rawGraphDataRefV1.current === nextRawData) return;
        if (!rawGraphDataRefV1.current) {
          const timer = setInterval(() => {
            if (!graphDataRefV1.current) return;
            clearInterval(timer);
            setTimeout(() => {
              graphDataRefV1.current.zoom(3, 0);
              graphDataRefV1.current.centerAt(0, 0);
            }, 10);
          });
        }
        rawGraphDataRefV1.current = nextRawData;
        setGraphDataV1(DependencyGraphUtils.ProcessData(nextDataV1));
      }
    });
    //Cohesion
    GraphService.getInstance().getTaggedServiceCohesion(tagV1).then((nextCohesionDataV1) => {
      if (nextCohesionDataV1){
        setCohesionV1(nextCohesionDataV1);
      }
    });
    //Coupling
    GraphService.getInstance().getTaggedServiceCoupling(tagV1).then((nextCouplingDataV1) => {
      if (nextCouplingDataV1){
        setCouplingV1(nextCouplingDataV1);
      }
    }); 
    //Instability
    GraphService.getInstance().getTaggedServiceInstability(tagV1).then((nextInstabilityDataV1) => {
      if (nextInstabilityDataV1){
        setInstabilityV1(nextInstabilityDataV1);
      }
    });
  }, [showEndpoint,tagV1]);

  //version2
  useEffect(() => {
    GraphService.getInstance().getTaggedDependencyGraph(true,tagV2).then((nextRawDataV2) => {
      if (nextRawDataV2){
        console.log("nextRawDataV2:",nextRawDataV2)
        setRawGraphDataV2(nextRawDataV2);
      }
    });
    GraphService.getInstance().getTaggedDependencyGraph(showEndpoint,tagV2).then((nextDataV2) => {
      if (nextDataV2){
        const nextRawDataV2 = JSON.stringify(nextDataV2);
        if (rawGraphDataRefV2.current === nextRawDataV2) return;
        if (!rawGraphDataRefV2.current) {
          const timer = setInterval(() => {
            if (!graphDataRefV2.current) return;
            clearInterval(timer);
            setTimeout(() => {
              graphDataRefV2.current.zoom(3, 0);
              graphDataRefV2.current.centerAt(0, 0);
            }, 10);
          });
        }
        rawGraphDataRefV2.current = nextRawDataV2;
        ;
        setGraphDataV2(DependencyGraphUtils.ProcessData(nextDataV2));
      }
    });
    //Cohesion
    GraphService.getInstance().getTaggedServiceCohesion(tagV2).then((nextCohesionDataV2) => {
      if (nextCohesionDataV2){
        setCohesionV2(nextCohesionDataV2);
      }
    }); 
    //Coupling
    GraphService.getInstance().getTaggedServiceCoupling(tagV2).then((nextCouplingDataV2) => {
      if (nextCouplingDataV2){
        setCouplingV2(nextCouplingDataV2);
      }
    });
    //Instability
    GraphService.getInstance().getTaggedServiceInstability(tagV2).then((nextInstabilityDataV2) => {
      if (nextInstabilityDataV2){
        setInstabilityV2(nextInstabilityDataV2);
      }
    }); 
  }, [showEndpoint,tagV2]);


  useEffect(() => {
    if(rawGraphDataV1 && rawGraphDataV2){
      const nextGraphDifferenceInfo = DependencyGraphUtils.CompareTwoGraphData(rawGraphDataV1,rawGraphDataV2) ;
      const nextDiffGraphData = JSON.stringify(nextGraphDifferenceInfo.diffGraphData);
      if (rawDiffGraphDataRef.current === nextDiffGraphData) return;
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
      setDiffGraphData(JSON.parse(nextDiffGraphData));
  
      setGraphDifferenceInfo(nextGraphDifferenceInfo);
    }
  }, [rawGraphDataV1,rawGraphDataV2]);

  useEffect(() => {
    const newDataDiff = mergeCohesionData(cohesionV1, cohesionV2);
    setCohesionDiff(newDataDiff);
  }, [cohesionV1, cohesionV2]); 

  useEffect(() => {
    const newDataDiff = mergeCouplingData(couplingV1, couplingV2);
    setCouplingDiff(newDataDiff);
  }, [couplingV1, couplingV2]); 
  
  useEffect(() => {
    const newDataDiff = mergeInstabilityData(instabilityV1, instabilityV2);
    setInstabilityDiff(newDataDiff);
  }, [instabilityV1, instabilityV2]); 
  

  const mergeCohesionData = (
    datav1: TTotalServiceInterfaceCohesion[], 
    datav2: TTotalServiceInterfaceCohesion[]
  ): TInsightDiffCohesion[] => {
    // 組合兩個TTotalServiceInterfaceCohesion[]組成diff資料
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
  

  const createNewVersion = async () => {
    if (!latestRawGraphData|| !newVersion) return;
    await GraphService.getInstance().addTaggedDiffData({
      tag: newVersion,
      graphData:latestRawGraphData,
      cohesionData:latestCohesion,
      couplingData:latestCoupling,
      instabilityData:latestInstability,
    });
    setNewVersion("");
    navigate(`/diff?tagV2=${encodeURIComponent(newVersion)}`);
  };

  const deleteVersionTagV1 = async () => {
    if (!tagV1 || tagV1 === latestVersionStr) return;
    await GraphService.getInstance().deleteTaggedDiffData(tagV1);
    navigate(`/diff`);
  };
  const deleteVersionTagV2 = async () => {
    if (!tagV2 || tagV2 === latestVersionStr) return;
    await GraphService.getInstance().deleteTaggedDiffData(tagV2);
    navigate(`/diff`);
  };

  const scrollToElement = (elementName:string) => {
    scroller.scrollTo(elementName, {
      duration: 300,
      smooth: true,
      offset: -216,
    });
  };


  return (
    <Box className={classes.root}>
      <Grid container padding={1} spacing={0.5} className={classes.pageHeader}>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.actions}> 
            <FormControl fullWidth>
              <InputLabel id="tag1-label">Selected Version 1</InputLabel>
              <Select
                labelId="tag1-label"
                value={tagV1 || latestVersionStr}
                label="Selected Version 1"
                onChange={(e) => {
                  if (e.target.value != latestVersionStr){
                    if(tagV2){
                      navigate(`/diff?tagV1=${encodeURIComponent(e.target.value)}&&tagV2=${encodeURIComponent(tagV2)}`);
                    }else{
                      navigate(`/diff?tagV1=${encodeURIComponent(e.target.value)}`);
                    }
                  }else{ 
                    if(tagV2){
                      navigate(`/diff?tagV2=${encodeURIComponent(tagV2)}`);
                    }else{
                      navigate(`/diff`);
                    }
                  }
                }}
              >
                <MenuItem value={latestVersionStr}>{latestVersionStr}</MenuItem>
                {tags.map((t, i) => (
                  <MenuItem key={`tag1-${i}`} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Delete selected">
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteVersionTagV1()}
                  disabled={!tagV1 || tagV1 === latestVersionStr}
                >
                  Delete
                </Button>
              </>
            </Tooltip>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.actions}>
            <FormControl fullWidth>
              <InputLabel id="tag2-label">Selected Version 2</InputLabel>
              <Select
                labelId="tag2-label"
                value={tagV2 || latestVersionStr}
                label="Selected Version 2" 
                onChange={(e) => {
                  if (e.target.value != latestVersionStr){
                    if(tagV1){
                      navigate(`/diff?tagV1=${encodeURIComponent(tagV1)}&&tagV2=${encodeURIComponent(e.target.value)}`);
                    }else{
                      navigate(`/diff?tagV2=${encodeURIComponent(e.target.value)}`);
                    }
                  }else{
                    if(tagV1){
                      navigate(`/diff?tagV1=${encodeURIComponent(tagV1)}`);
                    }else{
                      navigate(`/diff`);
                    }
                  }
                }}
              >
                <MenuItem value={latestVersionStr}>{latestVersionStr}</MenuItem>
                {tags.map((t, i) => (
                  <MenuItem key={`tag2-${i}`} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Delete selected">
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteVersionTagV2()}
                  disabled={!tagV2 || tagV2 === latestVersionStr}
                >
                  Delete
                </Button>
              </>
            </Tooltip>
          </Card>
        </Grid>
      </Grid>
      <Grid container padding={1} spacing={1} className={classes.pageBody}>
        
        {/* Create new version*/}
        <Grid item xs={12} >
          <Element name="Create new version Title">
            <Typography variant="h6">Create new version</Typography>
          </Element>
        </Grid>
        <Grid item xs={gridSize}>
          <Card variant="outlined" className={classes.actions}>
            <TextField
              fullWidth
              label="save the latest version as a new version"
              variant="outlined"
              value={newVersion} 
              onChange={(e) => setNewVersion(e.target.value)}
            />
            <Tooltip title="Save the latest version as a new version">
              <Button variant="contained" onClick={() => createNewVersion()}>
                Create
              </Button>
            </Tooltip>
          </Card>
        </Grid>
        <Grid item xs={12 - gridSize}></Grid>
        <Grid item xs={12} style={{ marginBottom: "3em" }}>
          <Divider />
        </Grid>



        {/* Graph diff*/}
        <Grid item xs={12} >
          <Element name="Graph Difference Title">
            <Typography variant="h6">Graph Difference</Typography>
          </Element>
        </Grid>
        <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-start", gap: "0.5em" }}>
          <Card className={classes.switch}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={showGraphDiffChart}
                    onChange={(e) => setShowGraphDiffChart(e.target.checked)}
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
        <Grid item xs={gridSize} style={{ display: showGraphDiffChart ? 'block' : 'none' }}>
          <div className={classes.graphContainer}>
            <Suspense fallback={<Loading />}>
              <ForceGraph2D
                ref={diffGraphDataRef}
                width={pageSize[0] - 20}
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
        <Grid item xs={gridSize} style={{ display: showGraphDiffChart ? 'none' : 'block' }}>
          <div className={classes.graphContainer}>
            <Grid item xs={12} className={classes.graphHeader}>
              <h3 className={classes.graphTitle}>{tagV1 || latestVersionStr}</h3>
            </Grid>
            <Suspense fallback={<Loading />}>
              <ForceGraph2D
                ref={graphDataRefV1}
                width={pageSize[0] * graphWidthRate - 20}
                height={pageSize[1] * graphHeightRate - 40}
                graphData={graphDataV1}
                {...DiffDependencyGraphFactory.Create(
                  graphDifferenceInfo,
                  false,
                )}
              />
            </Suspense>
          </div>
        </Grid>
        <Grid item xs={gridSize} style={{ display: showGraphDiffChart ? 'none' : 'block' }}>
          <div className={classes.graphContainer}>
            <Grid item xs={12} className={classes.graphHeader}>
              <h3 className={classes.graphTitle}>{tagV2 || latestVersionStr}</h3>
            </Grid>
            <Suspense fallback={<Loading />}>
              <ForceGraph2D
                ref={graphDataRefV2}
                width={pageSize[0] * graphWidthRate - 20}
                height={pageSize[1] * graphHeightRate - 40}
                graphData={graphDataV2}
                {...DiffDependencyGraphFactory.Create(
                  graphDifferenceInfo,
                  false,
                )}
              />
            </Suspense>
          </div>
        </Grid>


        <Grid item xs={12}>
          <Element name="Insight Difference">
            <Typography variant="h6">Insight Difference</Typography>
          </Element>
        </Grid>
        <Grid item xs={12}>
          <Element name="Insight Cohesion Difference">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowCohesionInsightDiffChart(!showCohesionInsightDiffChart);
              }}
            >
              {showCohesionInsightDiffChart? "show details":"show difference"}
            </Button>
          </Element>
        </Grid>

        {/* Cohesion diff*/}
        <Grid item xs={gridSize==6?3:0} style={{ display: showCohesionInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid> 
        <Grid item xs={gridSize - 0.5} style={{ display: showCohesionInsightDiffChart ? 'block' : 'none' }}>
        <ReactApexChart
            {...BarChartUtils.CreateDiffBarChart( 
              "Service Cohesion (Differences between the two versions)", 
              cohesionDiff,
              BarChartUtils.SeriesFromServiceCohesionDiff, 
              tagV1 || latestVersionStr,
              tagV2 || latestVersionStr, 
              false,
              BarChartUtils.ServiceCohesionDiffOpts( 
                cohesionDiff,
                tagV1 || latestVersionStr,
                tagV2 || latestVersionStr 
              )
            )}
          ></ReactApexChart> 
        </Grid>
        <Grid item xs={gridSize==6?3:0} style={{ display: showCohesionInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid>

        {/* Cohesion details*/}
        <Grid item xs={gridSize - 0.5} style={{ display: showCohesionInsightDiffChart ? 'none' : 'block' }} >
          <ReactApexChart
            {...BarChartUtils.CreateBarChart(
              `Service Cohesion (${tagV1 || latestVersionStr})`,
              cohesionV1,
              BarChartUtils.SeriesFromServiceCohesion,
              true,
              BarChartUtils.ServiceCohesionOpts(cohesionV1)
            )}
          ></ReactApexChart>
        </Grid>
        <Grid item xs={1} style={{ display: showCohesionInsightDiffChart ? 'none' : 'block' }}></Grid>
        <Grid item xs={gridSize - 0.5} style={{ display: showCohesionInsightDiffChart ? 'none' : 'block' }}>
          <ReactApexChart
            {...BarChartUtils.CreateBarChart(
              `Service Cohesion (${tagV2 || latestVersionStr})`,
              cohesionV2,
              BarChartUtils.SeriesFromServiceCohesion,
              true,
              BarChartUtils.ServiceCohesionOpts(cohesionV2)
            )}
          ></ReactApexChart>
        </Grid>


        {/* Coupling diff*/}
        <Grid item xs={12}>
          <Element name="Insight Coupling Difference">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowCouplingInsightDiffChart(!showCouplingInsightDiffChart);
            }}
          >
            {showCouplingInsightDiffChart? "show details":"show difference"}
          </Button>
          </Element>
        </Grid>
        <Grid item xs={gridSize==6?3:0} style={{ display: showCouplingInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid>
        <Grid item xs={gridSize - 0.5} style={{ display: showCouplingInsightDiffChart ? 'block' : 'none' }}>
        <ReactApexChart
            {...BarChartUtils.CreateDiffBarChart( 
              "Service Coupling (Differences between the two versions)", 
              couplingDiff,
              BarChartUtils.SeriesFromServiceCouplingDiff, 
              tagV1 || latestVersionStr,
              tagV2 || latestVersionStr, 
              false,
              BarChartUtils.ServiceCouplingDiffOpts(  
                couplingDiff,
                tagV1 || latestVersionStr,
                tagV2 || latestVersionStr 
              )
            )}
          ></ReactApexChart> 
        </Grid>
        <Grid item xs={gridSize==6?3:0} style={{ display: showCouplingInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid> 

        {/* Coupling details*/}
        <Grid item xs={gridSize - 0.5} style={{ display: showCouplingInsightDiffChart ? 'none' : 'block' }}>
          <ReactApexChart
            {...BarChartUtils.CreateBarChart(
              `Service Coupling (${tagV1 || latestVersionStr})`,
              couplingV1,
              BarChartUtils.SeriesFromServiceCoupling,
              true,
              BarChartUtils.ServiceCouplingOpts(couplingV1)
            )}
          ></ReactApexChart>
        </Grid>
        <Grid item xs={1} style={{ display: showCouplingInsightDiffChart ? 'none' : 'block' }}></Grid>
        <Grid item xs={gridSize - 0.5} style={{ display: showCouplingInsightDiffChart ? 'none' : 'block' }}>
          <ReactApexChart
            {...BarChartUtils.CreateBarChart(
              `Service Coupling (${tagV2 || latestVersionStr})`,
              couplingV2,
              BarChartUtils.SeriesFromServiceCoupling,
              true,
              BarChartUtils.ServiceCouplingOpts(couplingV2)
            )}
          ></ReactApexChart>
        </Grid>




        {/* Instabilitydiff*/}
        <Grid item xs={12}>
          <Element name="Insight Instability Difference">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowInstabilityInsightDiffChart(!showInstabilityInsightDiffChart);
            }}
          >
            {showInstabilityInsightDiffChart? "show details":"show difference"}
          </Button>
          </Element>
        </Grid>
        <Grid item xs={gridSize==6?3:0} style={{ display: showInstabilityInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid>
        <Grid item xs={gridSize - 0.5} style={{ display: showInstabilityInsightDiffChart ? 'block' : 'none' }}>
        <ReactApexChart
            {...BarChartUtils.CreateDiffBarChart( 
              "Service Instability (Differences between the two versions)", 
              instabilityDiff,
              BarChartUtils.SeriesFromServiceInstabilityDiff, 
              tagV1 || latestVersionStr, 
              tagV2 || latestVersionStr, 
              false,
              BarChartUtils.ServiceInstabilityDiffOpts(
                instabilityDiff,
                tagV1 || latestVersionStr, 
                tagV2 || latestVersionStr 
              )
            )}
          ></ReactApexChart> 
        </Grid>
        <Grid item xs={gridSize==6?3:0} style={{ display: showInstabilityInsightDiffChart&&gridSize==6 ? 'block' : 'none' }}></Grid> 
 



        {/* Instability details*/}
        <Grid item xs={gridSize - 0.5} style={{ display: showInstabilityInsightDiffChart ? 'none' : 'block' }}>
          <ReactApexChart
            {...BarChartUtils.CreateBarChart(
              `Service Instability (${tagV1 || latestVersionStr})`,
              instabilityV1,
              BarChartUtils.SeriesFromServiceInstability,
              false,
              BarChartUtils.ServiceInstabilityOpts(instabilityV1)
            )}
          ></ReactApexChart>
        </Grid>
        <Grid item xs={1} style={{ display: showInstabilityInsightDiffChart ? 'none' : 'block' }}></Grid>
        <Grid item xs={gridSize - 0.5} style={{ display: showInstabilityInsightDiffChart ? 'none' : 'block' }}>
          <ReactApexChart
            {...BarChartUtils.CreateBarChart(
              `Service Instability (${tagV2 || latestVersionStr})`,
              instabilityV2,
              BarChartUtils.SeriesFromServiceInstability,
              false,
              BarChartUtils.ServiceInstabilityOpts(instabilityV2)
            )}
          ></ReactApexChart>
        </Grid>
      </Grid>
    </Box>
  );
}
