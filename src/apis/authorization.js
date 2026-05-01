import { apiHelper } from './../utility/helpers'

export default {
  signIn({ account, password }) {
    return apiHelper.post('/api/signin', {
      account,
      password
    })
  },
  signUp({ account, name, email, password, checkPassword
  }) {
    return apiHelper.post('/api/users', {
      account,
      name,
      email,
      password,
      checkPassword
    })
  }
}