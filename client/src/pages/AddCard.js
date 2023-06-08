import { useState } from 'react'
import axios from 'axios'
import token from '../util/auth'
import CardFrenteVerso from './cardTypes/CardFrenteVerso'
import CardRespostaPorEscrito from './cardTypes/CardRespostaPorEscrito'
import CardVerdadeiroOuFalso from './cardTypes/CardVerdadeiroOuFalso'
import CardOrdenarParagrafos from './cardTypes/CardOrdenarParagrafos'
import CardMultiplaEscolha from './cardTypes/CardMultiplaEscolha'
import CardAssociarColunas from './cardTypes/CardAssociarColunas'
import { CardType } from '../util/enum/CardType'

function AddCard({ idCollection, idLesson, card, reload, setEditingCard, removeCard }) {
    const [cardType, setCardType] = useState(card ? card.idCardType : "")
    const [cardJson, setCardJson] = useState(card ? card.card : {})
    const [seed, setSeed] = useState(0)

    const handleCardTypeChange = event => {
        const { value } = event.target
        setCardType(value)
    }

    const onSubmit = event => {
        event.preventDefault()
        if (card) {
            axios.put(`http://localhost:3001/collections/${idCollection}/lessons/${idLesson}/cards/${card.id}`, {
                idCardType: cardType,
                card: cardJson
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    setEditingCard(false)
                    reload()
                })
                .catch(err => {
                    alert(`Error: ${err.response.data.error}`)
                })
        } else {
            axios.post(`http://localhost:3001/collections/${idCollection}/lessons/${idLesson}/cards`, {
                idCardType: cardType,
                card: cardJson
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    reload()
                    setCardJson({})
                    setSeed(Math.random())
                })
                .catch(err => {
                    alert(`Error: ${err.response.data.error}`)
                })
        }
    }

    return (
        <form className='modal' onSubmit={onSubmit}>
            <div className='card-type-chooser'>
                <label htmlFor="selectCardType">Escolha o tipo de cartão:</label>
                <select
                    id="selectCardType"
                    value={cardType}
                    onChange={handleCardTypeChange}
                >
                    <option value={""}>Tipo...</option>
                    <option value={CardType.ASSOCIAR_COLUNAS}>Associar colunas</option>
                    <option value={CardType.FRENTE_E_VERSO}>Frente e verso</option>
                    <option value={CardType.MULTIPLA_ESCOLHA}>Múltipla escolha</option>
                    <option value={CardType.ORDENAR_PARAGRAFOS}>Ordenar parágrafos</option>
                    {/* <option value={CardType.PREENCHER_LACUNAS}>Preencher lacunas</option> */}
                    <option value={CardType.RESPOSTA_POR_ESCRITO}>Resposta por escrito</option>
                    <option value={CardType.VERDADEIRO_OU_FALSO}>Verdadeiro ou falso</option>
                </select>
            </div>
            <div>
                {cardType === CardType.FRENTE_E_VERSO &&
                    <CardFrenteVerso
                        key={seed}
                        cardJson={cardJson}
                        setCardJson={setCardJson}
                    />}
                {cardType === CardType.RESPOSTA_POR_ESCRITO &&
                    <CardRespostaPorEscrito
                        key={seed}
                        cardJson={cardJson}
                        setCardJson={setCardJson}
                    />}
                {cardType === CardType.VERDADEIRO_OU_FALSO &&
                    <CardVerdadeiroOuFalso
                        key={seed}
                        cardJson={cardJson}
                        setCardJson={setCardJson}
                    />}
                {cardType === CardType.ORDENAR_PARAGRAFOS &&
                    <CardOrdenarParagrafos
                        key={seed}
                        cardJson={cardJson}
                        setCardJson={setCardJson}
                    />}
                {cardType === CardType.MULTIPLA_ESCOLHA &&
                    <CardMultiplaEscolha
                        key={seed}
                        cardJson={cardJson}
                        setCardJson={setCardJson}
                    />}
                {cardType === CardType.ASSOCIAR_COLUNAS &&
                    <CardAssociarColunas
                        key={seed}
                        cardJson={cardJson}
                        setCardJson={setCardJson}
                    />}
            </div>
            <div className='buttons'>
                {cardType !== "" && <button className="button-styled">
                    {card ? 'Salvar' : 'Adicionar'}
                </button>}
                {card && <button type='button' className="button-styled button-red" onClick={() => {
                    setEditingCard(false)
                    removeCard()
                }}>Apagar</button>}
            </div>
        </form>
    )
}

export default AddCard