<template>
  <div>
    <div style="display:flex;align-items:center;">
      <span>上传课件：</span>
      <Upload action="//jsonplaceholder.typicode.com/posts/">
        <Button icon="ios-cloud-upload-outline">选取本地文件</Button>
      </Upload>
    </div>
    <Table :height="tableHeight" border :columns="Columns" :data="tableData" ref="table"></Table>
    <div class="footer">
      <Button type="primary">保存
        <!-- <Icon type='ios-close' size="32" /> -->
      </Button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableHeight: 600,
      value: "",
      data: [],
      CascaderData: [
        {
          value: "beijing",
          label: "北京",
          children: [
            {
              value: "gugong",
              label: "故宫"
            },
            {
              value: "tiantan",
              label: "天坛"
            },
            {
              value: "wangfujing",
              label: "王府井"
            }
          ]
        },
        {
          value: "jiangsu",
          label: "江苏",
          children: [
            {
              value: "nanjing",
              label: "南京",
              children: [
                {
                  value: "fuzimiao",
                  label: "夫子庙"
                }
              ]
            },
            {
              value: "suzhou",
              label: "苏州",
              children: [
                {
                  value: "zhuozhengyuan",
                  label: "拙政园"
                },
                {
                  value: "shizilin",
                  label: "狮子林"
                }
              ]
            }
          ]
        }
      ],
      Columns: [
        {
          title: "课件名",
          key: "title",
          width: 200,
          render: (h, params) => {
            var vm = this;
            return h("Input", {
              props: {
                value: params.row.title
                //   content: params.row.title
              },
              on: {
                "on-change"(event) {
                  //值改变时
                  //将渲染后的值重新赋值给单元格值
                  params.row.title = event.target.value;
                  vm.data[params.index] = params.row;
                  console.log(123, vm.tableData, vm.data);
                }
              },
              style: {
                border: "none"
              }
            });
          }
        },
        {
          title: "关联知识点",
          key: "knowledgeTitle",
          ellipsis: true,
          minWidth: 150,
          render: (h, params) => {
            return h("Cascader", {
              props: {
                filterable: true,
                changeOnSelect: true,
                clearable: true,
                transfer: true,
                // trigger: "hover",
                data: this.CascaderData
                // renderFormat: this.Format
              },
              on: {
                "on-change": (value, selectedData) => {
                  this.handleChange(value, selectedData);
                }
              }
            });
          }
          /*  render: (h, params) => {
            var vm = this;
            return h(
              "Select",
              {
                props: {
                  value: vm.data[params.index].value
                },
                on: {
                  "on-change": event => {
                    vm.data[params.index].value = event;
                  }
                }
              },
              vm.options.map(function(option) {
                return h(
                  "Option",
                  {
                    props: { value: option }
                  },
                  option
                );
              })
            ); 
          } */
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
          title: "文件名",
          key: "fileName",
          ellipsis: true,
          minWidth: 200,
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                props: {
                  content: params.row.fileName
                },
                style: {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "180px"
                }
              },
              params.row.fileName
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
                "预览"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.Delete();
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableData: [],
      selectedList: []
    };
  },
  mounted() {
    this.getParams();
  },
  methods: {
    getParams() {
      // 取到路由带过来的参数
      let routerParams = this.$route.params.course_id;
      console.log(123, routerParams);
      // 将数据放在当前组件的数据内
      this.getCourseInfo(routerParams);
    },
    getCourseInfo(id) {
      var args = {
        apiVersion: "string",
        channel: "string",
        postData: {
          id: id
        }
      };
      tuhu.axios.post(this.$API.getCourseResourceById, args).then(res => {
        if (res.code - 10000 == 0) {
          this.tableData.push(res.data);
        }
      });
    },
    handleChange(value, selectedData) {
      // alert(123);
      this.selectedList.push(selectedData);
      console.log(123, selectedData);
      var getElement = document.getElementsByClassName("ivu-cascader-label")[0];
      getElement.innerHTML =
        "<span class='cascader-tag' ><span style='color:red'>gaga</span><img src='https://img3.tuhu.org/PeccancyCheXingYi/82b3/9d2f/8bbd507aaa0eac8a090d2296_w10_h10.png@100Q.png'/  onclick='alert(123)'></span>";
      // console.log(124, value, selectedData, this.selectedList);
    },
    Format(labels, selectedData) {
      console.log(566, labels, selectedData);
      // console.log(666, this.selectedList);
      var createElementEg = document.createElement("span");
      createElementEg.innerText = "haha";
      return createElementEg;
    }
  },
  watch: {
    // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
    $route: "getParams"
  }
};
</script>
<style lang="less">
.cascader-tag {
  padding: 0px 8px;
  border-radius: 3px;
  height: 25px;
  line-height: 25px;
  margin-right: 5px;
  display: inline-block;
  background: #f0f0f0;
  span {
    margin-right: 5px;
  }
  img {
    vertical-align: middle;
  }
}
</style>

<style lang="less" scoped>
.footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: rgba(243, 249, 254, 1);
}
</style>

