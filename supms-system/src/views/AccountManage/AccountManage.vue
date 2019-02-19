<template>
    <div class="account-manage">
         <!-- 面板组件 -->
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>账号管理</span>
            </div>
            <div class="text item">
                <!-- 账号管理表格 -->
                <el-table
                    ref="multipleTable"
                    :data="accountTableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                >
                    <!-- 单选框 -->
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    
                    <!-- 账号 -->
                    <el-table-column
                    prop="username"
                    label="账号"
                    >
                    </el-table-column>

                    <!-- 用户组 -->
                    <el-table-column
                    prop="usergroup"
                    label="用户组"
                    >
                    </el-table-column>

                    <!-- 日期 -->
                    <el-table-column
                    label="创建日期"
                    >
                    <template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
                    </el-table-column>

                    <!-- 操作 -->
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            type="primary"
                            size="mini"
                            @click="handleEdit(scope.row.id)">
                               <i class="el-icon-edit"></i> 编辑
                            </el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row.id)">
                               <i class="el-icon-delete"></i>  删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[3, 5, 10, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                  </el-pagination>
                </div>

                <!-- 批量删除 -->
                <div style="margin-top:20px;text-align: left;">
                  <el-button @click="batchDelete()">批量删除</el-button>
                  <el-button @click="cancelSelect()">取消选择</el-button>
                </div>
                  <!-- 修改的弹出模态框 -->
                <el-dialog title="账号修改" width="400px" :visible.sync="flag">
                <!-- 回填表单 -->
                  <el-form :model="editForm" :rules="rules" label-width="60px">
                      <!-- 账号 -->
                    <el-form-item label="账号" prop="username">
                        <el-input style="width: 217px;" type="text" v-model="editForm.username" autocomplete="off"></el-input>
                    </el-form-item>

                     <!-- 选中用户组 -->
                    <el-form-item label="用户组" prop="usergroup">
                        <el-select v-model="editForm.usergroup" placeholder="请选择用户组">
                          <el-option label="普通用户" value="普通用户"></el-option>
                          <el-option label="高级管理员" value="高级管理员"></el-option>
                        </el-select>
                    </el-form-item>
                  </el-form>
                    <!-- 表单的尾部 -->
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="flag = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                  </div>

                </el-dialog>
                
            </div>
        </el-card>
    </div>
</template>
<script>
// 引入moment模块
import moment from "moment";
// 引入qs
import qs from "qs";

export default {
  data() {
    return {
      accountTableData: [],//用户账号表格数据
      flag: false, //控制模态框的显示隐藏
      editForm: {
        // 修改表单数据
        username: "",
        usergroup: ""
      },
      // 验证规则
      rules:{
         username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 - 6 位", trigger: "blur" }
        ],
        // 用户组
        userGroup: [
            { required: true, message: '请选择用户组', trigger: 'change' }
        ]
      },
      editId: "" ,// 要修改的数据的id
      multipleSelection: [],//被选中的账号数据
      currentPage:1,
      total:0,
      pageSize:3,

      

    };
  },
  // 生命周期的钩子函数created，自动触发的
  created() {
    console.log("钩子函数自动触发");
    this.getAccountListByPage();
  },

  methods: {
    // // 请求所有账号数据的函数
    // getAccountList() {
    //   // 发送axios请求，获取所有用户账户数据
    //   this.axios
    //     .get("http://127.0.0.1:2500/account/accountlist")
    //     .then(response => {
    //       // 把后端返回的账号数据，赋值给用户账号表格数据accountTableData
    //       this.accountTableData = response.data;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // 按照分页显示数据的函数
    getAccountListByPage(){
      // 收集当前页码和每页显示条数的数据
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      // 发送axios请求，把收集的页码和每页条数发送给后端
      this.axios.get('http://127.0.0.1:2500/account/accountlistbypage',{
        params:{
          pageSize,
          currentPage
        }
      })
      .then(response=>{
        // console.log('对应页码的数据：',response.data)
        // 接收后端发来的总条数和对应页码的数据
        let {total,data}=response.data;
        // 赋值到对应变量
        this.total=total;
        this.accountTableData=data;
        // 判断， 
        if ( !data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getAccountListByPage();
          }

      })
      .catch(err=>{
        console.log(err)
      })
    },
    // 每页条数改变时就会触发
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      // 保存每页显示的条数
      this.pageSize=val;
      // 调用分页函数
       this.getAccountListByPage();

    },
    // 当前页码改变时就会触发
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage=val;
       // 调用分页函数
       this.getAccountListByPage();
    },
    //当单选框为选中状态，获取选中的数据（val就是），获取的数据是一个数组，里面是数据对象
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val)
    },
    // 批量删除
    batchDelete() {
      // 收集选中要删除的数据的id
      // console.log(selectedId)
      let selectedId = this.multipleSelection.map(v => v.id); //是一个数组
      console.log(selectedId.length);
      // 判断是否有选中状态的数据
      if (!selectedId.length) {
        this.$message.warning("请选中要删除的账号！");
        return;
      }
      // 确认框
      this.$confirm("你确定要删除该账号吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 发送axios请求，把获得的id数组传给后端
          this.axios
            .get("http://127.0.0.1:2500/account/batchdelete", {
              params: {
                selectedId
              }
            })
            .then(response => {
              // 接收错误码和提示信息
              let { error_code, reason } = response.data;
              // 判断
              if (error_code === 0) {
                // 删除成功提示
                this.$message({
                  type: "success",
                  message: reason
                });
                // 刷新列表
                this.getAccountListByPage();
              } else {
                // 删除失败提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 取消选择
    cancelSelect() {
      this.$refs.multipleTable.clearSelection();
    },
    // 删除
    handleDelete(id) {
      this.$confirm("你确定要删除该账号吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // alert(id)
          //发送ajax。把id传给后端
          this.axios
            .get(`http://127.0.0.1:2500/account/accountdel?id=${id}`)
            .then(response => {
              // console.log('删除结果',response.data)
              // 接收后端返回的错误码
              let { error_code, reason } = response.data;
              if (error_code === 0) {
                // 删除成功的提示
                this.$message({
                  type: "success",
                  message: reason
                });
                // 刷新列表（再次调用请求所有账号的函数）
                this.getAccountListByPage();
              } else {
                // 删除失败的提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改
    handleEdit(id) {
      // 把要修改的这条数据的id保存
      this.editId = id;
      // 显示模态框
      this.flag = true;
      
      // 发送请求，把获取的id发送给后端
      this.axios
        .get(`http://127.0.0.1:2500/account/accountedit?id=${id}`)
        .then(response => {
          // 接收后端返回的数据（是一个数组）
          let result = response.data[0];
          // 回填表单
          this.editForm.username = result.username;
          this.editForm.usergroup = result.usergroup;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 保存修改
    saveEdit() {
      // 收集修改的新数据，以及原来的id
      let params = {
        username: this.editForm.username,
        usergroup: this.editForm.usergroup,
        editId: this.editId
      };
      // 发送axios请求，发送新的数据给后端
      this.axios
        .post(
          "http://127.0.0.1:2500/account/accounteditsave",
          qs.stringify(params)
        )
        .then(response => {
          // 接收修改结果的提示信息
          let { error_code, reason } = response.data;
          if (error_code === 0) {
            // 提示成功
            this.$message({
              type: "success",
              message: reason
            });
            // 修改成功后刷新页面
            this.getAccountListByPage();
          } else {
            // 提示失败
            this.$message.error(reason);
          }
          // 关闭模态框
          this.flag = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  // 过滤器
  filters: {
    filterCtime(ctime) {
      return moment(ctime).format("YYYY/MM/DD HH:mm:ss");
    }
  }
};
</script>
<style lang="less">
.account-manage {
  .el-card {
    .el-card__header {
      text-align: left;
      font-size: 20px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
  }
}
</style>


