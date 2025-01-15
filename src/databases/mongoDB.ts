import mongoose, { Model, Schema, model } from "mongoose";
import env from "../services/env.js";
import { User } from "telegraf/typings/core/types/typegram.js";

export interface MessageDocument {
  shareId: number;
  messageIds: number[];
}
export type UserDocument = User;

export const MessageModel = model<MessageDocument>(
  "message",
  new Schema({
    shareId: { type: Number, required: true, unique: true },
    messageIds: { type: [Number], required: true },
  }),
);
export const UserModel = model<UserDocument>(
  "user",
  new Schema({
    id: { type: Number, required: true, unique: true },
    is_bot: { type: Boolean, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    username: { type: String },
    language_code: { type: String },
    is_premium: { type: Boolean },
    added_to_attachment_menu: { type: Boolean },
  }),
);
class MongoDB {
  db: typeof mongoose;
  MessageModel: Model<MessageDocument>;
  UserModel: Model<UserDocument>;
  databaseUrl: string;

  constructor() {
    this.db = mongoose;
    this.MessageModel = MessageModel;
    this.UserModel = UserModel;
    this.databaseUrl = env.DATABASE_URL || "";
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

  async saveUser(user: User) {
    await new this.UserModel(user).save();
    return user;
  }

  async getTotalUsers() {
    return this.UserModel.count();
  }
}
const mongoDB = new MongoDB();

export default mongoDB;
