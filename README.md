# What is this

面试题内容: [this](https://mp.weixin.qq.com/s/8_sMUG3nkluzZHmixwmr9g)

暂时先根据官方 tags 进行分类

### 基本思路

1. 封装 fetch，源自 MDN，后面可能替换 useFetch
   tips: 因为一开始是在浏览器中尝试编写代码
2. 创建一个浏览器插件项目
   方便去获取接口数据，虽然后端也可以，顺带存到数据库当中，暂时省事。
3. 绘制基本布局

```
____________________ _________
                    |
       list         | settings
____________________|_________
```

4. 通过请求接口，获取数据(暂时先请求首页数据)
   根据接口的返回值，应该是 mybatis-plus 的代码，用的类 RESTful 设计。(其他接口没看过)
5. JS 分词处理(效果并不是很理想，建议还是用 NLP 或者老 chat)

```
Array.from(
      new Intl.Segmenter('cn', { granularity: 'word' }).segment(item.content)
)
```

6. 重新生成数据

```
const jsonValue = ref([])
const jsonResult: Ref<Record<string, any>> = ref({})
// 监听数据,深度遍历，代码可以再优化
watch(list, (newValue) => {
  // 数据筛查 - 对数据接口的tags进行重新排序
  jsonValue.value = newValue!
    .filter((item: FormPageVO) => item.checked)
    .map((item: PageVO) => ({
      tags: item.tags.sort(),
      contents: item.content,
    })) as never[]

  const result = {}
  /**
   * 这个部分是关注点
   * 首先对拿到的新数据进行遍历
   *    对深层次的tags也进行便利
   *      如果没有改键，创建键与值，如果是tags最后一个，创建键与数组
   *    同时再判断tags的是否是最后一个，同时在判断该tag是不是字符为0
   *      如果是0的话，则插入一个空对象
   *      如果不是0的话，则插入一个字符进数组
   */
  jsonValue.value.forEach((item: { tags: any[]; contents: any }) => {
    let obj: Record<string, any> = result
    item.tags.forEach((tag, index) => {
      if (!obj[tag])
        obj[tag] = index === item.tags.length - 1 ? [] : {}
      obj = obj[tag]
      if (index === item.tags.length - 1) {
        if (item.contents[0] === '')
          obj.push({})
        else
          obj.push(item.contents)
      }
    })
  })

  jsonResult.value = result
}, {
  deep: true,
})
```

7. 在代码块中生成代码
   利用 naive-ui 提供的强大的组件

```
<NCode :hljs="hljs" :code="JSON.stringify(jsonResult)" language="js" word-wrap />
```

### features(下次一定)

- clipboard.js
- 接入 NLP 或者 chatGPT 分类
- 自定义拆分成树形架构
- 自定义接口 与 cookie
- 滚动加载数据

### Thanks(排名不分先后)

- ChatGPT
- https://github.com/antfu/vitesse-webext
- 鱼皮
- naive-ui
