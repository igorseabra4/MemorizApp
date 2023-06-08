const { CardType } = require('../enums/CardType')

module.exports = (idCardType, body) => {
    switch (idCardType) {
        case CardType.FRENTE_E_VERSO: {
            const { frente, verso } = body.card
            if (frente === undefined)
                throw "O campo frente não está definido."
            if (typeof frente != 'string')
                throw "O campo frente precisa ser uma string."
            if (frente.length === 0)
                throw "O campo frente não pode ser vazio."
            if (verso === undefined)
                throw "O campo verso não está definido."
            if (typeof verso != 'string')
                throw "O campo verso precisa ser uma string."
            if (verso.length === 0)
                throw "O campo verso não pode ser vazio."
            return { frente, verso }
        }
        case CardType.RESPOSTA_POR_ESCRITO: {
            const { pergunta, resposta } = body.card
            if (pergunta === undefined)
                throw "O campo pergunta não está definido."
            if (typeof pergunta != 'string')
                throw "O campo pergunta precisa ser uma string."
            if (pergunta.length === 0)
                throw "O campo pergunta não pode ser vazio."
            if (resposta === undefined)
                throw "O campo resposta não está definido."
            if (typeof resposta != 'string')
                throw "O campo resposta precisa ser uma string."
            if (resposta.length === 0)
                throw "O campo resposta não pode ser vazio."
            return { pergunta, resposta }
        }
        case CardType.VERDADEIRO_OU_FALSO: {
            const { frente, resposta } = body.card
            if (frente === undefined)
                throw "O campo frente não está definido."
            if (typeof frente != 'string')
                throw "O campo frente precisa ser uma string."
            if (frente.length == 0)
                throw "O campo frente não pode ser vazio."
            if (resposta === undefined)
                throw "O campo resposta não está definido."
            if (typeof resposta != "boolean")
                throw "O campo resposta precisa ser um valor booleano."
            return { frente, resposta }
        }
        case CardType.ASSOCIAR_COLUNAS: {
            const { proposta, itens } = body.card
            if (proposta === undefined)
                throw "O campo proposta não está definido."
            if (typeof proposta != 'string')
                throw "O campo proposta precisa ser uma string."
            if (itens === undefined)
                throw "O campo itens não está definido."
            if (itens.length < 2)
                throw "O campo itens precisa ter pelo menos 2 itens."
            var newItens = []
            for (var item of itens) {
                const { esquerda, direita } = item
                if (esquerda === undefined)
                    throw "O campo esquerda de um item não está definido."
                if (typeof esquerda != 'string')
                    throw "O campo esquerda do item precisa ser uma string."
                if (esquerda.length == 0)
                    throw "O campo esquerda do item não pode ser vazio."
                if (direita === undefined)
                    throw "O campo direita de um item não está definido."
                if (typeof direita != 'string')
                    throw "O campo direita do item precisa ser uma string."
                if (direita.length == 0)
                    throw "O campo direita do item não pode ser vazio."
                newItens.push({ esquerda, direita })
            }
            return { proposta, itens: newItens }
        }
        case CardType.ORDENAR_PARAGRAFOS: {
            const { proposta, paragrafos } = body.card
            if (proposta === undefined)
                throw "O campo proposta não está definido."
            if (typeof proposta != 'string')
                throw "O campo proposta precisa ser uma string."
            if (paragrafos === undefined)
                throw "O campo paragrafos não está definido."
            if (paragrafos.length === 0)
                throw "O campo paragrafos não pode ser vazio."
            for (var paragrafo of paragrafos) {
                if (typeof paragrafo != 'string')
                    throw "O texto do parágrafo precisa ser uma string."
                if (paragrafo.length == 0)
                    throw "O texto do parágrafo não pode ser vazio."
            }
            return { proposta, paragrafos }
        }
        case CardType.MULTIPLA_ESCOLHA: {
            const { pergunta, aleatorio, opcoes } = body.card
            if (pergunta === undefined)
                throw "O campo pergunta não está definido."
            if (typeof pergunta != 'string')
                throw "O campo pergunta precisa ser uma string."
            if (pergunta.length == 0)
                throw "O campo pergunta não pode ser vazio."
            if (opcoes === undefined)
                throw "O campo opcoes não está definido."
            if (opcoes.length < 2)
                throw "O campo opcoes precisa ter pelo menos 2 itens."
            if (aleatorio === undefined)
                throw "O campo aleatorio não está definido."
            if (typeof aleatorio != "boolean")
                throw "O campo aleatorio precisa ser um valor booleano."
            var newOpcoes = []
            var temCorreto = false
            var temErrado = false
            for (var opcao of opcoes) {
                const { texto, correto } = opcao
                if (texto === undefined)
                    throw "O campo texto de uma opção não está definido."
                if (typeof texto != 'string')
                    throw "O campo texto da opção precisa ser uma string."
                if (texto.length == 0)
                    throw "O campo texto da opção não pode ser vazio."
                if (correto === undefined)
                    throw "O campo correto de uma opção não está definido."
                if (typeof correto != "boolean")
                    throw "O campo correto precisa ser um valor booleano."
                if (correto)
                    temCorreto = true
                else
                    temErrado = true
                newOpcoes.push({ texto, correto })
            }
            if (!temCorreto)
                throw "Pelo menos um item precisa ser uma opção correta."
            if (!temErrado)
                throw "Pelo menos um item precisa ser uma opção errada."
            return { pergunta, aleatorio, opcoes: newOpcoes }
        }
        case CardType.PREENCHER_LACUNAS: {
            const { texto, lacunas } = body.card
            if (texto === undefined)
                throw "O campo texto não está definido."
            if (lacunas === undefined)
                throw "O campo lacunas não está definido."
            return { texto, lacunas }
        }
    }
    throw `Tipo de cartão ${idCardType} não suportado.`
}