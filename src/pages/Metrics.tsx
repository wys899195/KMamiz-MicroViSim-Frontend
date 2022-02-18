import { Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import Chord from "../components/Chord";
import IChordNode from "../entities/IChordNode";
import IChordRadius from "../entities/IChordRadius";
import GraphService from "../services/GraphService";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
  chord: {
    padding: "0.5em",
  },
}));

export default function Metrics() {
  const classes = useStyles();
  const [serviceChord, setServiceChord] = useState<{
    links: IChordRadius[];
    nodes: IChordNode[];
  }>({ links: [], nodes: [] });
  const [indirectServiceChord, setIndirectServiceChord] = useState<{
    links: IChordRadius[];
    nodes: IChordNode[];
  }>({ links: [], nodes: [] });

  useEffect(() => {
    GraphService.getInstance()
      .getDirectChord()
      .then((data) => {
        if (data) setServiceChord(data);
      });
    GraphService.getInstance()
      .getInDirectChord()
      .then((data) => {
        if (data) setIndirectServiceChord(data);
      });
  }, []);

  return (
    <Box className={classes.root}>
      <Grid container>
        <Grid item xs={6} className={classes.chord}>
          <Chord title="Service Dependencies" chordData={serviceChord} />
        </Grid>
        <Grid item xs={6} className={classes.chord}>
          <Chord
            title="Indirect Service Dependencies"
            chordData={indirectServiceChord}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
