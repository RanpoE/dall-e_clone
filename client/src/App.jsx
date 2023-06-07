
import { logo } from './assets'
import React from 'react'
import { useState } from 'react'
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import { nightmode, lightmode } from './assets'
import { Home, CreatePost, GptPrompt } from './pages'

export const ThemeContext = React.createContext()

const App = () => {
  const [light, setLight] = useState(true)
  const handleChangeTheme = () => setLight(!light)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ThemeContext.Provider value={light}>
      <BrowserRouter>
        <header className='flex p-6 justify-between items-center
        xl:max-w-7xl mx-auto max-w-full px-[5%] flex-wrap w-full'>
          <Link to="/">
            <img src={logo} alt='logo' className='w-28 object-contain' />
          </Link>
          {/* <button type='button' onClick={handleChangeTheme}>
            <img
              className='w-9 h-9'
              src={light ? lightmode : nightmode}
              alt='Night mode'
            />
          </button> */}
          {/* <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link to="/create-post" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md" >
                  Create
                </Link>
              </li>
              <li>
                <Link to="/gpt-chat" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md" >
                  Chat
                </Link>
              </li>
            </ul>
          </div> */}
          <div className='lg:hidden block' onClick={() => setIsOpen(prev => !prev)}>
            {isOpen ? <span className='font-bold'>X</span> : <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd">
              </path></svg>}
          </div>
          <nav className={`${isOpen ? "block" : "hidden"} w-full lg:flex lg:justify-evenly lg:w-auto`} >
            <ul className='text-base text-gray-600 lg:flex lg:justify-between'>
              <li>
                <Link to="/create-post" className='lg:px-5 py-2 block hover:text-blue-700 font-sm
                '>Create</Link>
              </li>
              <li>
                <Link to="/gpt-chat" className="lg:px-5 py-2 block hover:text-blue-700 font-sm
                ">Chat</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className='sm:p-8 px-4 pb-20 w-full bg-[#f9fafe] h-screen'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/gpt-chat' element={<GptPrompt />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}

export default App
