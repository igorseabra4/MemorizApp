import { useState } from 'react'
import AddCard from './AddCard'
import { CardStatus } from '../util/enum//CardStatus'
import axios from 'axios'
import token from '../util/auth'
import { CardType } from '../util/enum/CardType'

const idCardTypeToText = idCardType => {
    switch (idCardType) {
        case CardType.ASSOCIAR_COLUNAS:
            return 'Associar colunas'
        case CardType.FRENTE_E_VERSO:
            return 'Frente e verso'
        case CardType.MULTIPLA_ESCOLHA:
            return 'Múltipla escolha'
        case CardType.ORDENAR_PARAGRAFOS:
            return 'Ordenar parágrafos'
        case CardType.PREENCHER_LACUNAS:
            return 'Preencher lacunas'
        case CardType.RESPOSTA_POR_ESCRITO:
            return 'Resposta por escrito'
        case CardType.VERDADEIRO_OU_FALSO:
            return 'Verdadeiro ou falso'
        default:
            return ""
    }
}

const cardToText = (idCardType, card) => {
    switch (idCardType) {
        case CardType.FRENTE_E_VERSO:
            return (
                <div>
                    <div className='p card-property'>
                        Frente
                    </div>
                    <div className='p card-value'>
                        {card.frente}
                    </div>
                    <div className='p card-property'>
                        Verso
                    </div>
                    <div className='p card-value card-value-last'>
                        {card.verso}
                    </div>
                </div>
            )
        case CardType.RESPOSTA_POR_ESCRITO:
            return (
                <div>
                    <div className='p card-property'>
                        Pergunta
                    </div>
                    <div className='p card-value'>
                        {card.pergunta}
                    </div>
                    <div className='p card-property'>
                        Resposta
                    </div>
                    <div className='p card-value card-value-last'>
                        {card.resposta}
                    </div>
                </div>
            )
        case CardType.VERDADEIRO_OU_FALSO:
            return (
                <div>
                    <div className='p card-property'>
                        Afirmação
                    </div>
                    <div className='p card-value'>
                        {card.frente}
                    </div>
                    <div className='p card-property'>
                        Verdadeiro
                    </div>
                    <div className='p card-value card-value-last'>
                        {card.resposta ? '✅ Sim' : '❌ Não'}
                    </div>
                </div>
            )
        case CardType.ORDENAR_PARAGRAFOS:
            return (
                <div>
                    {card.proposta.length > 0 && <div className='p card-property'>
                        Proposta
                    </div>}
                    {card.proposta.length > 0 && <div className='p card-value'>
                        {card.proposta}
                    </div>}
                    {card.paragrafos.map((p, index) => (
                        <div key={index}>
                            <div className='p card-property'>
                                Parágrafo {index + 1}
                            </div>
                            <div className='p card-value'>
                                {p}
                            </div>
                        </div>
                    ))}
                </div>
            )
        case CardType.ASSOCIAR_COLUNAS:
            return (
                <div>
                    {card.proposta.length > 0 && <div className='p card-property'>
                        Proposta
                    </div>}
                    {card.proposta.length > 0 && <div className='p card-value'>
                        {card.proposta}
                    </div>}
                    {card.itens.map((item, index) => (
                        <div key={index}>
                            <div className='p card-property'>
                                Item {index + 1}
                            </div>
                            <div className='p card-value'>
                                <div className='card-colunas-box'>
                                    {item.esquerda}
                                </div>
                                &nbsp;
                                <div className='card-colunas-box'>
                                    {item.direita}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        case CardType.MULTIPLA_ESCOLHA:
            return (
                <div>
                    <div className='p card-property'>
                        Pergunta
                    </div>
                    <div className='p card-value'>
                        {card.pergunta}
                    </div>
                    {card.opcoes.map((opcao, index) => (
                        <div key={index}>
                            <div className='p card-property'>
                                Opção {index + 1}: {opcao.correto ? '✅ (correta)' : '❌ (incorreta)'}
                            </div>
                            <div className='p card-value'>
                                {opcao.texto}
                            </div>
                        </div>
                    ))}
                    <div className='p card-property'>
                        Ordem aleatória
                    </div>
                    <div className='p card-value card-value-last'>
                        {card.aleatorio ? '✅ Sim' : '❌ Não'}
                    </div>
                </div>
            )
        default:
            return ""
    }
}

function Card({ idCollection, idLesson, reload, card, removeCard, moveCardUp, moveCardDown }) {
    const [editingCard, setEditingCard] = useState(false)

    const buryCard = (idCard, buried) => {
        axios.put(`http://localhost:3001/collections/${idCollection}/lessons/${idLesson}/cards/${idCard}/bury`, {
            buried: buried
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            reload()
        }).catch(err => {
            alert(`Error: ${err.response.data.error}`)
        })
    }

    return (
        <tr>
            <td className='table-cell-center'>
                {moveCardUp && <button onClick={moveCardUp}>⬆️</button>}
                {card.order}
                {moveCardDown && <button onClick={moveCardDown}>⬇️</button>}
            </td>
            <td className='table-cell-center'>
                {idCardTypeToText(card.idCardType)}
            </td>

            {editingCard ? <td className='table-cell-center-form'>
                <AddCard
                    idCollection={idCollection}
                    idLesson={idLesson}
                    card={card}
                    reload={reload}
                    setEditingCard={setEditingCard}
                    removeCard={() => removeCard(card.id)}
                />
            </td> : <td className='table-cell-text'>{cardToText(card.idCardType, card.card)}</td>}

            <td className='table-cell-center table-cell-card-button'>
                <button className="button-styled" onClick={() => setEditingCard(val => !val)}>{editingCard ? 'Cancelar' : 'Editar'}</button>
                <br />
                {card.idCardStatus === CardStatus.SUSPENSO ?
                    <button className="button-styled" onClick={() => buryCard(card.id, false)}>Retornar</button> :
                    <button className="button-styled button-red" onClick={() => buryCard(card.id, true)}>Suspender</button>}
                {card.idCardStatus === CardStatus.SUSPENSO && <div className='p'>
                    Suspenso
                </div>}
            </td>
        </tr>
    )
}

export default Card