import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/likeat/restaurants`

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`
  }
})

// Public endpoints
export const getAllRestaurants = async () => {
  try {
    const response = await axios.get(`${baseUrl}/home`)
    return response.data
  }
  catch (error) {
    return error.response ? error.response.data : error.message
  }
}

export const getRestaurant = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, getAuthConfig())
  return response.data
}

// Client endpoints
export const updateRestaurant = async (id, updatedRestaurant) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, updatedRestaurant, getAuthConfig())
    return response.data
  } catch (error) {
    console.error('Error updating the restaurant', error.response ? error.response.data : error.message)
    return error.response ? error.response.data : error.message
  }
}

export const deleteRestaurant = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`, getAuthConfig())
    return response.data
  } catch (error) {
    console.error('Error deleting the restaurant', error.response ? error.response.data : error.message)
    return error.response ? error.response.data : error.message
  }
}

export const getClientRestaurants = async () => {
  try {
    const response = await axios.get(`${baseUrl}/client`, getAuthConfig())
    return response.data
  }
  catch (error) {
    return error.response ? error.response.data : error.message
  }
}

export const addRestaurant = async (newRestaurant) => {
  try {
    const response = await axios.post(`${baseUrl}`, newRestaurant, getAuthConfig())
    return response.data
  } catch (error) {
    return error.response ? error.response.data : error.message
  }
}

// Admin endpoints
export const getAllRequest = async () => {
  const response = await axios.get(`${baseUrl}/request`, getAuthConfig())
  return response.data
}

export const acceptStatus = async (id) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}/statusAccept`, {}, getAuthConfig())
    return response.data
  } catch (error) {
    console.error('Error accepting the restaurant', error.response ? error.response.data : error.message)
    return error.response ? error.response.data : error.message
  }
}

export const rejectStatus = async (id) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}/statusReject`, {}, getAuthConfig())
  return response.data
  } catch (error) {
    console.error('Error rejecting the restaurant', error.response ? error.response.data : error.message)
    return error.response ? error.response.data : error.message
  }
}