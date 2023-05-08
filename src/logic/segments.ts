import type { PageVO } from './request'

const regex = /[0-9+\-*/.=^<>{}\[\]()%~`|&$#@!?,;:_\s，。、；：！？￥（）【】《》“”‘’…—「」『』]|[@#\$%\^&\*\(\)_\+`\-=\[\]\\;',\.\/\{\}\|":<>\?]/g

// 分词和内容的对象数组
export const segmentAndContents = (data: PageVO[]) =>
  data?.map(item => ({
    content: item.content,
    segments: Array.from(
      new Intl.Segmenter('cn', { granularity: 'word' }).segment(item.content),
    ),
  }))

export type CustomPageVO = ReturnType<typeof segmentAndContents> | {
  tags?: string[]
}

// 分词数组(去重)
// const contentSegments = segmentAndContents
//   .map(item => item.segments.filter(item => !item.segment.match(regex)))
//   .map(item => [...new Set(item.map(item => item.segment))])
// 内容不去重 只保留大写开头的英文 通过出现的次数进行排序 从大到小
export const contentSegments2 = (data: CustomPageVO[]) => data
  .map((item: any) => item.segments.filter((item: any) => !item.segment.match(regex)))
  .map((item: any) => item.map((item: any) => item.segment).filter(isUpperCase))
  .map((item: any) => item.filter(hasEnglish))
  .map(sortBySegment)
  .map((item: any) =>
    Object.entries(item)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([key]) => key),
  )

function hasEnglish(arr: string): boolean {
  const regex = /[a-zA-Z]/
  for (let i = 0; i < arr.length; i++) {
    if (regex.test(arr[i]))
      return true
  }
  return false
}

function isUpperCase(word: string): boolean {
  const regex = /^[A-Z]/
  return regex.test(word)
}

/**
 * @param {Array} segments
 */
function sortBySegment(segments: string[]) {
  const counts: Record<any, any> = {}
  for (const segment of segments) {
    if (counts[segment])
      counts[segment] += 1

    else
      counts[segment] = 1
  }
  return counts
}
