import Mock from 'mockjs'

const List = []
const count = 121

// const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    guid: '@guid',
    timestamp: +Mock.Random.date('T'),
    pin: '@first',
    userIp: '@ip',
    nickName: '@first',
    category: '@first',
    commodityName: '@title(5, 10)',
    content: '@sentence(3, 27)',
    forecast: '@float(0, 100, 2, 2)',
    score: '@integer(1, 5)',
    textStatus: '@integer(-1, 2)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'clientType|1': ['IOS', 'Android', 'PC', 'IPad'],
    'topped|1': [1, 0, -1],
    creationTime: '@datetime',
    comment_disabled: true,
    objectId: '@integer(6000000, 9000000)',
    referenceEventId: '@integer(4000000000, 9000000000)',
    image_uri,
    platforms: ['a-platform'],
    'imageAuditStatus|1': [1, 0, -1],
    userPin: '@first',
    userNickName: '@first'
  }))
}

export default [
  {
    url: '/comment/list.*',
    type: 'post',
    response: config => {
      const { grade, topped, sku, keyword, page = 1, limit = 20, textStatus, sort, pin } = config.query

      let mockList = List.filter(item => {
        if (pin && item.pin !== pin) return false
        // if (auditStatus && item.imageAuditStatus !== Number(auditStatus)) return false
        // if (topStatus && item.topStatus !== Number(topStatus)) return false
        if (textStatus && item.textStatus !== Number(textStatus)) return false
        if (topped && item.topped !== Number(topped)) return false
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
        code: '1',
        result: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  },

  {
    url: '/comment/batchAuditSelected',
    type: 'post',
    response: _ => {
      return {
        code: '1',
        data: 'success'
      }
    }
  },
  {
    url: '/comment/updateAuditStatus',
    type: 'post',
    response: _ => {
      return {
        code: '1',
        data: 'success'
      }
    }
  },
  {
    url: '/comment/updateTopStatus',
    type: 'post',
    response: _ => {
      return {
        code: '1',
        data: 'success'
      }
    }
  },

  {
    url: '/comment/updateContent',
    type: 'post',
    response: _ => {
      return {
        code: '1',
        data: 'success'
      }
    }
  }
]

