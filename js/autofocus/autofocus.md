# autofocus
>2023-08-17 晴

autofocus是html的全局属性（全局属性是html元素共有的属性，可以用于所有的元素，即使有些属性可能对某些元素不起作用）
autofocus是一个布尔属性，如果一个元素添加该属性表示此元素在页面加载后需要被聚焦。

如果一个页面多个元素有autofocus属性，那只有第一个属性会自动聚焦。

1. 让input获焦
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <div>
        <input autofocus/>
      </div>
    </body>
    </html>
    ```
    [获焦](./images/autofocus-img1.png)


2. 两个input框只有第一个会聚焦
   ```html
    <body>
      <div>
        <input autofocus/>
      </div>
      <div>
        <input autofocus/>
      </div>
    </body>
   ```
    [获焦](./images/autofocus-img2.png)

3. vue+ant-design中input组件聚焦
   > 我为什么要写一个vue加ant-design的input聚焦呢
   > 因为在做日报项目的时候，直接在a-input上添加autofocus没作用
   > 我还以为autofocus没直接加载input上
   > 还想整完这个再看看react+antd的input该怎么聚焦
   > 结果在简单的文件中，直接添加autofocus就搞定了
   > md
   > 我去看一下日报那个项目为什么没成功
   ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
      <script src="https://unpkg.com/dayjs/dayjs.min.js"></script>
      <script src="https://unpkg.com/dayjs/plugin/customParseFormat.js"></script>
      <script src="https://unpkg.com/dayjs/plugin/weekday.js"></script>
      <script src="https://unpkg.com/dayjs/plugin/localeData.js"></script>
      <script src="https://unpkg.com/dayjs/plugin/weekOfYear.js"></script>
      <script src="https://unpkg.com/dayjs/plugin/weekYear.js"></script>
      <script src="https://unpkg.com/dayjs/plugin/advancedFormat.js"></script>
      <script src="https://unpkg.com/dayjs/plugin/quarterOfYear.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/ant-design-vue@4.0.0/dist/antd.min.js"></script>
      <link href="https://cdn.jsdelivr.net/npm/ant-design-vue@4.0.0/dist/reset.min.css" rel="stylesheet">
      <title>Document</title>
    </head>
    <body>
      <div id="app">
        <span>{{ message }}</span>
        <div style="width: 200px;margin-top: 24px;">
          <a-input v-model:value="message" autofocus></a-input>
        </div>
      </div>
    </body>
    </html>
    <script>
      const { createApp, ref } = Vue
      const { Input } = antd

      createApp({
        setup() {
          const message = ref('Hello vue!')
          return {
            message
          }
        },
        components: {
          'a-input': Input
        }
      }).mount('#app')
    </script>
   ```
