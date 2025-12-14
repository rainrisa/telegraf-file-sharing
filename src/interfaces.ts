import { NarrowedContext } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram.js";
import {
  SceneContext,
  SceneSessionData,
} from "telegraf/typings/scenes/index.js";

export type CommandContext = NarrowedContext<
  SceneContext<SceneSessionData>,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }
>;

export interface ShareConfig {
  direct: boolean;
}
