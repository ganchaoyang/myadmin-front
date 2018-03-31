<template>
  <tree-table :data="data" :evalFunc="func" :expandAll="expandAll" border>
    <el-table-column :label="$t('table.unitName')">
        <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
        </template>
    </el-table-column>
    <el-table-column :label="$t('table.address')">
        <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
        </template>
    </el-table-column>
    <el-table-column :label="$t('table.telePhone')">
        <template slot-scope="scope">
            <span>{{scope.row.telePhone}}</span>
        </template>
    </el-table-column>
    <el-table-column :label="$t('table.action')">
        <template slot-scope="scope">
            <el-button type="success">添加下级单位</el-button>
            <el-button type="success">编辑</el-button>
            <el-button type="danger">删除</el-button>
        </template>
    </el-table-column>
  </tree-table>
</template>

<script>

import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import { findAll } from '@/api/unit'

export default {
  name: 'UnitTreeTable',
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      expandAll: false,
      data: []
    }
  },
  created() {
    this.unitsTree()
  },
  methods: {
    unitsTree() {
      findAll(true).then(Response => {
        this.data = Response.data.data
      })
    }
  }
}
</script>

