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
            <el-button size="mini" type="success">{{$t('table.addChildUnit')}}</el-button>
            <el-button size="mini" type="success">{{$t('table.edit')}}</el-button>
            <el-button size="mini" type="danger">{{$t('table.delete')}}</el-button>
        </template>
    </el-table-column>
  </tree-table>
</template>

<script>

import treeTable from '@/components/TreeTable'
import treeToArray from '@/utils/customEval'
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

