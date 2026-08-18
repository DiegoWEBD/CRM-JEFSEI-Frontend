import axios from 'axios'

export const axiosClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
})

axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject(error)
	},
)
