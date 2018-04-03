<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input style="width: 300px;" class="filter-item" :placeholder="$t('table.username')" v-model="queryLoginName"></el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">{{$t('table.search')}}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addUser.dialogVisible = true">{{$t('table.add')}}</el-button>
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
      <el-table-column min-width="240px" align="center" :label="$t('table.action')">
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

    <el-dialog :visible.sync="addUser.dialogVisible" width="40%" title="创建用户">
      <el-steps :active="addUser.createDialogStepActive" align-center>
        <el-step title="步骤1" description="选择单位"></el-step>
        <el-step title="步骤2" description="填写用户信息"></el-step>
        <el-step title="步骤3" description="分配角色"></el-step>
      </el-steps>
      <el-tree :data="addUser.unitList" :props="addUser.defaultTreeProps" accordion 
        @node-click="handleTreeNodeClick" style="margin: 15px 0 0 12%;" 
        v-show="addUser.unitTreeVisible">
      </el-tree>
      <el-form label-width="80px" label-position="right" ref="userInfoForm" :rules="addUser.rules" v-show="addUser.createFormVisible" :model="addUser.submitData"
        class="demo-ruleForm" style="width: 60%;margin: 15px auto 0;">
        <el-form-item label="登录名:" prop="loginName">
          <el-input v-model="addUser.submitData.loginName" placeholder="请输入6-16位以内字符"></el-input>
        </el-form-item>
        <el-form-item label="昵  称:" prop="nickname">
          <el-input v-model="addUser.submitData.nickname" placeholder="请输入6-16位以内字符"></el-input>
        </el-form-item>
        <el-form-item label="密  码:" prop="password">
          <el-input v-model="addUser.submitData.password" type="password" placeholder="密码必须为6-16位"></el-input>
        </el-form-item>
        <el-form-item label="邮  箱:" prop="email">
          <el-input v-model="addUser.submitData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电  话:" prop="mobile">
          <el-input v-model="addUser.submitData.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="禁  用" prop="disabled">
          <el-switch v-model="addUser.submitData.isDisabled"></el-switch>
        </el-form-item>
      </el-form>
      <el-table ref="mutipleTable" :data="addUser.roleList" tooltip-effect="dark" style="width: 74%;margin: 15px auto 0"
        v-show="addUser.createRolesTableVisible" @selection-change="handleRolesSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :label="$t('table.roleName')">
          <template slot-scope="scope">{{scope.row.name}}</template>
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
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogCancel">取 消</el-button>
        <el-button type="primary" @click="createDialogNextStep">{{addUser.next}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findAll, addUser } from '@/api/user'
import { findAll as findAllUnits } from '@/api/unit'
import { findAll as findAllRoles } from '@/api/role'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: null,
      data: null,
      queryLoginName: '',
      addUser: {
        dialogVisible: false,
        createFormVisible: false,
        unitTreeVisible: true,
        createRolesTableVisible: false,
        unitList: [],
        roleList: [],
        defaultTreeProps: {
          label: 'name',
          children: 'children'
        },
        createDialogStepActive: 0,
        next: '下一步',
        submitData: {
          unitId: '',
          loginName: '',
          nickname: '',
          password: '',
          email: '',
          mobile: '',
          isDisabled: false,
          roles: []
        },
        rules: {
          loginName: [
            { type: 'string', required: true, message: '请输入登录名', triiger: 'blur' },
            { min: 6, max: 16, message: '长度在6-16个字符', triiger: 'blur' }
          ],
          nickname: [
            { type: 'string', required: true, message: '请输入昵称', triiger: 'blur' },
            { min: 6, max: 16, message: '长度在6-16个字符', triiger: 'blur' }
          ],
          password: [
            { type: 'string', required: true, message: '请输入密码', triiger: 'blur' },
            { min: 6, max: 16, message: '长度在6-16个字符', triiger: 'blur' }
          ],
          email: [
            { type: 'email', required: true, message: '请输入邮箱', triiger: 'blur' },
            { max: 32, message: '长度在32个字符以内', triiger: 'blur' }
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
    this.getUnitList()
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
    },
    getUnitList() {
      findAllUnits(true).then(Response => {
        this.addUser.unitList = Response.data.data
      })
    },
    getRoleList() {
      findAllRoles().then(Response => {
        this.addUser.roleList = Response.data.data
      })
    },
    handleTreeNodeClick(data) {
      this.addUser.submitData.unitId = data.id
    },
    handleRolesSelectionChange(val) {
      this.addUser.submitData.roles = val
    },
    createDialogNextStep() {
      if (this.addUser.createDialogStepActive === 0 &&
       this.addUser.submitData.unitId === '') {
        Message.error('请选择单位。')
        return
      } else if (this.addUser.createDialogStepActive === 1) {
        var valid
        this.$refs['userInfoForm'].validate(function(v) {
          if (!v) {
            Message.error('请填写完整的用户信息。')
          }
          valid = v
        })
        console.log(valid)
        if (!valid) return
      } else if (this.addUser.createDialogStepActive === 2) {
        if (this.addUser.submitData.roles.length === 0) {
          Message.error('请选择用户角色，后续可修改。')
          return
        }
      }
      this.addUser.createDialogStepActive += 1
      var step = this.addUser.createDialogStepActive
      if (step === 1) { // 填写用户基本信息。
        this.addUser.unitTreeVisible = false
        this.addUser.createFormVisible = true
      } else if (step === 2) { // 分配角色。
        this.getRoleList()
        this.addUser.next = '提 交'
        this.addUser.createFormVisible = false
        this.addUser.createRolesTableVisible = true
      // todo 需要将表单数据放到submit中。
      } else if (step === 3) { // 代表提交数据
        // console.log('submit data:' + JSON.stringify(this.addUser.submitData).replace(/\"/g, "\\'"))
        addUser(this.addUser.submitData).then(Response => {
          const data = Response.data
          this.createDialogCancel()
          if (data.code === 0) {
            Message.success('添加用户成功！')
            this.getList()
          } else {
            Message.error(data.data)
          }
        })
      }
    },
    createDialogCancel() {
      this.addUser.dialogVisible = false
      this.addUser.createDialogStepActive = 0
      this.addUser.unitTreeVisible = true
      this.addUser.createFormVisible = false
      this.addUser.createRolesTableVisible = false
      this.recoverSubmitData()
    },
    recoverSubmitData() {
      this.addUser.submitData.unitId = ''
      this.addUser.submitData.loginName = ''
      this.addUser.submitData.nickname = ''
      this.addUser.submitData.password = ''
      this.addUser.submitData.email = ''
      this.addUser.submitData.mobile = ''
      this.addUser.submitData.isDisabled = false
      this.addUser.submitData.roles = []
    }
  }
}
</script>

