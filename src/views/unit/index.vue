<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
        <el-input style="width: 300px;" class="filter-item" :placeholder="$t('table.unitName')" v-model="queryUnitName"></el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">{{$t('table.search')}}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialog.dialogVisible = true">{{$t('table.add')}}</el-button>
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
              <el-button size="mini" type="success" @click="addChildUnitHandle(scope.row)">{{$t('table.addChildUnit')}}</el-button>
              <el-button size="mini" type="success" @click="editUnitDilogHandle(scope.row)">{{$t('table.edit')}}</el-button>
              <el-button size="mini" type="danger" @click="deleteUnitHandle(scope.row.id)">{{$t('table.delete')}}</el-button>
          </template>
      </el-table-column>
    </tree-table>
    <el-dialog :visible.sync="dialog.dialogVisible" width="40%" :title="dialog.title">
      <el-steps :active="dialog.addStepActive" align-center v-show="dialog.addStep">
        <el-step title="步骤1" description="选择父级单位"></el-step>
        <el-step title="步骤2" description="填写单位信息"></el-step>
      </el-steps>
      <el-tree :data="list" :props="dialog.defaultTreeProps" accordion 
        @node-click="handleTreeNodeClick" style="margin: 15px 0 0 12%;" 
        v-show="dialog.addUnitTreeVisible">
      </el-tree>
      <el-form label-width="90px" label-position="right" ref="unitForm" :rules="rules.addRules" v-show="dialog.addFormVisible" :model="submitUnit"
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
        <el-button type="primary" @click="handleNextStep">{{dialog.nextText}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import treeTable from '@/components/TreeTable'
import treeToArray from '@/utils/customEval'
import { findAll, addUnit, editUnit, deleteUnit } from '@/api/unit'
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
      dialog: {
        type: 'add',
        title: '新增单位',
        addStep: true,
        addFormVisible: false,
        addUnitTreeVisible: true,
        dialogVisible: false,
        addStepActive: 0,
        nextText: '下一步',
        defaultTreeProps: {
          label: 'name',
          children: 'children'
        }
      },
      submitUnit: {
        id: null,
        parentId: null,
        name: null,
        address: null,
        email: null,
        website: null,
        telePhone: null,
        hasChildren: false
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
      this.dialog.dialogVisible = false
      this.dialog.addStepActive = 0
      this.dialog.addUnitTreeVisible = true
      this.dialog.addFormVisible = false
      this.dialog.nextText = '下一步'
      this.dialog.title = '新增单位'
      this.dialog.addStep = true
      this.dialog.type = 'add'
      this.initSubmitUnit()
    },
    initSubmitUnit() {
      this.submitUnit.id = null
      this.submitUnit.parentId = null
      this.submitUnit.name = null
      this.submitUnit.address = null
      this.submitUnit.email = null
      this.submitUnit.website = null
      this.submitUnit.telePhone = null
      this.submitUnit.hasChildren = false
    },
    handleNextStep() { // 对话框点击下一步或者确定按钮。
      if (this.dialog.type === 'edit') {
        editUnit(this.submitUnit).then(Response => {
          this.cancelDialog()
          const res = Response.data
          if (res.code === 10000) {
            Message.success(res.data)
            this.unitsTree()
          } else {
            Message.error(res.message)
          }
        })
      } else {
        this.dialog.addStepActive += 1
        if (this.dialog.addStepActive === 1) {
          this.dialog.addUnitTreeVisible = false
          this.dialog.addFormVisible = true
          this.dialog.nextText = '提 交'
        }
        if (this.dialog.addStepActive === 2 ||
         this.dialog.type === 'addChild') {
          addUnit(this.submitUnit).then(Response => {
            this.cancelDialog()
            const data = Response.data
            if (data.code === 10000) {
              Message.success(data.data)
              this.unitsTree()
            } else {
              Message.error(data.data)
            }
          })
        }
      }
    },
    editUnitDilogHandle(data) {
      this.dialog.title = '编辑单位'
      this.dialog.nextText = '提  交'
      this.dialog.dialogVisible = true
      this.dialog.addStep = false
      this.dialog.addUnitTreeVisible = false
      this.dialog.addFormVisible = true
      this.submitUnit.parentId = data.parentId
      this.submitUnit.name = data.name
      this.submitUnit.address = data.address
      this.submitUnit.website = data.website
      this.submitUnit.email = data.email
      this.submitUnit.telePhone = data.telePhone
      this.submitUnit.id = data.id
      this.dialog.type = 'edit'
      if (!(data.parentId === null)) {
        this.parentUnitName = data.parent.name
      }
      this.submitUnit.hasChildren = data.hasChildren
      console.log(this.submitUnit)
    },
    addChildUnitHandle(data) {
      this.dialog.nextText = '提 交'
      this.dialog.dialogVisible = true
      this.dialog.addStep = false
      this.dialog.addUnitTreeVisible = false
      this.dialog.addFormVisible = true
      this.dialog.type = 'addChild'
      this.submitUnit.parentId = data.id
      this.parentUnitName = data.name
    },
    deleteUnitHandle(id) {
      deleteUnit(id).then(Response => {
        const data = Response.data
        if (data.code === 10000) {
          Message.success(data.data)
          this.unitsTree()
        } else {
          Message.error(data.message)
        }
      })
    }
  }
}
</script>

