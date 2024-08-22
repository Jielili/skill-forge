

> 一下，currentuser 会执行两次，为什么呢
```javascript
import { useEffect, useState } from 'react'
import '@/assets/styles/App.css'
import { getCurrentUser } from '@/api/user'

const App = () => {
  const [user, setUser] = useState({})

  useEffect(() => {
    getCurrentUser().then(res => {
      setUser(res)
    })
  }, [])

  return (
    <div className="center">
      {/* <Button type="primary">Click me</Button> */}
      <div className="info">
        <div className="name">{ user.name }</div>
        <div className="emil">
          {user.email}
        </div>
      </div>
    </div>
  )
}

export default App

```

