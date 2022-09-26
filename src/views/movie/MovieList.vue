<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="电影名称">
        <el-input
          v-model="searchForm.movieName"
          placeholder="请输入电影姓名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表页面 -->
    <el-divider content-position="left">电影列表</el-divider>

    <!-- 使用表格呈现数据 -->
    <div v-if="tableData">
      <el-table :data="tableData.result" stripe style="width: 100%">
        <el-table-column align="center" prop="cover" label="封面" width="110">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 132px"
              :src="scope.row.cover"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="电影名称"
          width="149"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="star_actor"
          label="主演"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="type" label="类型" width="165">
        </el-table-column>
        <el-table-column
          align="center"
          prop="showingon"
          label="上映时间"
          width="121"
        >
        </el-table-column>
        <el-table-column align="center" prop="score" label="评分" width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="duration"
          label="时长"
          width="110"
        >
          <template slot-scope="scope">
            {{ scope.row.duration }} 分钟
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="category_id"
          label="所属类别"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.category_id == 1" type="danger"
              >热映</el-tag
            >
            <el-tag v-if="scope.row.category_id == 2" type="success"
              >待映</el-tag
            >
            <el-tag v-if="scope.row.category_id == 3">经典</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              @click="showEditActorDialog(scope.row.id)"
              title="配置演员列表"
              type="info"
              icon="el-icon-user"
              circle
            ></el-button>
            <el-button
              @click="showEditThumbDialog(scope.row.id)"
              title="配置剧照列表"
              type="warning"
              icon="el-icon-picture-outline"
              circle
            ></el-button>
            <el-button
              @click="$router.push(`/home/movie-update/${scope.row.id}`)"
              title="修改电影信息"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              @click="deleteMovie(scope.row.id)"
              title="删除电影"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="changeCurrentPage"
        style="margin: 20px 0; text-align: right"
        background
        layout="prev, pager, next"
        :total="tableData.total"
        :page-size="tableData.pagesize"
      >
      </el-pagination>
    </div>

    <!-- 设置修改剧照图片弹窗 -->
    <el-dialog title="配置剧照图片" :visible.sync="dialogThumbVisible">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="http://localhost:9000/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="warning"
          @click="$router.push('/home/thumb-list/' + currentSelectedId)"
          >管理剧照图片</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>

    <!-- 配置演员列表接口 -->
    <el-dialog title="配置演员列表接口" :visible.sync="dialogEditActorsVisible">
      <el-transfer
        v-model="transferValue"
        :data="transferData"
        style="text-align: center"
        :titles="['未选择演员', '演员已选择']"
      ></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitActors()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import PersonItem from "@/components/PersonItem.vue";
export default {
  components: {
    "person-item": PersonItem,
  },
  data() {
    return {
      // 原始数据
      transferValue: [],
      // 选中项数据
      transferData: [],
      // 绑定当前选中项的电影id
      currentSelectedId: 0,
      // 绑定上传文件列表
      fileList: [],
      // 是否显示修改演员列表窗口
      dialogEditActorsVisible: false,
      // 是否显示修改剧照图片窗口
      dialogThumbVisible: false,
      searchForm: {
        movieName: "", // 绑定电影姓名
      },
      tableData: null, // 存储表格所需数据 { page, pagesize, total, result }
    };
  },
  methods: {
    // 显示配置演员列表窗口
    showEditActorDialog(id) {
      this.dialogEditActorsVisible = true;
      this.currentSelectedId = id;
      // 发送请求，获取当前电影下的所有演员
      this.$http.ActorApi.listByMovieId({ movie_id: id }).then((res) => {
        console.log("获取当前电影下的所有演员", res);
        if (res.data.code == 200) {
          this.transferValue = [];
          res.data.data.forEach((item) => {
            this.transferValue.push(item.actor_id);
          });
        }
      });
    },

    // 显示修改剧照对话框
    showEditThumbDialog(id) {
      this.dialogThumbVisible = true;
      this.currentSelectedId = id;
    },

    // 提交穿梭框收集的数据
    submitActors() {
      let movie_id = this.currentSelectedId;
      let actor_ids = this.transferValue.toString();
      this.$http.MovieApi.bindActors({ movie_id, actor_ids }).then((res) => {
        console.log("为电影绑定演员列表", res);
        if (res.data.code == 200) {
          this.$message.success("演员列表绑定成功");
          this.dialogEditActorsVisible = false;
        }
      });
    },

    // 处理上传成功后的业务
    handleSuccess(res) {
      console.log(res);
      let url = res.data;
      let movie_id = this.currentSelectedId;
      // 发请求新增剧照配置
      this.$http.MovieThumbApi.add({ url, movie_id }).then((res) => {
        console.log("上传剧照结果", res);
      });
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    // 删除电影
    deleteMovie(id) {
      this.$http.MovieApi.delete({ id }).then((res) => {
        console.log("删除电影", res);
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          this.loadMovieList();
        }
      });
    },

    // 修改当前页
    changeCurrentPage(val) {
      // console.log(val);
      let name = this.searchForm.movieName.trim();
      if (!name) {
        // name为空
        this.$http.MovieApi.list({ page: val, pagesize: 2 }).then((res) => {
          console.log("加载所有电影列表", res);
          this.tableData = res.data.data;
        });
      } else {
        this.$http.MovieApi.listByName({ name, page: val, pagesize: 2 }).then(
          (res) => {
            console.log("模糊查询电影列表", res);
            if (res.data.code == 200) {
              this.tableData = res.data.data;
            }
          }
        );
      }
    },

    // 当点击搜索时执行
    onSearch() {
      let name = this.searchForm.movieName.trim();
      if (!name) {
        // name为空
        this.loadMovieList();
      } else {
        this.$http.MovieApi.listByName({ name, page: 1, pagesize: 2 }).then(
          (res) => {
            console.log("模糊查询电影列表", res);
            if (res.data.code == 200) {
              this.tableData = res.data.data;
            }
          }
        );
      }
    },

    // 加载电影列表
    loadMovieList() {
      this.$http.MovieApi.list({ page: 1, pagesize: 2 }).then((res) => {
        console.log("加载所有电影列表", res);
        this.tableData = res.data.data;
      });
    },

    // 加载所有演员，呈现到穿梭框
    loadAllActors() {
      this.$http.ActorApi.list({ page: 1, pagesize: 100 }).then((res) => {
        console.log("加载所有演员", res);
        // 将res.data.data 中的数据保存到 this.transferData
        // res.data.data 现有数据结构：[{演员},{演员},{演员}]
        // this.transferData 需要数据结构：[{key:1, label:''},...]
        if (res.data.code == 200) {
          let mdata = [];
          res.data.data.forEach((item) => {
            mdata.push({
              key: item.id,
              label: item.actor_name,
            });
            this.transferData = mdata;
          });
        }
      });
    },
  },
  // 挂载完毕后执行的生命周期
  mounted() {
    // 加载电影列表
    this.loadMovieList();
    // 加载所有演员
    this.loadAllActors();
  },
};
</script>
<style>
.el-transfer-panel {
  text-align: left;
}
</style>
