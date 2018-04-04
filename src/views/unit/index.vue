<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input style="width: 300px;" class="filter-item" :placeholder="$t('table.unitName')" v-model="queryUnitName"></el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">{{$t('table.search')}}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      </div>
    <tree-table :data="list" :evalFunc="func" :expandAll="expandAll" border>
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
  </div>
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
      data: [],
      list: [],
      queryUnitName: ''
    }
  },
  created() {
    this.unitsTree()
  },
  methods: {
    unitsTree() {
      findAll(true).then(Response => {
        this.data = Response.data.data
        this.list = Response.data.data
      })
    },
    handleSearch() {
      var temp = []
      this.data.forEach(element => {
        if (element.name.match(this.queryUnitName)) {
          temp.push(element)
        }
      })
      this.list = temp
    }
  }
}
</script>

