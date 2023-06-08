import { useState, useEffect } from 'react'

function CardMultiplaEscolha({ cardJson, setCardJson }) {
    const [pergunta, setPergunta] = useState(('pergunta' in cardJson) ? cardJson.pergunta : '')
    const handleChangePergunta = event => {
        const { value } = event.target
        setPergunta(value)
    }

    const [opcoes, setOpcoes] = useState(('opcoes' in cardJson) ? cardJson.opcoes : [])
    const handleChangeOpcoesTexto = (index, value) => {
        setOpcoes(opcoes => {
            const newOpcoes = [...opcoes]
            newOpcoes[index] = {
                texto: value,
                correto: newOpcoes[index].correto
            }
            return newOpcoes
        })
    }
    const handleChangeOpcoesCorreto = (index, checked) => {
        setOpcoes(opcoes => {
            const newOpcoes = [...opcoes]
            newOpcoes[index] = {
                texto: newOpcoes[index].texto,
                correto: checked
            }
            return newOpcoes
        })
    }

    const addOpcao = () => {
        setOpcoes(opcoes => {
            const newOpcoes = [...opcoes]
            newOpcoes.push({
                texto: '',
                correto: false
            })
            return newOpcoes
        })
    }

    const removeOpcao = (index) => {
        setOpcoes(opcoes => {
            const newOpcoes = [...opcoes]
            newOpcoes.splice(index, 1)
            return newOpcoes
        })
    }

    const [aleatorio, setAleatorio] = useState(('aleatorio' in cardJson) ? cardJson.aleatorio : false)
    const handleChangeAleatorio = checked => {
        setAleatorio(checked)
    }

    useEffect(() => {
        setCardJson({
            pergunta: pergunta,
            aleatorio: aleatorio,
            opcoes: opcoes
        })
    }, [pergunta, opcoes, aleatorio])

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
            <div className='card-checkbox'>
                <label htmlFor='addButton'>Opções:</label>
                <button
                    type='button'
                    className='button-styled button-small'
                    id='addButton'
                    onClick={addOpcao}
                >+</button>
            </div>
            {
                opcoes.map((opcao, index) => (<div className='p card-lista-item' key={index}>
                    <textarea
                        id={"inputText_" + index}
                        placeholder="Texto"
                        name={"paragrafo_" + index}
                        onChange={(event) => handleChangeOpcoesTexto(index, event.target.value)}
                        value={opcao.texto}
                    />
                    &nbsp;
                    <input
                        className='card-checkbox-check'
                        type="checkbox"
                        id={"inputCheck_" + index}
                        name={"resposta_" + index}
                        onChange={(event) => handleChangeOpcoesCorreto(index, event.target.checked)}
                        checked={opcao.correto}
                    />
                    &nbsp;
                    <button
                        type='button'
                        className='button-styled button-red button-small'
                        id={'removeButton_' + index}
                        onClick={() => removeOpcao(index)}
                    >-</button>
                </div>))
            }
            <div className='card-checkbox'>
                <label htmlFor="inputAleatorio">Ordem aleatória: </label>
                <input
                    className='card-checkbox-check'
                    type="checkbox"
                    id="inputAleatorio"
                    name="aleatorio"
                    onChange={(event) => handleChangeAleatorio(event.target.checked)}
                    checked={aleatorio}
                />
            </div>
        </div>
    )
}

export default CardMultiplaEscolha