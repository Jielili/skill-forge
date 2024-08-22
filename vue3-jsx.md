> 2023-06-14
1. vite.config.js 中需要添加代码
    ```javascript
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
      },
    ```

2. jsx 文件用需要引入 'h'
    ```javascript
      import { h, defineComponent } from "vue";
    ```

3. 如果需要用 transition, 也需要引入
    ```javascript
      import { h, Transition } from "vue";
    ```

4. 文件中添加子组件好像不支持-模式，只能是大驼峰
    ```javascript
    return () => (
      <div className={classes.tree}>
        <MyNode data={tree.value} />
      </div>
    );
    ```

5. 如果这个组件需要用自己的话，需要先定义再输出
    ```javascript
    // 定义
    const MyTree = defineComponent({
      name: "MyTree",
      props: {
        useMyself: {
          type: Boolean,
          default: true
        }
      }
      setup() {
        return () => {
          return (
            <div>
              <MyTree useMyself={ false }></MyTree>
              <span>my tree</span>
            </div>
            )
        }
      }
    })
    // export
    export default MyTree
    ```

6. 关于树的子节点折叠展开动画涉及到的height问题
  - 需要在插入动画开始前计算节点的height
  - 插入动画结束后移除height设置
  - 删除动画开始计算当前节点height，并赋值
    ```javascript
    import MyNode from "@/components/MyDeptTree/my-node.jsx";
    import classes from "./tree.module.less";
    import { h, toRefs, defineComponent, Transition } from "vue";
    const MyTree = defineComponent({
      name: "MyTree",
      props: {
        tree: {
          type: Object,
          default: () => {},
        },
      },
      setup(props) {
        const { tree } = toRefs(props);


        // 初始化子节点的height，因为子节点的子节点没展开，所以height = children.length * nodeHeight
        let height = tree.value.children.length * 22 + 'px'
        const getChildrenNodes = () => {
          if (tree.value.expand) {
            return (
              <div className={classes.children}>
                {tree.value.children.map((item) => (
                  <MyTree tree={item} />
                ))}
              </div>
            );
          }
          return null;
        };

        // 在元素插入到DOM前调用
        const onBeforeEnterHandler = (el, done) => {
          // 设置动画结束的的Height state
          el.style.height = height
        }

        // 在插入动画结束后调用
        const onAfterEnterHandler = (el) => {
          // 动画结束后移除height值，因为还可能展开子节点的子节点，这样height会变大，动画开始前设置的height就失效了
          el.style.height = 'auto'
        }

        const onBeforeLeave = （el) => {
          height = el.clientHeight + 'px'
        }

        // 在元素移除前调用
        const onBeforeLeaveHandler = (el) => {
          // 移除前设置动画开始的Height
          height = el.clientHeight + 'px'
          el.style.height = height 
        }

        return () => (
          <div className={classes.tree}>
            <MyNode data={tree.value} />
            {tree.value.children?.length > 0 && (
              <Transition
                enter-from-class={classes.out}
                leave-to-class={classes.out}
                onAfterEnter={onAfterEnterHandler} 
                onBeforeLeave={onBeforeLeaveHandler}
                onBeforeEnter={onBeforeEnterHandler}
              >
                {() => getChildrenNodes()}
              </Transition>
            )}
          </div>
        );
      },
    });
    export default MyTree;
    ```

> 2023-06-15
7. vue3 jsx 透传 slots
    ```javascript 
    <my-dept-tree v-else :tree="tree">
      <template #title="{ text }">
        <span>{{ text+'test' }}</span>
      </template>
    </my-dept-tree>
    ```

    ```javascript
    return () => (
      <div className={classes.tree}>
        <MyNode data={tree.value} loading={loading.value} onToggle={toggleHandler}>
          // 在这里这样做
          {{title : slots.title }}
        </MyNode>
        {!tree.value.isLeaf && (
          <Transition
            enter-from-class={classes.out}
            leave-to-class={classes.out}
            onAfterEnter={onAfterEnterHandler} 
            onBeforeLeave={onBeforeLeaveHandler}
            onBeforeEnter={onBeforeEnterHandler}
          >
            {() => getChildrenNodes()}
          </Transition>
        )}
      </div>
    );
    ```
    ```javascript
    return () => (
      <div className={classes.node}>
        <span className={classes["node-title"]}>
          {slots.title ? slots.title({text: data.name, record: data}) : data.name}
        </span>
      </div>
    );
    ```
    
8. 在jsx用用ant-design
    ```javascript
    import 'ant-design-vue/es/checkbox/style/index'
    const MyTree = defineComponent({
      setup() {
        const ACheckbox = resolveComponent('ACheckbox')
        return () => (<ACheckbox v-model:checked="checked1" />)
      }
    })
    ```