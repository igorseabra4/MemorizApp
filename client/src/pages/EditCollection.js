import React, { useState } from 'react'
import axios from 'axios'
import token from '../util/auth'
import { useNavigate } from 'react-router-dom'

function EditCollection({ idCollection, oldName, setEditingCollection }) {
    const [collectionName, setCollectionName] = useState(oldName)

    const handleCollectionNameChange = event => {
        const { value } = event.target
        setCollectionName(value)
    }

    const onSubmit = event => {
        event.preventDefault()
        axios.put(`http://localhost:3001/collections/${idCollection}`, {
            name: collectionName
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                setEditingCollection(false, collectionName)
            })
            .catch(err => {
                alert(`Error: ${err.response.data.error}`)
            })
    }

    const navigate = useNavigate()
    const apagarColecao = event => {
        event.preventDefault()
        axios.delete(`http://localhost:3001/collections/${idCollection}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                navigate(`/collections/`)
                navigate(0)
            })
            .catch(err => {
                alert(`Error: ${err.response.data.error}`)
            })
    }

    return (
        <form className='modal' onSubmit={onSubmit}>
            <label htmlFor="selectCollectionName">Nome da coleção:</label>
            <input
                type="text"
                placeholder="Nome da coleção"
                id="selectCollectionName"
                name="name"
                value={collectionName}
                onChange={handleCollectionNameChange}
            />
            <div className='buttons'>
                <button className="button-styled">
                    Salvar
                </button>
                <button type='button' className="button-styled button-red" onClick={apagarColecao}>
                    Apagar
                </button>
            </div>
        </form>
    )
}

export default EditCollection