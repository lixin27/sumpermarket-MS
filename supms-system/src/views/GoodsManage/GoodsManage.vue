<template>
    <div class="goods-manage">
        
        <!-- 面板组件 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>商品管理</span>
            </div>
            <!-- 分类，搜索查询-->
            <div style="text-align: left;font-size:12px;">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="">
                        <el-select v-model="formInline.region" placeholder="-----选择分类-----">
                            <el-option label="香飘飘" value="shanghai"></el-option>
                            <el-option label="优乐美" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input v-model="formInline.user" placeholder="关键字"></el-input>
                    </el-form-item>
                 
                    
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 商品管理表格 -->
            <div>
                <el-table
                    :data="tableData2"
                    style="width: 100%;font-size:12px;"
                    :row-class-name="tableRowClassName">
                    <el-table-column
                    prop="barcode"
                    label="商品条形码"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="tradename"
                    label="商品名称"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="classification"
                    label="所属分类">
                    </el-table-column>
                    <el-table-column
                    prop="price"
                    label="售价(元)">
                    </el-table-column>
                    <el-table-column
                    prop="promotionalprice"
                    label="促销价(元)">
                    </el-table-column>
                    <el-table-column
                    prop="marketprice"
                    label="市场价(元)">
                    </el-table-column>
                    <el-table-column
                    prop="inventory"
                    label="库存">
                    </el-table-column>
                    <el-table-column
                    prop="totalinventory"
                    label="库存总额(元)">
                    </el-table-column>
                    <el-table-column
                    prop="totalsales"
                    label="销售总额(元)">
                    </el-table-column>
                    <el-table-column label="操作" width="174">
                        
                        <template slot-scope="scope">
                            <el-button
                            type="primary"
                            size="mini"
                            @click="handleEdit(scope.row.id)">
                               <i class="el-icon-edit"></i> 修改
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
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        user: "",
        region: ""
      },
      tableData2: [
        {
          barcode: "123456",
          tradename: "我的优乐美",
          classification: "优乐美",
          price: 2,
          promotionalprice: "未促销",
          marketprice: 2.4,
          inventory: "2",
          totalinventory: 0,
          totalsales: 100
        }
      ]
    };
  },
  methods: {
    tableRowClassName() {},
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>
<style lang="less">
.goods-manage {
  .el-card {
    .el-card__header {
      text-align: left;
      font-size: 20px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
    .el-card__body {
      .el-form {
        .el-form-item {
          .el-form-item__content {
            .el-select {
              .el-input__inner {
                font-size: 12px;
                width: 130px;
                height:30px;
                line-height:30px;
              }
            }
            .el-button {
              font-size: 12px;
              padding:5px 5px;
            }
          }
          .el-input{
              .el-input__inner{
                   font-size: 12px;
                   width:200px;
                    height:30px;
                line-height:30px;
              }
          }
        //   .el-form-item__label {
        //     font-size: 12px;
        //   }
        }
      }
    }
  }
}
</style>


