import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";
import { del } from "vue";

const movieApi = {
  /**
   * 添加电影接口
   * @param {object}
   *   params: 详见接口文档
   * @returns
   */
  add(params) {
    return myAxios.post(BASEURL + "/movie-info/add", params);
  },

  /**
   * 查询电影类型的列表
   */
  listAllMovieTypes() {
    return myAxios.get(BASEURL + "/movie-types");
  },

  /**
   * 查询所有电影
   * @param {object}
   *   params: 详见接口文档 page,pagesize
   * @returns
   */
  list(params) {
    return myAxios.get(BASEURL + "/movie-infos", params);
  },

  /**
   * 通过电影名称关键字模糊查询所有电影
   * @param {object}
   *   params: 详见接口文档 name,page,pagesize
   * @returns
   */
  listByName(params) {
    return myAxios.post(BASEURL + "/movie-infos/name", params);
  },

  /**
   * 删除相应ID的电影
   * @param {object} params {id:1}
   * @returns
   */
  delete(params) {
    return myAxios.post(BASEURL + "/movie-info/del", params);
  },

  /**
   * 通过ID查询电影
   * @param {object} params {id:1}
   * @returns
   */
  queryById(params) {
    return myAxios.get(BASEURL + "/movie-info/query", params);
  },

  /**
   * 更新电影信息接口
   * @param {object} params {id:1}
   * @returns
   */
  update(params) {
    return myAxios.post(BASEURL + "/movie-info/update", params);
  },

  /**
   * 为电影绑定演员列表
   * @param {object}
   *   params {movir_id:'1', actor_ids:'1,2,3,4,5'}
   * @returns
   */
  bindActors(params) {
    return myAxios.post(BASEURL + "/movie-info/bind-actors", params);
  },
};

export default movieApi;
