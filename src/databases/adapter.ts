import { IMessageRepository, IUserRepository } from "./types";

export interface IRepository<TUser>
  extends IMessageRepository,
    IUserRepository<TUser> {}
