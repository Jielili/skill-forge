> 2023-08-09

# eslint

1. add eslint
   ```bash
   pnpm add eslint -D
   ```

2. eslint init
   ```bash
   pnpx eslint --init
   ```
   初始化eslint
   依次选择  
   install @eslint/create-config --- y 
   module of project --- esm (import/export)
   framework --- react
   wheather use typescript --- no
   code run --- browser
   format of file --- Javascript
   install package --- yes
   package manager --- pnpm

   ```javascript
    module.exports = {
        "env": {
            "browser": true, // 指定代码在浏览器环境运行，允许使用浏览器相关的全局变量和API
            "es2021": true // 启用es2021特性
        },
        "extends": [
            "eslint:recommended", // 继承ESLint推荐的规则集，包括一些常见的代码规则
            "plugin:react/recommended" // 继承react插件的推荐规则
        ],
        "overrides": [   // 覆盖，用于为特定文件或文件类型设置不同的规则
            {
                "env": {
                    "node": true
                },
                "files": [  // 对于这个文件夹里的文件，运行环境为node环境
                    ".eslintrc.{js,cjs}"  
                ],
                "parserOptions": {    
                    "sourceType": "script"  // 文件被视为脚本文件，不是模块
                }
            }
        ],
        "parserOptions": {
            "ecmaVersion": "latest", // 指定支持的ECMAScript版本为最新版本，表示可以使用最新的JavaScript特性
            "sourceType": "module"   // 指定代码以模块方式运行
        },
        "plugins": [
            "react"   // 启用React插件，应用React相关的规则
        ],
        "rules": {  // 自己配置规则
        }
    }
   ```
3. add 
   ```bash
   pnpm add eslint-plugin-react-hooks -D
   ```
   add extend
   ```javascript
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"  // 检车Hooks的使用，如Hooks的调用顺序，Hooks的依赖项
    ],
   ```
   发现一个错误---error 2


4. 尝试添加下 eslint-plugin-import

   eslint-plugin-import是一个eslint插件，专门用于处理JavaScript中的导入和导出语句，还有文件路径的解析。

   ```bash
   pnpm install eslint-plugin-import -D
   ```

   ```javascript
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:import/recommended"
    ],
    ``````
    error1


> 2023-08-10
5. 添加 eslint-config-airbnb
   ```bash
     pnpm add eslint-config-airbnb -D

     // eslint-config-airbnb 依赖 eslint-plugin-import， 所以不用单独安装eslint-plugin-import
     pnpm remove eslint-plugin-import
   ```

   ```javascript
    extends: [
      'airbnb',
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ],
    rules: {
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'import/extensions': ['error', 'ignorePackages', {
        js: 'ignorePackages',
        jsx: 'ignorePackages'
      }]
    }
   ```





# error  
1. Unable to resolve path to module './App'.eslintimport/no-unresolved
    ```javascript
    import App from './App'
    ```
    > 2023-08-10
      1. 第一次尝试---失败 
         ```javascript 
         "rules": {
            'import/extensions': ['error', 'always', {ignorePackages: true} ],
         }
         ```
      结果
      Missing file extension for "./App" eslintimport/extensions
      Unable to resolve path to module './App'.eslintimport/no-unresolved

      放弃 

      直接改 import方式
      ```javascript
      import App from './App.jsx'
      ```

2. ReactDOM.render is deprecated since React 18.0.0, use createRoot instead, see https://reactjs.org/link/switch-to-createrooteslintreact/no-deprecated
   
   done
   ```javascript
    import React from 'react'
    import { createRoot} from 'react-dom/client'
    import App from './App.jsx'

    const rootElement = document.getElementById('root')
    const root = createRoot(rootElement)
    root.render(<App />)
   ```

3. Unexpected use of file extension "jsx" for "./App.jsx" eslintimport/extensions
module "/Users/lili.jie/project/workspace/react/react-template/src/App"
   done 
   ```javascript
   rules: {
      semi: ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'import/extensions': ['error', 'ignorePackages', {
        js: 'ignorePackages',
        jsx: 'ignorePackages'
      }]
    }
   ```
   
没有后缀的问题

1. [eslint-config](https://www.npmjs.com/search?q=eslint-config)