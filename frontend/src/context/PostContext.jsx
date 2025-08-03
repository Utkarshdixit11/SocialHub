import React, { createContext, useContext, useState, useEffect } from 'react'
import { people } from '../assets/assets.js'
import { postAPI } from '../services/api.js'

const PostContext = createContext()

export const usePost = () => {
    const context = useContext(PostContext)
    if (!context) {
        throw new Error('usePost must be used within a PostProvider')
    }
    return context
}

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Load posts from API on component mount
    useEffect(() => {
        fetchPosts()
    }, [])

    // Fetch posts from backend API
    const fetchPosts = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await postAPI.getAllPosts()

            if (response.success) {
                // Transform backend posts to match frontend format
                const transformedPosts = response.data.map(post => ({
                    _id: post._id,
                    name: post.name,
                    content: post.content,
                    date: new Date(post.date).toISOString().split('T')[0],
                    time: new Date(post.date).toTimeString().split(' ')[0],
                    likes: post.likes || 0,
                    comments: post.comments || [],
                    likedBy: post.likedBy || []
                }))

                setPosts(transformedPosts)
            } else {
                throw new Error(response.message || 'Failed to fetch posts')
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
            setError(error.message)
            // Fallback to default data if API fails
            setPosts(people)
        } finally {
            setIsLoading(false)
        }
    }

    const createPost = async (postData) => {
        try {
            setIsLoading(true)
            setError(null)

            // Send post to backend API
            const response = await postAPI.createPost({
                name: postData.name,
                content: postData.content
            })

            if (response.success) {
                // Refresh posts from backend to get the latest data
                await fetchPosts()
                return response
            } else {
                throw new Error(response.message || 'Failed to create post')
            }
        } catch (error) {
            console.error('Error creating post:', error)
            setError(error.message)
            throw new Error(error.message || 'Failed to create post')
        } finally {
            setIsLoading(false)
        }
    }

    const likePost = (postId, userId) => {
        setPosts(prevPosts => 
            prevPosts.map(post => {
                if (post._id === postId) {
                    const isLiked = post.likedBy?.includes(userId)
                    return {
                        ...post,
                        likes: isLiked ? (post.likes || 1) - 1 : (post.likes || 0) + 1,
                        likedBy: isLiked 
                            ? post.likedBy.filter(id => id !== userId)
                            : [...(post.likedBy || []), userId]
                    }
                }
                return post
            })
        )
    }

    const addComment = (postId, comment) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post._id === postId) {
                    return {
                        ...post,
                        comments: [...(post.comments || []), {
                            id: Date.now().toString(),
                            text: comment.text,
                            author: comment.author,
                            timestamp: new Date().toISOString()
                        }]
                    }
                }
                return post
            })
        )
    }

    const deletePost = (postId) => {
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId))
    }

    const value = {
        posts,
        createPost,
        likePost,
        addComment,
        deletePost,
        isLoading,
        setIsLoading,
        error,
        setError,
        fetchPosts
    }

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    )
}
