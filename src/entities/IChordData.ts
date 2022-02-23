import IChordNode from "./IChordNode";
import IChordRadius from "./IChordRadius";

export default interface IChordData {
  nodes: IChordNode[];
  links: IChordRadius[];
}
