import request from '@/utils/request'

export function findAll(tree) {
  return request({
    url: '/unit/all',
    method: 'get',
    params: { tree }
  })
}
