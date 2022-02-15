import { makeStyles } from "@mui/styles";
const useStyles = makeStyles(() => ({
  root: {},
}));

export default function Metrics() {
  const classes = useStyles();
  return <div className={classes.root}>Metrics Template</div>;
}
