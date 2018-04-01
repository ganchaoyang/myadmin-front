import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/user/all',
    method: 'get'
  })
}

export function addUser(sysUser) {
  const data = sysUser
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}
