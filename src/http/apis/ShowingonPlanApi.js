import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";

const showingonPlanApi = {
  /**
   * 添加排片计划接口
   * @param {object}
   *   params:详见接口文档
   * @returns
   */
  add(params) {
    return myAxios.post(BASEURL + "/plan/add", params);
  },

  /**
   * 通过roomid查询放映厅排片计划列表
   * @param {object}
   *   params: {room_id:1}
   * @returns
   */
  queryByRoomId(params) {
    return myAxios.get(BASEURL + "/plans/roomid", params);
  },

  /**
   * 根据id删除排片计划
   * @param {object}
   *   params: {id:1}
   * @returns
   */
  delete(params) {
    return myAxios.post(BASEURL + "/plan/del", params);
  },

  /**
   * 将排片计划设置为发布状态
   * @param {object}
   *   params: {id:1}
   * @returns
   */
   publish(params) {
    return myAxios.post(BASEURL + "/plan/publish", params);
  },

  /**
   * 将排片计划设置为未发布状态
   * @param {object}
   *   params: {id:1}
   * @returns
   */
   noPublish(params) {
    return myAxios.post(BASEURL + "/plan/no-publish", params);
  },
};

export default showingonPlanApi;
