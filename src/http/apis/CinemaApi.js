import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";

const cinemaApi = {
  /**
   * 删除电影剧接口
   * @param {object}
   *   params: {id}
   * @returns
   */
  delete(params) {
    return myAxios.post(BASEURL + "/cinema/del", params);
  },

  /**
   * 添加电影剧接口
   * @param {object}
   *   params: 详见接口文档
   * @returns
   */
  add(params) {
    return myAxios.post(BASEURL + "/cinema/add", params);
  },

  /**
   * 查询所有的电影院
   */
  list() {
    return myAxios.get(BASEURL + "/cinemas");
  },

  /**
   * 查询所有的影院标签
   */
  queryAllTags() {
    return myAxios.get(BASEURL + "/cinema/tags");
  },

  /**
   * 查询所有的影院标签
   * @param:
   *   params: 存放影院ID的对象 {id:2}
   * @returns
   */
  queryById(params) {
    return myAxios.get(BASEURL + "/cinema/query", params);
  },

  /**
   * 通过id修改影院信息
   * @param:{object}
   *   params: 详见接口文档
   * @returns
   */
  update(params) {
    return myAxios.post(BASEURL + "/cinema/update", params);
  },
};

export default cinemaApi;
