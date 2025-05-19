import axios from 'axios'

// Obtiene la URL base y la API Key desde localStorage
export function getAxiosInstance() {
  const baseURL = localStorage.getItem('apiUrl') || ''
  const apiKey = localStorage.getItem('apiKey') || ''

//   console.log('Base URL:', baseURL)
//   console.log('API Key:', apiKey)
  
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
  })
}

// Función para acortar URL
export async function shortenUrlRequest(originalUrl: string) {
  const axiosInstance = getAxiosInstance()
  const response = await axiosInstance.post('/shorten', { original_url: originalUrl })
//   console.log(response.data)    
  return response.data
}

// Función para obtener información de una URL corta
export async function getUrlInfoRequest(shortCode: string) {
  const axiosInstance = getAxiosInstance()
  const response = await axiosInstance.get(`/info/${shortCode}`)
  return response.data
}

