import { useState, useEffect } from 'react'

function CardVerdadeiroOuFalso({ cardJson, setCardJson }) {
    const [frente, setFrente] = useState(('frente' in cardJson) ? cardJson.frente : '')
    const handleChangeFrente = event => {
        const { value } = event.target
        setFrente(value)
    }

    const [resposta, setResposta] = useState(('resposta' in cardJson) ? cardJson.resposta : true)
    const handleChangeResposta = event => {
        const { checked } = event.target
        setResposta(checked)
    }

    useEffect(() => {
        setCardJson({
            frente: frente,
            resposta: resposta
        })
    }, [frente, resposta])

    return (
        <div className="card-type-chooser">
            <label htmlFor="inputTop">Afirmação: </label>
            <textarea
                placeholder="Afirmação"
                id="inputTop"
                name="frente"
                onChange={handleChangeFrente}
                value={frente}
            />
            <div className='card-checkbox'>
                <label htmlFor="inputBottom">Verdadeiro: </label>
                <input
                    className='card-checkbox-check'
                    type="checkbox"
                    id="inputBottom"
                    name="resposta"
                    onChange={handleChangeResposta}
                    checked={resposta}
                />
            </div>
        </div>
    )
}

export default CardVerdadeiroOuFalso