<template>
  <div>
    <a-list :loading="loading" itemLayout="vertical" :dataSource="data">
      <div slot="loadMore" :style="{ textAlign: 'center', padding: '12px' }">
        <div style="height:32px;">
          <template v-if="showLoadingMore && !allLoaded">
            <a-spin v-if="loadingMore" />
            <a-button v-else @click="onLoadMore">loading more</a-button>
          </template>
          <template v-if="allLoaded && data.length > 0">
            <div>没有更多内容了</div>
          </template>
        </div>
      </div>
      <nuxt-link
        :to="`/post/${item.post_id}`"
        class="post_item"
        slot="renderItem"
        slot-scope="item"
      >
        <a-list-item>
          <a-list-item-meta :description="item.intro">
            <div slot="title">
              <div class="post_title">
                <div class="post_type" v-if="item.type">{{types[item.type]}}</div>
                <div class="post_main_title">
                  {{item.title}} ·
                  <span class="post_time">{{item.updated_at}}</span>
                </div>
              </div>
            </div>
          </a-list-item-meta>
          <!-- <span
            slot="actions"
            @click.stop.prevent="collect(index, item)"
            :class="{active: item.isCollect}"
          >
            <a-icon type="star-o" style="margin-right: 8px" />
            {{item.collectCount || 0}}
          </span> -->
          <span slot="actions" @click.stop.prevent="like(item)" :class="{active: item.isLike}">
            <a-icon type="like-o" style="margin-right: 8px;" />
            {{item.likeCount}}
          </span>
          <span
            :to="`/post/${item.post_id}#comment`"
            target="_blank"
            slot="actions"
            @click.stop.prevent="comment(item)"
          >
            <a-icon type="message-o" style="margin-right: 8px" />
            {{item.commentCount || 0}}
          </span>
          <img v-if="item.img" slot="extra" alt="文章首图" class="pc-nav post_img" :src="item.img" />
        </a-list-item>
      </nuxt-link>
    </a-list>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
export default {
  data() {
    return {
      loadingMore: false,
      showLoadingMore: true,
      actions: [
        { type: "star-o", text: "0" },
        { type: "like-o", text: "0" },
        { type: "message", text: "0" }
      ],
      page: 1,
      allLoaded: false,
      types: { original: "原创", reprint: "转载", translation: "翻译" }
    };
  },
  async asyncData({ app }) {
    const res = await app.$axios.$get("/api/post/list?page=0");
    return { loading: false, data: res.d };
  },
  head () {
    return {
      title: "Cboy的个人博客",
      meta: [
        { hid: 'description', name: 'description', content: '利用业余时间，nuxt.js+egg.js搭建的微型博客，功能简陋。' }
      ]
    }
  },
  mounted() {},
  methods: {
    getData() {
      return this.$axios.$get("/api/post/list?page=" + this.page++);
    },
    onLoadMore() {
      this.loadingMore = true;
      this.getData().then(res => {
        if (res.d.length === 0) {
          this.allLoaded = true;
          return;
        }
        this.data = this.data.concat(res.d);
        this.loadingMore = false;
        window.dispatchEvent(new Event("resize"));
      });
    },
    collect(item) {},
    like(item) {
      this.$axios
        .$put(`/api/post/like?post_id=${item.post_id}&state=${!item.isLike}`)
        .then(res => {
          if (res.s) {
            item.isLike ? item.likeCount-- : item.likeCount++;
            item.isLike = !item.isLike;
          } else {
            this.$message.error(res.m);
            if (res.m === "未登录") {
              this.$store.commit("showLogin", true);
            }
          }
        });
    },
    comment(item) {
      window.open(`/post/${item.post_id}#comment`)
    }
  },
  components: {
    Logo
  }
};
</script>

<style>
.ant-list {
  background-color: white;
  border-radius: 3px;
}
.ant-list-vertical .ant-list-item-main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.ant-list-vertical .ant-list-item-action {
  margin-left: 0;
}
.ant-list-item-meta-title .post_main_title,
.ant-list-item-meta-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.ant-list-item-meta-title .post_main_title {
  -webkit-line-clamp: 1;
}
.ant-list-vertical .ant-list-item-meta-title {
  margin-bottom: 5px;
}
.post_item {
  background-color: white;
  padding: 12px 20px;
  display: block;
}
.post_item:hover {
  background-color: rgba(199, 255, 255, 0.2);
}
.post_title {
  display: flex;
  align-items: center;
}
.post_type {
  background-color: #001529;
  color: white;
  padding: 0px 8px;
  font-size: 10px;
  margin-right: 12px;
  border-radius: 2px;
  white-space: nowrap;
}
.post_img {
  width: 200px;
  height: 120px;
  object-fit: cover;
}
.content_box {
  padding: 1.5rem 2rem;
}
.ant-list-item-action a{
  color: rgba(0, 0, 0, 0.45);
}
.ant-list-item-action .active {
  color: #0079eb;
}
</style>
