import request from '@/utils/request'

export function findAll() {
  return request({
    url: '/user/all',
    method: 'get'
  })
}
