<template>
  <div class="app-container calendar-list-container">
      <div class="container">
        <el-button class="filter-item" type="primary" icon="el-icon-plus" size="max" @click="addUsersHandle">添加用户到[{{ role.name }}]角色</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-minus" type="danger" size="max" @click="deleteUsersHandle">从[{{ role.name }}]角色中删除用户</el-button>
      </div>
      <el-table
        :data="initialUsers"
        ref="users-under-the-role"
        tooltip-effect="dark"
        @selection-change="selectionChangeHandle"
        style="width: 100%;margin-top:15px;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" :label="$t('table.nickname')" min-width="200">
          <template slot-scope="scope">
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" align="center" :label="$t('table.username')">
          <template slot-scope="scope">
            <span>{{scope.row.loginName}}</span>
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
            <el-tag :type="scope.row.disabled | statusStyleFilter">{{$t(statusName(scope.row.disabled))}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" align="center" :label="$t('table.createTime')">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialog.dialogVisible" width="40%" :title="dialog.title">
        <el-table
        :data="usersNotUnderTheRole"
        ref="users-not-under-the-role"
        tooltip-effect="dark"
        @selection-change="addUsersSelectionChangeHandle"
        style="width: 100%;margin-top:15px;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" :label="$t('table.nickname')" min-width="200">
          <template slot-scope="scope">
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" align="center" :label="$t('table.username')">
          <template slot-scope="scope">
            <span>{{scope.row.loginName}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="200px" align="center" :label="$t('table.disabled')">
          <template slot-scope="scope">
            <el-tag :type="scope.row.disabled | statusStyleFilter">{{$t(statusName(scope.row.disabled))}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
          <el-button @click="restoreDialog()">取 消</el-button>
          <el-button type="primary" @click="nextStepDialogHandle()">{{dialog.nextText}}</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>

import { findById, updateRole } from '@/api/role'
import { findAll as findAllUsers } from '@/api/user'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      // 存放的是当前角色最完整的用户。
      initialUsers: [],
      // 存放当前系统中所有的用户。
      allUsers: [],
      // 存放不是当前角色下的用户。
      usersNotUnderTheRole: [],
      role: {
        id: null,
        name: null,
        users: null,
        disabled: false
      },
      dialog: {
        title: '添加用户至当前角色',
        dialogVisible: false,
        nextText: '提 交'
      }
    }
  },
  created() {
    this.initData()
  },
  filters: {
    statusStyleFilter(status) {
      const statusStyleList = ['danger', 'success']
      return statusStyleList[status ? 0 : 1]
    }
  },
  methods: {
    // 初始化数据，主要是请求已经分配了当前角色的用户。
    initData() {
      if (this.$route.query.id) {
        this.role.id = this.$route.query.id
      }
      findById(this.role.id).then(Response => {
        const data = Response.data
        if (data.code === 0) {
          this.initialUsers = data.data.users
          this.role.users = data.data.users
          this.role.name = data.data.name
          this.role.disabled = data.data.disabled
        }
      })
    },
    statusName(status) {
      const statusNameList = ['table.disabled', 'table.enable']
      return statusNameList[status ? 0 : 1]
    },
    selectionChangeHandle(data) {
      var removeIds = new Map()
      data.forEach(element => {
        removeIds.set(element.id, true)
      })
      const tempUsers = []
      this.initialUsers.forEach(element => {
        if (!removeIds.has(element.id)) {
          tempUsers.push(element)
        }
      })
      this.role.users = tempUsers
    },
    deleteUsersHandle() {
      updateRole(this.role).then(Response => {
        const data = Response.data
        if (data.code === 0) {
          Message.success(data.data)
          this.initData()
        } else {
          Message.error(data.data)
        }
      })
    },
    addUsersHandle() {
      this.dialog.dialogVisible = true
      findAllUsers().then(Response => {
        const data = Response.data
        if (data.code === 0) {
          const userUnderTheRole = new Map()
          this.initialUsers.forEach(element => {
            userUnderTheRole.set(element.id, true)
          })
          const tempUsers = []
          data.data.forEach(element => {
            if (!userUnderTheRole.has(element.id)) {
              tempUsers.push(element)
            }
          })
          this.usersNotUnderTheRole = tempUsers
        }
      })
    },
    addUsersSelectionChangeHandle(data) {
      const users = [...this.initialUsers, ...data]
      this.role.users = users
    },
    nextStepDialogHandle() {
      updateRole(this.role).then(Response => {
        const data = Response.data
        if (data.code === 0) {
          Message.success(data.data)
          this.restoreDialog()
          this.initData()
        } else {
          Message.error(data.data)
        }
      })
    },
    restoreDialog() {
      this.dialog.dialogVisible = false
      this.usersNotUnderTheRole = []
      this.allUsers = []
      this.role.users = null
    }
  }
}
</script>

