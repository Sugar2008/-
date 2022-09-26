<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
      <el-breadcrumb-item>放映厅列表</el-breadcrumb-item>
      <el-breadcrumb-item>排片计划列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线 -->
    <el-divider></el-divider>

    <el-divider content-position="left">
      <p>
        <span style="color: #409eff; font-weight: bold">{{
          cinemaRoomInfo.cinema_name
        }}</span>
        的
        <span style="color: #409eff; font-weight: bold"
          >&nbsp;&nbsp;{{ cinemaRoomInfo.cinema_room_name }}（{{
            cinemaRoomInfo.cinema_room_type
          }}）</span
        >
        的排片计划列表
      </p>
    </el-divider>
    <div style="height: 20px"></div>

    <!-- 排片计划列表 -->
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column align="center" prop="title" label="电影名称" width="280">
      </el-table-column>
      <el-table-column
        align="center"
        prop="showingon_date"
        label="放映时间"
        width="220"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="showingon_time"
        label="场次"
        width="180"
      >
      </el-table-column>
      <el-table-column align="center" prop="price" label="票价" width="160">
        <template slot-scope="scope">
          {{scope.row.price}}元
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="是否已发布"
        width="180"
      >
        <template slot-scope="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.status"
            @change="changeStatus(scope.row.plan_id,scope.row.status)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="delPlan(scope.row.plan_id)"
            title="删除计划"
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cinema_room_id: this.$route.params.id, // 存储放映厅ID
      cinemaRoomInfo: {}, // 存储当前放映厅基本信息
      tableData: [], // 排片计划
    };
  },

  methods: {
    changeStatus(id, val) {
      if (val == 0) {
        this.noPublishPlan(id);
      } else {
        this.publishPlan(id);
      }
    },

    // 将排片计划设置为发布状态
    publishPlan(id) {
      this.$http.ShowingonPlanApi.publish({ id }).then((res) => {
        console.log("发布该排片计划请求", res);
        if (res.data.code == 200) {
          this.$message.success("该计划成功发布");
        }
      });
    },

    // 将排片计划设置为未发布状态
    noPublishPlan(id) {
      this.$http.ShowingonPlanApi.noPublish({ id }).then((res) => {
        console.log("已成功阻止该计划发布请求", res);
        if (res.data.code == 200) {
          this.$message.warning("已成功阻止该计划发布");
        }
      });
    },

    // 删除排片计划请求
    delPlan(id) {
      this.$http.ShowingonPlanApi.delete({ id }).then((res) => {
        console.log("删除排片计划请求", res);
        if (res.data.code == 200) {
          this.$message.success("删除该计划成功");
          this.loadShowingonPlans();
        }
      });
    },

    // 加载放映厅的基本信息
    loadCurrentCinameRoom() {
      this.$http.CinemaRoomApi.queryById({ id: this.cinema_room_id }).then(
        (res) => {
          console.log("加载当前放映厅的基本信息", res);
          if (res.data.code == 200) {
            this.cinemaRoomInfo = res.data.data;
          }
        }
      );
    },

    // 加载当前放映厅额排片计划列表
    loadShowingonPlans() {
      this.$http.ShowingonPlanApi.queryByRoomId({
        room_id: this.cinema_room_id,
      }).then((res) => {
        console.log("加载当前放映厅额排片计划列表", res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        }
      });
    },
  },

  mounted() {
    // 加载放映厅的基本信息
    this.loadCurrentCinameRoom();
    // 加载当前放映厅额排片计划列表
    this.loadShowingonPlans();
  },
};
</script>
