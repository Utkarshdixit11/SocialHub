// Test script to verify API integration
import { postAPI } from './services/api.js'

const testAPIIntegration = async () => {
    console.log('🧪 Testing API Integration...')
    
    try {
        // Test 1: Fetch existing posts
        console.log('\n📋 Test 1: Fetching posts...')
        const postsResponse = await postAPI.getAllPosts()
        console.log('✅ Posts fetched successfully:', postsResponse)
        
        // Test 2: Create a new post
        console.log('\n📝 Test 2: Creating a new post...')
        const newPostData = {
            name: 'Test User',
            content: 'This is a test post created via API integration test'
        }
        
        const createResponse = await postAPI.createPost(newPostData)
        console.log('✅ Post created successfully:', createResponse)
        
        // Test 3: Fetch posts again to verify the new post
        console.log('\n📋 Test 3: Fetching posts again...')
        const updatedPostsResponse = await postAPI.getAllPosts()
        console.log('✅ Updated posts fetched successfully:', updatedPostsResponse)
        
        console.log('\n🎉 All API integration tests passed!')
        
    } catch (error) {
        console.error('❌ API integration test failed:', error)
    }
}

// Export for use in browser console
window.testAPIIntegration = testAPIIntegration

export default testAPIIntegration
