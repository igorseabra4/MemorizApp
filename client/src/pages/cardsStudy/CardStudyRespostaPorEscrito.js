import { useState } from 'react'
import { CardAnswer } from '../../util/enum/CardAnswer'

function CardStudyRespostaPorEscrito({ card, responder, getPending }) {
    const [resposta, setResposta] = useState("")
    const [revelado, setRevelado] = useState(false)
    const [acertou, setAcertou] = useState(false)

    const onSubmit = (event) => {
        event.preventDefault()
        setRevelado(true)
        if (resposta.toLowerCase() === card.resposta.toLowerCase()) {
            responder(CardAnswer.CORRETO)
            setAcertou(true)
        } else {
            responder(CardAnswer.ERRADO)
            setAcertou(false)
        }
    }

    return (
        <div>
            <form className="card-studying" onSubmit={onSubmit}>
                <div className='p card-property'>
                    Pergunta
                </div>
                <div className='card-studying-text'>
                    {card.pergunta}
                </div>
                <div className='p card-property'>
                    Sua Reposta
                </div>
                <input
                    type="text"
                    placeholder="Resposta"
                    name="resposta"
                    onChange={(event) => setResposta(event.target.value)}
                    value={resposta}
                    readOnly={revelado}
                />
                {revelado &&
                    <div className='p card-property'>
                        Resposta Correta
                    </div>}
                {revelado &&
                    <div className='card-studying-text'>
                        {card.resposta}
                    </div>}
                {!revelado &&
                    <button className="button-styled">
                        Enviar
                    </button>}
                {revelado &&
                    (acertou ? '✅ Acertou!' : '❌ Errou!')}
                {revelado &&
                    <button className="button-styled" onClick={getPending}>
                        Continuar
                    </button>}
            </form>
        </div >
    )
}

export default CardStudyRespostaPorEscrito