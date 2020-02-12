<template>
  <div class="Pd20">
    <a-form
      id="components-form-demo-validate-other"
      :form="form"
      v-bind="formItemLayout"
      @submit="handleSubmit"
      action
    >
      <a-form-item label="文章标题">
        <a-input
          auto-focus
          v-decorator="['title', { rules: [{ required: true, message: 'Please input your title!' }] }]"
        />
      </a-form-item>
      <a-form-item label="文章简介">
        <a-input
          v-decorator="['intro', { rules: [{ required: true, message: 'Please input your intro!' }] }]"
        />
      </a-form-item>

      <a-form-item label="分类">
        <a-radio-group
          v-decorator="['category', { initialValue: categoryList[0].category_id }]"
          @change="handleCategoryChange"
        >
          <a-radio-button
            :value="item.category_id"
            v-for="(item, index) in categoryList"
            :key="index"
          >{{item.category_name}}</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        label="标签"
        :help="tag.length >= 5 && `Select up to 5 items`"
        :validate-status="tag.length >= 5 ? 'error' : ''"
      >
        <a-checkbox-group
          v-decorator="['tag', { initialValue: [] }]"
          @change="handleTagChange"
          style="width: 100%;"
        >
          <a-row>
            <a-col :span="8" v-for="(item, index) in tagList" :key="index">
              <a-checkbox
                :disabled="tag.length >= 5 && !tag.includes(item.tag_id)"
                :value="item.tag_id"
              >{{item.tag_name}}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>

      <a-form-item label="类型">
        <a-input-group>
          <a-select v-decorator="['type', { initialValue: types[0].value }]">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in types"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-input-group>
      </a-form-item>

      <a-form-item label="首图">
        <a-upload
          v-decorator="['img']"
          name="avatar"
          listType="picture-card"
          class="avatar-uploader"
          :showUploadList="false"
          action="/api/upload"
          :beforeUpload="beforeUpload"
          @change="handleChange"
          accept="image/*"
        >
          <img v-if="uploadImageUrl" :src="'../' + uploadImageUrl" alt="首图" style="width:100%;" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-item>

      <a-form-item label="文章内容">
        <div
          v-decorator="['content', { rules: [{ required: true, message: 'Please input your content!' }] }]"
        >
          <div id="wangeditor">
            <div ref="editorElem"></div>
          </div>
        </div>
      </a-form-item>

      <a-row style="margin-top:20px;">
        <a-col :span="6"></a-col>
        <a-col :span="12">
          <a-button type="primary" size="large" block htmlType="submit">保存</a-button>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
let E = null;
if (process.browser) {
  E = require("wangeditor");
}
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 }
      },
      form: this.$form.createForm(this, { name: "register" }),
      types: [
        { name: "原创", value: "original" },
        { name: "转载", value: "reprint" },
        { name: "翻译", value: "translation" }
      ],
      category: "",
      tag: [],
      content: "",
      editor: null,
      uploadImageUrl: "",
      loading: false
    };
  },
  async asyncData({ app, params }) {
    // await app.$axios.post("/api/post/addTag", {tag_name: ['html', 'js', 'css', 'ts' , 'node' , 'c#' , 'php', 'jquery', 'python', 'object-c', 'java', 'swift', 'kotlin', '.net', 'c/c++', 'go', 'redis', 'ps', 'ai', 'ae', 'ui']})
    // await app.$axios.post("/api/post/addCategory", {category_name: '杂谈'})
    // await app.$axios.post("/api/post/addCategory", {category_name: '前端'})
    // await app.$axios.post("/api/post/addCategory", {category_name: '后端'})
    // await app.$axios.post("/api/post/addCategory", {category_name: 'iOS'})
    // await app.$axios.post("/api/post/addCategory", {category_name: 'Android'})
    var reqList = [
      app.$axios.get("/api/post/getCategory"),
      app.$axios.get("/api/post/getTag")
    ]
    if(params.id !== 'new'){
      reqList.push(app.$axios.get("/api/post/" + params.id))
    }
    const res = await Promise.all(reqList);
    return { categoryList: res[0].data.d, tagList: res[1].data.d, data: res[2] && res[2].data.d };
  },
  mounted() {
    if(!this.isLogin){
      location.replace('/');
      return;
    }
    this.editor = new E(this.$refs.editorElem);
    // 编辑器的事件，每次改变会获取其html内容
    this.editor.customConfig.onchange = html => {
      this.content = html;
    };
    this.editor.create(); // 创建富文本实例
    if(this.data){
      if(this.data.user_id !== this.userInfo.user_id){
        location.replace('/post/' + this.data.post_id)
        return
      }
      this.content = this.data.content
      this.editor.txt.html(this.content)
      this.uploadImageUrl = this.data.img
      this.tag = this.data.tagList.map(item => item.tag_id)
      this.form.setFieldsValue({ 
        content: this.content,
        img: this.uploadImageUrl,
        title: this.data.title,  
        intro: this.data.intro,
        tag: this.tag,
        category: this.data.category,
        type: this.data.type
      });
    }
    // this.editor.customConfig.menus = [
    //   // 菜单配置
    //   'head', // 标题
    //   'bold', // 粗体
    //   'fontSize', // 字号
    //   'fontName', // 字体
    //   'italic', // 斜体
    //   'underline', // 下划线
    //   'strikeThrough', // 删除线
    //   'foreColor', // 文字颜色
    //   'backColor', // 背景颜色
    //   'link', // 插入链接
    //   'list', // 列表
    //   'justify', // 对齐方式
    //   'quote', // 引用
    //   'emoticon', // 表情
    //   'image', // 插入图片
    //   'table', // 表格
    //   'code', // 插入代码
    //   'undo', // 撤销
    //   'redo' // 重复
    // ];
  },
  methods: {
    handleSubmit(e) {
      this.form.setFieldsValue({ content: this.content , img: this.uploadImageUrl });
      e.preventDefault();
      this.form.validateFields((err, values) => {
        // console.log("Received values of form: ", values);
        if (err === null) {
          if(this.data){
            values.post_id = this.data.post_id
            values.user_id = this.data.user_id
          }
          this.$axios.$post("/api/post/edit", values).then(res => {
            if (res.s) {
              this.$message.success(res.m);
              location.href = '/post/' + res.d
            } else {
              this.$message.error(res.m);
            }
          });
        }
      });
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        // console.log(info)
        if(!info.file.response.d){
          this.$message.error(info.file.response.m);
          return
        }
        getBase64(info.file.originFileObj, imageUrl => {
          this.uploadImageUrl = info.file.response.d
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isImage = file.type.indexOf('image/') !== -1;
      if (!isImage) {
        this.$message.error("You can only upload Image file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("Image must smaller than 2MB!");
      }
      return isImage && isLt2M;
    },
    handleCategoryChange(e) {
      this.category = e.target.value;
    },
    handleTagChange(value) {
      this.tag = value;
    }
  }
};
</script>

<style>
.ant-form-item-label label {
  font-weight: 600;
}
.ant-upload.ant-upload-drag .ant-upload-drag-container {
  display: block;
  padding: 5px 0;
}
#wangeditor {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
  overflow: hidden;
  min-height: 300px;
}
#wangeditor:focus,
#wangeditor:focus-within {
  border-color: #40a9ff;
  border-right-width: 1px !important;
  outline: 0;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
.has-error #wangeditor {
  border-color: #f5222d;
}
.has-error #wangeditor:focus-within {
  border-color: #ff4d4f;
  border-right-width: 1px !important;
  outline: 0;
  box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
}
.w-e-toolbar,
.w-e-text-container {
  border: none !important;
  flex-wrap: wrap;
}
.w-e-text::-webkit-scrollbar-thumb {
  background-color: #ccc;
  outline: none;
}
.w-e-text::-webkit-scrollbar-track {
  box-shadow: none;
}
.w-e-text::-webkit-scrollbar {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 0.6rem;
}
</style>