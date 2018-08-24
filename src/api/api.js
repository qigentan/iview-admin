let DM_SITE = "http://172.16.20.89";
// 查询所有知识点列表;
export const getKnowledgeList = `${DM_SITE}/tech-knowledge/tech/knowledge/getKnowledgeList`;
//根据父级id查询知识点子列表接口;
export const getKnowledgeListByParentId = `${DM_SITE}/tech-knowledge/tech/knowledge/getKnowledgeListByParentId`;
// 添加知识点;
export const addKnowledge = `${DM_SITE}/tech-knowledge/tech/knowledge/addKnowledgeList`;
// 删除知识点
export const deleteKnowledge = `${DM_SITE}/tech-knowledge/tech/knowledge/deleteKnowledge`;
// 编辑知识点;
export const updateKnowledge = `${DM_SITE}/tech-knowledge/tech/knowledge/updateKnowledge`;
// 询知识点数据的详细信息;
export const getKnowledgeInfoById = `${DM_SITE}/tech-knowledge/tech/knowledge/getKnowledgeInfoById`;
// 课件管理----获取课件类型列表
export const getDictionaryListByType = `${DM_SITE}/tech-data-setting/tech/dataSetting/getDictionaryListByType`;
// 课件管理----查询课件列表
export const getCourseResourceList = `${DM_SITE}/tech-course/tech/courseresource/getCourseResourceList`;
// 课件管理----添加课程资源
export const addCourseResource = `${DM_SITE}/tech-course/tech/courseresource/addCourseResource`;
// 课件管理----删除课件信息
export const deleteCourseResourceById = `${DM_SITE}/tech-course/tech/courseresource/deleteCourseResourceById`;
// 课件管理----修改课件资源
export const updateCourseResource = `${DM_SITE}/tech-course/tech/courseresource/updateCourseResource`;
// 课件管理----获取课件信息
export const getCourseResourceById = `${DM_SITE}/tech-course/tech/courseresource/getCourseResourceById`;