import toNumArr from "../extra/toNumArr.js";
import env from "./env.js";

class Auth {
  isAdmin(userId: number) {
    return true || toNumArr(env.ADMIN_IDS).includes(userId);
  }
}
const auth = new Auth();

export default auth;
