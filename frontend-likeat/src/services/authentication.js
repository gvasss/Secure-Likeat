import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_API_BASE_URL }/likeat/auth`

const authenticate = async (usernameAndPassword) => {
    try {
        const response = await axios.post(
            `${baseUrl}/authenticate`,
            usernameAndPassword
        );
        return response;
    } catch (error) {
        console.error("Authentication error:", error);
        throw error;
    }
}

const register = async (user) => {
    try {
        const response = await axios.post(
            `${baseUrl}/register`,
            user
        );
        return response;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}

export default {
    authenticate,
    register
}