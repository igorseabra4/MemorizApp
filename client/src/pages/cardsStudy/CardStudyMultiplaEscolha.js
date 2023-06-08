import { useState } from 'react'
import shuffle from '../../util/shuffle'
import { CardAnswer } from '../../util/enum/CardAnswer'

function CardStudyMultiplaEscolha({ card, responder, getPending }) {
    var alternativas = card.opcoes
    if (card.aleatorio)
        alternativas = shuffle(alternativas)

    const [opcoes, setOpcoes] = useState(alternativas.map(alternativa => ({
        ...alternativa,
        selecionado: false
    })))

    const [revelado, setRevelado] = useState(false)
    const [pontuacao, setPontuacao] = useState(null)
    const [textoAcertou, setTextoAcertou] = useState('')

    const handleChangeResposta = (index, checked) => {
        if (revelado)
            return

        setOpcoes(opcoes => {
            var newOpcoes = [...opcoes]
            newOpcoes[index].selecionado = checked
            return newOpcoes
        })
    }

    const handleClick = () => {
        var pontos = 0
        var total = 0
        for (let opcao of opcoes) {
            if (opcao.correto)
                total++
            else if (opcao.selecionado)
                total++
            if (opcao.selecionado && opcao.correto)
                pontos++
        }
        const newPontuacao = pontos / total
        setPontuacao(newPontuacao)
        responder(pontos === total ? CardAnswer.CORRETO : CardAnswer.ERRADO)
        setTextoAcertou(pontos === total ? '✅ Acertou!' : '❌ Errou!')
        setRevelado(true)
    }

    return (
        <div>
            <div className="card-studying">
                <div className='card-studying-text'>
                    {card.pergunta}
                </div>
                <div className='p card-property'>
                    Alternativas
                </div>
                <div className="card-studying-paragrafos">
                    {opcoes.map((opcao, index) =>
                        <div key={index} className='card-lista-item'>
                            <div
                                className='card-studying-text'
                                onClick={() => handleChangeResposta(index, !opcao.selecionado)}
                            >
                                {opcao.texto}
                            </div>
                            &nbsp;
                            <input
                                className='card-checkbox-check'
                                type="checkbox"
                                id="inputBottom"
                                name="resposta"
                                onChange={(event) => handleChangeResposta(index, event.target.checked)}
                                checked={opcao.selecionado}
                                disabled={revelado}
                            />
                            {revelado && <input
                                className='card-checkbox-check'
                                type="checkbox"
                                id="inputBottomAnswer"
                                checked={opcao.correto}
                                disabled
                            />}
                        </div>
                    )}
                </div>
                {revelado &&
                    <div className='p card-property'>
                        Resposta
                    </div>}
                {revelado &&
                    <div className='card-studying-text'>
                        Pontuação: {pontuacao * 100}%
                        <br />
                        {textoAcertou}
                    </div>}
                {revelado ?
                    <button className="button-styled" onClick={getPending}>
                        Continuar
                    </button> :
                    <button className="button-styled" onClick={handleClick}>
                        Enviar
                    </button>
                }
            </div>
        </div >
    )
}

export default CardStudyMultiplaEscolha