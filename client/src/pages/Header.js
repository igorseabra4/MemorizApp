
import "../App.css"
import headerImage from '../images/icons8-space-64.png'
import Cookies from 'universal-cookie'
import { JWT_COOKIE } from '../util/constants'
import { useNavigate } from 'react-router-dom'

function Header({ isLogged, setIsLogged }) {
    const navigate = useNavigate()

    const logout = () => {
        const cookies = new Cookies();
        cookies.remove(JWT_COOKIE, { path: '/' })
        setIsLogged(false)
        navigate("/")
        navigate(0)
    }

    return (
        <header>
            <img src={headerImage} alt="Ícone do aplicativo." />
            <nav >
                <h2>MemorizApp</h2>
                {!isLogged && <a href='/'>Página Inicial</a>}
                {isLogged && <a href='/collections'>Coleções</a>}
                {!isLogged && <a href='/login'>Login</a>}
                {!isLogged && <a href='/registration'>Cadastro</a>}
                {isLogged && <button onClick={logout}>Logout</button>}
            </nav>
        </header>
    )
}

export default Header