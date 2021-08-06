import axios from 'axios';
import { CLIENT } from '~/config/frontend';

export const api = axios.create({
  baseURL: CLIENT.API_ADDR,
})
