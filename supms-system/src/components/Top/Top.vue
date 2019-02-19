<template>
    <div class="top">
        <el-row>
            <el-col :span="12">
                <div  class="title">
                    <i class="el-icon-menu"></i>
                    华联超市管理系统
                </div>
            </el-col>
            <el-col :span="12">
                <div class="top-right">
                    <el-row>
                        <el-col :span="18">
                            欢迎您! 
                            <el-dropdown @command="handleCommand">
                                <!-- 当前登录用户名 -->
                                <span class="username el-dropdown-link">
                                    {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <!-- 下拉菜单选项 -->
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-col>
                        <el-col :span="6">
                            <div class="avatar">
                                <img width="100%" height="100%" :src="avatarUrl" alt="">
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            username: "",
            avatarUrl: 'http://127.0.0.1:8080/avatar.jpg'
        }
    },
    methods:{
        handleCommand(command){
            // console.log(command);//
            // 判断
            if(command==='logout'){
                // 点击的是退出按钮，清除token
                window.localStorage.removeItem('token')
                // 弹出提示信息
                this.$message({
                    type:'success',
                    message:'退出登录成功，请重新登录'
                });
                // 跳转到登录页面
                setTimeout(()=>{
                    this.$router.push('/login')
                },1000)
            }
        }
    },
    // 生命周期函数
    created(){
        // 显示当前登录的账户名
        this.username=window.localStorage.getItem('username')
    }
}
</script>
<style lang="less">
    .top {
        // background-color: red;
        border-bottom: 2px solid green;
        .title {
            text-align: left;
            font-size: 20px;
            font-weight: 900;
        }
        .top-right {
            color: #2d3a4b;
            text-align: right;
            .username {
               font-weight: 600;
            }
            .avatar {
                width: 52px;
                height: 52px;
                margin-top: 4px;
                margin-left: 30px;
                border-radius: 50%;
                img {
                    border-radius: 50%;
                }
            }
        }
    }
</style>


