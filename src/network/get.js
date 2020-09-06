import request from "./request.js";

// axios({
//   axios常见的配置选项：
//  请求地址
// url: “请求地址”
//  请求类型
// method: ‘get/post……’
//  请求的根路径
// baseURL: “根路径”
//  请求前的数据处理
// transformRequest: [function(data) {}]
//  请求后的数据处理
// transformResponse: [function(data) {}]
//  自定义的请求头
// headers: {‘x-Requested-With’:‘XMLHttpRequest’}
//  URL查询对象，有1个差不多的data:{}一般配合post
// params: {}
//  超时设置
// timeout: number（ms）
// })

// 分类页
function getLeftData() {
    return request({
        method: 'get',
        url: "http://localhost:8888/api/private/v1/menus",
    });
}
// 获取用户列表
function getUsers(user) {
    return request({
        method: 'get',
        url: "http://localhost:8888/api/private/v1/users",
        params: {
            query: user.query,
            pagenum: user.pagenum,
            pagesize: user.pagesize,
        }
    });
}
//添加用户
function getAddUsers(add) {
    return request({
        method: 'post',
        url: "http://localhost:8888/api/private/v1/users",
        data: {
            username: add.username,
            password: add.password,
            email: add.email,
            mobile: add.mobile,
        }
    });
}

//修改用户状态
function getUserType(user) {
    return request({
        method: 'put',
        url: `http://localhost:8888/api/private/v1/users/${user.id}/state/${user.mg_state}`,
    });
}

// 编辑用户信息
function getEditDialog(id) {
    return request({
        method: 'get',
        url: `http://localhost:8888/api/private/v1/users/${id}`,
    });
}
// 编辑用户信息提交
function EditDialogs(edit) {
    return request({
        method: 'put',
        url: `http://localhost:8888/api/private/v1/users/${edit.id}`,
        data: {
            email: edit.email,
            mobile: edit.mobile,
        }
    });
}

// 删除用户信息
function getRemoveUser(id) {
    return request({
        method: 'delete',
        url: `http://localhost:8888/api/private/v1/users/${id}`,
    });
}

// 获取角色列表数据
function getUserRole() {
    return request({
        method: 'get',
        url: "http://localhost:8888/api/private/v1/roles",
    });
}

// 分配角色
function UserRole(edit, ids) {
    return request({
        method: 'put',
        url: `http://localhost:8888/api/private/v1/users/${edit.id}/role`,
        data: {
            rid: ids,
        }
    });
}

//删除角色指定权限
function DeleRote(role, roleId) {
    return request({
        method: 'delete',
        url: `http://localhost:8888/api/private/v1/roles/${role.id}/rights/${roleId}`,
    });
}

// 所有权限数据
function getRoleData(role, roleId) {
    return request({
        method: 'get',
        url: "http://localhost:8888/api/private/v1/rights/tree",
    });
}

// 为角色分配权限
function Role(id, idStr) {
    return request({
        method: 'post',
        url: `http://localhost:8888/api/private/v1/roles/${id}/rights`,
        data: {
            rids: idStr
        }
    });
}
// 获取权限列表
function getRights(id, idStr) {
    return request({
        method: 'get',
        url: "http://localhost:8888/api/private/v1/rights/list",
    });
}

// 商品列表
function getGoods(info) {
    return request({
        method: 'get',
        url: "http://localhost:8888/api/private/v1/goods",
        params: {
            query: info.query,
            pagenum: info.pagenum,
            pagesize: info.pagesize,
        }
    });
}

// 删除商品
function DeleGoods(id) {
    return request({
        method: 'delete',
        url: `http://localhost:8888/api/private/v1/goods/${id}`,

    });
}

// 获取分类数据
function getCate(id) {
    return request({
        method: 'get',
        url: `http://localhost:8888/api/private/v1/categories`,

    });
}


// 动态参数
function manyTableData(id, aa) {
    return request({
        method: 'get',
        url: `http://localhost:8888/api/private/v1/categories/${id}/attributes`,
        params: { sel: aa }
    });
}

// 添加商品
function Addgoods(info) {
    return request({
        method: 'post',
        url: "http://localhost:8888/api/private/v1/goods",
        data: {
            goods_name: info.goods_name,
            goods_price: info.goods_price,
            goods_weight: info.goods_weight,
            goods_number: info.goods_number,
            goods_cat: info.goods_cat,
            pics: info.pics,
            goods_introduce: info.goods_introduce,
            attrs: info.attrs,
        }
    });
}

// 数据报表
function getData() {
    return request({
        method: 'get',
        url: "http://localhost:8888/api/private/v1/reports/type/1",
    });
}

// 订单列表数据
function getOrder(info) {
    return request({
        method: 'get',
        url: "http://localhost:8888/api/private/v1/orders",
        params: {
            query: info.query,
            pagenum: info.pagenum,
            pagesize: info.pagesize,
        }
    });
}

// 订单物流情况
function getlogistics() {
    return request({
        method: 'get',
        url: "http://localhost:8888/api/private/v1/kuaidi/804909574412544580",
    });
}

// 分类列表
function getCateData(info) {
    return request({
        method: 'get',
        url: "http://localhost:8888/api/private/v1/categories",
        params: {
            type: info.type,
            pagenum: info.pagenum,
            pagesize: info.pagesize,
        }
    });
}

// 获取分类父级数据
function getCateParent() {
    return request({
        method: 'get',
        url: "http://localhost:8888/api/private/v1/categories",
        params: {
            type: 2,
        }
    });
}




// 添加分类
function AddCate(info) {
    return request({
        method: 'post',
        url: "http://localhost:8888/api/private/v1/categories",
        data: {
            cat_name: info.cat_name,
            cat_pid: info.cat_pid,
            cat_level: info.cat_level,
        }
    });
}

// 保存属性操作
function SaveAtrr(id, attrId, row, active, vals) {
    return request({
        method: 'put',
        url: `http://localhost:8888/api/private/v1/categories/${id}/attributes/${attrId}`,
        data: {
            attr_name: row.attr_name,
            attr_sel: active,
            attr_vals: vals,
        }
    });
}

// 删除对应参数
function removeParams(id, attrId) {
    return request({
        method: 'delete',
        url: `http://localhost:8888/api/private/v1/categories/${id}/attributes/${attrId}`,

    });
}

// 添加参数
function AddParams(id, attr_name, active) {
    return request({
        method: 'post',
        url: `http://localhost:8888/api/private/v1/categories/${id}/attributes`,
        data: {
            attr_name: attr_name,
            attr_sel: active
        }
    });
}

// 修改参数
function EditParams(id, attrId, active) {
    return request({
        method: 'get',
        url: `http://localhost:8888/api/private/v1/categories/${id}/attributes/${attrId}`,
        params: {
            attr_sel: active
        }
    });
}

// 修改提交参数
function ToEditParams(id, attrId, attr_name, active) {
    return request({
        method: 'put',
        url: `http://localhost:8888/api/private/v1/categories/${id}/attributes/${attrId}`,
        data: {
            attr_name: attr_name,
            attr_sel: active,
        }
    });
}
export { getLeftData, getCateParent, ToEditParams, EditParams, AddParams, removeParams, SaveAtrr, AddCate, getCateData, getlogistics, getOrder, getData, Addgoods, getGoods, DeleGoods, getCate, manyTableData, getRights, Role, getRoleData, DeleRote, getUsers, getAddUsers, getUserType, getEditDialog, EditDialogs, getRemoveUser, getUserRole, UserRole };