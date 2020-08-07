import axios from 'axios'

const baseURL = 'http://47.96.133.203:8080'

// httpGET('/pighouses').then().catch()
// https://www.runoob.com/vue2/vuejs-ajax-axios.html
export const httpGET = url => {
  return axios.get(`${baseURL}${url}`)
}

// axios
//   .get('https://api.coindesk.com/v1/bpi/currentprice.json')
//   .then(response => (this.info = response.data.bpi))
//   .catch(error => console.log(error))

// params: {a: b, c: d}
export const httpPOST = (url, params) => {
  return axios.post(`${baseURL}${url}`, params)
}

export const httpPUT = (url, params) => {
  return axios.put(`${baseURL}${url}`, params)
}

export const httpDELETE = (url, params) => {
  return axios.delete(`${baseURL}${url}`, params)
}

