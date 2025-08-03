// Test script to verify authentication API integration
import { userAPI } from './services/api.js'

const testAuthIntegration = async () => {
    console.log('🧪 Testing Authentication API Integration...')
    
    try {
        // Test 1: Try to register a new user
        console.log('\n📝 Test 1: User Registration...')
        const testUser = {
            name: 'Test User Frontend',
            email: 'testfrontend@example.com',
            password: 'testpass123'
        }
        
        try {
            const registerResponse = await userAPI.register(testUser)
            console.log('✅ Registration successful:', registerResponse)
        } catch (error) {
            console.log('⚠️ Registration failed (might be expected if user exists):', error.message)
        }
        
        // Test 2: Try to login with the user
        console.log('\n🔐 Test 2: User Login...')
        try {
            const loginResponse = await userAPI.login({
                email: testUser.email,
                password: testUser.password
            })
            console.log('✅ Login successful:', loginResponse)
        } catch (error) {
            console.log('❌ Login failed:', error.message)
        }
        
        // Test 3: Test with wrong credentials
        console.log('\n🚫 Test 3: Login with wrong credentials...')
        try {
            const wrongLoginResponse = await userAPI.login({
                email: testUser.email,
                password: 'wrongpassword'
            })
            console.log('❌ This should not succeed:', wrongLoginResponse)
        } catch (error) {
            console.log('✅ Correctly rejected wrong credentials:', error.message)
        }
        
        console.log('\n🎉 Authentication API integration tests completed!')
        
    } catch (error) {
        console.error('❌ Authentication integration test failed:', error)
    }
}

// Export for use in browser console
window.testAuthIntegration = testAuthIntegration

export default testAuthIntegration
