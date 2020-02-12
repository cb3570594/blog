// import cookies from 'js-cookie'
// const cookieparser = process.server ? require('cookieparser') : undefined
export default function ({ $axios, req }) {
  // $axios.defaults.withCredentials = true
  // let parsed = null
  // if (req && req.headers !== undefined) {
  //   parsed = cookieparser.parse(req.headers.cookie)
  //   req.headers.Authorization = 'Bearer ' + parsed.auth
  // }
  $axios.onError(error => {
  })
  $axios.onRequest(config => {
  })
  $axios.onResponse(config => {
    // console.log(config.data)
    // return config.data
  })
}