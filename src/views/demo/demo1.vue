<template>
  <div class="container">
    <div class="header">
      <Button type="primary">添加课件</Button>
      <div class="rightSerach">
        <Input placeholder="课件名称" style="width: auto" v-model="title" search @on-search="IconClick" clearable>
        <!-- <Icon type="ios-search" slot="suffix" /> -->
        </Input>
        <Select v-model="type" style="width:200px" @on-change="ChangeSelect">
          <Option v-for="item in typeList" :value="item.code" :key="item.value">{{ item.displayName }}</Option>
        </Select>
      </div>
    </div>
    <div>
      <Table :height="tableHeight" border :columns="Columns" :data="tableData" ref="table"></Table>
      <Page :total="totalPage" :page-size="pageSize" :current="page" :page-size-opts="opts" show-total show-elevator show-sizer @on-change="changePage" @on-page-size-change="changePageSize" style="margin-top:20px;"></Page>
    </div>
    <ConfirmModal :modal="DeleteModal" @ok="DeleteOk" @cancel="DeleteCancel">
      <div slot="content" style="font-size:14px;">
        <div style="display:flex;align-items:center;">
          <Icon type="information-circled" size="30" color="#FAAD14" style="vertical-align:middle;margin-right:15px;"></Icon>
          <p style="font-weight:bold;">删除课件</p>
        </div>
        <span style="margin-left:40px;margin-top:5px;display: inline-block;">您确定删除此课件吗？</span>
      </div>
    </ConfirmModal>
  </div>
</template>
<script>
import ConfirmModal from "./components/confirmModal";
export default {
  components: {
    ConfirmModal
  },
  data() {
    return {
      totalPage: 0,
      pageSize: 10,
      page: 1,
      opts: [10, 20, 30, 40],
      title: null,
      type: null,
      typeList: [],
      tableHeight: 500,
      Columns: [
        {
          title: "课件名",
          key: "title",
          ellipsis: true,
          width: 200,
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                props: {
                  content: params.row.title
                },
                style: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "180px"
                }
              },
              params.row.title
            );
          }
        },
        {
          title: "格式",
          key: "type",
          width: 100,
          render: (h, params) => {
            return h(
              "span",
              params.row.type == 0
                ? "视频"
                : params.row.type == 1 ? "音频" : "PDF"
            );
          }
        },
        {
          title: "知识点",
          key: "knowledgeTitle",
          ellipsis: true,
          minWidth: 150,
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                props: {
                  content: params.row.knowledgeTitle
                },
                style: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minWidth: "130px"
                }
              },
              params.row.knowledgeTitle
            );
          }
        },
        {
          title: "大小",
          key: "size",
          width: 100
        },
        {
          title: "使用次数",
          key: "usageCount",
          width: 100
        },
        {
          title: "最后更新",
          key: "updatedTime",
          ellipsis: true,
          minWidth: 150,
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                props: {
                  content: params.row.updatedTime
                },
                style: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minWidth: "130px"
                }
              },
              params.row.updatedTime
            );
          }
        },
        {
          title: "操作",
          key: "operation",
          fixed: "right",
          width: 150,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.toEdit(params.row.id);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.Delete(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableData: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        }
      ],
      classify: "",
      classifyList: [],
      StatusList: [],
      DeleteModal: false,
      rowParams: {} //点击删除传过去的那行信息
    };
  },
  mounted() {
    this.getTableData();
    this.getType();
    this.tableHeight =
      window.innerHeight - this.$refs.table.$el.offsetTop - 140;
  },
  methods: {
    getType() {
      tuhu.axios
        .get(`${this.$API.getDictionaryListByType}?type=COURSE_RESOURCE_TYPE`)
        .then(res => {
          if (res.code == 10000) {
            res.data.unshift({ displayName: "全部", code: -1 });
            this.typeList = res.data;
          } else {
            this.errorType(res.message);
          }
        });
    },
    getTableData() {
      var args = {
        apiVersion: "string",
        channel: "string",
        postData: {
          pageNo: this.page,
          pageSize: this.pageSize,
          sortBy: "string",
          title: this.title,
          type: this.type == -1 ? null : this.type
        }
      };
      tuhu.axios.post(this.$API.getCourseResourceList, args).then(res => {
        if (res.code == 10000) {
          this.totalPage = 0;
          this.tableData = res.data.courseResourceList;
          this.totalPage = res.data.totalCount;
        } else {
          this.errorType(res.message);
        }
      });
    },
    //改变option
    ChangeSelect(val) {
      console.log(123, val);
      this.getTableData();
    },
    //点击icon和回车
    IconClick() {
      this.getTableData();
    },
    // 改变页数搜索
    changePage(page) {
      console.log(page);
      this.page = page;
      this.getTableData(this.page, this.pageSize);
    },
    // 改变条目搜索
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableData(this.page, this.pageSize);
      console.log(pageSize);
    },
    toEdit(rowId) {
      this.$router.push({
        name: "addcourse_index",
        params: {
          course_id: rowId
        }
      });
    },
    Delete(rowParams) {
      this.DeleteModal = true;
      this.rowParams = rowParams;
    },
    DeleteOk() {
      var args = {
        apiVersion: "string",
        channel: "string",
        postData: {
          id: this.rowParams.id,
          updatedUser: this.rowParams.updatedUser
        }
      };
      tuhu.axios
        .post(this.$API.deleteCourseResourceById, args)
        .then(res => {
          if (res.code - 10000 == 0) {
            if (res.data) {
              this.DeleteModal = false;
              this.$Message.success(res.message);
            }
          } else {
            this.errorType(res.message);
          }
        })
        .catch(error => {
          this.errorType(error);
        });
    },
    DeleteCancel() {
      this.DeleteModal = false;
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  background: #fff;
  padding: 10px 10px;
  .header {
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    .rightSerach {
      margin-left: 300px;
    }
    margin-bottom: 20px;
  }
}
</style>

