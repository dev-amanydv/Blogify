import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Blog } from './pages/Blog'
import './App.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import { Blogs } from './pages/Blogs'
import { Publish } from './pages/Publish'
import LandingPage from './pages/LandingPage'
import Profile from './pages/Profile'
import AuthorsProfile from './pages/AuthorsProfile'


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/blog/:id' element={<Blog/>}/>
        <Route path='/blogs' element={<Blogs/>}/>
        <Route path='/publish' element={<Publish/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/authorsprofile/:id' element={<AuthorsProfile/>}/>
      </Routes>
    </BrowserRouter>
      <div>
       
      </div>
    </>
  )
}

export default App
