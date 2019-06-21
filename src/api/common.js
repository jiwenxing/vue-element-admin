import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/common/getCategoryList',
    method: 'get',
    params: query
  })
}

