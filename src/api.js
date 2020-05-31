import axios from 'axios'

const API = axios.create({
    baseURL: `http://192.168.0.103:3000`,
    withCredentials: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
})

export default API;
