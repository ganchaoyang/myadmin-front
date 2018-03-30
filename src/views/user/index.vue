<template>
  <div class="app-container calendar-list-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="用户名" min-width="200">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.username')">
        <template slot-scope="scope">
          <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.email')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.mobile')">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.disabled')">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" :label="$t('table.opBy')">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
