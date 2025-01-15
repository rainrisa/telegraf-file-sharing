import { NarrowedContext } from "telegraf";
import { Update, Message, User } from "telegraf/typings/core/types/typegram.js";
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

export interface DatabaseClient {
  initialize(): Promise<void>;
  saveMessages(shareId: number, messageIds: number[]): Promise<number>;
  getMessages(shareId: number): Promise<number[] | undefined>;
  saveUser(user: User): Promise<User>;
  getTotalUsers(): Promise<number>;
}
