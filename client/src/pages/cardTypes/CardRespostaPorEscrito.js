import { useState, useEffect } from 'react'

function CardRespostaPorEscrito({ cardJson, setCardJson }) {
    const [pergunta, setPergunta] = useState(('pergunta' in cardJson) ? cardJson.pergunta : '')
    const handleChangePergunta = event => {
        const { value } = event.target
        setPergunta(value)
    }

    const [resposta, setResposta] = useState(('resposta' in cardJson) ? cardJson.resposta : '')
    const handleChangeResposta = event => {
        const { value } = event.target
        setResposta(value)
    }

    useEffect(() => {
        setCardJson({
            pergunta: pergunta,
            resposta: resposta
        })
    }, [pergunta, resposta])

    return (
        <div className="card-type-chooser">
            <label htmlFor="inputTop">Pergunta: </label>
            <textarea
                placeholder="Pergunta"
                id="inputTop"
                name="pergunta"
                onChange={handleChangePergunta}
                value={pergunta}
            />
            <label htmlFor="inputBottom">Resposta: </label>
            <input
                type="text"
                placeholder="Resposta"
                id="inputBottom"
                name="resposta"
                onChange={handleChangeResposta}
                value={resposta}
            />
        </div>
    )
}

export default CardRespostaPorEscrito