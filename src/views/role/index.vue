<template>
  <div class="app-container calendar-list-container">
      <el-table :key="tableKey" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row 
      style="width: 100%">
        <el-table-column align="center" :label="$t('table.roleName')" min-width="200px">
            <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.permIdentify')" min-width="200px">
            <template slot-scope="scope">
                <span>{{scope.row.note}}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.status')" min-width="200px">
            <template slot-scope="scope">
                <el-tag :type="scope.row.disabled | statusStyleFilter">{{$t(statusName(scope.row.disabled))}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.action')" min-width="200px">
            <template slot-scope="scope">
                <el-button type="primary" size="mini">{{$t('table.edit')}}</el-button>
                <el-button v-if="!scope.row.disabled" size="mini" type="danger">{{$t('table.disabled')}}
                </el-button>
                <el-button v-if="scope.row.disabled" size="mini" type="success">{{$t('table.enable')}}
                </el-button>
                <el-button size="mini" type="danger">{{$t('table.delete')}}
                </el-button>
            </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import { findAll } from '@/api/role'

export default {
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: null
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
        this.listLoading = false
      })
    },
    statusName(status) {
      const statusNameList = ['table.disabled', 'table.enable']
      return statusNameList[status ? 0 : 1]
    }
  }
}
</script>

