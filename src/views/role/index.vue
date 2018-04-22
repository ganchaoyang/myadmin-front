<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input style="width: 300px;" class="filter-item" :placeholder="$t('table.unitName')" v-model="queryRoleName"></el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchHandle">{{$t('table.search')}}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialog.dialogVisible = true">{{$t('table.add')}}</el-button>
      </div>
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
                <el-button size="mini" type="danger" @click="deleteRoleHandle(scope.row.id)">{{$t('table.delete')}}
                </el-button>
                <el-dropdown style="margin-left: 8px;" @command="moreActionsHandle">
                  <el-button type="primary" size="mini">
                    更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="!scope.row.disabled" :command="scope.row.id + ',' + 'disabled'">禁用</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.disabled" :command="scope.row.id + ',' + 'enabled'">启用</el-dropdown-item>
                    <el-dropdown-item :command="scope.row.id + ',' + 'assignUsers'">分配用户</el-dropdown-item>
                    <el-dropdown-item :command="scope.row.id + ',' + 'assignPerms'">分配权限</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialog.dialogVisible" width="40%" :title="dialog.title">
        <el-form label-width="90px" label-position="right" ref="roleForm" :rules="rules.addRules" v-show="dialog.formVisible" :model="submitRole"
          class="demo-ruleForm" style="width: 60%;margin: 15px auto 0;">
          <el-form-item label="角色名称:" prop="name">
            <el-input v-model="submitRole.name" placeholder="请输入2-16位以内字符"></el-input>
          </el-form-item>
          <el-form-item label="角色标识:" prop="note">
            <el-input v-model="submitRole.note" placeholder="请输入角色标识，eg:doctor"></el-input>
          </el-form-item>
          <el-form-item label="禁  用" prop="disabled">
            <el-switch v-model="submitRole.disabled"></el-switch>
          </el-form-item>
        </el-form>
        <el-tree
          :data="allPerms"
          show-checkbox
          node-key="id"
          :props="tree.defaultProps"
          :default-checked-keys="tree.defaultCheckedKeys"
          default-expand-all
          v-show="dialog.assignPermsTreeVisible">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleDialogHandle()">取 消</el-button>
          <el-button type="primary" @click="nextStepDialogHandle()">{{dialog.nextText}}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { findAll, addRole, deleteRole, findById } from '@/api/role'
import { findAll as findAllPerms } from '@/api/perm'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: [],
      data: [],
      allPerms: [],
      permsUnderTheRole: [],
      queryRoleName: '',
      dialog: {
        type: 'add',
        title: '创建角色',
        dialogVisible: false,
        formVisible: true,
        assignPermsTreeVisible: false,
        nextText: '提 交'
      },
      submitRole: {
        id: null,
        name: null,
        note: null,
        disabled: false,
        perms: null
      },
      rules: {
        addRules: {
          name: [
            { type: 'string', required: true, message: '请输入角色名称', triiger: 'blur' },
            { min: 2, max: 16, message: '长度在6-16个字符', triiger: 'blur' }
          ],
          note: [
            { type: 'string', required: true, message: '请输入权限标识', triiger: 'blur' },
            { max: 10, message: '长度在10个字符以内', triiger: 'blur' }
          ]
        }
      },
      tree: {
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        defaultCheckedKeys: []
      }
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
        this.data = this.list
        this.listLoading = false
      })
    },
    initAllPerm() {
      findAllPerms(true).then(Response => {
        const data = Response.data
        if (data.code === 0) {
          this.allPerms = data.data
        }
      })
    },
    statusName(status) {
      const statusNameList = ['table.disabled', 'table.enable']
      return statusNameList[status ? 0 : 1]
    },
    searchHandle() {
      const temp = []
      this.data.forEach(element => {
        if (element.name.match(this.queryRoleName)) {
          temp.push(element)
        }
      })
      this.list = temp
    },
    restoreSubmitData() {
      this.submitRole.name = null
      this.submitRole.note = null
      this.submitRole.id = null
      this.submitRole.perms = null
      this.submitRole.disabled = false
    },
    cancleDialogHandle() {
      this.dialog.dialogVisible = false
      this.restoreSubmitData()
      this.permsUnderTheRole = null
    },
    nextStepDialogHandle() {
      if (this.dialog.type === 'add') { // 添加角色。
        addRole(this.submitRole).then(Response => {
          const data = Response.data
          if (data.code === 0) {
            Message.success(data.data)
            this.cancleDialogHandle()
            this.getList()
          } else {
            Message.error(data.data)
          }
        })
      }
    },
    deleteRoleHandle(id) {
      deleteRole(id).then(Response => {
        const data = Response.data
        if (data.code === 0) {
          Message.success(data.data)
          this.getList()
        } else {
          Message.error('删除失败！')
        }
      })
    },
    moreActionsHandle(commands) {
      const commandArr = commands.split(',')
      const action = commandArr[1]
      if (action === 'disabled') {
        console.log('禁用')
      } else if (action === 'enabled') {
        console.log('启用')
      } else if (action === 'assignUsers') {
        this.$router.push({
          path: '/role/assign/user/index',
          name: 'assignUser',
          query: {
            id: commandArr[0]
          }
        })
      } else if (action === 'assignPerms') {
        this.assignPermsHandle(commandArr[0])
      }
    },
    assignPermsHandle(id) {
      this.dialog.type = 'assignPerms'
      this.dialog.dialogVisible = true
      this.dialog.assignPermsTreeVisible = true
      this.dialog.formVisible = false
      findById(id).then(Response => {
        const data = Response.data
        if (data.code === 0) {
          this.permsUnderTheRole = data.data.perms
          this.submitRole.id = data.data.id
          this.submitRole.name = data.data.name
          this.submitRole.note = data.data.note
          this.submitRole.perms = this.permsUnderTheRole
          this.submitRole.disabled = data.data.disabled
          this.tree.defaultCheckedKeys = []
          this.permsUnderTheRole.forEach(element => {
            if (!element.hasChildren) {
              this.tree.defaultCheckedKeys.push(element.id)
            }
          })
          this.initAllPerm()
        }
      })
    }
  }
}
</script>

