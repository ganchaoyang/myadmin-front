<template>
  <div class="filter-container">
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="toEditorPage()">{{$t('table.add')}}</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      a: 0
    }
  },
  methods: {
    // 点击了添加文章的按钮，跳转至文章编辑页。
    toEditorPage() {
      this.$router.push({
        path: '/cms/article/add/index'
      })
    }
  }
}
</script>

