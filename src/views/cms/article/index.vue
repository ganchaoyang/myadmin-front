<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleSearch" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="toEditorPage()">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column min-width="150px" :label="$t('table.title')">
        <template slot-scope="scope">
          <span class="link-type">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type | handleArticleType}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" :label="$t('table.author')">
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.readings')" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.views" class="link-type">{{scope.row.views}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{$t(statusNameFilter(scope.row.status))}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="350" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!= 2" size="mini" type="success" @click="handelUpdateStatus('PUBLISHED', scope.row)">{{$t('table.publish')}}
          </el-button>
          <el-button v-if="scope.row.status!= 1" size="mini" @click="handelUpdateStatus('DRAFT', scope.row)">{{$t('table.draft')}}
          </el-button>
          <el-button v-if="scope.row.status!= 0" size="mini" type="danger" @click="handelUpdateStatus('DELETED', scope.row)">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>  
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" 
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

import { findAll, editArticle } from '@/api/cms/article'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      tableKey: 0,
      total: null,
      list: null,
      wholeList: null,
      listLoading: true,
      listQuery: {
        title: null,
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  filters: {
    statusFilter(status) {
      const statusArray = [
        'danger',
        'info',
        'success'
      ]
      return statusArray[status]
    },
    handleArticleType(type) {
      const typeArray = ['BLOG', 'ARTICLE']
      return typeArray[type]
    }
  },
  methods: {
    getList() {
      findAll(this.listQuery.page,
        this.listQuery.limit).then(Request => {
        this.listLoading = false
        const data = Request.data
        if (data.code === 10000) {
          this.list = data.data.list
          this.total = data.data.totalNumber
          this.wholeList = this.list
        } else {
          Message.error('获取数据失败了！！')
        }
      })
    },
    // 点击了添加文章的按钮，跳转至文章编辑页。
    toEditorPage() {
      this.$router.push({
        path: '/cms/article/add/index'
      })
    },
    statusNameFilter(status) {
      const statusNameArray = [
        'table.delete',
        'table.draft',
        'table.publish'
      ]
      return statusNameArray[status]
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleSearch() {
      const temp = []
      this.wholeList.forEach(element => {
        if (element.title.match(this.listQuery.title)) {
          temp.push(element)
        }
      })
      this.list = temp
    },
    handleEdit(id) {
      this.$router.push({
        path: '/cms/article/add/index',
        query: {
          id: id
        }
      })
    },
    handelUpdateStatus(status, article) {
      const oldStatus = article.status
      article.status = status
      editArticle(article).then(Response => {
        const data = Response.data
        if (data.code === 10000) {
          Message.success(data.data)
        } else {
          console.log(article.status)
          console.log(oldStatus)
          article.status = oldStatus
          Message.error(data.message)
        }
      })
    }
  }
}
</script>

