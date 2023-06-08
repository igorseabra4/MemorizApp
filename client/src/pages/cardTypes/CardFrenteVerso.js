import { useState, useEffect } from 'react'

function CardFrenteVerso({ cardJson, setCardJson }) {
    const [frente, setFrente] = useState(('frente' in cardJson) ? cardJson.frente : '')
    const handleChangeFrente = event => {
        const { value } = event.target
        setFrente(value)
        setCardJson({
            frente: value,
            verso: verso
        })
    }

    const [verso, setVerso] = useState(('verso' in cardJson) ? cardJson.verso : '')
    const handleChangeVerso = event => {
        const { value } = event.target
        setVerso(value)
        setCardJson({
            frente: frente,
            verso: value
        })
    }

    useEffect(() => {
        setCardJson({
            frente: frente,
            verso: verso
        })
    }, [frente, verso])

    return (
        <div className="card-type-chooser">
            <label htmlFor="inputTop">Frente: </label>
            <textarea
                placeholder="Frente"
                id="inputTop"
                name="frente"
                onChange={handleChangeFrente}
                value={frente}
            />
            <label htmlFor="inputBottom">Verso: </label>
            <textarea
                placeholder="Verso"
                id="inputBottom"
                name="verso"
                onChange={handleChangeVerso}
                value={verso}
            />
        </div >
    )
}

export default CardFrenteVerso