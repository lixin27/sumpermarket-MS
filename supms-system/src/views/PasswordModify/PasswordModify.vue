<template>
    <div class="account-add">
        <!-- 面板组件 -->
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>密码修改</span>
            </div>
            <div class="text item">
                <!-- 添加账号表单 -->
                <el-form size="mini" :model="passwordModifyForm" status-icon :rules="rules" ref="passwordModifyForm" label-width="100px" class="demo-ruleForm">
                   
                    <!-- 旧密码 -->
                    <el-form-item label="旧密码" prop="oldPassword">
                        <el-input type="text" v-model="passwordModifyForm.oldPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 新密码 -->
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input type="text" v-model="passwordModifyForm.newPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 确认新密码 -->
                    <el-form-item label="确认新密码" prop="newPasswordCheck">
                        <el-input type="text" v-model="passwordModifyForm.newPasswordCheck" autocomplete="off"></el-input>
                    </el-form-item>
                    
                    <!-- 登录按钮&重置按钮 -->
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('passwordModifyForm')">修改</el-button>
                        <el-button @click="resetForm('passwordModifyForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
// 引入qs库
import qs from 'qs';

export default {
  data() {
    //自定义检查旧密码是否正确的验证
    const checkOldPwd=(rule, value, callback)=>{
        // 获取当前登录的账户
    const username=window.localStorage.getItem('username');
    // 发送axios请求，把用户输入的值发送给后端
    this.axios.get(`http://127.0.0.1:2500/account/checkOldPwd?oldPwd=${value}&username=${username}`)
        .then(response=>{
            // console.log(response.data)
            // 接收后端发来的提示信息和错误码
            let{error_code,reason}=response.data;
            // 根据错误码显示提示信息
            if(error_code===0){
                // 正确信息的回调
                 callback();
            }else{
                // 错误信息
                callback(new Error(reason));
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    // 自定义新密码的验证
    const pass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value.length < 3 || value.length > 6) {
        callback(new Error("长度在 3 - 6 位"));
      } else {
        if (this.passwordModifyForm.newPasswordCheck !== "") {
          this.$refs.passwordModifyForm.validateField("newPasswordCheck");
        }
        callback();
      }
    };
    // 自定义确认新密码的验证
    const checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.passwordModifyForm.newPassword) {
        callback(new Error("两次新密码不一致"));
      } else {
        callback();
      }
    };

    return {
      // 添加账号表单数据
      passwordModifyForm: {
        oldPassword: "",
        newPassword: "",
        newPasswordCheck: ""
      },
      // 验证规则
      rules: {
        // 旧密码
        oldPassword: [{ required: true, validator: checkOldPwd, trigger: "blur" }
          
        ],
        // 新密码
        newPassword: [{ required: true, validator: pass, trigger: "blur" }],
        // 确认新密码
        newPasswordCheck: [{ required: true, validator: checkPass, trigger: "blur" }],
       
       
      }
    };
  },
  methods: {
    // 点击修改按钮 触发这个函数
    submitForm(formName) {
      // 获取表单组件 调用验证方法
      this.$refs[formName].validate(valid => {
        // 如果所有验证通过 valid就是true
        if (valid) {
          // 收集用户输入的所有账号数据
          let params = {
            username: window.localStorage.getItem('username'),
            oldPassword: this.passwordModifyForm.oldPassword,
            newPassword: this.passwordModifyForm.newPassword
          };
          // 使用axios发送数据给后端
          this.axios.post('http://127.0.0.1:2500/account/savenewpwd',qs.stringify(params))
            .then(response=>{
              // console.log(response.data)
              // 接收后端返回的错误码和提示信息
              let { error_code, reason } = response.data;
              // 根据后端响应的数据进行判断
              if(error_code === 0){
                // 弹出成功的提示
                this.$message({
                  type:'success',
                  message:reason
                }); 
                // 清除token
                window.localStorage.removeItem('token')
                // 跳转到登录页面
                this.$router.push('/login')
              }else{
                // 弹出失败的提示
              this.$message.error(reason);
              }
            })
            .catch(err=>{
              console.log(err)
            })
        } else {
          // 否则就是false
          return false;
        
        }
      });
    },
    // 点击重置按钮 触发这个函数
    resetForm(formName) {
      // this.$refs.loginForm.resetFields() 获取整个表单组件 调用重置方法
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less">
.account-add {
  .el-card {
    .el-card__header {
      text-align: left;
      font-size: 20px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
    .el-card__body {
        text-align: left;
      .el-form {
        width: 290px;
        .el-form-item {
            margin-bottom: 24px;
        }
      }
    }
  }
}
</style>




