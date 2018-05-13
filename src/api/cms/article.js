import request from '@/utils/request'

// 新增文章。
export function addArticle(article) {
  return request({
    url: '/cms/article/add',
    method: 'post',
    data: article
  })
}
