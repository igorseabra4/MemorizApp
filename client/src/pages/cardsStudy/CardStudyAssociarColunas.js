import { useState } from 'react'
import shuffle from '../../util/shuffle'
import { CardAnswer } from '../../util/enum/CardAnswer'

function CardStudyAssociarColunas({ card, responder, getPending }) {
    var itensDireitaAleatorio = shuffle(card.itens.map(item => item.direita))

    const [itens, setItens] = useState(shuffle(card.itens.map(i => i)).map((item, index) => ({
        ...item,
        opcaoDireita: itensDireitaAleatorio[index]
    })))

    const [revelado, setRevelado] = useState(false)
    const [pontuacao, setPontuacao] = useState(null)
    const [textoAcertou, setTextoAcertou] = useState('')

    const handleClick = () => {
        var pontos = 0
        var total = itens.length
        for (let item of itens)
            if (item.direita === item.opcaoDireita)
                pontos++

        const newPontuacao = pontos / total
        setPontuacao(newPontuacao)
        responder(pontos === total ? CardAnswer.CORRETO : CardAnswer.ERRADO)
        setTextoAcertou(pontos === total ? '✅ Acertou!' : '❌ Errou!')
        setRevelado(true)
    }

    const moveItemUp = index => {
        if (revelado)
            return
        setItens(itens => {
            const newItens = [...itens]
            newItens[index] = {
                ...itens[index],
                opcaoDireita: itens[index - 1].opcaoDireita
            }
            newItens[index - 1] = {
                ...itens[index - 1],
                opcaoDireita: itens[index].opcaoDireita
            }
            return newItens
        })
    }

    const moveItemDown = index => {
        if (revelado)
            return
        setItens(itens => {
            const newItens = [...itens]
            newItens[index] = {
                ...itens[index],
                opcaoDireita: itens[index + 1].opcaoDireita
            }
            newItens[index + 1] = {
                ...itens[index + 1],
                opcaoDireita: itens[index].opcaoDireita
            }
            return newItens
        })
    }

    return (
        <div>
            <div className="card-studying">
                {card.proposta &&
                    <div className='p card-studying-text'>
                        {card.proposta}
                    </div>}
                {revelado &&
                    <div className='p card-property'>
                        Resposta
                    </div>}
                <div className="card-studying-paragrafos">
                    {itens.map((item, index) => (
                        <div key={index} className='card-lista-item'>
                            <div className='card-studying-text'>
                                {item.esquerda}
                            </div>
                            &nbsp;
                            <div className='card-studying-text' style={{ backgroundColor: !revelado ? 'white' : item.opcaoDireita === item.direita ? 'lightgreen' : 'lightcoral' }}>
                                {item.opcaoDireita}
                            </div>
                            &nbsp;
                            {revelado && <div className='card-studying-text' style={{ backgroundColor: 'lightgreen' }}>
                                {item.direita}
                            </div>}
                            {!revelado && <div className='card-lista-item-buttons'>
                                {index > 0 ?
                                    <button onClick={() => moveItemUp(index)}>⬆️</button> :
                                    <button>🟦</button>}
                                {(index !== itens.length - 1) ?
                                    <button onClick={() => moveItemDown(index)}>⬇️</button> :
                                    <button>🟦</button>}
                            </div>}
                        </div>
                    ))}
                </div>
                {revelado &&
                    <div className='card-studying-text'>
                        Pontuação: {(pontuacao * 100).toFixed(2)}%
                        <br />
                        {textoAcertou}
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

export default CardStudyAssociarColunas