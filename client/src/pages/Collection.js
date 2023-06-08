import React from 'react'
import axios from 'axios'
import token from '../util/auth'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EditCollection from './EditCollection'
import Lesson from './Lesson'
import AddLesson from './AddLesson'

function Collection() {
    const [collectionName, setCollectionName] = useState("")
    const [lessons, setLessons] = useState([])
    const [cards, setCards] = useState([])
    const [config, setConfig] = useState({
        random: false,
        defaultNewCards: 5
    })

    const [editingCollection, setEditingCollection] = useState(false)
    const [addingLesson, setAddingLesson] = useState(false)

    const { idCollection } = useParams()

    const reload = () => {
        axios.get(`http://localhost:3001/collections/${idCollection}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            setCollectionName(res.data.name)
            setLessons(res.data.lessons)
            setCards(res.data.cards)
            setConfig(res.data.settings)
        })
    }

    useEffect(reload, [idCollection, addingLesson])

    const moveLessonUp = index => {
        var lessonIds = lessons.map(lesson => lesson.id)
        lessonIds[index] = lessons[index - 1].id
        lessonIds[index - 1] = lessons[index].id
        axios.put(`http://localhost:3001/collections/${idCollection}/lessons/reorder`, {
            lessons: lessonIds
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

    const moveLessonDown = index => {
        var lessonIds = lessons.map(lesson => lesson.id)
        lessonIds[index] = lessons[index + 1].id
        lessonIds[index + 1] = lessons[index].id
        axios.put(`http://localhost:3001/collections/${idCollection}/lessons/reorder`, {
            lessons: lessonIds
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

    const [salvandoConfigTexto, setSalvandoConfigTexto] = useState(false)

    const saveConfig = event => {
        event.preventDefault()
        axios.put(`http://localhost:3001/collections/${idCollection}`, {
            settings: config
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                setEditingCollection(false, collectionName)
                setSalvandoConfigTexto(true)
                setTimeout(() => setSalvandoConfigTexto(false), 1500)
            })
            .catch(err => {
                alert(`Error: ${err.response.data.error}`)
            })
    }

    const handleDefaultNewCardsChange = value => {
        setConfig(config => ({
            ...config,
            defaultNewCards: parseInt(value)
        }))
    }

    const handleConfigChange = (settingName, checked) => {
        setConfig(config => ({
            ...config,
            [settingName]: checked
        }))
    }

    return (
        <div>
            <div className='container'>
                {!editingCollection && <h3>{collectionName}</h3>}
                {editingCollection && <EditCollection
                    idCollection={idCollection}
                    oldName={collectionName}
                    setEditingCollection={(value, name) => {
                        setEditingCollection(value)
                        setCollectionName(name)
                    }}
                    isLesson={false}
                />}
                <button className="button-styled hover-top-right" onClick={() => setEditingCollection(old => !old)}>
                    {editingCollection ? 'Cancelar' : 'Editar'}
                </button>
            </div>
            <div className='container'>
                <h4>Configurações</h4>
                <form className='modal' onSubmit={saveConfig}>
                    <div className='card-type-chooser'>
                        <div className='card-checkbox'>
                            <label htmlFor="random">Estudar em ordem aleatória:</label>
                            <input
                                className='card-checkbox-check'
                                type="checkbox"
                                id="random"
                                onChange={(event) => handleConfigChange(event.target.id, event.target.checked)}
                                checked={config.random}
                            />
                        </div>
                        <div className='card-checkbox'>
                            <label htmlFor="defaultNewCards">Novos cartões por vez (padrão):</label>
                            <input
                                style={{ width: '50%' }}
                                type="number"
                                id="defaultNewCards"
                                name="name"
                                value={config.defaultNewCards}
                                onChange={(event) => handleDefaultNewCardsChange(event.target.value)}
                            />
                        </div>
                    </div>
                    <button className="button-styled">
                        {salvandoConfigTexto ? 'Salvo!' : 'Salvar'}
                    </button>
                </form>
            </div>
            {lessons.map((lesson, index) => (<Lesson
                key={lesson.id}
                idCollection={idCollection}
                lesson={lesson}
                cards={cards.filter(card => card.idLesson === lesson.id)}
                reload={reload}
                moveLessonUp={index > 0 ? (() => moveLessonUp(index)) : null}
                moveLessonDown={(index != lessons.length - 1) ? (() => moveLessonDown(index)) : null}
            />))}
            <div className='p'>
                <button className="button-styled" onClick={() => setAddingLesson(old => !old)}>
                    {addingLesson ? 'Cancelar' : 'Adicionar Lição'}
                </button>
            </div>
            <div className='p'>
                {addingLesson && <AddLesson idCollection={idCollection} setAddingLesson={setAddingLesson} />}
            </div>
            <div className='p'>
                <a href={`/collections/`}>Voltar</a>
            </div>
        </div >
    )
}

export default Collection