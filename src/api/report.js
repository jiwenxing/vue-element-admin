import request from '@/utils/request'

export function queryReportList(param) {
  return request({
    url: '/report/list',
    method: 'post',
    params: param
  })
}

export function queryReasonList() {
  return request({
    url: '/report/reasonList',
    method: 'post'
  })
}

export function deleteComment(param) {
  return request({
    url: '/report/deleteComment',
    method: 'post',
    params: param
  })
}
