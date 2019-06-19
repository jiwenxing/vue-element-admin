import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/comment/list',
    method: 'post',
    params: query
  })
}

// export function fetchArticle(id) {
//   return request({
//     url: '/article/detail',
//     method: 'get',
//     params: { id }
//   })
// }

// export function fetchPv(pv) {
//   return request({
//     url: '/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

export function updateAuditStatus(data) {
  return request({
    url: '/comment/updateAuditStatus',
    method: 'post',
    data
  })
}

export function updateTopStatus(data) {
  return request({
    url: '/comment/updateTopStatus',
    method: 'post',
    data
  })
}

export function updateContent(data) {
  return request({
    url: '/comment/updateContent',
    method: 'post',
    data
  })
}

export function batchAuditSelected(data) {
  return request({
    url: '/comment/batchAuditSelected',
    method: 'post',
    data
  })
}
