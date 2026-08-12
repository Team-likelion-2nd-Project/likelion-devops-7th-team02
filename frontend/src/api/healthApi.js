import axios from 'axios'

export const getHealth = () =>
  axios.get('/actuator/health')