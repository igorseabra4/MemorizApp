import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './pages/Header'
import Collections from './pages/Collections'
import Registration from './pages/Registration'
import Collection from './pages/Collection'
import Home from './pages/Home'
import CollectionStudy from './pages/CollectionStudy'
import { useEffect, useState } from 'react'
import axios from 'axios'
import token from './util/auth'

function App() {
  useEffect(() => {
    document.title = 'MemorizApp';
  }, []);

  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    if (token)
      axios.get(`http://localhost:3001/auth`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        setIsLogged(true)
      }).catch(res => {
        setIsLogged(false)
      })
    else
      setIsLogged(false)
  }, [])

  return (
    <div>
      <Header isLogged={isLogged} setIsLogged={setIsLogged} />
      <main>
        <Routes>
          <Route path='/' element={<Home isLogged={isLogged} setIsLogged={setIsLogged} />} />
          <Route path='/collections' element={<Collections />} />
          <Route path='/collections/:idCollection' element={<Collection />} />
          <Route path='/collections/:idCollection/study' element={<CollectionStudy />} />
          <Route path='/registration' element={<Registration isLogin={false} setIsLogged={setIsLogged} />} />
          <Route path='/login' element={<Registration isLogin={true} setIsLogged={setIsLogged} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App