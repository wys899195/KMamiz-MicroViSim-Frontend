import { Delete } from "@mui/icons-material";
import {
  Card,
  Typography,
  List,
  Divider,
  ListItem,
  IconButton,
  ListItemIcon,
  Chip,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TEndpointLabel } from "../../entities/TEndpointLabel";
import DataService from "../../services/DataService";

type BaseProps = {
  namespace: string;
  service: string;
  version: string;
  userDefinedLabels?: TEndpointLabel;
  triggerUpdate: () => void;
};

const useStyles = makeStyles(() => ({
  card: {
    height: "40em",
    overflow: "auto",
    padding: "0.5em",
  },
  table: {
    maxHeight: "37.8em",
    overflow: "auto",
  },
}));
export default function RuleDisplay(props: BaseProps) {
  const classes = useStyles();

  const display =
    props.userDefinedLabels?.labels.filter(
      (l) =>
        l.uniqueServiceName ===
        `${props.service}\t${props.namespace}\t${props.version}`
    ) || [];

  return (
    <div className={classes.card}>
      <Typography variant="h6">Active Rules</Typography>

      <TableContainer
        component={Paper}
        variant="outlined"
        className={classes.table}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {display.map((l, id) => (
              <TableRow key={`row-${id}`}>
                <TableCell>
                  <Chip
                    label={l.block ? "Block" : "Add"}
                    color={l.block ? "error" : "success"}
                    title={`Rule type: ${l.block ? "Block" : "Add"}`}
                  />
                </TableCell>
                <TableCell>
                  <Chip label={l.method} title={`Method: ${l.method}`} />
                </TableCell>
                <TableCell>{l.label}</TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    title="Delete Rule"
                    onClick={() => {
                      DataService.getInstance()
                        .deleteUserDefinedLabels(l)
                        .then(() => {
                          props.triggerUpdate();
                        });
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
