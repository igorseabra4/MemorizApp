import React, { useState } from 'react'
import axios from 'axios'
import token from '../util/auth'

function AddCollection({ setAddingCollection }) {
    const [collectionName, setCollectionName] = useState("")

    const handleCollectionNameChange = event => {
        const { value } = event.target
        setCollectionName(value)
    }

    const onSubmit = event => {
        event.preventDefault()
        axios.post(`http://localhost:3001/collections/`, {
            name: collectionName
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                setAddingCollection(false)
            })
            .catch(err => {
                alert(`Error: ${err.response.data.error}`)
            })
    }

    return (
        <div>
            <form onSubmit={onSubmit} className='p modal'>
                <label htmlFor="selectCollectionName">Nome da coleção:</label>
                <input
                    type="text"
                    placeholder="Nome da coleção"
                    id="selectCollectionName"
                    name="name"
                    value={collectionName}
                    onChange={handleCollectionNameChange}
                />
                <button className="button-styled">
                    Adicionar
                </button>
            </form>
        </div>
    )
}

export default AddCollection