<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影列表</el-breadcrumb-item>
      <el-breadcrumb-item>剧照列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线 -->
    <el-divider></el-divider>

    <!-- 列表页面 -->
    <el-divider content-position="left">剧照列表</el-divider>

    <div v-if="thumbList">
      <div class="thumb-item" v-for="item in thumbList" :key="item.id">
        <el-image
          style="
            width: 195px;
            height: 130px;
            box-shadow: #0003 2px 2px 6px 0px;
            margin: 15px 20px 0 0;
          "
          :src="item.url"
          fit="cover"
        ></el-image>
        <i class="el-icon-error" @click="deleteThumb(item.id)"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      movie_id: this.$route.params.movie_id,
      thumbList: null, // 绑定剧照列表
    };
  },
  methods: {
    // 删除剧照
    deleteThumb(id) {
      this.$http.MovieThumbApi.delete({ id }).then((res) => {
        console.log("删除剧照", res);
        if (res.data.code == 200) {
          this.loadThumbByMovieId();
        }
      });
    },

    // 通过电影ID，查询剧照列表
    loadThumbByMovieId() {
      this.$http.MovieThumbApi.listByMovieId({ movie_id: this.movie_id }).then(
        (res) => {
          console.log("通过电影ID查询剧照列表", res);
          this.thumbList = res.data.data;
        }
      );
    },
  },
  mounted() {
    this.loadThumbByMovieId();
  },
};
</script>
<style scoped>
.thumb-item {
  display: inline-block;
  position: relative;
}
.thumb-item:hover i {
  display: block;
}
.thumb-item i {
  position: absolute;
  right: 12px;
  top: 5px;
  font-size: 1.3em;
  display: none;
  color: #777;
}
</style>
