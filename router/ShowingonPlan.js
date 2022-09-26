// 定义电影相关的接口
const express = require("express");
const { date } = require("joi");
const router = express.Router();
const Joi = require("joi");
const { off } = require("../utils/db.js");
// 引入mysql连接池
const pool = require("../utils/db.js");
const Response = require("../utils/Response.js");

/**
 * 通过放映厅ID查询排片计划列表
 * @param:
 *   id:  // 放映厅id
 * @return:
 *   {code:200, msg:'ok', data:{}}
 */
router.get("/plans/roomid", (req, resp) => {
  let { room_id } = req.query;

  // 表单验证
  let schema = Joi.object({
    room_id: Joi.number().required(), // 必填
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }

  // 执行查询业务
  let sql = `select 
    sp.id plan_id,
    sp.cinema_id cinema_id,
    sp.cinema_room_id cinema_room_id,
    sp.movie_id movie_id,
    mi.title title,
    sp.showingon_date showingon_date,
    sp.showingon_time showingon_time,
    sp.price price,
    sp.status status
  from
    showingon_plan sp join movie_info mi on sp.movie_id=mi.id 
  where 
    cinema_room_id=? and showingon_date>?
  order by
    showingon_date, showingon_time`;

  let now = new Date();
  let year = now.getFullYear();
  let month =
    now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth();
  let day = now.getDay() ? "0" + now.getDay() : now.getDay();
  let time = `${year}-${month}-${day}`;

  pool.query(sql, [room_id, time], (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
      throw error;
    }
    resp.send(Response.ok(result));
  });
});

/**
 * 添加排片计划接口
 * @param:
 *   详见接口文档
 * @return:
 *   {code:200, msg:'ok'}
 */
router.post("/plan/add", (req, resp) => {
  let {
    cinema_id,
    cinema_room_id,
    movie_id,
    showingon_date,
    showingon_time,
    price,
    status,
  } = req.body; // post请求参数在req.body中

  // 表单验证
  let schema = Joi.object({
    cinema_id: Joi.number().required(),
    cinema_room_id: Joi.number().required(),
    movie_id: Joi.number().required(),
    showingon_date: Joi.string()
      .required()
      .pattern(new RegExp("\\d{4}-\\d{2}-\\d{2}")),
    showingon_time: Joi.string()
      .required()
      .pattern(new RegExp("\\d{2}:\\d{2}")),
    price: Joi.number().required(),
    status: Joi.number().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }

  // 表单验证通过，执行添加操作
  let sql = `insert into showingon_plan (
    cinema_id,
    cinema_room_id,
    movie_id,
    showingon_date,
    showingon_time,
    price,
    status) values (?,?,?,?,?,?,?)`;
  pool.query(
    sql,
    [
      cinema_id,
      cinema_room_id,
      movie_id,
      showingon_date,
      showingon_time,
      price,
      status,
    ],
    (error, result) => {
      if (error) {
        resp.send(Response.error(500, error));
      }
      resp.send(Response.ok());
    }
  );
});

/**
 * 删除排片计划接口
 * @param:
 *   id:  // 放映厅id
 * @return:
 *   {code:200, msg:'ok'}
 */
router.post("/plan/del", (req, resp) => {
  let { id } = req.body;

  // 表单验证
  let schema = Joi.object({
    id: Joi.string().required(), // 必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }

  // 执行删除排片计划业务
  let sql = "delete from showingon_plan where id = ?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
    }
    resp.send(Response.ok());
  });
});

/**
 * 修改将排片计划设置为发布状态业务
 * @param:
 *   详见接口文档
 * @return:
 *   {code:200, msg:'ok', data:[{}]}
 */
router.post("/plan/publish", (req, resp) => {
  let { id } = req.body;

  // 表单验证
  let schema = Joi.object({
    id: Joi.string().required(), // 必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }

  // 执行将排片计划设置为发布状态业务
  let sql = "update showingon_plan set status=1 where id = ?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
    }
    resp.send(Response.ok());
  });
});

/**
 * 修改将排片计划设置为未发布状态业务
 * @param:
 *   详见接口文档
 * @return:
 *   {code:200, msg:'ok', data:[{}]}
 */
router.post("/plan/no-publish", (req, resp) => {
  let { id } = req.body;

  // 表单验证
  let schema = Joi.object({
    id: Joi.string().required(), // 必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }

  // 执行将排片计划设置为未发布状态业务
  let sql = "update showingon_plan set status=0 where id = ?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
    }
    resp.send(Response.ok());
  });
});

// 将router对象导出
module.exports = router;
