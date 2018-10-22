<template>
  <div class="app-container">
      <el-form label-width="90px" label-position="left" ref="roleForm">
          <el-form-item label="文章标题：" size="large">
            <el-input v-model="article.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="文章标签：" size="large">
            <el-select v-model="article.tags" multiple placeholder="请选择" size="medium" style="width:100%;">
              <el-option
                v-for="item in allTag"
                :key="item.id"
                :label="item.tagName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <markdown-editor id="article-content" ref="contentEditor" v-model="article.content"></markdown-editor> -->
          <md-editor id="article-content" ref="contentEditor" :init-data="article.content" :onchange="handleArticleContentChanged"></md-editor>
      </el-form>
      <el-button style="margin-top:50px;" type="primary" icon="el-icon-circle-check-outline" @click="submitData()">提 交</el-button>
  </div>
</template>
<script>

// import MarkdownEditor from '@/components/MarkdownEditor'
import MdEditor from '@/components/MdEditor'
import { addArticle, findById, editArticle } from '@/api/cms/article'
import { findAll as findAllTag } from '@/api/cms/tag'
import { Message } from 'element-ui'

export default {
  name: 'article-editor',
  components: { MdEditor },
  data() {
    return {
      edit: false,
      article: {
        id: null,
        title: null,
        content: null,
        contentTextType: 0,
        tags: [],
        type: null
      },
      allTag: null,
      editor: {
        type: 0
      },
      mode: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const id = this.$route.query.id
      if (!(id && typeof id === 'object')) { // 证明不为空
        // 此时应该获取当前对象的数据。
        console.log(id)
        findById(id).then(Response => {
          const data = Response.data
          if (data.code === 10000) {
            this.article.title = data.data.title
            this.article.content = data.data.content
            this.article.contentTextType = data.data.contentTextType
            this.article.id = data.data.id
            this.editor.type = data.data.contentTextType
            this.article.tags = data.data.tags
            this.edit = true
          }
        })
      }
      // 获取所有的tag
      findAllTag().then(Response => {
        const data = Response.data
        if (data.code === 10000) {
          this.allTag = data.data
        } else {
          Message.error(data.message)
        }
      })
    },
    submitData() {
      // 首先需要设置article的内容语法。
      this.article.contentType = this.editor.type
      if (this.edit) {
        editArticle(this.article).then(Response => {
          const data = Response.data
          if (data.code === 10000) {
            Message.success(data.data)
            history.go(-1)
          } else {
            Message.error(data.message)
          }
        })
      } else {
        // 调用接口提交数据。
        addArticle(this.article).then(Response => {
          const data = Response.data
          if (data.code === 10000) {
            Message.success(data.data)
            history.go(-1)
          } else {
            Message.error(data.message)
          }
        })
      }
    },
    handleArticleContentChanged(data) {
      this.article.content = data.markdown
    }
  }
}
</script>

