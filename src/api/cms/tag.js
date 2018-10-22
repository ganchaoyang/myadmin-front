import request from '@/utils/request'

// 获取所有标签。
export function findAll() {
  return request({
    url: '/cms/tag/all',
    method: 'get'
  })
}
