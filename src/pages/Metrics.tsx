import { Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useRef, useState } from "react";
import AreaLineChartUtils from "../classes/AreaLineChartUtils";
import AreaLineChart from "../components/AreaLineChart";
import Chord from "../components/Chord";
import {
  TAreaLineChartData,
  TAreaLineChartDataFields,
} from "../entities/TAreaLineChartData";
import GraphService from "../services/GraphService";
import { TChordData } from "../entities/TChordData";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    overflowX: "clip",
  },
  chord: {
    padding: "0.5em",
  },
}));

export default function Metrics() {
  const classes = useStyles();
  const sChordRef = useRef<TChordData>();
  const iChordRef = useRef<TChordData>();

  const [mappedHistoryData, setMappedHistoryData] = useState<
    TAreaLineChartData[]
  >([]);

  useEffect(() => {
    const unsubscribe = [
      GraphService.getInstance().subscribeToDirectChord((data) => {
        if (
          data &&
          JSON.stringify(data) !== JSON.stringify(sChordRef.current)
        ) {
          sChordRef.current = data;
        }
      }),
      GraphService.getInstance().subscribeToInDirectChord((data) => {
        if (
          data &&
          JSON.stringify(data) !== JSON.stringify(iChordRef.current)
        ) {
          iChordRef.current = data;
        }
      }),
      GraphService.getInstance().subscribeToAreaLineData(setMappedHistoryData),
    ];

    return () => {
      unsubscribe.forEach((un) => un());
    };
  }, []);

  const areaCharts: {
    name: string;
    field: TAreaLineChartDataFields;
    options?: any;
  }[] = [
    { name: "Requests", field: "requests" },
    {
      name: "Risks",
      field: "risk",
      options: {
        yaxis: {
          max: 1,
          min: 0,
        },
      },
    },
    { name: "RequestErrors", field: "requestErrors" },
    { name: "ServerErrors", field: "serverErrors" },
    { name: "Latency (Coefficient of Variation)", field: "latencyCV" },
  ];

  return (
    <Box className={classes.root}>
      <Grid container>
        <Grid item xs={6} className={classes.chord}>
          {sChordRef.current && (
            <Chord title="Service Dependencies" chordData={sChordRef.current} />
          )}
        </Grid>
        <Grid item xs={6} className={classes.chord}>
          {iChordRef.current && (
            <Chord
              title="Indirect Service Dependencies"
              chordData={iChordRef.current}
            />
          )}
        </Grid>
        {mappedHistoryData
          ? areaCharts.map((c) => (
              <Grid key={c.name} item xs={6}>
                <AreaLineChart
                  title={c.name}
                  series={AreaLineChartUtils.MappedBaseDataToSeriesData(
                    mappedHistoryData,
                    c.field
                  )}
                  overrideOptions={c.options}
                />
              </Grid>
            ))
          : null}
      </Grid>
    </Box>
  );
}
