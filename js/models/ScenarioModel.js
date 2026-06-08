export default class ScenarioModel {
    constructor() {
        this.storageKey = 'respira_scenarios';
        const stored = JSON.parse(localStorage.getItem(this.storageKey));

        if (Array.isArray(stored) && stored.length > 0) {
            this.scenarios = this.normalizeScenarios(stored);
        } else {
            this.scenarios = this.getDefaultScenarios();
            this.saveScenarios(this.scenarios);
        }
    }

    normalizeScenarios(list) {
        let hasChanges = false;

        const normalized = list.map((scenario, index) => {
            const copy = { ...scenario };

            if (!copy.id) {
                copy.id = index + 1;
                hasChanges = true;
            }

            if (!copy.type) {
                copy.type = 'social';
                hasChanges = true;
            }

            if (!Array.isArray(copy.options) || copy.options.length === 0) {
                copy.options = [this.createCompletionOption(10)];
                hasChanges = true;
            }

            return copy;
        });

        if (hasChanges) {
            this.saveScenarios(normalized);
        }

        return normalized;
    }

    saveScenarios(list) {
        localStorage.setItem(this.storageKey, JSON.stringify(list));
    }

    createCompletionOption(points) {
        const safePoints = Number.isFinite(points) && points > 0 ? Math.round(points) : 10;
        return {
            text: 'Concluí o exercício',
            points: safePoints,
            feedback: 'Excelente! Registaste o exercício como concluído.'
        };
    }

    getDefaultScenarios() {
        return [
            {
                id: 1,
                title: 'No Supermercado',
                type: 'social',
                text: 'A caixa do supermercado enganou-se no troco e deu-te menos 2 euros. A fila atrás de ti está grande.',
                options: [
                    { text: 'Ficas calado e vais embora para não atrapalhar a fila.', points: 0, feedback: 'Evitaste a situação por medo do confronto. Tenta ser mais assertivo, os teus direitos importam!' },
                    { text: 'Falas bem alto dizendo que te estão a tentar roubar.', points: 0, feedback: 'Foste agressivo. A assertividade procura o respeito mútuo sem ataques a terceiros.' },
                    { text: 'Dizes calmamente: "Desculpe, acho que faltam 2 euros no troco."', points: 10, feedback: 'Excelente! Foste claro, educado e defendeste a tua posição com confiança.' }
                ]
            },
            {
                id: 2,
                title: 'Apresentação na Aula',
                type: 'social',
                text: 'O professor chamou o teu nome para apresentar o trabalho perante a turma inteira. Sentes o coração a bater muito forte.',
                options: [
                    { text: 'Levantas-te devagar, respiras fundo 1 vez e começas a falar.', points: 10, feedback: 'Muito bem! Usaste a âncora da respiração (ancoragem) e enfrentaste de imediato a situação.' },
                    { text: 'Dizes que te sentes mal e pedes para não apresentar hoje.', points: 0, feedback: 'Fugiste do desafio. A fuga traz alívio momentâneo, mas a exposição gradual é o que diminui o medo a longo prazo.' },
                    { text: 'Lês tudo muito rápido a olhar para o chão, só para despachar.', points: 5, feedback: 'Conseguiste enfrentar grande parte do medo! Da próxima vez, tenta treinar o contacto visual e fazer as pausas.' }
                ]
            },
            {
                id: 3,
                title: 'Falar ao Telemóvel',
                type: 'social',
                text: 'O teu telemóvel está a tocar. É um número que não tens gravado e estás à espera de uma resposta sobre uma entrevista.',
                options: [
                    { text: 'Deixas tocar até ao fim e depois pesquisas o número no Google.', points: 0, feedback: 'A evitação prolonga a tua ansiedade. Enfrentar a chamada quebra imediatamente o ciclo da preocupação.' },
                    { text: 'Atendes prontamente: "Estou sim, bom dia!"', points: 10, feedback: 'Parabéns! Atender chamadas desconhecidas é um grande passo na habituação social.' },
                    { text: 'Passas o telemóvel a um amigo ou pai para atenderem por ti.', points: 0, feedback: 'Delegaste a situação (comportamento de segurança). Para ganhares autonomia, tenta atender tu mesmo num ambiente calmo.' }
                ]
            },
            {
                id: 4,
                title: 'Iniciar uma Conversa Curta',
                type: 'soft-skills',
                text: 'Escolhe alguém da turma ou do trabalho e faz uma pergunta aberta ("Como correu o teu dia?", "O que achaste da aula?").',
                options: [this.createCompletionOption(15)]
            },
            {
                id: 5,
                title: 'Pedir Ajuda com Clareza',
                type: 'soft-skills',
                text: 'Pede ajuda a um colega ou professor. Diz o que precisas e agradece no final.',
                options: [this.createCompletionOption(15)]
            },
            {
                id: 6,
                title: 'Dar um Elogio Sincero',
                type: 'vida-real',
                text: 'Elogia alguém de forma simples e sincera ("Gostei da tua apresentação", "Boa explicação!").',
                options: [this.createCompletionOption(15)]
            },
            {
                id: 7,
                title: 'Pedir Indicações na Rua',
                type: 'vida-real',
                text: 'Pede indicações a uma pessoa na rua ou num estabelecimento. Mantém contacto visual e agradece.',
                options: [this.createCompletionOption(20)]
            },
            {
                id: 8,
                title: 'Fazer uma Pergunta em Aula',
                type: 'vida-real',
                text: 'Durante uma aula, coloca uma pergunta curta. Pode ser algo que te ajude a compreender melhor.',
                options: [this.createCompletionOption(20)]
            },
            {
                id: 9,
                title: 'Apresentação Final de POO',
                type: 'vida-real',
                text: 'Faz a apresentação final de POO em frente aos professores. Respira fundo, fala com calma e mantém a tua estrutura.',
                options: [this.createCompletionOption(50)]
            },
            {
                id: 10,
                title: 'Telefonar para Marcar',
                type: 'soft-skills',
                text: 'Faz uma chamada curta para marcar ou confirmar algo simples. Prepara 2 frases antes de ligar.',
                options: [this.createCompletionOption(15)]
            }
        ];
    }

    getAllScenarios() {
        return this.scenarios;
    }

    addScenario({ title, text, points, type }) {
        const trimmedTitle = title ? title.trim() : '';
        const trimmedText = text ? text.trim() : '';

        if (!trimmedTitle || !trimmedText) {
            return null;
        }

        const safeType = type || 'soft-skills';
        const nextId = this.scenarios.reduce((maxId, item) => Math.max(maxId, item.id || 0), 0) + 1;
        const scenario = {
            id: nextId,
            title: trimmedTitle,
            type: safeType,
            text: trimmedText,
            options: [this.createCompletionOption(points)]
        };

        this.scenarios.push(scenario);
        this.saveScenarios(this.scenarios);
        return scenario;
    }

    removeScenario(id) {
        const before = this.scenarios.length;
        this.scenarios = this.scenarios.filter(item => item.id !== id);
        if (this.scenarios.length !== before) {
            this.saveScenarios(this.scenarios);
            return true;
        }
        return false;
    }
}