import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import token from '../util/auth'
import { useNavigate } from 'react-router-dom'

function Home({ isLogged, setIsLogged }) {
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`http://localhost:3001/auth`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setIsLogged(true)
            navigate('/collections/')
            navigate(0)
        }).catch(res => {
            setIsLogged(false)
        })
    }, [])

    return (
        <div>
            {isLogged ? <p>Bem-vindo ao MemorizApp</p> : <p className='p'>
                Você não está logado. Por favor&nbsp;<a href='/login'>faça login</a>&nbsp;ou&nbsp;<a href='/registration'>crie uma conta</a>.
            </p >}
        </div>
    )
}

export default Home