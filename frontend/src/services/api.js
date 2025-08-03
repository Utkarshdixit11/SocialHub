import axios from 'axios'

// TODO: move this to env file
const API_BASE_URL = 'http://localhost:4000'

// setup axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
})

// add token to requests if user is logged in
apiClient.interceptors.request.use(
    (config) => {
        const userToken = localStorage.getItem('token')
        if (userToken) {
            config.headers.Authorization = `Bearer ${userToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// handle response errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API request failed:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

// posts related API calls
export const postAPI = {
    createPost: async (postData) => {
        try {
            const response = await apiClient.post('/api/post/add', postData)
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create post')
        }
    },

    getAllPosts: async () => {
        try {
            const response = await apiClient.get('/api/post/list')
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Could not fetch posts')
        }
    },
}

// user authentication stuff
export const userAPI = {
    login: async (credentials) => {
        try {
            const response = await apiClient.post('/api/user/login', credentials)

            if (response.data.success && response.data.token) {
                localStorage.setItem('token', response.data.token)
            }
            return response.data
        } catch (error) {
            console.error('Login API error:', error)
            throw new Error(error.response?.data?.message || 'Login failed')
        }
    },

    register: async (userData) => {
        try {
            const response = await apiClient.post('/api/user/register', userData)

            if (response.data.success && response.data.token) {
                localStorage.setItem('token', response.data.token)
            }
            return response.data
        } catch (error) {
            console.error('Registration API error:', error)
            throw new Error(error.response?.data?.message || 'Registration failed')
        }
    },

    logout: () => {
        // clear user data from storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },

    // TODO: implement this when we add user profile endpoint
    getCurrentUser: async () => {
        try {
            const response = await apiClient.get('/api/user/profile')
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to get user info')
        }
    },
}

export default apiClient
