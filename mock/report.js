import Mock from 'mockjs'

const reportCommentList = []
const totalCount = 121
const reasonMap = { 1: '涉黄', 2: '涉政', 3: '辱骂', 4: '恶意', 5: '敲诈', 6: '其他' }

// const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < totalCount; i++) {
  const reportComment = Mock.mock({
    id: '@increment',
    guid: '@guid',
    sku: '@integer(6000000, 9000000)',
    skuName: '@cword(5)',
    pin: '@first',
    reportCount: '@integer(1, 7)',
    score: '@integer(1, 5)',
    content: '@csentence',
    ip: '@ip',
    status: '@pick([1, 0, -1])',
    topStatus: '@pick([1, 0, -1])',
    timestamp: +Mock.Random.date('T'),
    display_time: '@datetime',
    comment_disabled: true,
    imageList: '@pick(' + JSON.stringify(['@image', '@image', '@image', '@image', '@image', '@image']) + ', 0, 6)',
    platforms: ['a-platform']
  })
  const reportInfoList = []
  for (let i = 0; i < reportComment.reportCount; i++) {
    const reportInfo = Mock.mock({
      id: '@increment',
      commentId: reportComment.id,
      sku: '@integer(6000000, 9000000)',
      skuName: '@cword(5)',
      pin: '@first',
      reasonId: '@integer(1, 6)',
      type: '@pick([0, 1])',
      status: '@pick([1, 7, 8])',
      content: '@csentence',
      imageList: '@pick(' + JSON.stringify(['@image', '@image', '@image', '@image', '@image', '@image']) + ', 0, 6)',
      reportTime: '@datetime'
    })
    reportInfoList.push(reportInfo)
  }
  reportComment.reportInfoList = reportInfoList
  reportCommentList.push(reportComment)
}

export default [
  {
    url: '/report/list.*',
    type: 'post',
    response: config => {
      const { pin, grade, topStatus, sku, keyword, auditStatus, sort, page = 1, limit = 20} = config.query
      let mockList = reportCommentList.filter(item => {
        if (pin && item.pin !== pin) return false
        if (auditStatus && item.status !== Number(auditStatus)) return false
        if (topStatus && item.topStatus !== Number(topStatus)) return false
        if (grade && item.importance !== +Number(grade)) return false
        if (sku && item.sku !== Number(sku)) return false
        if (keyword && item.content.indexOf(keyword) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 0,
        totalCount: mockList.length,
        reportCommentList: pageList
      }
    }
  },
  {
    url: '/report/reasonList.*',
    type: 'post',
    response: config => {
      return {
        code: 0,
        reasonMap: reasonMap
      }
    }
  }
]

