import mongoose, { Model, Schema, model } from "mongoose";
import env from "../services/env.js";
import { User } from "telegraf/typings/core/types/typegram.js";
import { IRepository } from "./adapter.js";
import { MessageEntity } from "./types.js";

export type UserDocument = User;

export const MessageModel = model<MessageEntity>(
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

class MongoRepository implements IRepository<User> {
  private db = mongoose;
  private databaseUrl = env.DATABASE_URL || "";

  async initialize() {
    await this.db.connect(this.databaseUrl);
  }

  async saveMessages(message: MessageEntity) {
    await MessageModel.updateOne(
      { shareId: message.shareId },
      { $set: message },
      { upsert: true },
    );

    return message.shareId;
  }

  async getMessages(shareId: number) {
    const doc = await MessageModel.findOne({
      shareId,
    }).lean<MessageEntity | null>();

    return doc ?? undefined;
  }

  async saveUser(user: User) {
    await UserModel.updateOne(
      { id: user.id },
      { $set: user },
      { upsert: true },
    );
    return user;
  }

  async getTotalUsers() {
    return UserModel.countDocuments();
  }

  async *getAllUsers() {
    const cursor = UserModel.find().cursor();
    for await (const user of cursor) {
      yield user;
    }
  }
}

const mongoRepository = new MongoRepository();

export default mongoRepository;
