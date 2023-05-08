async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

export async function getArticleList(): Promise<ListData> {
  const { data } = await postData(
    'https://www.code-nav.cn/api/post/list/page/vo',
    {
      current: 1,
      reviewStatus: 1,
      sortField: 'createTime',
      sortOrder: 'descend',
    },
  )

  return data
}

export interface User {
  id: string
  planetCode: string
  userName: string
  userAvatar: string
  gender: number
  userProfile?: any
  userRole: string
  interests: any[]
  place?: any
  birthday?: any
  school?: any
  major?: any
  education?: any
  graduationYear?: any
  jobStatus?: any
  company?: any
  job?: any
  workYear?: any
  direction?: any
  goal?: any
  github?: any
  blog?: any
  score: number
  coin: number
  followeeNum: number
  followNum: number
  followStatus?: any
  vipExpireTime: string
  lastLoginTime?: any
  createTime: string
  updateTime: string
}

export interface PageVO {
  id: string
  title: string
  description?: any
  content: string
  category: string
  cover?: any
  language?: any
  viewNum: number
  thumbNum: number
  favourNum: number
  commentNum: number
  priority: number
  userId: string
  reviewStatus: number
  reviewMessage?: any
  reviewerId?: any
  reviewTime?: any
  createTime: string
  updateTime: string
  user: User
  tags: string[]
  fileList?: any
  videoList?: any
  atUserList?: any
  pictureList?: any
  hasThumb: boolean
  hasFavour: boolean
  needVip?: any
  atUserVOList?: any
}

export interface ListData {
  records: PageVO[]
  total: string
  size: string
  current: string
  orders: any[]
  optimizeCountSql: boolean
  searchCount: boolean
  countId?: any
  maxLimit?: any
  pages: string
}

export interface ResponseData<T> {
  code: number
  data: ListData | T | unknown | null
  message: string
}
