import { useState } from 'react'
import { CardAnswer } from '../../util/enum/CardAnswer'

function CardStudyFrenteVerso({ card, responder, getPending }) {
    const [revelado, setRevelado] = useState(false)
    const [resposta, setResposta] = useState(false)

    const handleClick = (value) => {
        setResposta(value)
        responder(value === card.resposta ? CardAnswer.CORRETO : CardAnswer.ERRADO)
        setRevelado(true)
    }

    return (
        <div>
            <div className="card-studying">
                <div className='p card-property'>
                    Afirmação
                </div>
                <div className='card-studying-text'>
                    {card.frente}
                </div>
                {revelado &&
                    <div className='p card-property'>
                        Resposta
                    </div>}
                {revelado &&
                    <div className='card-studying-text'>
                        {card.resposta ? '✅ Verdadeiro' : '❌ Falso'}
                    </div>}
                {revelado &&
                    <div className='card-studying-text'>
                        {resposta === card.resposta ? '✅ Acertou!' : '❌ Errou!'}
                    </div>}
                {revelado ?
                    <button className="button-styled" onClick={getPending}>
                        Continuar
                    </button> :
                    <div className='buttons'>
                        <button className="button-styled" onClick={() => handleClick(true)}>
                            Verdadeiro
                        </button>
                        &nbsp;
                        <button className="button-styled" onClick={() => handleClick(false)}>
                            Falso
                        </button>
                    </div>
                }
            </div>
        </div >
    )
}

export default CardStudyFrenteVerso