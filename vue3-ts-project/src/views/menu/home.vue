<script setup lang="ts">
import bread_crumbs from "../../components/publicComponents/bread_crumb.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { getAllSwiper, getAllCompanyIntroduce } from "../../api/setting";
import introduce from "../../components/home/introduce.vue";
import { bus } from "../../utils/mitt.js";
import { companyMessageList, systemMessageList } from "../../api/message.ts";
import messageDetail from "../../components/home/messageDetail.vue";

const breadcrumbs = ref();
const item = ref({
  first: "首页",
});
// 轮播图
const imageUrl = ref([]);
onMounted(async () => {
  const res = await getAllSwiper();
  imageUrl.value = res.data;
  getAllCompanyintroduce();
  companyDataList();
  systemDataList();
});
// 获取公告列表
const companyData = ref<any[]>([]);
const systemData = ref<any[]>([]);
const companyDataList = async () => {
  const res = await companyMessageList();
  companyData.value = res.data;
};
const systemDataList = async () => {
  const res = await systemMessageList();
  systemData.value = res.data;
};
// 获取公司介绍
const companyIntroduce = ref([
  {
    set_name: "",
    set_text: "",
  },
]);
const getAllCompanyintroduce = async () => {
  const res = await getAllCompanyIntroduce();
  companyIntroduce.value = res.data;
};
// 控制弹窗
const introRef = ref();
// 数据回显
const openIntroduce = (index: number) => {
  bus.emit("introduce", index);
  introRef.value.open();
};
// 显示详细数据
const messageDetailRef = ref();
const getCompanyDetail = (row: any) => {
  bus.emit("homeCompany", row);
  messageDetailRef.value.open();
};
// 系统消息
const getSystemDetail = (row: any) => {
  bus.emit("homeSystem", row);
  messageDetailRef.value.open();
};
onUnmounted(() => {
  bus.all.clear();
});
</script>

<template>
  <bread_crumbs ref="breadcrumbs" :item="item"></bread_crumbs>
  <div class="home-wrapped">
    <!-- 轮播图外壳 -->
    <div class="swiper-wrapped">
      <el-carousel
        :interval="4000"
        type="card"
        height="250px"
        indicator-position="outside"
      >
        <el-carousel-item v-for="(item, index) in imageUrl" :key="index">
          <img :src="item" class="swiper" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 栅格布局外壳 -->
    <div class="layout-wrapped">
      <el-row :gutter="20">
        <el-col
          :span="6"
          v-for="(item, index) in companyIntroduce"
          :key="index"
          @click="openIntroduce(index + 1)"
        >
          <div class="company-message-area">
            <span>{{ item.set_name }}</span>
            <div v-html="item.set_text" class="company-introduce"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格外壳 -->
    <div class="two-table-wrapped">
      <div class="company-notice">
        <span>公司公告</span>
        <el-table
          :data="companyData"
          style="width: 100%"
          :show-header="false"
          @row-dblclick="getCompanyDetail"
        >
          <el-table-column prop="message_title" label="公告主题">
            <template #default="{ row }">
              <div class="message_title">{{ row.message_title }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="message_level" label="等级">
            <template #default="{ row }">
              <el-tag round v-if="row.message_level == '一般'">
                {{ row.message_level }}
              </el-tag>
              <el-tag round v-if="row.message_level == '重要'" type="warning">
                {{ row.message_level }}
              </el-tag>
              <el-tag round v-if="row.message_level == '必要'" type="danger">
                {{ row.message_level }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="message_publish_department" label="发布部门" />
          <el-table-column
            prop="message_publish_time"
            label="发布日期"
            width="200"
          >
            <template #default="{ row }">
              <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="system-message">
        <span>系统消息</span>
        <el-table
          :data="systemData"
          style="width: 100%"
          :show-header="false"
          @row-dblclick="getSystemDetail"
        >
          <el-table-column prop="message_title" label="公告主题" />
          <el-table-column
            prop="message_publish_time"
            label="发布日期"
            width="200"
          >
            <template #default="{ row }">
              <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <introduce ref="introRef"></introduce>
  <messageDetail ref="messageDetailRef"></messageDetail>
</template>

<style scoped lang="scss">
@mixin table-class {
  height: 232px;
  width: 48%;
  display: flex;
  flex-direction: column;
}

// 首页外壳
.home-wrapped {
  padding: 8px;
  height: calc(100vh - 101px);
  background: #f5f5f5;
  display: flex;
  flex-direction: column;

  // 轮播图外壳
  .swiper-wrapped {
    padding: 0 20px;
    background: #fff;
    margin-bottom: 8px;

    .swiper {
      width: 100%;
      height: 100%;
    }
  }

  // 栅格布局外壳
  .layout-wrapped {
    padding: 8px;
    margin-bottom: 8px;
    background: #fff;

    // 公司信息区域
    .company-message-area {
      background: #f5f5f5;
      height: 200px;
      padding: 8px;
      cursor: pointer;

      span {
        border-bottom: 1px solid #409eff;
        font-size: 14px;
      }

      .company-introduce {
        text-indent: 24px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        margin-top: 5px;
      }
    }

    .company-message-area:hover {
      cursor: pointer;
      background-color: #eef5ff;
    }
  }

  // 表格外壳
  .two-table-wrapped {
    height: 232px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #fff;

    // 公司公告
    .company-notice {
      @include table-class;
    }

    // 系统消息
    .system-message {
      @include table-class;
    }

    .title {
      font-size: 14px;
      margin-bottom: 5px;
      border-bottom: 1px solid #ea0709;
    }
  }
}

.message_title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// 轮播图默认样式
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
:deep(.el-table__cell) {
  height: 41.76px;
}
</style>
