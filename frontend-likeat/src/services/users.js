import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/likeat/users`

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`
  }
})

// Profile Management
export const getProfile = async () => {
  const response = await axios.get(`${baseUrl}/profile`, getAuthConfig())
  return response.data
}

export const updateUser = async (updateData) => {
  await axios.put(`${baseUrl}/update`, updateData, getAuthConfig())
}

export const changePassword = async (passwordData) => {
  await axios.patch(`${baseUrl}/change-password`, passwordData, getAuthConfig())
}

// User Deletion
export const deleteClient = async () => {
  const response = await axios.delete(`${baseUrl}/client`, getAuthConfig())
  return response.data
}

export const deleteCustomer = async () => {
  const response = await axios.delete(`${baseUrl}/customer`, getAuthConfig())
  return response.data
}

export const deleteAdmin = async () => {
  const response = await axios.delete(`${baseUrl}/admin`, getAuthConfig())
  return response.data
}

// Dashboard Views
export const getAdmins = async () => {
  const response = await axios.get(`${baseUrl}/admins`, getAuthConfig())
  return response.data
}

export const getClients = async () => {
  const response = await axios.get(`${baseUrl}/clients`, getAuthConfig())
  return response.data
}

export const getCustomers = async () => {
  const response = await axios.get(`${baseUrl}/customers`, getAuthConfig())
  return response.data
}

// Dashboard Delete
export const deleteAdminById = async (id) => {
  const response = await axios.delete(`${baseUrl}/admin/${id}`, getAuthConfig())
  return response.data
}

export const deleteClientById = async (id) => {
  const response = await axios.delete(`${baseUrl}/client/${id}`, getAuthConfig())
  return response.data
}

export const deleteCustomerById = async (id) => {
  const response = await axios.delete(`${baseUrl}/customer/${id}`, getAuthConfig())
  return response.data
}

// User Details
export const getUserById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`, getAuthConfig())
  return response.data
}