import React, { useState } from 'react'
import axios from 'axios'
import token from '../util/auth'

function EditLesson({ idCollection, idLesson, name, description, editLesson, deleteLesson }) {
    const [lessonName, setLessonName] = useState(name)
    const [lessonDescription, setLessonDescription] = useState(description)

    const handleLessonNameChange = event => {
        const { value } = event.target
        setLessonName(value)
    }

    const handleLessonDescriptionChange = event => {
        const { value } = event.target
        setLessonDescription(value)
    }

    const onSubmit = event => {
        event.preventDefault()
        axios.put(`http://localhost:3001/collections/${idCollection}/lessons/${idLesson}`, {
            name: lessonName,
            description: lessonDescription
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                editLesson(false, lessonName, lessonDescription)
            })
            .catch(err => {
                alert(`Error: ${err.response.data.error}`)
            })
    }

    const apagarLicao = () => {
        axios.delete(`http://localhost:3001/collections/${idCollection}/lessons/${idLesson}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                deleteLesson()
            })
            .catch(err => {
                alert(`Error: ${err.response.data.error}`)
            })
    }

    return (
        <form className='modal' onSubmit={onSubmit}>
            <label htmlFor="selectLessonName">Nome da lição:</label>
            <input
                type="text"
                placeholder="Nome da lição"
                id="selectLessonName"
                name="name"
                value={lessonName}
                onChange={handleLessonNameChange}
            />
            <label htmlFor="selectLessonDescription">Descrição da lição:</label>
            <textarea
                placeholder="Descrição da lição"
                id="selectLessonDescription"
                name="description"
                value={lessonDescription}
                onChange={handleLessonDescriptionChange}
            />
            <div className='buttons'>
                <button className="button-styled">
                    Salvar
                </button>
                <button type='button' className="button-styled button-red" onClick={apagarLicao}>
                    Apagar
                </button>
            </div>
        </form>
    )
}

export default EditLesson