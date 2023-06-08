import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { JWT_COOKIE, MAX_TOKEN_AGE_SECONDS } from '../util/constants'
import { StatusCodes } from 'http-status-codes'

function Registration({ isLogin, setIsLogged }) {
    const [userData, setUserData] = useState({
        username: "",
        password: ""
    })

    const handleChange = event => {
        const { name, value } = event.target
        setUserData(prevUserData => ({
            ...prevUserData,
            [name]: value
        }))
    }

    const navigate = useNavigate()

    const onSubmit = event => {
        event.preventDefault()
        if (isLogin) {
            axios.post("http://localhost:3001/auth/login", userData)
                .then((res) => {
                    if (res.status === StatusCodes.OK) {
                        const cookies = new Cookies();
                        cookies.set(JWT_COOKIE, res.data.accessToken, {
                            expires: new Date((res.data.issuedAt + MAX_TOKEN_AGE_SECONDS) * 1000),
                            path: '/'
                        })
                        setIsLogged(true)
                        navigate("/collections")
                        navigate(0)
                    }
                })
                .catch((err) => {
                    alert(`Error: ${err.response.data.error}`)
                })
        } else {
            axios.post("http://localhost:3001/auth/register", userData)
                .then((res) => {
                    if (res.status === StatusCodes.CREATED) {
                        alert(`Usuário ${res.data.username} criado com sucesso.`)
                        setUserData({
                            username: "",
                            password: ""
                        })
                        navigate("/login")
                        navigate(0)
                    }
                })
                .catch((err) => {
                    alert(`Error: ${err.response.data.error}`)
                })
        }
    }

    return (
        <div className='p'>
            <form className='modal' onSubmit={onSubmit}>
                <label htmlFor="inputUsername">Nome de usuário:</label>
                <input
                    type="text"
                    placeholder="Nome de usuário"
                    id="inputUsername"
                    name="username"
                    onChange={handleChange}
                    value={userData.username}
                />
                <label htmlFor="inputPassword">Senha:</label>
                <input
                    type="password"
                    placeholder="Senha"
                    id="inputPassword"
                    name="password"
                    onChange={handleChange}
                    value={userData.password}
                />
                <button className="button-styled">
                    {isLogin ? 'Login' : 'Cadastrar'}
                </button>
            </form>
        </div>
    )
}

export default Registration