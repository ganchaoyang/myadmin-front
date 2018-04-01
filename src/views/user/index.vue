<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input style="width: 300px;" class="filter-item" :placeholder="$t('table.username')" v-model="queryLoginName"></el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">{{$t('table.search')}}</el-button>
      </div>
      
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
          <el-tag :type="scope.row.isDisabled | statusStyleFilter">{{$t(statusName(scope.row.isDisabled))}}</el-tag>
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
      <el-table-column min-width="200px" align="center" :label="$t('table.action')">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">{{$t('table.edit')}}</el-button>
          <el-button v-if="!scope.row.isDisabled" size="mini" type="danger">{{$t('table.disabled')}}
          </el-button>
          <el-button v-if="scope.row.isDisabled" size="mini" type="success">{{$t('table.enable')}}
          </el-button>
          <el-button size="mini" type="danger">{{$t('table.delete')}}
          </el-button>
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
      list: null,
      data: null,
      queryLoginName: ''
    }
  },
  filters: {
    statusStyleFilter(status) {
      const statusStyleList = ['danger', 'success']
      return statusStyleList[status ? 0 : 1]
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
        this.data = Response.data.data
        this.listLoading = false
      })
    },
    statusName(status) {
      const statusNameList = ['table.disabled', 'table.enable']
      return statusNameList[status ? 0 : 1]
    },
    handleSearch() {
      var temp = []
      this.data.forEach(element => {
        if (element.loginName.match(this.queryLoginName)) {
          temp.push(element)
        }
      })
      this.list = temp
    }
  }
}
</script>

