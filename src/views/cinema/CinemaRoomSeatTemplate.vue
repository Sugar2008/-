<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
      <el-breadcrumb-item>放映厅列表</el-breadcrumb-item>
      <el-breadcrumb-item>配置座位模板</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线 -->
    <el-divider></el-divider>

    <!-- 配置作为模板内容 -->
    <el-container>
      <el-aside>
        <!-- 时间线 -->
        <el-timeline>
          <!-- 第一步 -->
          <el-timeline-item timestamp="第一步" placement="top">
            <el-card :body-style="{ padding: '15px' }">
              <div slot="header" class="clearfix">
                <span>编辑坐标系</span>
              </div>
              <el-form label-width="40px">
                <el-form-item label="行数">
                  <el-input v-model="rows" placeholder="请输入行数"></el-input>
                </el-form-item>
                <el-form-item label="列数">
                  <el-input v-model="cols" placeholder="请输入列数"></el-input>
                </el-form-item>
                <el-button
                  @click="step1()"
                  size="small"
                  type="primary"
                  plain
                  style="width: 100%"
                  >生成坐标模板</el-button
                >
              </el-form>
            </el-card>
          </el-timeline-item>

          <!-- 第二步 -->
          <el-timeline-item timestamp="第二步" placement="top">
            <el-card :body-style="{ padding: '15px' }">
              <div slot="header" class="clearfix">
                <span>选择座位区域（框选）</span>
              </div>
              <el-button
                @click="step2()"
                size="small"
                type="primary"
                plain
                style="width: 100%"
                >撤销选中</el-button
              >
            </el-card>
          </el-timeline-item>

          <!-- 第三步 -->
          <el-timeline-item timestamp="第三步" placement="top">
            <el-card :body-style="{ padding: '15px' }">
              <div slot="header" class="clearfix">
                <span>选择座类型</span>
              </div>
              <el-button
                @click="step3_1()"
                size="small"
                type="primary"
                plain
                style="width: 48%"
                >普通座位</el-button
              >
              <el-button
                @click="step3_2()"
                size="small"
                type="primary"
                plain
                style="width: 47.8%"
                >过道</el-button
              >
            </el-card>
          </el-timeline-item>

          <!-- 第四步 -->
          <el-timeline-item timestamp="第四步" placement="top">
            <el-card :body-style="{ padding: '15px' }">
              <div slot="header" class="clearfix">
                <span>确认模板</span>
              </div>
              <el-button
                @click="step4()"
                size="small"
                type="success"
                plain
                style="width: 100%"
                >选好了</el-button
              >
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-aside>
      <el-main>
        <!-- 提示内容 -->
        <div class="tip">
          <div class="tip-item" style="background: #36d6"></div>
          未分配 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div class="tip-item" style="background: #36d"></div>
          已选择座位 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div class="tip-item" style="background: #a11"></div>
          普通座位 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div class="tip-item" style="background: #3333"></div>
          过道
        </div>

        <el-divider></el-divider>
        <el-divider>电影荧屏</el-divider>

        <!-- 画布 -->
        <canvas id="canvas"></canvas>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import SeatSelector from "@/libs/SeatSelector.js";
export default {
  data() {
    return {
      rows: "",
      cols: "",
      seatSelector: null, // 座位模板对象
      id: this.$route.params.id, // 放映厅的ID
    };
  },
  methods: {
    // 生成座位模板，并且绘制在canvas中
    step1() {
      let row = parseInt(this.rows);
      let col = parseInt(this.cols);
      this.seatSelector = new SeatSelector(row, col, "canvas"); // 创建SeatSelector对象，传入行数、列数、canvas
      this.seatSelector.draw(); // 将座位模板刻在canvas中
    },

    // 撤销选中
    step2() {
      if (this.seatSelector) {
        this.seatSelector.setNoSelect();
      }
    },

    // 设置选中座位为普通座位
    step3_1() {
      if (this.seatSelector) {
        this.seatSelector.setSelectedSeatsToNormalSeats();
      }
    },

    // 设置选中座位为过道
    step3_2() {
      if (this.seatSelector) {
        this.seatSelector.setSelectedSeatsToGangway();
      }
    },

    // 选好了
    step4() {
      if (this.seatSelector) {
        try {
          let seat_template = this.seatSelector.getSeatTemplateJsonString();
          let room_size = this.seatSelector.getSeatCount();
          let id = this.id;
          // 发送请求，更新放映厅的座位模板
          this.$http.CinemaRoomApi.updateSeatTemplate({
            id,
            seat_template,
            room_size,
          }).then((res) => {
            console.log("更新放映厅的座位模板", res);
            if (res.data.code == 200) {
              this.$message.success("更新放映厅的座位模板完成");
              this.$router.go(-1);
            }
          });
        } catch (error) {
          this.$message.error(error);
        }
      }
    },
  },
};
</script>
<style scoped>
main {
  padding: 0 0 0 20px;
}
#canvas {
  border: 1px dashed #999;
  border-radius: 4px;
  display: none;
  margin: 30px auto;
}
.tip {
  text-align: center;
  font-size: 14px;
  margin: 23px 0 20px 0;
}
.tip-item {
  display: inline-block;
  background: #3333;
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
</style>
