import request from '@/utils/request'
// 查询所有用户
export function findAll() {
  return request({
    url: '/user/all',
    method: 'get'
  })
}

// 添加用户。
export function addUser(sysUser) {
  const data = sysUser
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

// 删除用户。
export function deleteUser(id) {
  return request({
    url: '/user/delete/' + id,
    method: 'delete'
  })
}

// 更新用户。
export function updateUser(data) {
  return request({
    url: '/user/edit',
    method: 'put',
    data
  })
}
