import request from '@/utils/request'

export function findAll(tree) {
  return request({
    url: '/perm/all',
    method: 'get',
    params: { tree }
  })
}

export function addPerm(perm) {
  const data = perm
  return request({
    url: '/perm/add',
    method: 'post',
    data
  })
}
