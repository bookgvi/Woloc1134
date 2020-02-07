import axios from 'axios'
import { stringify } from 'qs'
import { LocalStorage, Loading, Notify, QSpinnerGears } from 'quasar'

const currentURL = (_ => {
  const currentURL = window.location
  let baseURL = currentURL.hostname
  let isCabinet = currentURL.hostname.split('.')
  if (baseURL === 'localhost') {
    baseURL = 'https://pre.ugoloc.ucann.ru'
  } else if (isCabinet[0] === `cabinet`) {
    isCabinet.shift()
    baseURL = `https://${isCabinet.join('.')}`
  }
  // baseURL = 'https://ugoloc-828.shot.ugoloc.ucann.ru'
  return `${baseURL}/api`
})()
const instance = axios.create({
  // baseURL: process.env.API_BASE_URL || '/api', // api base_url
  baseURL: currentURL, // api base_url
  paramsSerializer: function (params) {
    return stringify(params, { arrayFormat: 'brackets' })
  },
})

instance.defaults.headers.post['Content-Type'] = 'application/json'
instance.defaults.headers.get['Accept'] = 'application/json'

// request interceptor
instance.interceptors.request.use(
  conf => {
    Loading.show({
      delay: 1000,
      spinner: QSpinnerGears
    })
    // Do something before request is sent
    const token = LocalStorage.getItem('user-token')
    if (token) {
      conf.headers['X-Requested-With'] = 'XMLHttpRequest'
      conf.headers['Authorization'] = `Bearer ${token}`
    }
    return conf
  },
  error => {
    // Do something with request error
    // console.log('request error: ', error) // for debug
    Promise.reject(error)
  })

// response interceptor
instance.interceptors.response.use(
  response => {
    Loading.hide()
    return response
  },
  error => {
    Loading.hide()
    const response = error.response
    // console.info('response error', response.data)// for debug
    if (response) {
      const serverError = String(response.status).match(/^5\d./)
      if (serverError && serverError[0]) {
        return Promise.reject(error)
      }
      switch (response.status) {
        case 401:
        case 403:
          LocalStorage.remove('user-token')
          window.location.href = `/login`
          break
        default:
          if (response.data && response.data.errors) {
            if (Array.isArray(response.data.errors)) {
              response.data.errors.forEach(err => {
                Notify.create({
                  message: err.title,
                  color: 'negative',
                  position: 'bottom-left',
                  icon: 'warning'
                })
              })
            } else {
              Notify.create({
                message: response.data.errors.title,
                color: 'negative',
                position: 'bottom-left',
                icon: 'warning'
              })
            }
          }
      }
      return response.data
    }
    return Promise.reject(error)
  }
)
export default instance
