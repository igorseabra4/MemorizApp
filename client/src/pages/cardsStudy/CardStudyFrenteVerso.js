import { useState } from 'react'
import { CardStatus } from '../../util/enum/CardStatus'
import { CardAnswer } from '../../util/enum/CardAnswer'

function CardStudyFrenteVerso({ idCardStatus, card, responder }) {
    const [revelado, setRevelado] = useState(false)

    return (
        <div>
            <div className="card-studying">
                <div className='p card-property'>
                    Frente
                </div>
                <div className='card-studying-text'>
                    {card.frente}
                </div>
                {revelado &&
                    <div className='p card-property'>
                        Verso
                    </div>}
                {revelado &&
                    <div className='card-studying-text'>
                        {card.verso}
                    </div>}
                {revelado ?
                    <div className='buttons'>
                        <button className="button-styled" onClick={() => responder(CardAnswer.ERRADO, true)}>
                            Errei
                        </button>
                        &nbsp;
                        {idCardStatus === CardStatus.REVISAO &&
                            <button className="button-styled" onClick={() => responder(CardAnswer.DIFICIL, true)}>
                                Acertei (Difícil)
                            </button>}
                        {idCardStatus === CardStatus.REVISAO && <>&nbsp;</>}
                        <button className="button-styled" onClick={() => responder(CardAnswer.CORRETO, true)}>
                            Acertei (Ok)
                        </button>
                        {idCardStatus === CardStatus.REVISAO && <>&nbsp;</>}
                        {idCardStatus === CardStatus.REVISAO &&
                            <button className="button-styled" onClick={() => responder(CardAnswer.FACIL, true)}>
                                Acertei (Fácil)
                            </button>}
                    </div>
                    :
                    <button className="button-styled" onClick={() => setRevelado(true)}>
                        Revelar
                    </button>}
            </div>
        </div >
    )
}

export default CardStudyFrenteVerso