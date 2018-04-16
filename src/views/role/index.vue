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
                <el-button v-if="!scope.row.disabled" size="mini" type="danger">{{$t('table.disabled')}}
                </el-button>
                <el-button v-if="scope.row.disabled" size="mini" type="success">{{$t('table.enable')}}
                </el-button>
                <el-button size="mini" type="danger">{{$t('table.delete')}}
                </el-button>
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
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleDialogHandle()">取 消</el-button>
          <el-button type="primary" @click="nextStepDialogHandle()">{{dialog.nextText}}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { findAll, addRole } from '@/api/role'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: [],
      data: [],
      queryRoleName: '',
      dialog: {
        type: 'add',
        title: '创建角色',
        dialogVisible: false,
        formVisible: true,
        nextText: '提 交'
      },
      submitRole: {
        name: '',
        note: '',
        disabled: false
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
      this.submitRole.name = ''
      this.submitRole.note = ''
      this.submitRole.disabled = false
    },
    cancleDialogHandle() {
      this.dialog.dialogVisible = false
      this.restoreSubmitData()
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
    }
  }
}
</script>

