import { makeStyles } from "@mui/styles";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { percent, Root } from "@amcharts/amcharts5";
import { ChordDirected } from "@amcharts/amcharts5/flow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import ViewportUtils from "../classes/ViewportUtils";
import ChordUtils from "../classes/ChordUtils";
import IChordRadius from "../entities/IChordRadius";
import IChordNode from "../entities/IChordNode";
import { Card } from "@mui/material";

const useStyles = makeStyles(() => ({
  root: {
    textAlign: "center",
  },
  chart: {
    width: "100%",
  },
}));

export type ChordDiagramOptions = {
  title: string;
  chordData: {
    links: IChordRadius[];
    nodes: IChordNode[];
  };
};

export default function Chord(props: ChordDiagramOptions) {
  const classes = useStyles();
  const cordRef = useRef<ChordDirected | null>(null);
  const [divId] = useState(`id-${Math.random()}`);
  const [size, setSize] = useState(0);
  const [scale, setScale] = useState(0.8);

  useLayoutEffect(() => {
    // register to viewport resize
    const unsubscribe = ViewportUtils.getInstance().subscribe(([vw]) =>
      setSize(vw / 3)
    );

    // create the chord diagram
    const root = Root.new(divId);
    root.setThemes([am5themes_Animated.new(root)]);
    cordRef.current = ChordUtils.CreateDefault(root);
    ChordUtils.FillData(
      root,
      cordRef.current!,
      props.chordData.links,
      props.chordData.nodes
    );

    // teardown
    return () => {
      unsubscribe();
      root.dispose();
    };
  }, [props.chordData]);

  useEffect(() => {
    cordRef.current?.set("scale", scale);
  }, [scale]);

  return (
    <div className={classes.root}>
      <h3>{props.title}</h3>
      <Card variant="outlined">
        <div
          id={divId}
          className={classes.chart}
          style={{ height: size }}
          onWheel={(e) => {
            const newScale = scale + (e.deltaY > 0 ? 0.2 : -0.2);
            /**
             * Make sure scale is always greater than 0
             * Since `scale = 0` makes the diagram disappear,
             * and a negative scale value mirrors the diagram.
             */
            if (newScale > 0.1) setScale(newScale);
          }}
          onMouseDown={(e) => {
            // reset view on mouse middle click
            if (e.button !== 1) return;
            cordRef.current?.set("x", percent(50));
            cordRef.current?.set("y", percent(50));
            cordRef.current?.set("startAngle", 80);
            setScale(1);
          }}
        ></div>
      </Card>
    </div>
  );
}
