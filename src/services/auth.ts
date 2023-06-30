import env from "./env.js";

class Auth {
  isAdmin(userId: number) {
    return env.adminIds.includes(userId);
  }
}
const auth = new Auth();

export default auth;
