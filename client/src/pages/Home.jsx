import React, { useState, useEffect } from 'react'

import { Loader, FormField, Card } from '../components'
import { ThemeContext } from '../App'

const RenderCards = ({ data, title }) => {
    if (data?.length > 0) {
        return data.map((post) => <Card key={post._id} {...post} />)
    }
    return (
        <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>
            {title}
        </h2>
    )
}

const Home = () => {
    const theme = React.useContext(ThemeContext)
    const [loading, setLoading] = useState(false)
    const [allPosts, setAllPosts] = useState(null)

    const [searchText, setSearchText] = useState('')
    const [searchedResults, setSearchedResults] = useState(null)
    const [searchTimeout, setSearchTimeout] = useState(null)

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            const baseURL = 'https://dall-e-api-h45e.onrender.com/api/v1/post'
            try {
                console.log(import.meta.env)
                const response = await fetch(baseURL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if (response.ok) {
                    const result = await response.json()

                    setAllPosts(result.data.reverse())
                }
            } catch (error) {
                alert("Error")
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout)
        setSearchText(e.target.value)
        setSearchTimeout(
            setTimeout(() => {
                const searchResults = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase())
                    || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
                console.log(searchResults, searchText)
                setSearchedResults(searchResults)
            }, 500)
        )
    }

    return (
        <section className='max-w-7xl mx-auto p-5 rounded-xl dark:bg-black'>
            <div>
                <h1 className={`font-extrabold text-[#222328] text-[28px] dark:text-white`}>
                    The community showcase
                </h1>
                <p className={`mt-2 text-[#666e75] text-[16px] max-w[500px] dark:text-white`}>
                    Browse through a collection of visually stunning image generated by DALL-E AI
                </p>
            </div>
            <div className='mt-16'>
                <FormField
                    labelName='Search posts'
                    type='text'
                    name='text'
                    placeholder='Search posts'
                    value={searchText}
                    handleChange={handleSearchChange}
                />
            </div>
            <div className='mt-10'>
                {loading ?
                    (
                        <div className='flex justify-center'>
                            <Loader />
                        </div>
                    ) : (
                        <>
                            {searchText && (
                                <h2 className='font-medium text-[#666e75] text-xl mb-3'>
                                    Showing result for <span className='text-[#222328]'>{searchText}</span>
                                </h2>
                            )}
                            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
                                {
                                    searchText ? (
                                        <RenderCards data={searchedResults} title="No search results found" />
                                    ) : (
                                        <RenderCards data={allPosts} title="No posts found" />
                                    )
                                }
                            </div>
                        </>
                    )}
            </div>
        </section>
    )
}

export default Home