<script setup lang="ts">
import type { Ref } from 'vue'
import { NButton, NCard, NCheckbox, NCode, NDynamicTags, NList, NListItem, NModal, NSpace } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import type { PageVO } from '../logic/request'
import type { CustomPageVO } from '../logic/segments'
import { contentSegments2, segmentAndContents } from '../logic/segments'
import { getArticleList } from '~/logic/request'

hljs.registerLanguage('javascript', javascript)

type FormPageVO = PageVO & {
  checked: boolean
}

const list: Ref<FormPageVO[] | null> = ref(null)
const segments: Ref<string[][]> = ref([[]])
onMounted(async () => {
  const { records } = await getArticleList()
  list.value = records.map((item: PageVO) => ({ ...item, checked: false })) as FormPageVO[]
  segments.value = contentSegments2(segmentAndContents(list.value! as PageVO[]) as unknown as CustomPageVO[])
})

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

const treeModal = ref(false)
const codeModal = ref(false)
</script>

<template>
  <section class="flex flex-col justify-center items-center">
    <main class="text-gray-700 dark:text-gray-200 h-[calc(100vh-69px)] flex flex-row">
      <div class="w-4/5 h-full overflow-y-scroll">
        <NList hoverable clickable>
          <NListItem v-for="(item, index) in list" :key="item.id">
            <h4>标题: {{ item.title }}</h4>
            <h4>作者: {{ item.user.userName }}</h4>
            <NSpace>
              官方标签:
              <NDynamicTags v-model:value="item.tags" />
            </NSpace>
            <NSpace>
              通过JS分词计算得到的英文标签:
              <NDynamicTags v-model:value="segments[index]" />
            </NSpace>
            <template #suffix>
              <NCheckbox v-model:checked="item.checked" />
            </template>
          </NListItem>
        </NList>
      </div>
      <div class="w-1/5 h-full">
        <NList hoverable clickable>
          <NListItem>
            <NButton @click="treeModal = true">
              设置树形结构
            </NButton>
          </NListItem>
          <NListItem @click="codeModal = true">
            <NButton>
              生成JSON数据格式
            </NButton>
          </NListItem>
        </NList>
      </div>
    </main>

    <footer class="py-24px px-50px text-center text-gray-700 dark:text-gray-200 w-full">
      Powered by Vite <pixelarticons-zap class="align-middle inline-block" />
    </footer>
  </section>

  <NModal v-model:show="treeModal">
    <NCard style="width: 600px" title="模态框" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <template #header-extra>
        噢！
      </template>
      内容
      <template #footer>
        尾部
      </template>
    </NCard>
  </NModal>

  <NModal v-model:show="codeModal">
    <NCard style="width: 600px" title="模态框" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <NCode :hljs="hljs" :code="JSON.stringify(jsonResult)" language="js" word-wrap />
    </NCard>
  </NModal>
</template>
