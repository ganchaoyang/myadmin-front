import request from '@/utils/request'

export function findAll(tree) {
  return request({
    url: '/perm/all',
    method: 'get',
    params: { tree }
  })
}
