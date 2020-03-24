import axios from 'axios'

let requests = axios.create({
  headers: {
    'oxo-auth': 'bad47c89c9abf1ba3a13c30d68466dfcf838ecebe30c73c32fba1929e6db3b76',
  },
  timeout: 20000 // request timeout
})

requests.interceptors.request.use(config => {
  // if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
  //   if (typeof(config.data) !== 'string' && config.headers['Content-Type'] !== 'multipart/form-data') {
  //     config.data = qs.stringify(config.data)
  //   }
  // }
  return config
}, error => {
  Promise.reject(error)
})

requests.interceptors.response.use(async response => {
  if (response.status === 200) {
    return response
  } else {
    return Promise.reject(new Error(response.data.msg || response.data.description || 'Error'))
  }
}, error => {
  if (error.response) {
    if (error.response.status === 500) {
      return Promise.reject(new Error(error.response.data.msg || error.response.data.description || '服务器错误，请联系管理员处理'))
    }
    return Promise.reject(error.response.data)
  } else {
    return Promise.reject(error)
  }
})

export default requests
