import { Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import AreaLineChartUtils from "../classes/AreaLineChartUtils";
import AreaLineChart from "../components/AreaLineChart";
import {
  TAreaLineChartData,
  TAreaLineChartDataFields,
} from "../entities/TAreaLineChartData";
import GraphService from "../services/GraphService";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    overflowX: "clip",
    paddingTop: "1em",
  },
}));

export default function Metrics() {
  const classes = useStyles();
  const [mappedHistoryData, setMappedHistoryData] = useState<
    TAreaLineChartData[]
  >([]);

  useEffect(() => {
    const unsubscribe = [
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
