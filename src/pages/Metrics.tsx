import { Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import AreaLineChartUtils from "../classes/AreaLineChartUtils";
import { GetAreaLineData } from "../classes/MockData";
import AreaLineChart from "../components/AreaLineChart/AreaLineChart";
import Chord from "../components/Chord";
import IChordNode from "../entities/IChordNode";
import IChordRadius from "../entities/IChordRadius";
import IMappedHistoryData, {
  IMappedHistoryDataAvailableFields,
} from "../entities/IMappedHistoryData";
import GraphService from "../services/GraphService";

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
  const [serviceChord, setServiceChord] = useState<{
    links: IChordRadius[];
    nodes: IChordNode[];
  }>({ links: [], nodes: [] });
  const [indirectServiceChord, setIndirectServiceChord] = useState<{
    links: IChordRadius[];
    nodes: IChordNode[];
  }>({ links: [], nodes: [] });

  const [mappedHistoryData, setMappedHistoryData] = useState<
    IMappedHistoryData[]
  >([]);

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

    // TODO: change to api call
    setMappedHistoryData(GetAreaLineData());
  }, []);

  const areaCharts: {
    name: string;
    field: IMappedHistoryDataAvailableFields;
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
                  series={AreaLineChartUtils.MappedHistoryDataToSeriesData(
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
