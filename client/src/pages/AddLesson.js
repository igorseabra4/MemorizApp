import React, { useState } from 'react'
import axios from 'axios'
import token from '../util/auth'

function AddLesson({ idCollection, setAddingLesson }) {
    const [lessonName, setLessonName] = useState("")
    const [lessonDescription, setLessonDescription] = useState("")

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
        axios.post(`http://localhost:3001/collections/${idCollection}/lessons`, {
            name: lessonName,
            description: lessonDescription
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                setAddingLesson(false)
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
            <button className="button-styled">
                Adicionar
            </button>
        </form>
    )
}

export default AddLesson