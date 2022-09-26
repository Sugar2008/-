import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";
import { del } from "vue";

const movieThumbApi = {
  /**
   * 添加电影剧照接口
   * @param {object}
   *   params: 详见接口文档
   * @returns
   */
  add(params) {
    return myAxios.post(BASEURL + "/movie-thumb/add", params);
  },

  /**
   * 查询相应电影id下的所有剧照
   * @param {object}
   *   params: 详见接口文档 movieid
   * @returns
   */
  listByMovieId(params) {
    return myAxios.get(BASEURL + "/movie-thumbs/movieid", params);
  },

  /**
   * 删除相应ID的电影剧照
   * @param {object} params {id:1}
   * @returns
   */
  delete(params) {
    return myAxios.post(BASEURL + "/movie-thumb/del", params);
  },
};

export default movieThumbApi;
