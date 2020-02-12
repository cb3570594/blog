<template>
  <div>
    <div class="statistics_box" id="statistics">
      <p>截止{{info.modifyTime}} 全国统计数据 <span style="float:right;">访问人数：{{visitCount}}</span></p>
      <ul class="statistics_count">
        <li>
          <div style="color: red;">{{info.confirmedCount}}</div>
          <div>确诊病例</div>
        </li>
        <li>
          <div style="color: orange;">{{info.suspectedCount}}</div>
          <div>疑似病例</div>
        </li>
        <li>
          <div style="color: brown;">{{info.deadCount}}</div>
          <div>死亡人数</div>
        </li>
        <li>
          <div style="color: green;">{{info.curedCount}}</div>
          <div>治愈人数</div>
        </li>
      </ul>
      <p>注：{{info.generalRemark}}</p>
      <div class="statistics_desc">
        <a-row class="statistics_desc-item">
          <a-col :span="3"><a-icon type="warning" style="color: #f26522" /></a-col>
          <a-col><p class="height-50">{{info.note1}}</p></a-col>
        </a-row>
        <a-row class="statistics_desc-item">
          <a-col :span="3"><a-icon type="warning" style="color: #f2cd22" /></a-col>
          <a-col><p class="height-50">{{info.note2}}</p></a-col>
        </a-row>
        <a-row class="statistics_desc-item">
          <a-col :span="3"><a-icon type="warning" style="color: #b7f222" /></a-col>
          <a-col><p class="height-50">{{info.note3}}</p></a-col>
        </a-row>
        <a-row class="statistics_desc-item">
          <a-col :span="3"><a-icon type="warning" style="color: #f2a622" /></a-col>
          <a-col><p class="height-50">{{info.remark1}}</p></a-col>
        </a-row>
        <a-row class="statistics_desc-item">
          <a-col :span="3"><a-icon type="warning" style="color: #f222ab" /></a-col>
          <a-col><p class="height-50">{{info.remark2}}</p></a-col>
        </a-row>
        <a-row class="statistics_desc-item">
          <a-col :span="3"><a-icon type="warning" style="color: #f53b4e" /></a-col>
          <a-col><p class="height-50">{{info.remark3}}</p></a-col>
        </a-row>
      </div>
    </div>
    <a-anchor :offsetTop="63" class="tabbar" :wrapperStyle="{padding: 0, margin: 0}" @click="handleClick">
      <a-anchor-link href="#map" title="疫情地图" />
      <a-anchor-link href="#report" title="实时播报" />
      <a-anchor-link href="#rumor" title="谣言鉴别" />
    </a-anchor>
    <div class="tabbar_detail">
      <div id="map">
        <p class="tabbar_detail-title" c="#f00000">疫情地图</p>
        <img :src="info.imgUrl" alt="">
        <img :src="item" v-for="(item, index) in info.dailyPics" :key="index" alt="">
        <a-table
          :columns="columns"
          :dataSource="table"
          :rowKey="(item, index) => item.locationId + '-' + index"
        >
        </a-table>
      </div>
      <div id="report">
        <p class="tabbar_detail-title" c="#f00000">实时播报</p>
        <a-timeline style="padding: 10px 15px;" class="timeline">
          <a-timeline-item v-for="(item, index) in news" :key="index">
            <a :href="item.sourceUrl">
              <p style="margin-bottom: 10px;">{{item.pubDateStr}} · {{item.modifyTime}}</p>
              <h3>{{item.title}}</h3>
              <p>{{item.summary}}</p>
            </a>
          </a-timeline-item>
        </a-timeline>
      </div>
      <div id="rumor">
        <p class="tabbar_detail-title" c="#f00000">谣言鉴别</p>
        <div class="rumor-item" v-for="(item, index) in rumors" :key="index">
          <div class="rumor-img">
            <div class="rumor-explain" :style="{'--color': rumorColor[item.markstyle]}">{{item.explain}}</div>
            <img :src="item.imgsrc" alt="">
          </div>
          <h3>{{item.title}}</h3>
          <p>{{item.desc}}</p>
          <div style="text-align:right;padding: 10px;">出处：{{item.author}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const baseApiUrl = "https://api.tianapi.com";
const key = '7695a5b7dfc1f80fabda9191bb5cda85';
import moment from "moment";
moment.locale('zh-cn');
export default {
  async asyncData({app}) {
    const res = await Promise.all([
      app.$axios.$get(`${baseApiUrl}/txapi/ncov/index?key=${key}`),
      app.$axios.$get(`${baseApiUrl}/txapi/rumour/index?key=${key}`),
      app.$axios.$get(`${baseApiUrl}/txapi/ncovcity/index?key=${key}`),
      app.$axios.$post(`/api/visit`,{
        visit_id: 'e6ca5736-30fc-4c81-ad3c-f2d982aa606a',
        remark: '疫情'
      }),
    ])
    let info = res[0].newslist[0].desc;
    let table = res[2].newslist.map(item => {
      item.cityName = item.provinceName;
      return item;
    })
    let news = res[0].newslist[0].news.map(item => {
      item.modifyTime = moment(item.modifyTime).format("MM-DD HH:mm");
      return item;
    });
    let rumors = res[1].newslist;
    info.modifyTime = moment(info.modifyTime).format('lll');
    return {info, table, news, rumors, visitCount: res[3].d};
  },
  head () {
    return {
      title: "新型冠状病毒感染的肺炎——疫情" + "——Cboy的个人博客",
      meta: [
        { hid: 'description', name: 'description', content: "2019新型冠状病毒，即“2019-nCoV”，因2019年武汉病毒性肺炎病例而被发现，2020年1月12日被世界卫生组织命名。冠状病毒是一个大型病毒家族，已知可引起感冒以及中东呼吸综合征（MERS）和严重急性呼吸综合征（SARS）等较严重疾病。新型冠状病毒是以前从未在人体中发现的冠状病毒新毒株" },
        { hid: 'keywords', name: 'keywords', content: '肺炎,新型冠状病毒,疫情,湖北,武汉' },
      ],
    }
  },
  data(){
    return{
      columns: [
        {
          title: '地区',
          dataIndex: 'cityName',
          width: '40%',
        },
        {
          title: '确诊',
          dataIndex: 'confirmedCount',
        },
        {
          title: '死亡',
          dataIndex: 'deadCount',
        },
        {
          title: '治愈',
          dataIndex: 'curedCount',
        },
      ],
      rumorColor: {'fake': 'red', 'true': 'lime', 'doubt': 'orange'}
    }
  },
  mounted() {
    this.table = this.table.map(item => {
      item.children = item.cities;
      return item
    });
  },
  methods:{
    handleClick(e, link) {
      e.preventDefault();
      // console.log(link);
    },
  }
}
</script>

<style>
.statistics_box{
  padding: 15px;
}
.statistics_count{
  display: flex;
  padding: 0;
  text-align: center;
  font-size: 14px;
}
.statistics_count>li{
  flex: 1;
}
.statistics_count>li>div:first-child{
  font-size: 18px;
  font-weight: bold;
}
.statistics_desc{
  border-top: 1px solid #f2f2f2;
  font-size: 15px;
}
.statistics_desc-item>div:first-child{
  text-align: center;
  margin: 10px 0;
}
.statistics_desc p{
  margin: 10px 0;
}
.tabbar .ant-anchor{
  display: flex;
  font-size: 16px;
  border-top: 1px solid rgba(0, 21, 41, 0.5);
  border-bottom: 1px solid rgba(0, 21, 41, 0.5);
  text-align: center;
}
.tabbar .ant-anchor .ant-anchor-link{
  flex: 1;
  padding: 0;
  line-height: 50px;
}
.tabbar .ant-anchor .ant-anchor-ink{
  display: none;
}
.tabbar_detail p{
  margin: 0;
}
.tabbar_detail img{
  width: 100%;
}
.tabbar_detail-title{
  padding: 10px 18px;
  position: relative;
  font-size: 18px;
  font-weight: 600;
}
.tabbar_detail-title::before{
  content:"";
  position: absolute;
  height: 15px;
  width: 3px;
  background-color: #ff0000;
  top: 50%;
  left: 7px;
  transform: translateY(-50%);
}
.timeline a{
  color: inherit;
}
.rumor-item{
  padding: 10px;
}
.rumor-img{
  position: relative;
}
.rumor-explain{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%) rotate(-20deg);
  color: var(--color);
  border: 3px solid var(--color);
  border-radius: 5px;
  font-size: 40px;
  font-weight: bold;
  font-family: 'yahei';
  padding: 0px 10px;
}
.rumor-item>h3{
  padding: 10px 10px 0;
  font-weight: bold;
  font-size: 18px;
  color: rgba(0, 21, 41);
}
.rumor-item>p{
  padding: 0 10px;
}
.ant-pagination.ant-table-pagination{
  padding-right: 10px;
}
</style>