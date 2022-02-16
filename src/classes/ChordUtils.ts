import { color, percent, Root } from "@amcharts/amcharts5";
import { ChordDirected } from "@amcharts/amcharts5/flow";
import IChordNode from "../entities/IChordNode";
import IChordRadius from "../entities/IChordRadius";

export default class ChordUtils {
  static CreateDefault(root: Root) {
    return ChordDirected.new(root, {
      startAngle: 80,
      padAngle: 2,
      sourceIdField: "from",
      targetIdField: "to",
      valueField: "value",
      paddingTop: 20,
      paddingBottom: 20,
      draggable: true,
      centerX: percent(50),
      centerY: percent(50),
      x: percent(50),
      y: percent(50),
      scale: 1,
    });
  }

  static FillData(
    root: Root,
    cord: ChordDirected,
    links: IChordRadius[],
    nodes?: IChordNode[]
  ) {
    const series = root.container.children.push(cord);

    series.nodes.labels.template.setAll({
      textType: "adjusted",
      centerX: 0,
      fontSize: 12,
    });
    series.links.template.set("fillStyle", "source");

    if (nodes) {
      series.nodes.data.setAll(
        nodes.map((n) => ({ ...n, fill: color(n.fill) }))
      );
    }
    series.data.setAll(links);
  }
}
