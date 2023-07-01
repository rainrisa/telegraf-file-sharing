import mongoose, { Model, Schema, model } from "mongoose";
import env from "../services/env.js";

export interface MessageDocument {
  shareId: number;
  messageIds: number[];
}
export const MessageModel = model(
  "message",
  new Schema({
    shareId: { type: Number, required: true, unique: true },
    messageIds: { type: [Number], required: true },
  })
);
class MongoDB {
  db: typeof mongoose;
  MessageModel: Model<MessageDocument>;
  databaseUrl: string;

  constructor() {
    this.db = mongoose;
    this.MessageModel = MessageModel;
    this.databaseUrl = env.databaseUrl || "";
  }

  async initialize() {
    await this.db.connect(this.databaseUrl);
  }

  async saveMessages(shareId: number, messageIds: number[]) {
    await new this.MessageModel({
      shareId,
      messageIds,
    }).save();

    return shareId;
  }

  async getMessages(shareId: number) {
    return (await this.MessageModel.findOne({ shareId }))?.messageIds;
  }
}
const mongoDB = new MongoDB();

export default mongoDB;
