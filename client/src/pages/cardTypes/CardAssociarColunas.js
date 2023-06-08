import { useState, useEffect } from 'react'

function CardAssociarColunas({ cardJson, setCardJson }) {
    const [proposta, setProposta] = useState(('proposta' in cardJson) ? cardJson.proposta : '')
    const handleChangeProposta = event => {
        const { value } = event.target
        setProposta(value)
    }

    const [itens, setItens] = useState(('itens' in cardJson) ? cardJson.itens : [])

    const handleChange = (index, lado, value) => {
        setItens(itens => {
            const newItens = [...itens]
            if (lado == 'esquerda')
                newItens[index] = {
                    esquerda: value,
                    direita: itens[index].direita
                }
            else if (lado == 'direita')
                newItens[index] = {
                    esquerda: itens[index].esquerda,
                    direita: value
                }
            return newItens
        })
    }

    const addItem = () => {
        setItens(itens => {
            const newItens = [...itens]
            newItens.push({
                esquerda: '',
                direita: ''
            })
            return newItens
        })
    }

    const removeItem = (index) => {
        setItens(itens => {
            const newItens = [...itens]
            newItens.splice(index, 1)
            return newItens
        })
    }

    useEffect(() => {
        setCardJson({
            proposta: proposta,
            itens: itens
        })
    }, [proposta, itens])

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
                <label htmlFor='addButton'>Itens:</label>
                <button
                    type='button'
                    className='button-styled button-small'
                    id='addButton'
                    onClick={addItem}
                >+</button>
            </div>
            {
                itens.map((item, index) => (<div className='p paragrafo card-lista-item' key={index}>
                    <input
                        type="text"
                        id={"inputEsquerda_" + index}
                        placeholder="Esquerda"
                        name={"itemEsquerda_" + index}
                        onChange={event => handleChange(index, 'esquerda', event.target.value)}
                        value={item.esquerda}
                    />
                    &nbsp;
                    <input
                        type="text"
                        id={"inputDireita_" + index}
                        placeholder="Direita"
                        name={"itemDireita_" + index}
                        onChange={event => handleChange(index, 'direita', event.target.value)}
                        value={item.direita}
                    />
                    &nbsp;
                    <button
                        type='button'
                        className='button-styled button-red button-small'
                        id='addButton'
                        onClick={() => removeItem(index)}
                    >-</button>
                </div>))
            }
        </div>
    )
}

export default CardAssociarColunas