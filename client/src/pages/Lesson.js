import React from 'react'
import { useState } from 'react'
import EditLesson from './EditLesson'
import AddCard from './AddCard'
import Card from './Card'
import axios from 'axios'
import token from '../util/auth'

function Lesson({ idCollection, lesson, cards, reload, moveLessonUp, moveLessonDown }) {
    const [lessonName, setLessonName] = useState(lesson.name)
    const [lessonDescription, setLessonDescription] = useState(lesson.description)

    const [editingLesson, setEditingLesson] = useState(false)
    const [addingCard, setAddingCard] = useState(false)

    const editLesson = (value, name, description) => {
        setEditingLesson(value)
        setLessonName(name)
        setLessonDescription(description)
    }

    const removeCard = (idCard) => {
        axios.delete(`http://localhost:3001/collections/${idCollection}/lessons/${lesson.id}/cards/${idCard}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            reload()
        }).catch(err => {
            alert(`Error: ${err.response.data.error}`)
        })
    }

    const moveCardUp = index => {
        var cardIds = cards.map(card => card.id)
        cardIds[index] = cards[index - 1].id
        cardIds[index - 1] = cards[index].id
        axios.put(`http://localhost:3001/collections/${idCollection}/lessons/${lesson.id}/cards/reorder`, {
            cards: cardIds
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

    const moveCardDown = index => {
        var cardIds = cards.map(card => card.id)
        cardIds[index] = cards[index + 1].id
        cardIds[index + 1] = cards[index].id
        axios.put(`http://localhost:3001/collections/${idCollection}/lessons/${lesson.id}/cards/reorder`, {
            cards: cardIds
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
        <div className='container'>
            <div className='lesson-heading'>
                {moveLessonUp && <button onClick={moveLessonUp}>⬆️</button>}
                {moveLessonDown && <button onClick={moveLessonDown}>⬇️</button>}
                <h4>Lição #{lesson.order}{!editingLesson && (': ' + lessonName)}</h4>
            </div>
            {!editingLesson && <div className='p'>{lessonDescription}</div>}
            <div>
                {editingLesson && <EditLesson
                    idCollection={idCollection}
                    idLesson={lesson.id}
                    name={lessonName}
                    description={lessonDescription}
                    editLesson={editLesson}
                    deleteLesson={reload}
                />}
                <button className="button-styled hover-top-right" onClick={() => setEditingLesson(oldValue => !oldValue)}>
                    {editingLesson ? 'Cancelar' : 'Editar'}
                </button>
            </div>
            {cards.length == 0 ? <div className='p'>Esta lição ainda não possui cartões.</div> : <table>
                <thead>
                    <tr>
                        <th className='table-cell-card-number'>
                            #
                        </th>
                        <th className='table-cell-card-type'>
                            Tipo
                        </th>
                        <th>
                            Cartão
                        </th>
                        <th className='table-cell-card-button'>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {cards.map((card, index) => (
                        <Card
                            key={card.id}
                            idCollection={idCollection}
                            idLesson={lesson.id}
                            reload={reload}
                            card={card}
                            removeCard={removeCard}
                            moveCardUp={index > 0 ? (() => moveCardUp(index)) : null}
                            moveCardDown={(index !== cards.length - 1) ? (() => moveCardDown(index)) : null}
                        />
                    ))}
                </tbody>
            </table>}
            <div className='p'>
                <button className="button-styled" onClick={() => setAddingCard(old => !old)}>
                    {addingCard ? 'Cancelar' : 'Adicionar Cartão'}
                </button>
            </div>
            <div className='p'>
                {addingCard && <AddCard
                    idCollection={idCollection}
                    idLesson={lesson.id}
                    reload={reload} />}
            </div>
        </div>
    )
}

export default Lesson