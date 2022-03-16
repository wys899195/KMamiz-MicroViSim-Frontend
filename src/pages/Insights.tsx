import { makeStyles } from "@mui/styles";
import { Box, Grid } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import { TChordData } from "../entities/TChordData";
import GraphService from "../services/GraphService";
import Chord from "../components/Chord";
import { Unsubscribe } from "../services/DataView";
import ReactApexChart from "react-apexcharts";
import BarChartUtils from "../classes/BarChartUtils";
import { TTotalServiceInterfaceCohesion } from "../entities/TTotalServiceInterfaceCohesion";
import { TServiceInstability } from "../entities/TServiceInstability";
import StackedLineChartUtils from "../classes/StackedLineChartUtils";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    overflowX: "clip",
    marginBottom: "5em",
  },
  chord: {
    padding: "0.5em",
  },
}));

function handleChordNext(
  strategy: (sub: (data?: TChordData) => void) => Unsubscribe,
  setFunc: React.Dispatch<React.SetStateAction<TChordData | undefined>>,
  ref: React.MutableRefObject<TChordData | undefined>
) {
  return strategy((data) => {
    if (data && JSON.stringify(data) !== JSON.stringify(ref.current)) {
      setFunc(data);
      ref.current = data;
    }
  });
}

export default function Insights() {
  const classes = useStyles();
  const sChordRef = useRef<TChordData>();
  const iChordRef = useRef<TChordData>();
  const [sChord, setSChord] = useState<TChordData>();
  const [iChord, setIChord] = useState<TChordData>();
  const [cohesion, setCohesion] = useState<TTotalServiceInterfaceCohesion[]>(
    []
  );
  const [instability, setInstability] = useState<TServiceInstability[]>([]);

  useEffect(() => {
    const unsubscribe = [
      handleChordNext(
        GraphService.getInstance().subscribeToDirectChord,
        setSChord,
        sChordRef
      ),
      handleChordNext(
        GraphService.getInstance().subscribeToInDirectChord,
        setIChord,
        iChordRef
      ),
      GraphService.getInstance().subscribeToServiceCohesion(setCohesion),
      GraphService.getInstance().subscribeToServiceInstability(setInstability),
    ];

    return () => {
      unsubscribe.forEach((un) => un());
    };
  }, []);

  return (
    <Box className={classes.root}>
      <Grid container>
        <Grid item xs={6} className={classes.chord}>
          {sChord && <Chord title="Service Dependencies" chordData={sChord} />}
        </Grid>
        <Grid item xs={6} className={classes.chord}>
          {iChord && (
            <Chord title="Indirect Service Dependencies" chordData={iChord} />
          )}
        </Grid>
        <Grid item xs={6}>
          <ReactApexChart
            type="bar"
            height={600}
            options={BarChartUtils.DefaultOptions(
              "Service Cohesion",
              cohesion.map(({ name }) => name)
            )}
            series={BarChartUtils.SerialFromServiceCohesion(cohesion)}
          ></ReactApexChart>
        </Grid>
        <Grid item xs={6}>
          <ReactApexChart
            type="line"
            height={600}
            options={{
              ...StackedLineChartUtils.DefaultOptions(
                "Service Instability (SDP)",
                instability.map(({ name }) => name)
              ),
              yaxis: StackedLineChartUtils.YAxisForServiceInstability(),
            }}
            series={StackedLineChartUtils.SerialFromServiceInstability(
              instability
            )}
          ></ReactApexChart>
        </Grid>
      </Grid>
    </Box>
  );
}
