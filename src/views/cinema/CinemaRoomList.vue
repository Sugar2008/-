<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
      <el-breadcrumb-item>放映厅列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线 -->
    <el-divider></el-divider>

    <!-- 操作按钮 -->
    <el-button type="primary" plain @click="showAddCinemaRoomDialog()"
      >新增放映厅</el-button
    >

    <!-- 列表页面 -->
    <el-divider content-position="left">放映厅列表</el-divider>
    <el-empty
      v-if="!tableData || tableData.length == 0"
      description="当前影院暂无放映厅"
    ></el-empty>

    <div v-else>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column align="center" prop="room_name" label="放映厅名称">
        </el-table-column>
        <el-table-column align="center" prop="room_type" label="放映厅类型">
        </el-table-column>
        <el-table-column align="center" prop="room_size" label="放映厅人数">
          <template slot-scope="scope">
            <span v-if="scope.row.room_size">{{ scope.row.room_size }}</span>
            <span v-else style="color: #aaa">[请先配置作为模板]</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="$router.push(`/home/showingon-plan/list/${scope.row.id}`)"
              title="查看排片计划列表"
              type="primary"
              icon="el-icon-view"
              circle
            ></el-button>
            <el-button
              @click="$router.push(`/home/showingon-plan/${scope.row.id}`)"
              title="添加排片计划"
              type="success"
              icon="el-icon-plus"
              circle
            ></el-button>
            <el-button
              @click="
                $router.push(`/home/cinema-room-seat-template/${scope.row.id}`)
              "
              title="配置放映厅座位模板"
              type="warning"
              icon="el-icon-s-grid"
              circle
            ></el-button>
            <el-button
              @click="showDeleteDialog(scope.row.id)"
              title="删除放映厅"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加放映厅的对话框 -->
    <el-dialog title="添加放映厅" :visible.sync="dialogAddCinemaRoomVisible">
      <el-form :model="form">
        <el-form-item label="放映厅名称" label-width="150">
          <el-input
            style="width: 400px"
            v-model="form.room_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="放映厅类型" label-width="150">
          <el-select
            style="width: 400px"
            v-model="form.room_type"
            placeholder="请选择放映厅类型"
          >
            <el-option
              v-for="item in cinemaRoomTypes"
              :key="item.id"
              :label="item.type_name"
              :value="item.type_name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCinemaRoomVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogAddCinemaRoomVisible: false, // 添加放映厅窗口是否可见
      form: {
        movie_cinema_id: this.$route.params.id, // 绑定当前电影院ID
        room_name: "",
        room_type: "",
      },
      cinemaRoomTypes: [], // 放映厅的类型
      tableData: [], // 存储所有的放映厅
    };
  },
  methods: {
    // 弹出删除对话框
    showDeleteDialog(id) {
      this.$confirm(
        "此操作将会永久删除该放映厅，已有影片排期将作废，是否确定删除放映厅？",
        "注意"
      )
        .then((res) => {
          return this.$http.CinemaRoomApi.delete({ id });
        })
        .then((res) => {
          console.log("删除放映厅请求", res);
          if (res.data.code == 200) {
            this.$message.success("删除成功");
            this.loadCinemaRoomByCinemaId();
          }
        });
    },

    // 提交添加放映厅请求
    onSubmit() {
      this.$http.CinemaRoomApi.add(this.form).then((res) => {
        console.log("提交添加放映厅请求", res);
        if (res.data.code == 200) {
          this.$message.success("添加成功");
          this.dialogAddCinemaRoomVisible = false;
          this.form.room_name = "";
          this.form.room_type = "";
          this.loadCinemaRoomByCinemaId();
        }
      });
    },

    // 显示添加放映厅对话框
    showAddCinemaRoomDialog() {
      this.dialogAddCinemaRoomVisible = true;
    },

    // 加载所有的放映厅类型
    loadAllCinemaRoomTypes() {
      this.$http.CinemaRoomApi.queryAllTypes().then((res) => {
        console.log("加载所有的放映厅类型", res);
        if (res.data.code == 200) {
          this.cinemaRoomTypes = res.data.data;
        }
      });
    },

    // 通过影院ID加载影院里所有放映厅列表
    loadCinemaRoomByCinemaId() {
      this.$http.CinemaRoomApi.list({
        cinema_id: this.form.movie_cinema_id,
      }).then((res) => {
        console.log("通过影院ID加载影院里所有放映厅列表", res);
        this.tableData = res.data.data;
      });
    },
  },

  mounted() {
    // 加载所有的放映厅类型
    this.loadAllCinemaRoomTypes();
    // 加载当前电影院里所有的放映厅
    this.loadCinemaRoomByCinemaId();
  },
};
</script>
