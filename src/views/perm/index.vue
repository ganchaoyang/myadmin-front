<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input style="width: 300px;" class="filter-item" :placeholder="$t('table.permName')" v-model="queryPermName"></el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchHandle">{{$t('table.search')}}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialog.dialogVisible = true">{{$t('table.add')}}</el-button>
      </div>
    <tree-table :data="list" :evalFunc="func" :expandAll="expandAll" border>
      <el-table-column :label="$t('table.permName')">
          <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
          </template>
      </el-table-column>
      <el-table-column :label="$t('table.permType')">
          <template slot-scope="scope">
              <span>{{scope.row.type}}</span>
          </template>
      </el-table-column>
      <el-table-column :label="$t('table.permCode')">
          <template slot-scope="scope">
              <span>{{scope.row.code}}</span>
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
    <el-dialog :visible.sync="dialog.dialogVisible" width="40%" :title="dialog.title">
      <el-steps :active="dialog.addStepActive" align-center v-show="dialog.addStep">
        <el-step title="步骤1" description="选择父级权限"></el-step>
        <el-step title="步骤2" description="填写权限信息"></el-step>
      </el-steps>
      <el-tree :data="data" :props="dialog.defaultTreeProps" accordion 
        @node-click="handleTreeNodeClick" style="margin: 15px 0 0 12%;" 
        v-show="dialog.addPermTreeVisible">
      </el-tree>
      <el-form label-width="90px" label-position="right" ref="permForm" :rules="rules.addRules" v-show="dialog.addFormVisible" :model="submitPerm"
        class="demo-ruleForm" style="width: 60%;margin: 15px auto 0;">
        <el-form-item label="父级权限:" prop="parentName">
          <el-input v-model="parentPermName" placeholder="未选择父级权限" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="权限类型:" prop="type">
          <el-select v-model="submitPerm.type" placeholder="请选择" style="width: 100%;" @change="permTypeChange">
            <el-option
              v-for="item in permTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input v-model="submitPerm.name" placeholder="请输入2-16位以内字符"></el-input>
        </el-form-item>
        <el-form-item label="标识:" prop="code">
          <el-input v-model="submitPerm.code" placeholder="请输入2-8位以内字符"></el-input>
        </el-form-item>
        <el-form-item label="URL:" prop="url" v-show="dialog.form.urlVisible">
          <el-input v-model="submitPerm.url" placeholder="请输入2-16位以内字符"></el-input>
        </el-form-item>
        <el-form-item label="图标:" prop="icon" v-show="dialog.form.iconVisible">
          <el-input v-model="submitPerm.icon" placeholder="请输入2-16位以内字符"></el-input>
        </el-form-item>
        <el-form-item label="禁  用" prop="disabled">
          <el-switch v-model="submitPerm.disabled"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="restoreDialog()">取 消</el-button>
        <el-button type="primary" @click="dialogNextStepHandle()">{{dialog.nextText}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import treeTable from '@/components/TreeTable'
import treeToArray from '@/utils/customEval'
import { findAll } from '@/api/perm'

export default {
  name: 'PermTreeTable',
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      expandAll: false,
      data: [],
      list: [],
      queryPermName: '',
      parentPermName: '',
      permTypes: [{
        value: 'menu',
        label: '菜单'
      }, {
        value: 'data',
        label: '数据'
      }],
      dialog: {
        type: 'add',
        title: '添加权限',
        dialogVisible: false,
        addStepActive: 0,
        addStep: true,
        addPermTreeVisible: true,
        addFormVisible: false,
        nextText: '下一步',
        defaultTreeProps: {
          label: 'name',
          children: 'children'
        },
        form: {
          iconVisible: true,
          urlVisible: true
        }
      },
      submitPerm: {
        id: null,
        parentId: null,
        type: 'menu',
        name: null,
        code: null,
        url: null,
        icon: null,
        disabled: false
      },
      rules: {
        addRules: {
          name: [
            { type: 'string', required: true, message: '请输入权限名称', triiger: 'blur' },
            { min: 2, max: 16, message: '长度在6-16个字符', triiger: 'blur' }
          ]
        }
      }
    }
  },
  created() {
    this.permsTree()
  },
  methods: {
    permsTree() {
      findAll(true).then(Response => {
        this.data = Response.data.data
        this.list = Response.data.data
      })
    },
    searchHandle() {
      var temp = []
      this.data.forEach(element => {
        if (element.name.match(this.queryPermName)) {
          temp.push(element)
        }
      })
      this.list = temp
    },
    handleTreeNodeClick(data) {
      this.submitPerm.parentId = data.id
      this.parentPermName = data.name
    },
    permTypeChange(data) {
      if (data === 'data') {
        this.submitPerm.url = null
        this.submitPerm.icon = null
        this.dialog.form.urlVisible = false
        this.dialog.form.iconVisible = false
      } else {
        this.dialog.form.urlVisible = true
        this.dialog.form.iconVisible = true
      }
    },
    restoreSubmitData() {
      this.submitPerm.id = null
      this.submitPerm.parentId = null
      this.submitPerm.type = 'menu'
      this.submitPerm.name = null
      this.submitPerm.code = null
      this.submitPerm.url = null
      this.submitPerm.icon = null
      this.submitPerm.disabled = false
    },
    restoreDialog() {
      this.dialog.type = 'add'
      this.dialog.title = '添加权限'
      this.dialog.dialogVisible = false
      this.dialog.addStepActive = 0
      this.dialog.addStep = true
      this.dialog.addPermTreeVisible = true
      this.dialog.addFormVisible = false
      this.dialog.nextText = '下一步'
      this.dialog.form.iconVisible = true
      this.dialog.form.urlVisible = true
      this.restoreSubmitData()
    },
    dialogNextStepHandle() {
      if (this.dialog.type === 'add') {
        this.dialog.addStepActive += 1
        if (this.dialog.addStepActive === 1) {
          this.dialog.addFormVisible = true
          this.dialog.addPermTreeVisible = false
          this.dialog.nextText = '提 交'
        }
      }
    }
  }
}
</script>
