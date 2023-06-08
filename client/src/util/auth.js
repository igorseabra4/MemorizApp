import Cookies from 'universal-cookie'
import { JWT_COOKIE } from './constants';
const cookies = new Cookies();
const token = cookies.get(JWT_COOKIE)

export default token