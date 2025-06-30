import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Blog } from './pages/Blog'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Blogs } from './pages/Blogs'
import Publish from './pages/Publish'
import LandingPage from './pages/LandingPage'
import Profile from './pages/Profile'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import EditBlog from './pages/EditBlog'
import MyBlogs from './pages/MyBlogs'
import Drafts from './pages/Drafts'

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/blog/:id' element={<Blog/>}/>
          <Route path='/blogs' element={<Blogs/>}/>
          <Route path='/publish' element={<Publish/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/my-blogs' element={<MyBlogs/>}/>
          <Route path='/drafts' element={<Drafts/>}/>
          <Route path='/edit/:id' element={<EditBlog/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App