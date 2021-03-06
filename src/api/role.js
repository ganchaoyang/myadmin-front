import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/role/all',
    method: 'get'
  })
}

export function findById(id) {
  return request({
    url: '/role/data/' + id,
    method: 'get'
  })
}

export function addRole(role) {
  const data = role
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/delete/' + id,
    method: 'delete'
  })
}

export function updateRole(role) {
  const data = role
  return request({
    url: '/role/edit',
    method: 'put',
    data
  })
}

