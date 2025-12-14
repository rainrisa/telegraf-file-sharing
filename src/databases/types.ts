export interface IMessageRepository {
  initialize(): Promise<void>;

  saveMessages(message: MessageEntity): Promise<number>;
  getMessages(shareId: number): Promise<MessageEntity | undefined>;
}

export interface IUserRepository<TUser> {
  saveUser(user: TUser): Promise<TUser>;
  getTotalUsers(): Promise<number>;
  getAllUsers(): AsyncIterable<TUser>;
}

export interface MessageEntity {
  shareId: number;
  messageIds: number[];
  direct: boolean;
}
