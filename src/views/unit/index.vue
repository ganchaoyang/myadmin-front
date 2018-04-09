<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input style="width: 300px;" class="filter-item" :placeholder="$t('table.unitName')" v-model="queryUnitName"></el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">{{$t('table.search')}}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addUnit.dialogVisible = true">{{$t('table.add')}}</el-button>
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
    <el-dialog :visible.sync="addUnit.dialogVisible" width="40%" title="新增单位">
      <el-steps :active="addUnit.createDialogStepActive" align-center>
        <el-step title="步骤1" description="选择父级单位"></el-step>
        <el-step title="步骤2" description="填写单位信息"></el-step>
      </el-steps>
      <el-tree :data="list" :props="addUnit.defaultTreeProps" accordion 
        @node-click="handleTreeNodeClick" style="margin: 15px 0 0 12%;" 
        v-show="addUnit.unitTreeVisible">
      </el-tree>
      <el-form label-width="90px" label-position="right" ref="unitForm" :rules="rules.addRules" v-show="addUnit.createFormVisible" :model="submitUnit"
        class="demo-ruleForm" style="width: 60%;margin: 15px auto 0;">
        <el-form-item label="父级单位:" prop="parentName">
          <el-input v-model="parentUnitName" placeholder="未选择父级单位" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单位名称:" prop="name">
          <el-input v-model="submitUnit.name" placeholder="请输入2-16位以内字符"></el-input>
        </el-form-item>
        <el-form-item label="单位邮箱:" prop="email">
          <el-input v-model="submitUnit.email" placeholder="请输入单位邮箱"></el-input>
        </el-form-item>
        <el-form-item label="单位网址:" prop="website">
          <el-input v-model="submitUnit.website" placeholder="请输入单位网址"></el-input>
        </el-form-item>
        <el-form-item label="单位电话:" prop="phone">
          <el-input v-model="submitUnit.telePhone" placeholder="请输入单位电话"></el-input>
        </el-form-item>
        <el-form-item label="单位地址:" prop="address">
          <el-input v-model="submitUnit.address" placeholder="请输入单位地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="handleNextStep">{{addUnit.nextText}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import treeTable from '@/components/TreeTable'
import treeToArray from '@/utils/customEval'
import { findAll, addUnit } from '@/api/unit'
import { Message } from 'element-ui'

export default {
  name: 'UnitTreeTable',
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      expandAll: false,
      data: [],
      list: [],
      queryUnitName: '',
      parentUnitName: '',
      addUnit: {
        defaultTreeProps: {
          label: 'name',
          children: 'children'
        },
        unitTreeVisible: true,
        dialogVisible: false,
        createDialogStepActive: 0,
        createFormVisible: false,
        nextText: '下一步'
      },
      submitUnit: {
        parentId: '',
        name: '',
        address: '',
        email: '',
        website: '',
        telePhone: ''
      },
      rules: {
        addRules: {
          name: [
            { type: 'string', required: true, message: '请输入单位名称', triiger: 'blur' },
            { min: 2, max: 16, message: '长度在6-16个字符', triiger: 'blur' }
          ],
          email: [
            { type: 'email', required: false, message: '请输入邮箱', triiger: 'blur' },
            { max: 32, message: '长度在32个字符以内', triiger: 'blur' }
          ]
        }
      }
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
    },
    handleTreeNodeClick(data) {
      this.submitUnit.parentId = data.id
      this.parentUnitName = data.name
    },
    cancelDialog() {
      this.addUnit.createDialogStepActive = 0
      this.initSubmitUnit()
      this.addUnit.dialogVisible = false
      this.addUnit.unitTreeVisible = true
      this.addUnit.createFormVisible = false
      this.addUnit.nextText = '下一步'
    },
    initSubmitUnit() {
      this.submitUnit.parentId = ''
      this.submitUnit.name = ''
      this.submitUnit.address = ''
      this.submitUnit.email = ''
      this.submitUnit.website = ''
      this.submitUnit.telePhone = ''
    },
    handleNextStep() {
      var step = this.addUnit.createDialogStepActive
      step += 1
      this.addUnit.createDialogStepActive = step
      console.log(step)
      if (step === 1) {
        this.addUnit.unitTreeVisible = false
        this.addUnit.createFormVisible = true
        this.addUnit.nextText = '提 交'
      }
      if (step === 2) {
        addUnit(this.submitUnit).then(Response => {
          this.cancelDialog()
          const data = Response.data
          if (data.code === 0) {
            Message.success(data.data)
            this.unitsTree()
          } else {
            Message.error(data.data)
          }
        })
      }
    }
  }
}
</script>

