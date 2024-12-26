import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/likeat/reviews`

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`
  }
})

export const addReview = async (newReview) => {
  const response = await axios.post(`${baseUrl}`, newReview, getAuthConfig())
  return response.data
}

export const getAllReviews = async () => {
  const response = await axios.get(`${baseUrl}`, getAuthConfig())
  return response.data
}

export const getReviewById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, getAuthConfig())
  return response.data
}

export const deleteReview = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getAuthConfig())
  return response.data
}

export const getCustomerReviews = async () => {
  const response = await axios.get(`${baseUrl}/customer`, getAuthConfig())
  return response.data
}

export const getRestaurantReviews = async (id) => {
  const response = await axios.get(`${baseUrl}/restaurant/${id}`, getAuthConfig())
  return response.data
}