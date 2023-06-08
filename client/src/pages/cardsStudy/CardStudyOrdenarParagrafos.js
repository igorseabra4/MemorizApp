import { useState } from 'react'
import shuffle from '../../util/shuffle'
import { CardAnswer } from '../../util/enum/CardAnswer'

function CardStudyOrdenarParagrafos({ card, responder, getPending }) {
    const [paragrafos, setParagrafos] = useState(shuffle([...card.paragrafos]))
    const [revelado, setRevelado] = useState(false)
    const [acertou, setAcertou] = useState(null)

    const handleClick = () => {
        var iguais = true
        for (let i = 0; i < paragrafos.length; i++) {
            if (paragrafos[i] !== card.paragrafos[i]) {
                iguais = false
                break;
            }
        }
        setAcertou(iguais)
        responder(iguais ? CardAnswer.CORRETO : CardAnswer.ERRADO)
        setRevelado(true)
    }

    const moveParagrafoUp = index => {
        if (revelado)
            return
        setParagrafos(paragrafos => {
            const newParagrafos = [...paragrafos]
            newParagrafos[index] = paragrafos[index - 1]
            newParagrafos[index - 1] = paragrafos[index]
            return newParagrafos
        })
    }

    const moveParagrafoDown = index => {
        if (revelado)
            return
        setParagrafos(paragrafos => {
            const newParagrafos = [...paragrafos]
            newParagrafos[index] = paragrafos[index + 1]
            newParagrafos[index + 1] = paragrafos[index]
            return newParagrafos
        })
    }

    return (
        <div>
            <div className="card-studying">
                {card.proposta &&
                    <div className='p card-studying-text'>
                        {card.proposta}
                    </div>}
                <div className="card-studying-paragrafos">
                    {paragrafos.map((paragrafo, index) => (
                        <div key={index} className='card-lista-item'>
                            <div className='card-lista-item-buttons'>
                                {index > 0 ?
                                    <button onClick={() => moveParagrafoUp(index)}>⬆️</button> :
                                    <button>🟦</button>}
                                {(index !== paragrafos.length - 1) ?
                                    <button onClick={() => moveParagrafoDown(index)}>⬇️</button> :
                                    <button>🟦</button>}
                            </div>
                            <div className='card-studying-text'>
                                {paragrafo}
                            </div>
                        </div>
                    ))}
                </div>
                {revelado &&
                    <div className='p card-property'>
                        Resposta
                    </div>}
                {revelado &&
                    <div className="card-studying-paragrafos">
                        {card.paragrafos.map((paragrafo, index) => (
                            <div key={index} className='card-studying-text'>
                                {index + 1}. {paragrafo}
                            </div>
                        ))}
                    </div>}
                {revelado &&
                    <div className='card-studying-text'>
                        {acertou ? '✅ Acertou!' : '❌ Errou!'}
                    </div>}
                {revelado ?
                    <button className="button-styled" onClick={getPending}>
                        Continuar
                    </button> :
                    <button className="button-styled" onClick={handleClick}>
                        Enviar
                    </button>
                }
            </div>
        </div >
    )
}

export default CardStudyOrdenarParagrafos