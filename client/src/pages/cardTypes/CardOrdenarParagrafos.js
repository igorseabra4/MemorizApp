import { useState, useEffect } from 'react'

function CardOrdenarParagrafos({ cardJson, setCardJson }) {
    const [proposta, setProposta] = useState(('proposta' in cardJson) ? cardJson.proposta : '')
    const handleChangeProposta = event => {
        const { value } = event.target
        setProposta(value)
    }

    const [paragrafos, setParagrafos] = useState(('paragrafos' in cardJson) ? cardJson.paragrafos : [])

    const handleChange = (index, value) => {
        setParagrafos(paragrafos => {
            const newParagrafos = [...paragrafos]
            newParagrafos[index] = value
            return newParagrafos
        })
    }

    const addParagrafo = () => {
        setParagrafos(paragrafos => {
            const newParagrafos = [...paragrafos]
            newParagrafos.push('')
            return newParagrafos
        })
    }

    const removeParagrafo = (index) => {
        setParagrafos(paragrafos => {
            const newParagrafos = [...paragrafos]
            newParagrafos.splice(index, 1)
            return newParagrafos
        })
    }

    useEffect(() => {
        setCardJson({
            proposta: proposta,
            paragrafos: paragrafos
        })
    }, [proposta, paragrafos])

    return (
        <div className="card-type-chooser">
            <label htmlFor="inputTop">Proposta (pode ser vazio):</label>
            <textarea
                placeholder="Proposta"
                id="inputTop"
                name="proposta"
                onChange={handleChangeProposta}
                value={proposta}
            />
            <div className='card-checkbox'>
                <label htmlFor='addButton'>Parágrafos:</label>
                <button
                    type='button'
                    className='button-styled button-small'
                    id='addButton'
                    onClick={addParagrafo}
                >+</button>
            </div>
            {
                paragrafos.map((paragrafo, index) => (<div className='p card-lista-item' key={index}>
                    <textarea
                        id={"input_" + index}
                        placeholder="Texto"
                        name={"paragrafo_" + index}
                        onChange={event => handleChange(index, event.target.value)}
                        value={paragrafo}
                    />
                    &nbsp;
                    <button
                        type='button'
                        className='button-styled button-red button-small'
                        id='addButton'
                        onClick={() => removeParagrafo(index)}
                    >-</button>
                </div>))
            }
        </div>
    )
}

export default CardOrdenarParagrafos