import request from '@/utils/request'

export function findAll(tree) {
  return request({
    url: '/unit/all',
    method: 'get',
    params: { tree }
  })
}

export function addUnit(unit) {
  const data = unit
  return request({
    url: '/unit/add',
    method: 'post',
    data
  })
}
