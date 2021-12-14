import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  svg: {
    width: "500px",
    height: "500px",
  },
}));

export default function DependencyGraph() {
  const classes = useStyles();

  return (
    <div>
      <svg id="svg" className={classes.svg}></svg>
    </div>
  );
}
