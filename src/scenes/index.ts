import { Scenes } from "telegraf";
import shareScene from "./share/index.js";

const scenes = [shareScene];
const stage = new Scenes.Stage<Scenes.SceneContext>(scenes);

export default stage;
