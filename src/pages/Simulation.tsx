import {
  Card, FormControlLabel, FormGroup, Switch, Grid, Typography,
  Box,  Button,  Tooltip, FormControl,TextareaAutosize,
  MenuItem, Select, InputLabel,
} from "@mui/material";
import { enableTabToIndent } from "indent-textarea";
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
import SimulationService from "../services/SimulationService";
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
import Loading from "../components/Loading";
import { 

} from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { useLocation, useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";

const ForceGraph2D = lazy(() => import("react-force-graph-2d"));

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'row',
  },
  editor: {
    width: '45%',
    padding: '10px',
    borderRight: '5px solid #ccc',
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
  },
  graphContainer: {
    width: '65%',
    padding: '10px',
    overflow: 'auto',
    height: '100%',
  },
  divider: {
    width: '5px',
    cursor: 'ew-resize',
    backgroundColor: '#ddd',
    height: '100%',
  },
  textField: {
    resize: 'none',
    width: '100%', 
    overflowY: 'auto',
    height: '80vh',
    border: '1px solid black' 
  },
  buttonContainer: {
    marginTop: '16px',
  }
}));

export default function Simulation() {
  const classes = useStyles();


  /***window size control***/
  const rwdWidth = 1300
  const [pageSize, setPageSize] = useState([0, 0]);
  const [graphWidthRate, setCanvasWidthRate] = useState(0.5);
  const [graphHeightRate, setCanvasHeightRate] = useState(0.75);
  const [editorWidth, setEditorWidth] = useState(45);
  const [isResizing, setIsResizing] = useState(false);

  const graphDataRef = useRef<any>();
  const rawGraphDataRef = useRef<string>();

  const [yamlInput, setYamlInput] = useState(() => {
    return localStorage.getItem("inityamlInput") || "";
  });
  const [parsedYaml, setParsedYaml] = useState(null);
  const [graphData, setGraphData] = useState<any>();
  const [rawGraphData, setRawGraphData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const [graphDifferenceInfo, setGraphDifferenceInfo] = useGraphDifference();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleParseYamlClick = async () => {
    if (!yamlInput) {
      return;
    }
    setLoading(true); 

    try {
      const nextGraphData = await SimulationService.getInstance().getDependencyGraphBySimulateYaml(yamlInput);
      if (nextGraphData) {
        const nextRawGraphData = JSON.stringify(nextGraphData);
        if (rawGraphDataRef.current === nextRawGraphData) return;
        if (!rawGraphDataRef.current) {
          const timer = setInterval(() => {
            if (!graphData) return;
            clearInterval(timer);
            setTimeout(() => {
              graphData.zoom(3, 0);
              graphData.centerAt(0, 0);
            }, 10);
          });
        }

        rawGraphDataRef.current = nextRawGraphData;
        setRawGraphData(JSON.parse(nextRawGraphData));
        setGraphData(DependencyGraphUtils.ProcessData(nextGraphData));
        console.log(graphData);
        localStorage.setItem("inityamlInput", yamlInput);
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  


  useEffect(() => {
    if (yamlInput) {
      handleParseYamlClick();
    }
  }, []); 

  /***useEffect for window size control***/
  useEffect(() => {
    const unsubscribe = [
      ViewportUtils.getInstance().subscribe(([vw]) =>{
        setCanvasWidthRate(vw > rwdWidth ? 0.55 : 0.55);
        setCanvasHeightRate(vw > rwdWidth ? 0.9 : 0.9);
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
    if (graphDataRef.current) {
      graphDataRef.current.zoom(3, 0);
      graphDataRef.current.centerAt(0, 0);
    }

  }, [graphData]);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        setEditorWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleEditorChange = (value: string | undefined) => {
    setYamlInput(value || "");
};

  const createNewVersion = async () => {
    if (!graphData) return;
    await GraphService.getInstance().addTaggeddDiffData(rawGraphData);
    window.location.replace("/diff");
  };

  return (
    <div className={classes.container}>
      <div
        className={classes.editor}
        style={{ width: `${editorWidth}%` }}
      >

        <MonacoEditor
          className={classes.textField} 
          value={yamlInput}
          onChange={handleEditorChange}
          language="yaml"
          theme="light"
          height="80vh"
          options={{
            minimap: { enabled: false },
            lineNumbers: "on",
            wordWrap: "on",
            tabSize: 2,
            autoIndent: "advanced",
            formatOnType: true, 
            suggestOnTriggerCharacters: true,
          }}
        />
        <div className={classes.buttonContainer}>
          <Button 
          variant="contained" 
          color="primary"
          onClick={handleParseYamlClick}
          disabled={loading}
          >
            {loading ? 'Parsing...' : 'Go!'}
          </Button>


          <Button 
          variant="contained" 
          color="primary"
          onClick={createNewVersion}
          disabled={loading}
          >
            {loading ? 'Parsing...' : 'create as a new version'}
          </Button>
        </div>
      </div>

      <div
        className={classes.divider}
        onMouseDown={() => setIsResizing(true)} 
      ></div>

      <div
        className={classes.graphContainer}
        style={{ width: `${100 - editorWidth}%` }}
      >
        <Typography variant="h5">Dependency Graph</Typography>
        <div className="dependency-graph" id="dependency-graph">
          <Suspense fallback={<Loading />}>
            <ForceGraph2D
              ref={graphDataRef}
              width={pageSize[0] * graphWidthRate - 20}
              height={pageSize[1] * graphHeightRate - 40}
              graphData={graphData}
              {...DiffDependencyGraphFactory.Create(
                graphDifferenceInfo,
                false,
              )}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}