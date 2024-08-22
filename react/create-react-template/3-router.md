> 2023-08-31
添加router

1. 安装 react-router-dom
   ```bash
   pnpm add react-router-dom
   ```

2. 新建router.jsx文件
   ```jsx
    import React from 'react'
    import { createBrowserRouter } from 'react-router-dom'
    import App from './App'

    const routes = [
      {
        path: '/',
        element: <App />
      }
    ]

    const router = createBrowserRouter(routes, {
      basename: '/' // 域名根目录下的部署未知
    })

    export default router
   ```

3. 在index.jsx中修改render对象
   ```jsx
    import { RouterProvider } from 'react-router-dom'
    import router from './router'
    root.render(
      <RouterProvider router={router} />
    )
   ```

4. 添加home page 和 about page
   ```jsx router.js
    import Home from './pages/Home'
    import About from './pages/About'
    const routes = [
      {
        path: '/',
        element: <App />
      },
      {
        path: 'Home',
        element: <Home />
      },
      {
        path: '/About',
        element: <About />
      }
    ]
   ```

   ```jsx /pages/Home.jsx
    import React from 'react'

    function Home() {
      return (
        <div>
          <h1>This is Home page</h1>
        </div>
      )
    }

    export default Home
   ```

   ```jsx /pages/About.jsx
    import React from 'react'

    function Home() {
      return (
        <div>
          <h1>This is About page</h1>
        </div>
      )
    }

    export default Home
   ```

5. 在App中添加一个目录，可以在App的剩余页面直接展示About和Home
   
   - 为App添加子路由children
   ```jsx  router.jsx
    const routes = [
      {
        path: '/',
        element: <App />,
        children: [
          {
            path: '/home',
            element: <Home />
          },
          {
            path: '/about',
            element: <About />
          }
        ]
      }
    ]
   ```

   - 在App页面添加目录项`<link />`，和展示子路由的组件`<Outlet />`
   ```jsx App.jsx
    import React from 'react'
    import { Link, Outlet } from 'react-router-dom'

    function App() {
      return (
        <div>
          <h1>Hello, React!</h1>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
          <Outlet />
        </div>
      )
    }
    export default App
   ```