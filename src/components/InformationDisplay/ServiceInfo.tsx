import {
  Card,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Article, FiberManualRecord, Warning } from "@mui/icons-material";
import { TAggregateServiceInfo } from "../../entities/TAggregatedData";
import RequestDonutChart from "../RequestDonutChart";

function roundNumber(num: number) {
  return Math.round(num * 10000) / 10000;
}
function sumField(field: string, obj: any[]) {
  return obj.reduce((prev, s: any) => prev + s[field], 0);
}

export default function ServiceInfo(props: {
  services: TAggregateServiceInfo[];
}) {
  props.services.sort((a, b) => a.version.localeCompare(b.version));

  const endpoints = [
    ...new Set<string>(
      props.services
        .map((s) => s.endpoints.map((e) => ({ ...e, version: s.version })))
        .flat()
        .map((e) => `${e.version}\t${e.method}\t${e.labelName}`)
    ),
  ].length;

  const reqErrors = sumField("totalRequestErrors", props.services);
  const srvErrors = sumField("totalServerErrors", props.services);
  const normalReq =
    sumField("totalRequests", props.services) - reqErrors - srvErrors;

  return (
    <div>
      <Card variant="outlined">
        <RequestDonutChart series={[normalReq, reqErrors, srvErrors]} />
      </Card>
      <List>
        <ListItem disablePadding>
          <ListItemIcon>
            <FiberManualRecord color="secondary" />
          </ListItemIcon>
          <ListItemText primary={`Endpoints: ${endpoints}`} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <Warning color="warning" />
          </ListItemIcon>
          <ListItemText
            primary={`Combined Risk: ${roundNumber(
              sumField("avgRisk", props.services) / props.services.length
            )}`}
          />
        </ListItem>
      </List>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Version</TableCell>
              <TableCell>Risk</TableCell>
              <TableCell>Docs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.services.map((s) => (
              <TableRow key={s.version}>
                <TableCell>{s.version}</TableCell>
                <TableCell>{roundNumber(s.avgRisk)}</TableCell>
                <TableCell>
                  <Tooltip title="Open SwaggerUI">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        window.open(
                          `/swagger/${encodeURIComponent(s.uniqueServiceName)}`,
                          "_blank"
                        );
                      }}
                    >
                      <Article />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
