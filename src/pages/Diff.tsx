import { makeStyles } from "@mui/styles";
import {
  useEffect, useMemo, useState,
} from "react";
import { 
  Box, Card, Button, Grid, Tooltip, TextField, Typography, FormControl, 
  MenuItem, Select, InputLabel,
} from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import GraphService from "../services/GraphService";
import { useLocation, useNavigate } from "react-router-dom";
import DiffDisplay from "../components/DiffDisplay";


type MultiLevelMap = {
  [olderVersionTag: string]: {
    [newerVersionTag: string]: {};
  };
};

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
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const [labelMap, setLabelMap] = useState<MultiLevelMap>();
  const [newerVersionTag,setNewerVersionTag] = useState<string>("");
  const [olderVersionTag,setOlderVersionTag] = useState<string>("");
  const [uniqueLabelName,setUniqueLabelName] = useState<string>("");
  const [showPageHeader, setShowPageHeader] = useState(true);
  const latestVersionStr = "Latest";
  const [newVersionTag, setNewVersionTag] = useState<string>("");


  /***useEffects for tag control***/
  useEffect(() => {
    const q = query.get("q");
    if (q) {
      const [olderVersionTag,newerVersionTag] = atob(
        decodeURIComponent(q)
      ).split("\t");
      setOlderVersionTag(olderVersionTag || "");
      setNewerVersionTag(newerVersionTag || "");
    }
    GraphService.getInstance().getTagsOfDiffdata().then((tags) => {
      const newLabelMap: MultiLevelMap = {};
      const sortedTags = tags.sort((a, b) => b.time - a.time);// sort descending by time

      // other version tag
      sortedTags.forEach((tagI) => {
        const tempOlderVersionTag = JSON.stringify(tagI);
        newLabelMap[tempOlderVersionTag] = {[JSON.stringify({tag:latestVersionStr,time:0})]: {}}// The latest version can always be selected as the "newer" version in the comparison
        sortedTags.forEach((tagJ) => {
          const tempNewerVersionTag = JSON.stringify(tagJ);
          if (tagJ.time > tagI.time) {
            newLabelMap[tempOlderVersionTag][tempNewerVersionTag] = {};
          }
        });
      });
      console.log(newLabelMap)
      setLabelMap(newLabelMap);
    });
  }, []);
  useEffect(() => {
    if (newerVersionTag) {
      setUniqueLabelName(
        `${olderVersionTag}\t${newerVersionTag}`
      );
    } else setUniqueLabelName("");
  }, [newerVersionTag]);
  useEffect(() => {
    const url = `${olderVersionTag}${newerVersionTag && `\t${newerVersionTag}`}`;
    const encoded = encodeURIComponent(btoa(url));
    navigate(`/diff${encoded && `?q=${encoded}`}`, {
      replace: true,
    });
  }, [olderVersionTag, newerVersionTag]);


  /***constants for tag select control***/
  const getMenuItemLevel = (level: number) => {
    if (!labelMap) return [];
    const keys = [olderVersionTag, newerVersionTag];
    let root = labelMap;
    for (let i = 0; i < level; i++) {
      if (!root) break;
      for (const key in root) {
        if (JSON.parse(key).tag == keys[i]){
          root = root[key];
        }
      }
    }
    return root ? Object.keys(root) : [];
  };
  const setAndClearUpTo = (value: string, level: number) => {
    const setFunctions = [
      setOlderVersionTag,
      setNewerVersionTag,
    ];
    setFunctions.forEach((f, id) => {
      if (id > level) {
        f("");
      } else if (id === level) {
        f(value);
      }
    });
  };
  const selects = [
    { name: "Select an vertion", relVal: () => olderVersionTag},
    { name: "Select the newer version", relVal: () => newerVersionTag },
  ];
  const desplayFormattedCreateTime = (timestamp: number): string => {
    if (!timestamp) {
      return ""; 
    }
    const formatedTimestamp = new Date(timestamp).toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 24 hour format
    });
    return `(Created at ${formatedTimestamp})`
  };
  /***constants for diff version control***/
  const createNewVersion = async () => {
    if (!newVersionTag) return;
    await GraphService.getInstance().addTaggedDiffData(newVersionTag);
    setNewVersionTag("");
    window.location.replace("/diff");
  };
  const deleteVersion = async (level: number) => {
    const tagToDelete = level === 0 ? olderVersionTag : level === 1 ? newerVersionTag :"";
    if (!tagToDelete || tagToDelete === latestVersionStr) return;
    await GraphService.getInstance().deleteTaggedDiffData(tagToDelete);
    window.location.replace("/diff");
  };
  const shouldDisableDeleteButton = (level: number):boolean => {
    const tagToDelete = level === 0 ? olderVersionTag : level === 1 ? newerVersionTag :"";
    return (!tagToDelete || tagToDelete === latestVersionStr)

  };


  
  return (
    <Box className={classes.root}>
        <Grid container padding={showPageHeader ? 1 : 0} spacing={0.5} className={classes.pageHeader}>
          {showPageHeader &&
            <Grid item xs={5}>
              <Typography variant="h5">Diff</Typography>
            </Grid>
          }
          {showPageHeader &&
            <Grid item xs={7}>
              <Card variant="outlined" className={classes.actions}>
                <TextField
                  fullWidth
                  label="Create New Version from Latest"
                  variant="outlined"
                  value={newVersionTag} 
                  onChange={(e) => setNewVersionTag(e.target.value)}
                /> 
                <Tooltip title="Create New Version from Latest">
                  <Button 
                    variant="contained" 
                    onClick={() => createNewVersion()}  
                    disabled={!newVersionTag}
                  >
                    Create
                  </Button>
                </Tooltip>
              </Card>
            </Grid>
          }
          {showPageHeader && labelMap &&
            selects.map((s, id) => (
              <Grid item xs={12/selects.length}>
                <Card variant="outlined" className={classes.actions}> 
                  <FormControl key={`select-${id}`} fullWidth>
                    <InputLabel id={`label-${id}`}>{s.name}</InputLabel>
                    <Select
                      labelId={`label-${id}`}
                      label={s.name}
                      onChange={(e) => setAndClearUpTo(e.target.value, id)}
                      value={s.relVal()}
                    >
                      {
                        getMenuItemLevel(id).map((val, idx) => {
                          const parsedVal = JSON.parse(val);
                          return (
                            <MenuItem value={parsedVal.tag} key={`${id}-${idx}`}>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                              <span>{parsedVal.tag}</span>
                              <span style={{color: "gray", marginLeft: "0.5em" }}>
                                {desplayFormattedCreateTime(parsedVal.time)}
                              </span>
                            </div>
                          </MenuItem>
                          )
                        }
                      )}
                    </Select>
                  </FormControl>
                  <Tooltip title="Delete selected">
                    <>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteVersion(id)}
                        disabled={shouldDisableDeleteButton(id)}
                      >
                        Delete
                      </Button>
                    </>
                  </Tooltip>
                </Card>
              </Grid>
            )
          )}
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              onClick={() => setShowPageHeader(!showPageHeader)}
              fullWidth
              startIcon={showPageHeader ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />}
              style={{
                backgroundColor: 'lightgray',
                color: 'black',
              }}
            >
            </Button>
          </Grid>
        </Grid>

      
      <Grid container padding={1} spacing={1} style={{ marginTop: showPageHeader ? '14.5em' : '2em' }}>
        {uniqueLabelName && ( 
          <DiffDisplay olderVersionTag={olderVersionTag} newerVersionTag={newerVersionTag} latestVersionStr={latestVersionStr}/> 
        )}
      </Grid>
    </Box>
  );

}
