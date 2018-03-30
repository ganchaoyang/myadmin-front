<template>
  <div class="app-container calendar-list-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" :label="$t('table.nickname')" min-width="200">
        <template slot-scope="scope">
          <span>{{scope.row.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.username')">
        <template slot-scope="scope">
          <span>{{scope.row.loginName}}</span>
          <!--<span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>-->
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.email')">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.mobile')">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.disabled')">
        <template slot-scope="scope">
          <span>{{scope.row.isDisabled}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.opBy')">
        <template slot-scope="scope">
          <span>{{scope.row.opBy}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findAll } from '@/api/user'

export default {
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      findAll().then(Response => {
        this.list = Response.data.data
        this.listLoading = false
      })
    }
  }
}
</script>

