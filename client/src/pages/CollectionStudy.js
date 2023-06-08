import React from 'react'
import axios from 'axios'
import token from '../util/auth'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CardType } from '../util/enum/CardType'
import LessonStudy from './LessonStudy'
import CardStudyFrenteVerso from './cardsStudy/CardStudyFrenteVerso'
import CardStudyRespostaPorEscrito from './cardsStudy/CardStudyRespostaPorEscrito'
import CardStudyVerdadeiroOuFalso from './cardsStudy/CardStudyVerdadeiroOuFalso'
import CardStudyOrdenarParagrafos from './cardsStudy/CardStudyOrdenarParagrafos'
import CardStudyMultiplaEscolha from './cardsStudy/CardStudyMultiplaEscolha'
import CardStudyAssociarColunas from './cardsStudy/CardStudyAssociarColunas'

const getCardStudy = (card, responder, getPending) => {
    switch (card.idCardType) {
        case CardType.FRENTE_E_VERSO:
            return <CardStudyFrenteVerso
                idCardStatus={card.idCardStatus}
                card={card.card}
                responder={responder}
            />
        case CardType.RESPOSTA_POR_ESCRITO:
            return <CardStudyRespostaPorEscrito
                card={card.card}
                responder={responder}
                getPending={getPending}
            />
        case CardType.VERDADEIRO_OU_FALSO:
            return <CardStudyVerdadeiroOuFalso
                card={card.card}
                responder={responder}
                getPending={getPending}
            />
        case CardType.ORDENAR_PARAGRAFOS:
            return <CardStudyOrdenarParagrafos
                idCardStatus={card.idCardStatus}
                card={card.card}
                responder={responder}
                getPending={getPending}
            />
        case CardType.ASSOCIAR_COLUNAS:
            return <CardStudyAssociarColunas
                card={card.card}
                responder={responder}
                getPending={getPending}
            />
        case CardType.MULTIPLA_ESCOLHA:
            return <CardStudyMultiplaEscolha
                card={card.card}
                responder={responder}
                getPending={getPending}
            />
        default:
            return ""
    }
}

function CollectionStudy() {
    const [seed, setSeed] = useState(0)

    const { idCollection } = useParams()

    const [newCardsCount, setNewCardsCount] = useState(5)
    const [collectionName, setCollectionName] = useState("")
    const [lessons, setLessons] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:3001/collections/${idCollection}/study`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            setCollectionName(res.data.name)
            setLessons(res.data.lessons)
            setNewCardsCount(res.data.defaultNewCards)
        })
    }, [idCollection, seed])

    const [studying, setStudying] = useState(true)
    const [isDue, setIsDue] = useState(false)
    const [currentCard, setCurrentCard] = useState(null)

    const getPending = () => {
        // impede que eu mande o mesmo cartão duas vezes seguidas
        var params = currentCard ? `?prevCardId=${currentCard.id}` : ''

        axios.get(`http://localhost:3001/collections/${idCollection}/pending${params}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            setIsDue(res.data.isDue)
            if (!res.data.isDue)
                setStudying(false)
            setCurrentCard(res.data.card)
            setSeed(Math.random())
        })
    }
    useEffect(getPending, [idCollection])

    const responder = (answer, continuar = false) => {
        axios.post(`http://localhost:3001/collections/${idCollection}/cards/${currentCard.id}/answer`, {
            answer: answer
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            if (continuar)
                getPending()
        }).catch(err => {
            alert(`Error: ${err.response.data.error}`)
        })
    }

    return (
        <div>
            <div className='container p'>
                <h3>{collectionName}</h3>
                {isDue && studying && <div className='p' key={seed}>
                    {getCardStudy(currentCard, responder, getPending)}
                </div>}
                {isDue && !studying && <div className='p'>
                    <button className="button-styled" onClick={() => setStudying(true)}>
                        Estudar
                    </button>
                </div>}
                {!isDue && <div className='p'>
                    Não há cartões para estudar no momento.
                </div>}
                {!studying && <div className='p modal'>
                    <label htmlFor="selectNewCardsCount">Quantidade para mover para estudo:</label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        id="selectNewCardsCount"
                        value={newCardsCount}
                        onChange={(event) => setNewCardsCount(event.target.value)}
                    />
                </div>}
            </div>
            {
                !studying && lessons.map(lesson => (<LessonStudy
                    key={lesson.id}
                    idCollection={idCollection}
                    idLesson={lesson.id}
                    lessonName={lesson.name}
                    lessonDescription={lesson.description}
                    lessonOrder={lesson.order}
                    countNew={lesson.countNew}
                    newCardsCount={newCardsCount}
                    getPending={getPending}
                />))
            }
            <div className='p'>
                {studying ?
                    <button className="button-styled" onClick={() => setStudying(false)}>
                        Voltar
                    </button>
                    :
                    <a href={`/collections/`}>Voltar</a>}
            </div>
        </div>
    )
}

export default CollectionStudy