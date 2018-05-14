<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="toEditorPage()">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column min-width="150px" :label="$t('table.title')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('table.author')">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" v-if='showReviewer' align="center" :label="$t('table.reviewer')">
        <template slot-scope="scope">
          <span style='color:red;'>{{scope.row.reviewer}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.readings')" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.pageviews" class="link-type">{{scope.row.pageviews}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='published'" size="mini" type="success" >{{$t('table.publish')}}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" >{{$t('table.draft')}}
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" >{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>  
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: false,
      listQuery: {
        title: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {

    },
    // 点击了添加文章的按钮，跳转至文章编辑页。
    toEditorPage() {
      this.$router.push({
        path: '/cms/article/add/index'
      })
    }
  }
}
</script>

