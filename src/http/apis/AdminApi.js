import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";

const adminApi = {
  /**
   * 执行登录业务
   * @param {object}
   *   params: {userame:xxx, password:xxx}
   * @returns
   */
  login(params) {
    return myAxios.post(BASEURL + "/user/login", params);
  },
};

export default adminApi;
