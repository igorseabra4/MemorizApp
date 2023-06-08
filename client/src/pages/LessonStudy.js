import React from 'react'
import axios from 'axios'
import token from '../util/auth'

function LessonStudy({ idCollection, idLesson, lessonName, lessonDescription, lessonOrder, countNew, newCardsCount, getPending }) {
    const cardsToMove = newCardsCount > countNew ? countNew : newCardsCount

    const moveCards = () => {
        axios.post(`http://localhost:3001/collections/${idCollection}/lessons/${idLesson}/begin?limit=${cardsToMove}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                getPending()
            })
            .catch(err => {
                alert(`Error: ${err.response.data.error}`)
            })
    }

    return (
        <div className='container'>
            <h4>Lição #{lessonOrder}: {lessonName} ({countNew} cartões novos)</h4>
            <div className='p'>
                {cardsToMove > 0 && <button className="button-styled" onClick={moveCards}>
                    Mover {cardsToMove} para estudo
                </button>}
            </div>
            <div className='p'>{lessonDescription}</div>
        </div>
    )
}

export default LessonStudy