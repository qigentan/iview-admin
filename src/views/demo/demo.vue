<template>
  <div class="container">
    <div class="tree">
      <p style="height:30px;">维护知识点视图模块</p>
      <div style="width:400px;height:600px;overflow-y:auto;overflow-x: hidden;">
        <Tree :data="catalogdata" :render="renderContent"></Tree>
      </div>

    </div>
    <div class="module">
      <p>维护子模块</p>
      <!-- <p class="titleTree"></p> -->
      <Breadcrumb separator=">" class="bread">
        <BreadcrumbItem v-for="item in breadArr">{{item}}</BreadcrumbItem>
      </Breadcrumb>
      <ul>
        <li v-for="(item,key) in childList" :key="key">
          <Input v-model="item.title" placeholder="模块名称" class="inputItem" disabled />
          <Icon type="ios-add" class="icon" />
        </li>
      </ul>
      <ul>
        <li class="templateItem" v-for="(item,idx) in templateList" :key="idx">
          <Input placeholder="模块名称" class="inputItem" v-model="item.val" />
          <Icon type="ios-trash-outline" size="16" class="icon" @click="addItem(item.val)" />
          <Icon type="ios-trash-outline" size="16" class="icon" @click="removeItem(idx)" />
        </li>
      </ul>
      <Button type="primary" class="saveBtn" @click="saveNewMoudle">保存</Button>
    </div>
    <!-- <Modal v-model="modal" :mask-closable="false" title="编辑">
      <Form :label-width="80">
        <FormItem label="上级模块">
          <Select v-model="parentNode" style="width:300px">
            <Option v-for="item in parentList" :value="item" :key="item.value">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="模块名称">
          <Input v-model="nodeName" placeholder="模块名称" style="width:300px" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click.native="cancel">取消</Button>
        <Button type="primary" @click.native="ok">保存</Button>
      </div>
    </Modal> -->
    <ConfirmModal :modal="EditModal" :title="EditTitle" @ok="EditOk" @cancel="EditCancel">
      <div slot="content">
        <Form :label-width="80">
          <FormItem label="上级知识点" v-if="parentNode&&parentNode.title">
            <!--  <Select v-model="parentNode" style="width:300px">
              <Option v-for="item in parentList" :value="item" :key="item.value">{{ item }}</Option>
            </Select> -->
            <Input v-model="parentNode.title" style="width:250px" disabled/>
          </FormItem>
          <FormItem label="知识点名称">
            <Input v-model="nodeName" placeholder="知识点名称" style="width:250px" />
          </FormItem>
        </Form>
      </div>
    </ConfirmModal>
    <!-- <ConfirmModal :modal="DeleteModal" :title="DeleteTitle" @ok="DeleteOk" @cancel="DeleteCancel">
      <div slot="content">
        <Icon type="information-circled" size="36" color="#ED5565" style="vertical-align:middle;margin-right:15px;"></Icon>
        <span>确定删除此模块吗</span>
      </div>
    </ConfirmModal> -->
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
import Vue from "vue";
export default {
  components: {
    ConfirmModal
  },
  data() {
    return {
      // modal: false,
      EditModal: false,
      DeleteModal: false,
      value: "",
      breadArr: [],
      catalogdata: [
        {
          title: "产品",
          expand: true,
          children: [
            {
              title: "后台网站",
              expand: true,
              children: [
                {
                  title: "教研管理",
                  expand: true,
                  children: [
                    {
                      title: "课程管理"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      templateList: [
        { val: "" },
        { val: "" },
        { val: "" },
        { val: "" },
        { val: "" }
      ],
      parentList: "",
      childList: "",
      parentNode: "",
      nodeName: "",
      EditTitle: "编辑",
      DeleteTitle: "删除",
      root: "",
      node: "",
      data: "",
      levelNum: 0,
      findItem: true,
      appendRoot: "", //增加时标记当前节点
      appendNode: "",
      appendData: "",
      type: 0, //0增加，1编辑 2删除
      currentItem: null
    };
  },
  mounted() {
    this.getKnowledgeList();
  },
  methods: {
    renderContent(h, { root, node, data }) {
      // if (data.level < 5) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h(
            "span",
            {
              props: {
                // type: "ios-paper-outline"
              },
              style: {
                marginRight: "8px",
                color: "#333"
              }
            },
            data.title
          ),
          h(
            "span",
            {
              style: {
                marginRight: "8px",
                color: "#8f949a",
                cursor: "pointer"
              },
              on: {
                click: () => {
                  this.Edit(root, node, data);
                }
              }
            },
            "编辑"
          ),
          h(
            "span",
            {
              style: {
                marginRight: "8px",
                color: "#8f949a",
                cursor: "pointer"
              },
              on: {
                click: () => {
                  this.remove(root, node, data);
                }
              }
            },
            "删除"
          ),
          h(
            "span",
            {
              style: {
                marginRight: "8px",
                color: "#8f949a",
                cursor: "pointer"
              },
              on: {
                click: () => {
                  this.append(root, node, data);
                }
              }
            },
            "子模块"
          )
        ]
      );
      // }
    },
    //type判断编辑确认，子模块增加（点击子模块和保存时--刷新子列表和父级标题）和删除
    //编辑确认和子模块点击，获取列表（当前节点id）和标题父级(父级节点id))
    //删除---1.如果删除的是当前节点，获取子列表（传父级id）和标题级(父级id)
    //       2如果删除的是父级或父级以上，子列表和标题级数组都手动清空---判断是父级以上（根据删除的id递归循环是否能找到子节点）
    //       3删除的是子集，标题级不变，传父级id获取子列表

    //获取所有列表
    getKnowledgeList() {
      tuhu.axios
        .get(this.$API.getKnowledgeList)
        .then(res => {
          if (res.code - 10000 == 0) {
            var result = res.data;
            this.catalogdata = result;
            //只展示4层的判断
            this.catalogdata.forEach(item => {
              this.loopChild(item);
              this.addExpandByloop(item);
            });
            console.log(111, this.catalogdata);
          } else {
            this.errorType(res.message);
          }
        })
        .catch(error => {
          this.errorType(error);
        });
    },
    //获取子列表
    getChildListByType() {
      if (this.appendRoot) {
        if (this.type == 0 || this.type == 1) {
          //增加appendData和编辑data,所获取data做了区别
          if (this.type == 0) {
            //增加
            // var parentId = this.getParentId(this.appendRoot, this.appendNode);
            this.getChildList(this.appendData.id);
          } else {
            //编辑,若编辑的当前节点的直属子级的话，需要重新请求一次子级列表,编辑id,当前节点id
            this.catalogdata.forEach(item => {
              this.getCurrentItemById(item, this.appendData.id); //获取更新后的当前节点
            });
            if (this.currentItem.children) {
              this.currentItem.children.forEach(item => {
                //若是当前节点的直接子级，则重新获取列表
                if (item.id == this.data.id) {
                  this.getChildList(this.appendData.id);
                }
              });
            }
            console.log(123, this.currentItem);
          }
        } else {
          //删除
          if (this.data.id == this.appendData.id) {
            //删除是当前节点,留下父级列表
            this.getChildList(this.appendData.parentId);
          } else if (this.data.level > this.appendData.level) {
            //向下找
            this.catalogdata.forEach(item => {
              this.getCurrentItemById(item, this.appendData.id);
            });
            if (this.currentItem.children) {
              this.currentItem.children.forEach(item => {
                //若是当前节点的直接子级，则重新获取列表
                if (item.id == this.data.id) {
                  this.getChildList(this.appendData.id);
                }
              });
            }
          } else {
            //向上找
            //获取父级或父级以上
            this.catalogdata.forEach(item => {
              this.getCurrentItemById(item, this.data.id);
            });
            console.log(123, this.currentItem);
            //父级递归查询是否有子级，确认是否是其父级
            this.currentItem.children.forEach(item => {
              this.getCurrentItemById(item, this.appendData.id);
            });
            //新赋值的currentItem和子级相等的话说明含有子级
            if (this.currentItem.id == this.appendData.id) {
              this.childList = [];
            }
          }
        }
      }
    },
    getCurrentItemById(item, currentId) {
      if (item.id == currentId) {
        // debugger;
        this.currentItem = item;
      }
      if (item.children) {
        item.children.forEach(citem => {
          if (citem.id == currentId) {
            // debugger;
            this.currentItem = citem;
          }
          if (citem.children) {
            this.getCurrentItemById(citem, currentId);
          }
        });
      }
    },

    getParentId(root, node) {
      var parentId = root.find(el => el.nodeKey === node.parent).node.id;
      return parentId;
    },
    getChildList(id) {
      tuhu.axios
        .get(`${this.$API.getKnowledgeListByParentId}?parentId=${id}`)
        .then(res => {
          if (res.code - 10000 == 0) {
            this.childList = res.data.filter(item => {
              return item.id != id;
            });
          } else {
            this.errorType(res.message);
          }
        })
        .catch(error => {
          this.errorType(error);
        });
    },
    //获取标题列表
    getbreadArr() {
      if (this.type == 1) {
        //编辑
        if (
          this.data.id == this.appendData.id ||
          this.data.id == this.appendData.parentId
        ) {
          //编辑当前节点或者父级节点
          var parentId = this.appendData.parentId;
          this.getbreadList(parentId);
        }
      } else if (this.type == 0) {
        //增加
        var parentId = this.appendData.parentId;
        this.getbreadList(parentId);
      } else {
        //删除
        if (this.data.id == this.appendData.id) {
          //删除当前节点
          var parentId = this.appendData.parentId;
          this.getbreadList(parentId);
        } else {
          //删除父级或父级以上
          //获取父级或父级以上
          this.catalogdata.forEach(item => {
            this.getCurrentItemById(item, this.data.id);
          });
          console.log(123, this.currentItem);
          //父级递归查询是否有子级，确认是否是其父级
          this.currentItem.children.forEach(item => {
            this.getCurrentItemById(item, this.appendData.id);
          });
          //新赋值的currentItem和子级相等的话说明含有子级
          if (this.currentItem.id == this.appendData.id) {
            this.breadArr = [];
          }
        }
      }
    },
    getbreadList(parentId) {
      this.breadArr = [];
      tuhu.axios
        .get(`${this.$API.getKnowledgeListByParentId}?parentId=${parentId}`)
        .then(res => {
          if (res.code - 10000 == 0) {
            res.data.forEach(item => {
              if (item.id == parentId || item.id == this.appendData.id) {
                this.breadArr.push(item.title);
              }
            });
          } else {
            this.errorType(res.message);
          }
        })
        .catch(error => {
          this.errorType(error);
        });
    },
    //每次增删改后右边模块的更新(没有点击增加的时候不更新右边)
    Update() {
      if (this.appendData) {
        new Promise((resolve, reject) => {
          resolve(this.getKnowledgeList());
        }).then(this.getChildListByType(), this.getbreadArr());
      } else {
        this.getKnowledgeList();
      }
    },
    //编辑
    Edit(root, node, data) {
      console.log("Edit", root, node, data);
      this.root = root;
      this.node = node;
      this.data = data;
      this.EditModal = true;
      this.nodeName = data.title;
      if (node.parent !== undefined) {
        this.parentNode = root.find(el => el.nodeKey == node.parent).node;
      } else {
        this.parentNode = "";
      }
    },
    EditOk() {
      var args = {
        apiVersion: "string",
        channel: "string",
        postData: {
          id: this.data.id,
          parentId: this.parentNode.id || "",
          title: this.nodeName
        }
      };
      tuhu.axios
        .post(this.$API.updateKnowledge, args)
        .then(res => {
          console.log(66, res);
          if (res.code - 10000 == 0) {
            if (res.data) {
              this.$Message.success(res.message);
              this.type = 1;
              this.Update();
            }
          } else {
            this.errorType(res.message);
          }
        })
        .catch(error => {
          this.errorType(error);
        });
      this.EditModal = false;
    },
    //增加
    append(root, node, data) {
      console.log("append", root, node, data);
      this.type = 0;
      this.appendRoot = root;
      this.appendNode = node;
      this.appendData = data;
      this.getChildListByType();
      this.getbreadArr();
      this.templateList.map(item => {
        return (item.val = "");
      });
    },
    saveNewMoudle() {
      console.log(88, this.templateList);
      if (this.appendData) {
        if (this.appendData.level < 5) {
          var titleArr = this.templateList
            .filter(item => {
              return item.val;
            })
            .map(item => {
              return item.val;
            });
          if (this.appendRoot) {
            var args = {
              apiVersion: "string",
              channel: "string",
              postData: {
                parentId: this.appendData.id || 0,
                titles: titleArr
              }
            };
            tuhu.axios
              .post(this.$API.addKnowledge, args)
              .then(res => {
                if (res.code == 10000 - 0) {
                  if (res.data) {
                    this.type = 0;
                    this.templateList.map(item => {
                      return (item.val = "");
                    });
                    this.Update();
                  }
                } else {
                  this.errorType(res.message);
                }
              })
              .catch(error => {
                this.errorType(error);
              });
          }
        } else {
          this.$Message.warning("目前最多支持四层目录");
        }
      } else {
        this.$Message.warning("请选择父级");
      }
    },
    //删除
    remove(root, node, data) {
      this.DeleteModal = true;
      this.type = 2;
      this.root = root;
      this.node = node;
      this.data = data;
      console.log("remove", data, node, data);
    },
    moduleDelete(root, node, data) {
      this.type = 2;
      console.log(0, root, node, data);
      var args = {
        apiVersion: "string",
        channel: "string",
        postData: {
          id: data.id
        }
      };
      tuhu.axios
        .post(this.$API.deleteKnowledge, args)
        .then(res => {
          if (res.code == 10000) {
            if (res.data) {
              this.$Message.success(res.message);
              this.Update();
            }
          } else {
            this.errorType(res.message);
          }
        })
        .catch(error => {
          this.errorType(error);
        });

      //手动删除
      // const parentKey = root.find(el => el === node).parent;
      // const parent = root.find(el => el.nodeKey === parentKey).node;
      // const index = parent.children.indexOf(data);
      // if (data.children) {
      //   this.clearChildren(data);
      // } else {
      //   this.childList.forEach((item, idx) => {
      //     if (item.title == data.title) {
      //       console.log(123, item);
      //       this.childList.splice(idx, 1);
      //     }
      //   });
      // }
      // parent.children.splice(index, 1);

      // this.breadArr = root
      //   .filter(item => {
      //     return item.nodeKey <= node.parent + 1;
      //   })
      //   .map(element => {
      //     return element.node.title;
      //   });
    },
    DeleteOk() {
      this.moduleDelete(this.root, this.node, this.data);
      this.DeleteModal = false;
    },
    //递归删除所有子级的方法
    clearChildren(data) {
      data.children.forEach((child, idx) => {
        if (child.children) {
          this.clearChildren(child);
        } else {
          var childIdx = this.childList.indexOf(child);
          this.childList.splice(childIdx, 1);
        }
      });
    },
    addItem(item) {
      this.templateList.push({ val: "" });
      console.log(666, this.templateList);
    },
    removeItem(idx) {
      this.templateList.splice(idx, 1);
      console.log(666, idx, this.templateList);
    },
    EditCancel() {
      this.EditModal = false;
    },
    DeleteCancel() {
      this.DeleteModal = false;
    },

    loopChild(item) {
      if (item.level >= 5) {
        item.children = null;
        Vue.set(item, "expand", true);
      }
      if (item.children) {
        item.children.forEach(citem => {
          // console.log(123, citem);
          if (citem.level >= 5) {
            citem.children = null;
            Vue.set(citem, "expand", true);
          }
          if (citem.children) {
            this.loopChild(citem);
          }
        });
      }
    },
    //递归循环子级加上expand为true的属性
    addExpandByloop(item) {
      Vue.set(item, "expand", true);
      if (item.children) {
        item.children.forEach(citem => {
          Vue.set(citem, "expand", true);
          if (citem.children) {
            this.addExpandByloop(citem);
          }
        });
      }
    }
  }
};
</script>


<style lang="less" scoped>
.container {
  display: flex;
}
.tree {
  // min-width: 320px;
  //   display: inline-block;
  background: #fff;
  padding: 15px 15px 30px 20px;
  p {
    font-size: 14px;
    font-weight: bold;
  }
}
.module {
  //   width: 500px;
  background: #fff;
  padding: 15px 15px 30px 20px;
  flex: 1;
  margin-left: 10px;
  p {
    font-size: 14px;
    font-weight: bold;
  }
  .bread {
    margin: 10px 0;
  }
  ul li {
    list-style: none;
    // width: 350px;
    .inputItem {
      width: 300px;
      margin: 5px 20px 0 0;
    }
    .icon {
      cursor: pointer;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .saveBtn {
    margin-top: 15px;
  }
}
</style>

