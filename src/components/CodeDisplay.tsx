import Highlight from "react-highlight";
import { makeStyles } from "@mui/styles";
import { Card } from "@mui/material";

export type CodeDisplayProps = {
  code: string;
};

const useStyles = makeStyles(() => ({
  code: {
    borderRadius: "0.3em",
    border: "1px solid lightgray",
  },
}));
export default function CodeDisplay(props: CodeDisplayProps) {
  const classes = useStyles();
  return (
    <Highlight className={`${classes.code} typescript`}>{props.code}</Highlight>
  );
}
