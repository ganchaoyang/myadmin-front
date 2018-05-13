<template>
  <div class="app-container">
      <el-form label-width="90px" label-position="left" ref="roleForm">
        <div class="components-container">
          <el-form-item label="文章标题：" size="large">
            <el-input v-model="article.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="副标题：" size="large">
            <el-input v-model="article.subtitle" placeholder="请输入文章副标题"></el-input>
          </el-form-item>
          <el-form-item label="公 开:" prop="disabled">
            <el-switch v-model="mode"></el-switch>
          </el-form-item>
          <div class="editor-container">
              <markdown-editor id="article-content" ref="contentEditor" v-model="article.content" :height="300" :zIndex="20"></markdown-editor>
          </div>
          <el-button style="margin-top:80px;" type="primary" icon="el-icon-circle-check-outline" @click="submitData()">提 交</el-button>
        </div>
      </el-form>
  </div>
</template>

<script>

import MarkdownEditor from '@/components/MarkdownEditor'
import { addArticle } from '@/api/cms/article'
import { Message } from 'element-ui'

export default {
  name: 'article-editor',
  components: { MarkdownEditor },
  data() {
    return {
      article: {
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
  methods: {
    submitData() {
      // 首先需要设置article的内容语法。
      this.article.contentType = this.editor.type
      // 设置文章的公开与否。
      if (this.mode) {
        this.article.mode = 'PUBLIC'
      } else {
        this.article.mode = 'PRIVATE'
      }
      // 调用接口提交数据。
      addArticle(this.article).then(Response => {
        const data = Response.data
        if (data.code === 0) {
          Message.success(data.data)
        } else {
          Message.error(data.data)
        }
      })
    }
  }
}
</script>

