import request from '@/utils/request'

// 新增文章。
export function addArticle(article) {
  return request({
    url: '/cms/article/add',
    method: 'post',
    data: article
  })
}

// 获取文章列表。
// pageNum: 当前页，pageSize：每页数据量。
export function findAll(pageNum, pageSize) {
  return request({
    url: '/cms/article/all?pageNum=' + pageNum + '&pageSize=' + pageSize,
    method: 'get'
  })
}

export function findById(id) {
  return request({
    url: '/cms/article/data/' + id,
    method: 'get'
  })
}

export function editArticle(article) {
  return request({
    url: '/cms/article/edit',
    method: 'put',
    data: article
  })
}

