<template>
  <div v-if="data" class="Pd20">
    <a-row type="flex" align="middle" class="avator-view">
      <a-avatar :size="50" icon="user" />
      <div style="margin-left: 10px;flex:1;">
        <div><nuxt-link class="height-64" to="/">{{data.user.user_name || data.user.user_email}}</nuxt-link></div>
        <div style="color: #aaa;">{{ data.created_at }}</div>
      </div>
      <div v-if="data.user_id === userInfo.user_id">
        <nuxt-link :to="'/edit/'+ data.post_id">
          <a-button>编辑</a-button>
        </nuxt-link>
      </div>
    </a-row>
    <div class="content-view">
      <img v-if="data.img" class="content-main-img" :src="'../'+data.img">
      <h1 class="content-main-title">{{data.title}}</h1>
      <h3 class="content-main-intro">{{data.intro}}</h3>
      <div v-html="data.content" style="padding-bottom: 20px;"></div>
      <div class="tags" v-if="data.tagList && data.tagList.length > 0">
        <div>标签：</div>
        <a-row>
          <a-tag v-for="(item, index) in data.tagList" :key="index">{{item.tag_name}}</a-tag>
        </a-row>
      </div>
    </div>
    <div id="comment">
      <div class="comment-title">评论</div>
      <div class="comment-input">
        <a-row type="flex" align="middle">
          <a-col>
            <a-avatar :size="40" icon="user" />
          </a-col>
          <a-col style="padding-left:20px;flex:1;">
            <a-textarea ref="commentInput" placeholder="谨言慎行~" @focus="focusCommentInput" v-model.trim="commentContent" :disabled="loading" :rows="1" autosize style="resize:none;padding: 11px;" @pressEnter="comment" />
          </a-col>
        </a-row>
      </div>
      <div class="comment-content">
        <a-row type="flex" class="comment-item" v-for="(item, index) in commentList" :key="index">
          <a-col>
            <a-avatar :size="35" icon="user" />
          </a-col>
          <a-col style="padding-left:10px;flex:1;">
            <div>{{item.user.user_name || item.user.user_email}} · <span class="post_time">&lt;{{item.createdAt}}&gt;</span></div>
            <p style="padding-top:10px;">{{item.content}}</p>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="post-suspended-panel">
      <div class="panel-btn" :class="{'has-count': data.likeCount > 0}" @click="like" :count="data.likeCount">
        <a-icon type="like" theme="filled" style="fontSize: 20px;" :class="{active: data.isLike}" />
      </div>
      <div class="panel-btn" :class="{'has-count': data.commentCount > 0}" @click="toComment" :count="data.commentCount">
        <a-icon type="message" theme="filled" style="fontSize: 20px;" />
      </div>
    </div>
  </div>
  <div v-else>
    <div style="padding: 30%; text-align:center;">{{msg}}</div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      loading: false,
      commentContent: '',
      commentList:[]
    }
  },
  async asyncData({ app, params }) {
    const res = await app.$axios.$get('/api/post/' + params.id);
    res.d && !res.d.user && (res.d.user = {user_name: '未知用户', user_email: '未知邮箱'});
    return { loading: false, data: res.d, msg: res.m };
  },
  head () {
    let meta = [];
    if(this.data){
      let keywords = [this.data.ct.category_name];
      this.data.tagList.forEach(item => {
        keywords.push(item);
      });
      meta = [
        { hid: 'description', name: 'description', content: this.data.intro },
        { hid: 'keywords', name: 'keywords', content: keywords.join(',') },
      ]
    }
    return {
      title: this.data ? this.data.title + "——Cboy的个人博客" : '文章不存在',
      meta
    }
  },
  mounted() {
    this.data && this.getComment();
    this.toHash();
  },
  methods:{
    getComment(){
      this.$axios.$get("/api/comment/get?post_id=" + this.data.post_id).then(res=>{
        this.commentList = res.d || [];
      })
    },
    toComment(){
      location.hash = '#comment';
      this.toHash();
    },
    toHash(){
      if(location.hash){
        scrollTo(0, document.querySelector(location.hash).offsetTop - 60);
      }
    },
    like(){
      let item = this.data;
      this.$axios
        .$put(`/api/post/like?post_id=${item.post_id}&state=${!item.isLike ? 1: 0}`)
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
    comment(){
      if(!this.commentContent.trim()){
        this.$message.info('没话说？');
        return;
      }
      this.loading = true;
      this.$axios.post('/api/comment/add', {
        post_id: this.data.post_id,
        content: this.commentContent
      }).then(res=>{
        if(res.data.s){
          this.commentContent = '';
          this.commentList.unshift({
            ...res.data.d,
            user: {
              user_email: this.userInfo.user_email,
              user_image: this.userInfo.user_image,
              user_name: this.userInfo.user_name
            }
          });
          this.data.commentCount++;
          this.$message.success(res.data.m);
        }else{
          this.$message.error(res.data.m);
        }
        this.loading = false;
      }).catch(err=>{
        this.loading = false;
      })
    },
    focusCommentInput(){
      if(!this.isLogin){
        this.$store.commit("showLogin", true);
        this.$refs.commentInput.blur();
      }
    },
  }
}
</script>

<style>
.avator-view,.content-main-intro{
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.content-view{
  padding-top: 20px;
}
.content-main-img{
  display: block;
  margin: auto;
  width: auto;
  max-width: 100%;
  max-height: 300px;
  margin-bottom: 20px;
  /* background-image: url('https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center; 
  padding-top: 56.29%;*/
}
.content-main-title{
  font-weight: 600;
}
.tags{
  padding-top: 10px;
  border-top:1px solid #f2f2f2;
}
.tags .ant-tag{
  margin: 10px;
}
.comment-title{
  text-align: center;
  font-size: 16px;
  padding: 20px;
  border-top: 1px solid #f2f2f2;
}
.comment-content{
  padding: 10px;
}
.comment-item{
  padding: 10px 0;
}
.comment-item p{
  margin-bottom: 5px;
}
.comment-item + .comment-item{
  border-top: 1px solid #f2f2f2;
}
.post-suspended-panel{
  position: fixed;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}
.panel-btn{
  border-radius: 50%;
  background-color: white;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px 0px rgba(0,0,0,.1);
  width: 40px;
  height: 40px;
  cursor: pointer;
  line-height: 40px;
  text-align: center;
  position: relative;
}
.panel-btn .active{
  color: #0079eb;
}
.panel-btn.has-count::after{
  content: attr(count);
  position: absolute;
  top: 0;
  right: 0;
  padding: 1px 4px;
  font-size: 10px;
  text-align: center;
  white-space: nowrap;
  color: #fff;
  line-height: 1;
  background-color: #b2bac2;
  border-radius: 10px;
  transform: translateX(50%) scale(.75);
}
</style>