<template>
  <div class="app-container">
      <el-form label-width="90px" label-position="left" ref="roleForm">
          <el-form-item label="文章标题：" size="large">
            <el-input v-model="article.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="副标题：" size="large">
            <el-input v-model="article.subtitle" placeholder="请输入文章副标题"></el-input>
          </el-form-item>
          <el-form-item label="公 开:" prop="disabled">
            <el-switch v-model="mode"></el-switch>
          </el-form-item>
          <markdown-editor id="article-content" ref="contentEditor" v-model="article.content"></markdown-editor>
      </el-form>
      <el-button style="margin-top:50px;" type="primary" icon="el-icon-circle-check-outline" @click="submitData()">提 交</el-button>
  </div>
</template>

<script>

import MarkdownEditor from '@/components/MarkdownEditor'
import { addArticle, findById, editArticle } from '@/api/cms/article'
import { Message } from 'element-ui'

export default {
  name: 'article-editor',
  components: { MarkdownEditor },
  data() {
    return {
      edit: false,
      article: {
        id: null,
        title: null,
        subtitle: null,
        content: null,
        contentType: 'MD',
        mode: 'PUBLIC'
      },
      editor: {
        type: 'MD'
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
            this.article.subtitle = data.data.subtitle
            this.article.content = data.data.content
            this.article.contentType = data.data.contentType
            this.article.mode = data.data.mode
            this.article.id = data.data.id
            this.editor.type = data.data.contentType
            if (data.data.mode === 'PUBLIC') {
              this.mode = true
            } else {
              this.mode = false
            }
            this.edit = true
          }
        })
      }
    },
    submitData() {
      // 首先需要设置article的内容语法。
      this.article.contentType = this.editor.type
      // 设置文章的公开与否。
      if (this.mode) {
        this.article.mode = 'PUBLIC'
      } else {
        this.article.mode = 'PRIVATE'
      }
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
    }
  }
}
</script>

