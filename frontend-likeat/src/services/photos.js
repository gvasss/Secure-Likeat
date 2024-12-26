import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/likeat/photos`

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`
  }
})

export const addPhoto = async (restaurantId, mainImage, additionalImages) => {
  try {
    const formData = new FormData()
  
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }
    
    if (additionalImages && additionalImages.length > 0) {
      additionalImages.forEach((image) => {
        formData.append(`additionalImage`, image);
      });
    }

    const response = await axios.post(`${baseUrl}/restaurant/${restaurantId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
    });
    return response.data
  } catch (error) {
    console.error('Error adding the photo', error.response ? error.response.data : error.message)
    return error.response ? error.response.data : error.message
  }
}

export const deletePhoto = async (photoId) => {
  await axios.delete(`${baseUrl}/${photoId}`, getAuthConfig())
}