import axios from 'axios'

const API = axios.create({
    baseURL: `http://localhost:3000/`,
    withCredentials: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
})

export default API;
