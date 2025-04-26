import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import LineChartUtils from "../classes/LineChartUtils";
import LineChart from "../components/LineChart";
import {
  TLineChartData,
  TLineChartDataFields,
} from "../entities/TLineChartData";
import GraphService from "../services/GraphService";
import { TServiceStatistics } from "../entities/TStatistics";
import ServiceStatisticsTable from '../components/ServiceStatisticsTable';

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    overflowX: "clip",
    paddingTop: "1em",
  },
  select: {
    minWidth: 130,
    marginRight: "1em",
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
    marginTop: '8em',
  },
}));

export default function Metrics() {
  const classes = useStyles();
  const [lastTimes, setLastTimes] = useState<number>(1800); //display data for the last 30 minutes by default
  const [mappedHistoricalData, setMappedHistoricalData] =
    useState<TLineChartData>();
  const [statistics,setStatistics] = useState<TServiceStatistics[]>([]);

  useEffect(() => {
    const unsubscribe = [
      GraphService.getInstance().subscribeToLineChartData(
        setMappedHistoricalData,lastTimes * 1000
      ),
    ];

    return () => {
      unsubscribe.forEach((un) => un());
    };
  }, [lastTimes]);

  useEffect(() => {
    const unsubscribeStatistics = [
      GraphService.getInstance().subscribeToServiceHistoricalStatistics(
        setStatistics,lastTimes * 1000
      ),
    ];
    return () => {
      unsubscribeStatistics.forEach((uns) => uns());
    };
  }, [lastTimes]);

  const areaCharts: {
    name: string;
    field: TLineChartDataFields;
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

  const statisticsTimeOptions = [
    { label: 'last 10 min', value: 600 },
    { label: 'last 30 min', value: 1800 },
    { label: 'last 1 hr'  , value: 3600 },
    { label: 'last 3 hr'  , value: 10800 },
    { label: 'last 6 hr'  , value: 21600 },
    { label: 'last 12 hr' , value: 43200 },
    { label: 'last 1 day' , value: 86400 },
    { label: 'last 7 days', value: 604800 },
  ];

  return (
    <Box className={classes.root}>
      <Grid container padding={1} spacing={0.5} className={classes.pageHeader}>
        <Grid item xs={12} margin="1em 1em 0 0" >
        <FormControl className={classes.select}>
          <InputLabel id="lt-label">LastTimes</InputLabel>
          <Select
            labelId="lt-label"
            label="LastTimes"
            onChange={(e) => setLastTimes(+e.target.value)}
            value={lastTimes}
          >
            {statisticsTimeOptions.map((option) => (
              <MenuItem key={`lt-item-${option.value}`} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Grid>
      </Grid>
      <Grid container className={classes.pageBody}>
        {mappedHistoricalData
          ? areaCharts.map((c) => (
              <Grid key={c.name} item xs={6}>
                <LineChart
                  title={c.name}
                  series={LineChartUtils.MappedBaseDataToSeriesData(
                    mappedHistoricalData,
                    c.field
                  )}
                  overwriteOptions={c.options}
                />
              </Grid>
            ))
          : null}
        <Grid item xs={12} padding={1}>
          <ServiceStatisticsTable servicesStatistics={statistics} />
        </Grid>
      </Grid>
    </Box>
  );
}
