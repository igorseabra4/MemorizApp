import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import token from '../util/auth'
import AddCollection from './AddCollection'

function Collections() {
    const [collections, setCollections] = useState([])

    const [addingCollection, setAddingCollection] = useState(false)

    useEffect(() => {
        axios.get("http://localhost:3001/collections", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            setCollections(res.data)
        })
    }, [addingCollection])

    return (
        <div>
            {collections.length == 0 ? <div className='p'>Você ainda não possui coleções. Clique no botão abaixo para adicionar uma.</div> : <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Cartões (estudar agora)</th>
                        <th>Cartões</th>
                        <th>Cartões (novos)</th>
                        <th>Cartões (em revisão)</th>
                        <th>Cartões (suspensos)</th>
                        <th className='table-cell-card-button'></th>
                    </tr>
                </thead>
                <tbody>
                    {collections.map(value => (
                        <tr key={value.id}>
                            <td>
                                <a href={`/collections/${value.id}/study`}>{value.name}</a>
                            </td>
                            <td>{value.cardCountLearning + value.cardCountDue + value.cardCountFailed}</td>
                            <td>{value.cardCount}</td>
                            <td>{value.cardCountNew}</td>
                            <td>{value.cardCountReview}</td>
                            <td>{value.cardCountBuried}</td>
                            <td className='table-cell-center table-cell-card-button'>
                                <a href={`/collections/${value.id}`}>Editar</a>
                            </td>
                        </tr >)
                    )}
                </tbody>
            </table>}
            <div className='p'>
                <button className="button-styled" onClick={() => setAddingCollection(old => !old)}>
                    {addingCollection ? 'Cancelar' : 'Adicionar Coleção'}
                </button>
            </div>
            <div className='p'>
                {addingCollection && <AddCollection setAddingCollection={setAddingCollection} />}
            </div>
        </div>
    )
}

export default Collections