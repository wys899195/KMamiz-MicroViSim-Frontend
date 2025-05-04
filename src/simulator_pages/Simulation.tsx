import {
  Card, FormControlLabel, FormGroup, Switch, Grid, Typography,
  Box, Button, Tooltip, FormControl, TextareaAutosize,
  MenuItem, Select, InputLabel, TextField,
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
import SimulationService from "../services/SimulationService";
import {

} from "@mui/material";
import MonacoEditor from "@monaco-editor/react";
import GraphService from "../services/GraphService";

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'row',
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

  const [yamlInput, setYamlInput] = useState(() => {
    return "";
  });

  const [loading, setLoading] = useState(false);

  // create new version tag
  const latestVersionStr = "Latest";
  const [newVersionTagToCreate, setNewVersionTagToCreate] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleParseYamlClick = async () => {
    if (!yamlInput) {
      return;
    }
    setLoading(true);
    try {
      const { message, resStatus } = await SimulationService.getInstance().retrieveDataBySimulateYaml(yamlInput);

      if (resStatus >= 400) {
        alert(`Failed to simulate data retrival.\n\n[error message]\n${message}`);
        console.log(`${message}`)
      } else {
        alert(`ok!`);
      }
    } finally {
      setLoading(false);
      setYamlInput("")
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setYamlInput(value || "");
  };
  const createNewVersion = async () => {
    if (!newVersionTagToCreate) return;
    if (newVersionTagToCreate == latestVersionStr) {
      setNewVersionTagToCreate("");
      setErrorMessage(`Version name cannot be set to "${latestVersionStr}"`);
      return;
    }
    try {
      await GraphService.getInstance().addTaggedDiffData(newVersionTagToCreate);
    } catch (error) {
      setErrorMessage(`Failed to create version: ${error}`);
    }
  };

  return (
    <div className={classes.container}>
      <div
        className={classes.editor}
        style={{ width: `100%` }}
      >
        <Grid container spacing={2}>

          <Grid item xs={3} justifyContent="center" alignItems="center">
            <Card variant="outlined" className={classes.actions}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleParseYamlClick}
                disabled={loading || !yamlInput}
              >
                {loading ? 'Processing...' : 'start simulate'}
              </Button>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card variant="outlined" className={classes.actions}>
              <TextField
                id="new-version-tag"
                fullWidth
                label="Save simulator data as a new version for the comparator in the production environment."
                variant="outlined"
                value={newVersionTagToCreate}
                onChange={(e) => setNewVersionTagToCreate(e.target.value)}
                error={!!errorMessage}
                helperText={errorMessage}
              />
              <Tooltip title="Save simulator data as a new version for the comparator in the production environment.">
                <Button
                  variant="contained"
                  onClick={() => createNewVersion()}
                  disabled={!newVersionTagToCreate || loading}

                >
                  {loading ? 'Processing...' : 'Create'}
                </Button>
              </Tooltip>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <MonacoEditor
              className={classes.textField}
              value={yamlInput}
              onChange={handleEditorChange}
              language="yaml"
              theme="light"
              height="75vh"
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
          </Grid>
        </Grid>



      </div>
    </div>
  );
}