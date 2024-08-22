
> 2023-08-22
日报系统——新需求——日历日期多选

使用`ant-design`的日历组件`ACalendar`


这是个日历插件，选择日期来筛选日报。
ant-design的日历插件会有默认选择日期，也就是其value不能赋值undefined，也就是肯定会有一个日期是selected状态，经过观察，那个日期会带class`.ant-picker-cell-selected`
初始默认选中日期是当天。

因为日报需求要求初始化不选择任何日期，查询全部符合条件的日报。所以去查询日报的日期参数需要和日历插件的日历参数分离。

数据部分：
当点击日历日期时，通过点击事件获取点击的时间来判断怎么给接口查询参数赋值。
默认参数=undefined
点击日期：如果参数是undefined，则把参数赋值成点击日期
点击日期：如果参数和点击日期是相等，则把参数赋值成undefined（需要取消日期选择，再次查询全部日报）

样式部分：
样式需要和参数想对应，不能跟随日历中的current显式
1. 当天的日期始终有一个样式，用来告诉用户今天是几号。(原样式已有——样式1)
2. 当选择某天时，参数被赋值成这个日期，所以这个日期要有一个突出样式（样式2），告诉用户已经选择了某个日期（原样式已有）
3. (重点)当参数是undefined时要把`.ant-picker-cell-selected`的样式2去掉即可

原问题代码如下
  ```html
  <template>
    <div class="calendar">
      <ACalendar
        :fullscreen="false"
        :disabled-date="disabledDate"
        :class="{ 'no-selected': !calendarValue, 'selected': !!calendarValue }"
      >
        <template #headerRender="{ value: current, onChange }">
          <div class="calendar-header py-2 px-3">
            <ARow
              type="flex"
              justify="space-between"
            >
              <ACol>
                <DoubleLeftOutlined
                  class="mr-2"
                  @click="onChange(current.add(-1, 'year').startOf('month'))"
                />
                <LeftOutlined @click="onChange(current.add(-1, 'month').startOf('month'))" />
              </ACol>
              <ACol>
                <ASelect
                  size="small"
                  :dropdown-match-select-width="false"
                  :value="String(current.year())"
                  :options="getYears(current)"
                  :style="{ marginRight: '8px' }"
                  @change="newYear => onChange(current.year(newYear))"
                />
                <ASelect
                  size="small"
                  :dropdown-match-select-width="false"
                  :value="String(current.month())"
                  :options="getMonths(current)"
                  @change="selectedMonth => onChange(current.month(parseInt(String(selectedMonth), 10)))"
                />
              </ACol>
              <ACol>
                <RightOutlined
                  class="mr-2"
                  @click="onChange(current.add(1, 'month').startOf('month'))"
                />
                <DoubleRightOutlined @click="onChange(current.add(1, 'year').startOf('month'))" />
              </ACol>
            </ARow>
          </div>
        </template>
        <template #dateFullCellRender="{ current }">
          <div
            class="ant-picker-cell-inner ant-picker-calendar-date"
            @click="changeDate(current)"
          >
            <div class="ant-picker-calendar-date-value">
              {{ current.format('DD') }}
            </div>
            <div class="ant-picker-calendar-date-content">
              <div
                :class="{'date-dot': taskDate.indexOf(dayjs(current.format('YYYY-MM-DD')).valueOf()) >= 0}"
              />
            </div>
          </div>
        </template>
      </ACalendar>
      <div
        class="footer"
        @click="pickToday"
      >
        今天
      </div>
    </div>
  </template>

  <script setup>
  import { DoubleLeftOutlined, LeftOutlined, RightOutlined, DoubleRightOutlined } from '@ant-design/icons-vue'
  import { useDateStore } from '@/stores/date.js'
  import dayjs from 'dayjs'
  import { toRefs } from 'vue'
  const date = useDateStore()
  const props = defineProps({
    // 有日报的时间
    taskDate: {
      type: Array,
      default: () => []
    }
  })

  const emit = defineEmits(['selectedDateChange'])

  const { taskDate } = toRefs(props)
  const calendarValue = ref(undefined)

  function changeDate (date) {
    if (calendarValue.value && calendarValue.value.startOf('day').valueOf() === date.startOf('day').valueOf()) {
      calendarValue.value = undefined
    } else {
      calendarValue.value = date
    }
  }

  watch(calendarValue, () => {
    date.setSelectedDate(calendarValue.value && calendarValue.value.startOf('day'))
    emit('selectedDateChange', calendarValue.value && calendarValue.value.startOf('day'))
  })

  function pickToday () {
    calendarValue.value = dayjs()
  }

  function getMonths (value) {
    const localeData = value.localeData()
    const months = []
    for (let i = 0; i < 12; i++) {
      months.push({
        label: localeData.monthsShort(value.month(i)),
        value: i.toString()
      })
    }
    return months
  }

  function getYears (value) {
    const year = value.year()
    const years = []
    for (let i = year - 10; i < year + 10; i += 1) {
      years.push({
        label: i.toString(),
        value: i
      })
    }
    return years
  }

  const disabledDate = (currentDate) => {
    return dayjs().isBefore(currentDate, 'day')
  }

  </script>

  <style lang="less" scoped>
  @import "~/ant-design-vue/es/style/themes/index.less";

  :deep(.ant-picker-cell) .ant-picker-cell-inner {
    cursor: pointer;
  }

  :deep(.ant-picker-calendar) {
    .ant-picker-panel {
      border-bottom: 1px solid rgb(0 0 0 / 5%);

      .ant-picker-body {
        padding: 0 0 6px;
        font-size: 12px;

        thead {
          height: 36px;
          border-bottom: 1px solid rgb(0 0 0 / 5%);
        }

        .ant-picker-cell-disabled::before {
          background: none;
        }
      }
    }
  }

  .date-dot {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: @primary-color;
  }

  .calendar {
    width: "280px";
    position: "relative";
    background: #fff;
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 8%);
    border-radius: 8px;
  }

  .calendar-header {
    background-color: #f8fafb;
    border-radius: 8px 8px 0 0;
  }

  .footer {
    text-align: center;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    color: #0085ff;
    cursor: pointer;
  }

  .no-selected {
    :deep(.ant-picker-cell-selected) {
      & .ant-picker-calendar-date-value {
        color: rgb(0 0 0 / 85%);
        background: #fff !important;
      }

      &.ant-picker-cell-today .ant-picker-calendar-date-value {
        color: #1890ff !important;
        background: #e6f7ff !important;
        border-color: #e6f7ff !important;
      }
    }
  }

  :deep(.ant-picker-cell-in-view.ant-picker-cell-today) {
    .ant-picker-cell-inner {
      color: #1890ff !important;
      background-color: #e6f7ff;
    }

    &.ant-picker-cell-selected {
      .ant-picker-cell-inner {
        color: #fff !important;
        background: #1890ff;
      }
    }
  }
  </style>
```

md, 改来改去一直没对，结果过来写记录，捋一下就行了？
```css
// .no-selected {
//   :deep(.ant-picker-cell-selected) {
//     & .ant-picker-calendar-date-value {
//       color: rgb(0 0 0 / 85%);
//       background: #fff !important;
//     }

//     &.ant-picker-cell-today .ant-picker-calendar-date-value {
//       color: #1890ff !important;
//       background: #e6f7ff !important;
//       border-color: #e6f7ff !important;
//     }
//   }
// }

// :deep(.ant-picker-cell-in-view.ant-picker-cell-today) {
//   .ant-picker-cell-inner {
//     color: #1890ff !important;
//     background-color: #e6f7ff;
//   }

//   &.ant-picker-cell-selected {
//     .ant-picker-cell-inner {
//       color: #fff !important;
//       background: #1890ff;
//     }
//   }
// }

.no-selected {
  :deep(.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner) {
    color: rgb(0 0 0 / 85%);
    background: #fff;
  }
}
```

——————————————

新要求，要求选择日期范围，不是单个日期

通过js点击事件来实现

1. 首先监听按下鼠标按钮事件，获取当前焦点所在日期，当做开始日期
2. 监听松开鼠标按钮时间，获取当前焦点所在日期，当做结束日期

此时可能会有个问题：拖拽过程看不到动态效果，只能显式一个终态。
那我们需要监听鼠标拖拽事件
1. 首先监听按下鼠标按钮事件，获取当前焦点所在日期，当做开始日期
2. 监听鼠标拖拽事件，获取焦点，当做结束日期。
3. 监听鼠标松开时间，取消监听鼠标移动事件
4. 需要加防抖

---------开始

1. 首先定义开始日期`startDate`和结束日期`endDate`
   ```javascript
   + const startDate = ref(undefined)
   + const endDate = ref(undefined)
   ```
2. 添加id
    ```html
      <ACalendar
        id="calendar"
        :fullscreen="false"
        :disabled-date="disabledDate"
        :class="{ 'no-selected': !calendarValue, 'selected': !!calendarValue"
      >
    ```
3. 在文档加载完获取日历整个元素对象, 绑定`mousedown`事件
   ```js
     import { onMounted } from 'vue'
     onMounted(() => {
       const calendarEl = document.getElementById('calendar')
     })
   ```
4. 绑定`mousedown`事件
    ```html
      <div
        :title="current.format('YYYY-MM-DD')"
        class="ant-picker-calendar-date-value"
      >
        {{ current.format('DD') }}
      </div>
    ```

    ```js
      import { debounce } from 'lodash'
      onMounted(() => {
        const calendarEl = document.getElementById('calendar')
        const mousemoveHandler = debounce(e => {
          endDate.value = e.target.title
        }, 300)

        calendarEl.addEventListener('mousedown', e => {
          startDate.value = e.target.title
          calendarEl.addEventListener('mousemove', mousemoveHandler)
        })
      })
    ```
5. 绑定`mouseup`事件
    ```js
      onMounted(() => {
        const calendarEl = document.getElementById('calendar')
        const mousemoveHandler = debounce(e => {
          endDate.value = e.target.title
        }, 300)

        calendarEl.addEventListener('mousedown', e => {
          startDate.value = e.target.title
          calendarEl.addEventListener('mousemove', mousemoveHandler)
        })

        calendarEl.addEventListener('mouseup', e => {
          calendarEl.removeEventListener('mousemove', mousemoveHandler)
        })
      })
    ```
6. 因为`endDate`有小于在`startDate`前面，所以添加`mouseDownDate`和`mouseUpDate`来从事件获取时间
   ```js
     + const startDate = ref(undefined)
     + const endDate = ref(undefined)
     + const mouseDownDate = ref(undefined)
     + const mouseUpDate = ref(undefined)
     onMounted(() => {
        const calendarEl = document.getElementById('calendar')
        const mousemoveHandler = debounce(e => {
          mouseUpDate.value = e.target.title
        }, 300)

        calendarEl.addEventListener('mousedown', e => {
          mouseDownDate.value = e.target.title
          mouseUpDate.value = undefined
          calendarEl.addEventListener('mousemove', mousemoveHandler)
        })

        calendarEl.addEventListener('mouseup', e => {
          calendarEl.removeEventListener('mousemove', mousemoveHandler)
        })
    })
   ```
7. 通过逻辑判断来对startDate和endDate赋值
   ```js
    const mousemoveHandler = debounce(e => {
      mouseUpDate.value = e.target.title
      if (mouseDownDate.value < mouseUpDate.value) {
        startDate.value = mouseDownDate.value
        endDate.value = mouseUpDate.value
      } else {
        startDate.value = mouseUpDate.value
        endDate.value = mouseDownDate.value
      }
      console.log(startDate.value, endDate.value)
    }, 300)
   ```

8. 虽然参数取`mouseUpDate`，但是是在mousemove获取值的，记录的是鼠标移动的点。所以只点击，不移动鼠标，得不到`mouseUpDate`的值，需要在mouseup时间中获取松开鼠标点击的值。
   
   那我们用`mouseMoveDate`来代替`mouseUpDate`，用原来的`mouseUpdate`来存储`mouseUp`事件位置上的日期。
   
   而且获取开始日期和结束日期的逻辑函数要改。

   如果`mouseDownDate`是空，则不做处理，直接返回。因为首次点击就没有获取到日期。
   那如果`mouseUpdate`也是空，即鼠标滑出了日历，那此次滑动还有效么？我们看看ant-design的组件pick-date组件。

-------
oh，天呢。这个组件好像要点击两次才能获取到时间，是click一次作为日期1，click第二次作为日期2。

擦，我得重来！！！！！！
-------
   
先看下ant-design的pick-date组件处理。


既然这样，就得用到vue的click事件了。

1. 点击日期......

擦，不行
---------

两种方案
1. 一次mousedown和一次mouseup来确定日期范围
2. 两次mousedown和两次mouseup来确定日期范围，
   第一次down和up确定日期1，并且监听move事件
   第二次down和up确定日期2，取消move监听事件。
   
   但是这种方案有两个弊端
   1. 只选一天时，比方案一多点一次click
   2. 没法通过点击已选择日期来取消日期选择，来查询全部日报


我决定选择方案2

1. 定义两次选择日期``

不选了，我先把第一种方案实现
------


9. 只要`mouseDownDate`或者`mouseUpDate`是空，则不做处理，直接返回（原来的开始时间和结束时间不变）
    ```js
    const mouseDownDate = ref(undefined)
    const mouseUpDate = ref(undefined)
    const startDate = ref(undefined)
    const endDate = ref(undefined)

    const cal = () => {
      if (!mouseDownDate.value || !mouseUpDate.value) {
        return
      }
      calendarValue.value = undefined
      if (mouseDownDate.value < mouseUpDate.value) {
        startDate.value = mouseDownDate.value
        endDate.value = mouseUpDate.value
      } else {
        startDate.value = mouseUpDate.value
        endDate.value = mouseDownDate.value
      }
      console.log(startDate.value, endDate.value)
    }

    onMounted(() => {
      const calendarEl = document.getElementById('calendar')
      const mousemoveHandler = debounce(e => {
        mouseUpDate.value = e.target.title
        cal()
      }, 300)

      calendarEl.addEventListener('mousedown', e => {
        mouseDownDate.value = e.target.title
        mouseUpDate.value = undefined
        calendarEl.addEventListener('mousemove', mousemoveHandler)
      })

      calendarEl.addEventListener('mouseup', e => {
        calendarEl.removeEventListener('mousemove', mousemoveHandler)
        mouseUpDate.value = e.target.title
        cal()
      })
    })
    ```

10. 处理下拖拽选中
    ```css
    #calendar {
      user-select: none;
    }
    ```

11. 添加选中样式
    ```css
    .middle-date,
    .start-date,
    .end-date {
      color: #fff;
      background: #1890ff;
      border-radius: 4px;
    }
    ```
    ```html
    <div
      :title="current.format('YYYY-MM-DD')"
      :class="{
        'ant-picker-calendar-date-value': true,
        'start-date': current.format('YYYY-MM-DD') === startDate,
        'end-date': current.format('YYYY-MM-DD') === endDate,
        'middle-date': (current.format('YYYY-MM-DD') > startDate) && (current.format('YYYY-MM-DD') < endDate)
      }"
    >
      {{ current.format('DD') }}
    </div>
    ```

  

坏消息！坏消息！
--------------
业务和垃圾产品确定了，要两次点击确认时间范围

   
好的，我们确认下方案。

我们需要确认三个时机

1. 对日期1赋值
2. 对日期2赋值
3. 监听mousemove事件
4. 取消监听mousemove事件

两个方案进行下对比


| 功能 | 方案一实现实现点 | 方案二实现时间点
| ----- | ---------------- | ---------|
| 对日期1赋值 |  通过监听mousedown，鼠标按下后赋值 | 第一次click事件后赋值
| 对日期2赋值 |  1. 通过监听mouseup，鼠标松开后赋值 2. 监听mousemove，防抖赋值| 1. 第二次click事件后赋值 2. mousemove时间防抖赋值
| 监听mousemove事件 | 鼠标按下后监听 | 第一次click事件后监听
| 取消监听mousemove事件 | 鼠标松开后取消监听 |第二次click事件后取消监听


> 2023-08-24
我把跟日期相关的操作放到一个js文件中了
```js
import dayjs from 'dayjs'
import { onMounted } from 'vue'
import { useDateStore } from '@/stores/date.js'

export default function useDateRange (emit) {
  const date = useDateStore()
  const firstClickDate = ref(undefined)
  const secondClickDate = ref(undefined)
  const mouseMoveDate = ref(undefined)
  const startDate = ref(undefined)
  const endDate = ref(undefined)
  const calendarStartDate = computed(() => {
    const date1 = firstClickDate.value || startDate.value
    const date2 = secondClickDate.value || mouseMoveDate.value || endDate.value
    return date1 < date2 ? date1 : date2
  })
  const calendarEndDate = computed(() => {
    const date1 = firstClickDate.value || startDate.value
    const date2 = secondClickDate.value || mouseMoveDate.value || endDate.value
    return date1 < date2 ? date2 : date1
  })

  const cal = () => {
    if (!firstClickDate.value || !secondClickDate.value) {
      return
    }
    if (firstClickDate.value < secondClickDate.value) {
      startDate.value = firstClickDate.value
      endDate.value = secondClickDate.value
    } else {
      startDate.value = secondClickDate.value
      endDate.value = firstClickDate.value
    }
    date.setSelectedDate(dayjs(endDate.value))
    emit('selectedDateChange', [dayjs(startDate.value), dayjs(endDate.value)])
    firstClickDate.value = undefined
    secondClickDate.value = undefined
    mouseMoveDate.value = undefined
  }

  let calendarEl
  const mousemoveHandler = e => {
    mouseMoveDate.value = e.target.title
  }

  const mouseleaveHandler = e => {
    calendarEl.removeEventListener('mousemove', mousemoveHandler)
    firstClickDate.value = undefined
    secondClickDate.value = undefined
    mouseMoveDate.value = undefined
  }

  onMounted(() => {
    calendarEl = document.getElementById('calendar').querySelector('.ant-picker-body tbody')
    calendarEl.addEventListener('mouseleave', mouseleaveHandler)
  })

  function changeDate (date) {
    if (!firstClickDate.value) {
      mouseMoveDate.value = date.format('YYYY-MM-DD')
      firstClickDate.value = date.format('YYYY-MM-DD')
      secondClickDate.value = undefined
      calendarEl.addEventListener('mousemove', mousemoveHandler)
    } else {
      calendarEl.removeEventListener('mousemove', mousemoveHandler)
      secondClickDate.value = date.format('YYYY-MM-DD')
      cal()
    }
  }

  function unset () {
    firstClickDate.value = undefined
    secondClickDate.value = undefined
    mouseMoveDate.value = undefined
    startDate.value = undefined
    endDate.value = undefined
    emit('selectedDateChange', [undefined, undefined])
  }

  onBeforeUnmount(() => {
    calendarEl.removeEventListener('mousemove', mousemoveHandler)
  })

  return {
    changeDate,
    firstClickDate,
    secondClickDate,
    mouseMoveDate,
    startDate,
    endDate,
    calendarStartDate,
    calendarEndDate,
    unset
  }
}
```


上面的click不太灵敏，日期元素宽高太小，导致外边缘点击无效。

```js
// click 处理操作
const clickHandler = e => {
  changeDate(e.target.title)
}

onMounted(() => {
  calendarEl = document.getElementById('calendar').querySelector('.ant-picker-body tbody')
  calendarEl.addEventListener('click', clickHandler)  // 添加click监听
  calendarEl.addEventListener('mouseleave', mouseleaveHandler)
})

function changeDate (date) {
  if (!firstClickDate.value) {
    mouseMoveDate.value = date   // 赋值修改
    firstClickDate.value = date  // 赋值修改
    secondClickDate.value = undefined
    calendarEl.addEventListener('mousemove', mousemoveHandler)
  } else {
    calendarEl.removeEventListener('mousemove', mousemoveHandler)
    secondClickDate.value = date  // 赋值修改
    cal()
  }
}

onBeforeUnmount(() => {
  calendarEl.removeEventListener('mouseleave', mouseleaveHandler)
  calendarEl.removeEventListener('mousemove', mousemoveHandler)
  calendarEl.removeEventListener('click', clickHandler)  // 离开页面取消监听
})
```

功能完成，撒花🎉🎉🎉
--------



