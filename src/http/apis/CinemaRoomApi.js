import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";

const cinemaRoomApi = {
  /**
   * 删除放映厅接口
   * @param {object}
   *   params: {id}
   * @returns
   */
  delete(params) {
    return myAxios.post(BASEURL + "/cinema-room/del", params);
  },

  /**
   * 添加放映厅接口
   * @param {object}
   *   params: 详见接口文档
   * @returns
   */
  add(params) {
    return myAxios.post(BASEURL + "/cinema-room/add", params);
  },

  /**
   * 根据影院ID查询所有的放映厅
   */
  list(params) {
    return myAxios.get(BASEURL + "/cinema-rooms/cinemaid", params);
  },

  /**
   * 查询所有放映厅的类型
   */
  queryAllTypes() {
    return myAxios.get(BASEURL + "/cinema-room/types");
  },

  /**
   * 修改座位类型
   */
  updateSeatTemplate(params) {
    return myAxios.post(BASEURL + "/cinema-room/edit-seat-template", params);
  },

  /**
   * 通过ID查询所有放映厅的信息
   */
  queryById(params) {
    return myAxios.get(BASEURL + "/cinema-room/query",params);
  },
};

export default cinemaRoomApi;
