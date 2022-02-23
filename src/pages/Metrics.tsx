import { Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import AreaLineChartUtils from "../classes/AreaLineChartUtils";
import AreaLineChart from "../components/AreaLineChart";
import Chord from "../components/Chord";
import IAreaLineChartData, {
  IAreaLineChartDataFields,
} from "../entities/IAreaLineChartData";
import GraphService from "../services/GraphService";
import IChordData from "../entities/IChordData";

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
  const [serviceChord, setServiceChord] = useState<IChordData>({
    links: [],
    nodes: [],
  });
  const [indirectServiceChord, setIndirectServiceChord] = useState<IChordData>({
    links: [],
    nodes: [],
  });

  const [mappedHistoryData, setMappedHistoryData] = useState<
    IAreaLineChartData[]
  >([]);

  useEffect(() => {
    const unsubscribe = [
      GraphService.getInstance().subscribeToDirectChord((data) => {
        if (data && JSON.stringify(data) !== JSON.stringify(serviceChord)) {
          setServiceChord(data);
        }
      }),
      GraphService.getInstance().subscribeToInDirectChord((data) => {
        if (
          data &&
          JSON.stringify(data) !== JSON.stringify(indirectServiceChord)
        ) {
          setIndirectServiceChord(data);
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
    field: IAreaLineChartDataFields;
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
          <Chord title="Service Dependencies" chordData={serviceChord} />
        </Grid>
        <Grid item xs={6} className={classes.chord}>
          <Chord
            title="Indirect Service Dependencies"
            chordData={indirectServiceChord}
          />
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
