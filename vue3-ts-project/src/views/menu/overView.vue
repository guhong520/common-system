<script setup lang="ts">
import bread_crumbs from "../../components/publicComponents/bread_crumb.vue";
import { ref, onMounted, reactive, computed } from "vue";

import * as echarts from "echarts/core";
import {
  TitleComponent,
  type TitleComponentOption,
  TooltipComponent,
  type TooltipComponentOption,
  LegendComponent,
  type LegendComponentOption,
} from "echarts/components";
import { PieChart, type PieSeriesOption } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

import { GridComponent, type GridComponentOption } from "echarts/components";
import { BarChart, type BarSeriesOption } from "echarts/charts";

import { LineChart, type LineSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import svgIcon from "../../components/publicComponents/svgIcon.vue";

import { useUserInfo } from "../../store/userInfo";
import { type AccountDetailData } from "../../types/set";
import { useRouter } from "vue-router";
// 获取实时数据
import {
  getCategoryAndNumber,
  getAdminAndNumber,
  getLevelAndNumber,
  getDayAndNumber,
} from "../../api/overview";
import { getCompanyName } from "../../api/setting";

const router = useRouter();
const breadcrumbs = ref();
const item = ref({
  first: "系统概览",
});
// 获取公司名字
const companyName = ref("");
const getCompany = async () => {
  const data = await getCompanyName();
  companyName.value = data.data;
};
getCompany();
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  GridComponent,
  BarChart,
  LineChart,
  UniversalTransition,
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>;
// 产品柱状图
type EChartsOption1 = echarts.ComposeOption<
  GridComponentOption | BarSeriesOption
>;

var option: EChartsOption1;

// 创建 ref 来引用 DOM 元素
const chartRef = ref<HTMLElement | null>(null);
// 产品类别图
const productCategory = ref<HTMLElement | null>(null);
// 等级间隙饼图
const levelGap = ref<HTMLElement | null>(null);
//每日登录人数折线图
const dailyLogin = ref<HTMLElement | null>(null);
const initPie = async () => {
  // 饼图
  if (chartRef.value) {
    try {
      // 初始化 ECharts
      const myChart = echarts.init(chartRef.value);
      myChart.showLoading();
      const data = await getAdminAndNumber();
      myChart.hideLoading();
      const option: EChartsOption = {
        title: {
          text: "管理与用户对比图",
          // subtext: "Fake Data",
          left: "right",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
          padding: [20, 20, 20, 20],
        },
        series: [
          {
            // name: "Access From",
            type: "pie",
            radius: "65%",
            data: data.data.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      // 用于echarts响应式
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      // 使用配置项显示图表
      option && myChart.setOption(option);
    } catch (error) {
      console.error("ECharts 初始化失败:", error);
    }
  } else {
    console.error("未获取到有效的 DOM 元素");
  }
};
const initProductCategory = async () => {
  // 饼图
  if (productCategory.value) {
    try {
      // 初始化 ECharts
      const myChart = echarts.init(productCategory.value);
      myChart.showLoading();
      const data = await getCategoryAndNumber();
      myChart.hideLoading();
      option = {
        title: {
          text: "产品类别库存总价图",
          top: "3%",
          textStyle: {
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "8", // 设置图表距离容器左边的距离，可根据需求调整百分比

          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          // 食品类，服装类，鞋帽类，日用品类，家具类，家用电器类，纺织品类，五金类
          data: data.data.category,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            barWidth: 40,
            colorBy: "data",
            data: data.data.price,
            type: "bar",
          },
        ],
      };
      // 用于echarts响应式
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      // 使用配置项显示图表
      option && myChart.setOption(option);
    } catch (error) {
      console.error("ECharts 初始化失败:", error);
    }
  } else {
    console.error("未获取到有效的 DOM 元素");
  }
};
const initMessageLevel = async () => {
  if (levelGap.value) {
    try {
      // 初始化 ECharts
      const myChart = echarts.init(levelGap.value);
      myChart.showLoading();
      const data = await getLevelAndNumber();
      myChart.hideLoading();
      type EChartsOption = echarts.ComposeOption<
        TooltipComponentOption | LegendComponentOption | PieSeriesOption
      >;
      var option: EChartsOption;
      option = {
        title: {
          text: "公告等级分布图",
          top: "3%",
          textStyle: {
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "9%",
          left: "center",
        },
        series: [
          {
            // name: "Access From",
            type: "pie",
            radius: ["35%", "65%"],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: data.data.data,
          },
        ],
      };
      // 用于echarts响应式
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      // 使用配置项显示图表
      option && myChart.setOption(option);
    } catch (error) {
      console.error("ECharts 初始化失败:", error);
    }
  } else {
    console.error("未获取到有效的 DOM 元素");
  }
};
const initDailyLogin = async () => {
  if (dailyLogin.value) {
    try {
      // 初始化 ECharts
      const myChart = echarts.init(dailyLogin.value);
      myChart.showLoading();
      const data = await getDayAndNumber();
      myChart.hideLoading();
      type EChartsOption = echarts.ComposeOption<
        GridComponentOption | LineSeriesOption
      >;
      var option: EChartsOption;
      option = {
        title: {
          text: "每日登录人数图",
          top: "3%",
          textStyle: {
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "item",
        },
        xAxis: {
          type: "category",
          data: data.data.week.reverse(),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: data.data.number.reverse(),
            type: "line",
          },
        ],
      };

      // 用于echarts响应式
      window.addEventListener("resize", function () {
        myChart.resize();
      });
      // 使用配置项显示图表
      option && myChart.setOption(option);
    } catch (error) {
      console.error("ECharts 初始化失败:", error);
    }
  } else {
    console.error("未获取到有效的 DOM 元素");
  }
};
const id = localStorage.getItem("id") as unknown as number;
onMounted(() => {
  initPie();
  initProductCategory();
  initMessageLevel();
  initDailyLogin();
  getUserInfor();
});
const userStore = useUserInfo();
const userData: AccountDetailData = reactive({
  name: "",
  sex: "",
  identity: "",
  department: "",
  imageUrl: "",
});
const getUserInfor = async () => {
  const res = await userStore.userInfo(id);
  userData.name = res.data.name;
  userData.sex = res.data.sex;
  userData.identity = res.data.identity;
  userData.department = res.data.department;
  userData.imageUrl = res.data.image_url;
};
const imageUrl = computed(() => userData.imageUrl);

// 跳转
const RouterTo = (path1: string) => {
  router.push({ path: `/${path1}` });
};
</script>

<template>
  <bread_crumbs :item="item" ref="breadcrumbs"></bread_crumbs>
  <div class="overview-wrapped">
    <!-- 顶部外壳 -->
    <div class="top-content-wrapped">
      <div class="person-infor">
        <!-- 用户头像 -->
        <div class="person-avatar-wrapped">
          <el-avatar :size="100" :src="imageUrl"></el-avatar>
          <span class="department">所属部门：{{ userData.department }}</span>
          <div class="company">所属公司：{{ companyName }}</div>
        </div>
        <!-- 竖线 -->
        <div class="line-wrapped">
          <div class="line"></div>
        </div>
        <!-- 详细信息外壳 -->
        <div class="detail-infor-wrapped">
          <p>姓名：{{ userData.name }}</p>
          <p>性别：{{ userData.sex }}</p>
          <p>身份：{{ userData.identity }}</p>
          <p>分管领域：超级管理</p>
          <p>权限：最高权限</p>
        </div>
      </div>
      <div class="pie" ref="chartRef"></div>
    </div>
    <!-- 中间外壳 -->
    <div class="mid-content-wrapped">
      <div class="mid-content-left" ref="productCategory"></div>
      <div class="mid-content-right">
        <div class="title">常用管理</div>
        <el-row :gutter="20">
          <!-- 行容器，设置列间距为 20px -->
          <!-- 每列宽度为 6/24（25%），共 4 列 -->
          <el-col :span="6"
            ><div class="button-area">
              <svgIcon
                icon-name="userManage"
                style="width: 24px; height: 24px"
              ></svgIcon>
              <span class="button-name" @click="RouterTo('product_manage')"
                >用户管理</span
              >
            </div>
          </el-col>
          <el-col :span="6"
            ><div class="button-area">
              <svgIcon
                icon-name="productManage"
                style="width: 24px; height: 24px"
              ></svgIcon>
              <span class="button-name" @click="RouterTo('inProduct')"
                >产品管理</span
              >
            </div>
          </el-col>
          <el-col :span="6"
            ><div class="button-area">
              <svgIcon
                icon-name="message"
                style="width: 24px; height: 24px"
              ></svgIcon>
              <span class="button-name" @click="RouterTo('messageList')"
                >系统消息</span
              >
            </div></el-col
          >
          <el-col :span="6"
            ><div class="button-area">
              <svgIcon
                icon-name="user"
                style="width: 24px; height: 24px"
              ></svgIcon>
              <span class="button-name" @click="RouterTo('set')">个人信息</span>
            </div></el-col
          >
          <el-col :span="6"
            ><div class="button-area">
              <svgIcon
                icon-name="departmentMessage"
                style="width: 24px; height: 24px"
              ></svgIcon>
              <span class="button-name" @click="RouterTo('messageList')"
                >部门信息</span
              >
            </div></el-col
          >
          <el-col :span="6"
            ><div class="button-area">
              <svgIcon
                icon-name="setting"
                style="width: 24px; height: 24px"
              ></svgIcon>
              <span class="button-name" @click="RouterTo('set')">系统设置</span>
            </div></el-col
          >
        </el-row>
      </div>
    </div>
    <!-- 底部外壳 -->
    <div class="footer-content-wrapped">
      <div class="footer-content-left" ref="levelGap"></div>
      <div class="footer-content-right" ref="dailyLogin"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.overview-wrapped {
  background-color: #f5f5f5;
  height: calc(100vh - 100px);
  padding: 5px;
  //   个人信息加饼状图
  .top-content-wrapped {
    display: flex;
    height: 30%;
    .person-infor {
      display: flex;
      height: 100%;
      width: calc(50% - 8px);
      margin-right: 8px;
      background-color: #fff;
      .person-avatar-wrapped {
        display: flex;
        width: 50%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .department {
          margin: 10px 0;
          font-size: 16px;
        }
        .company {
          margin-top: 8px;
        }
      }
      //   分割线
      .line-wrapped {
        height: 100%;
        display: flex;
        align-items: center;
        .line {
          height: 200px;
          border: 1px solid #d3d3d3;
        }
      }
      //   详细信息区域
      .detail-infor-wrapped {
        height: 100%;
        width: calc(50% - 1px);
        margin-left: 50px;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        p {
          margin: 15px 0;
        }
      }
      //   饼状图
    }
    .pie {
      width: calc(50%);
      height: 100%;
      background: #fff;
    }
  }
  //   中间部分 消息阅读量 产品类图
  .mid-content-wrapped {
    margin-top: 8px;
    height: 35%;
    display: flex;
    .mid-content-left {
      margin-right: 8px;
      width: calc(60% - 8px);
      background: #fff;
    }
    .mid-content-right {
      width: calc(40%);
      background: #fff;
      padding: 8px;
      .title {
        font-size: 16px;
        margin-bottom: 8px;
      }
      // 按钮区域
      .button-area {
        margin-bottom: 8px;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: #f5f5f5;

        // 按钮名字
        .button-name {
          margin-top: 10px;
        }
      }

      // 按钮变色
      .button-area:hover {
        background: #e4efff;
      }
    }
  }
  .footer-content-wrapped {
    margin-top: 8px;
    height: calc(38% - 8px);
    display: flex;
    .footer-content-left {
      margin-right: 8px;
      width: calc(30% - 8px);
      background: #fff;
      height: 100&;
    }
    .footer-content-right {
      width: calc(70%);
      background: #fff;
    }
  }
}
</style>
