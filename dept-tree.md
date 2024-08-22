1. 关于树的子节点折叠展开动画涉及到的height问题
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