import Swal from 'sweetalert2'
import axios from 'axios'

const baseURL = 'http://localhost:3000'

export const DEFAULT_AVATAR = 'https://i.imgur.com/q6bwDGO.png'

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})

export const apiHelper = axios.create({
  baseURL
})