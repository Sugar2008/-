<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线 -->
    <el-divider></el-divider>

    <div
      id="cinemaListMapContainer"
      style="width: 100%; height: 207px; border: 1px solid #ddd"
    ></div>

    <!-- 列表页面 -->
    <el-divider content-position="left">电影院列表</el-divider>

    <el-table :data="tableData" stripe style="width: 100%" height="300">
      <el-table-column prop="cinema_name" label="影院名称" width="320" sortable>
      </el-table-column>
      <el-table-column prop="address" label="影院地址"> </el-table-column>
      <el-table-column
        prop="city"
        label="影院位置"
        width="200"
        sortable
        :sort-method="sortByLocation"
      >
        <template slot-scope="scope">
          {{ scope.row.province }} · {{ scope.row.district }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            @click="showLocation(scope.row.longitude, scope.row.latitude)"
            title="定位位置"
            type="success"
            icon="el-icon-location-information"
            circle
          ></el-button>
          <el-button
            @click="$router.push(`/home/cinema-room-list/${scope.row.id}`)"
            title="查看影院放映厅列表"
            type="warning"
            icon="el-icon-s-unfold"
            circle
          ></el-button>
          <el-button
            @click="$router.push(`/home/cinema-update/${scope.row.id}`)"
            title="修改电影院信息"
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showDeleteDialog(scope.row.id)"
            title="删除电影院"
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
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  data() {
    return {
      tableData: [],
      map: null, // 表示地图对象
    };
  },
  methods: {
    // 弹出删除对话框
    showDeleteDialog(id) {
      this.$confirm(
        "此操作将会永久关闭该影院，已有影片排期将作废，是否确定删除影院？",
        "注意"
      )
        .then((res) => {
          return this.$http.CinemaApi.delete({ id });
        })
        .then((res) => {
          console.log("删除影院请求", res);
          if (res.data.code == 200) {
            this.$message.success("删除成功");
            this.loadAllCinemas();
          }
        });
    },

    // 在地图中显示影院位置
    showLocation(lng, lat) {
      if (this.map != null) {
        this.map.setCenter([lng, lat], false, 1000);
        this.map.setZoom(18, false, 1000);
      }
    },

    // 影院位置列排序
    sortByLocation(a, b) {
      let astr = a.province + a.district;
      let bstr = b.province + a.district;
      return astr > bstr;
    },

    // 加载所有电影院数据
    loadAllCinemas() {
      this.$http.CinemaApi.list().then((res) => {
        console.log("加载所有电影院数据", res);
        this.tableData = res.data.data;
      });
    },

    // 初始化显示地图
    initMap() {
      AMapLoader.load({
        key: "365abf0f1d6f1c37db70c330a5706886", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          // 地图初始化应该在地图容器div已经添加到DOM树之后
          this.map = new AMap.Map("cinemaListMapContainer", {
            zoom: 11, // 级别
            center: [112.172793, 37.200034], // 中心点坐标
            viewMode: "3D", // 使用3D地图
          });
          console.log("加载地图完成");
          // 将所有的电影院的位置，在地图中以marker的方式显示
          this.tableData.forEach((item) => {
            let lat = item.latitude;
            let lnt = item.longitude;
            // 创建Marker，将Marker添加到地图上
            let marker = new AMap.Marker({
              position: new AMap.LngLat(lnt, lat),
            });
            this.map.add(marker);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

  mounted() {
    // 加载所有电影院数据
    this.loadAllCinemas();
    // 初始化地图
    this.initMap();
  },
};
</script>
