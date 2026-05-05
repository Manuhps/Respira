export default class ScenarioModel {
    constructor() {
        this.scenarios = [
            {
                id: 1,
                title: '🛒 No Supermercado',
                text: 'A caixa do supermercado enganou-se no troco e deu-te menos 2 euros. A fila atrás de ti está grande.',
                options: [
                    { text: 'Ficas calado e vais embora para não atrapalhar a fila.', points: 0, feedback: 'Evitaste a situação por medo do confronto. Tenta ser mais assertivo, os teus direitos importam!' },
                    { text: 'Falas bem alto dizendo que te estão a tentar roubar.', points: 0, feedback: 'Foste agressivo. A assertividade procura o respeito mútuo sem ataques a terceiros.' },
                    { text: 'Dizes calmamente: "Desculpe, acho que faltam 2 euros no troco."', points: 10, feedback: 'Excelente! Foste claro, educado e defendeste a tua posição com confiança.' }
                ]
            },
            {
                id: 2,
                title: '🏫 Apresentação na Aula',
                text: 'O professor chamou o teu nome para apresentar o trabalho perante a turma inteira. Sentes o coração a bater muito forte.',
                options: [
                    { text: 'Levantas-te devagar, respiras fundo 1 vez e começas a falar.', points: 10, feedback: 'Muito bem! Usaste a âncora da respiração (ancoragem) e enfrentaste de imediato a situação.' },
                    { text: 'Dizes que te sentes mal e pedes para não apresentar hoje.', points: 0, feedback: 'Fugiste do desafio. A fuga traz alívio momentâneo, mas a exposição gradual é o que diminui o medo a longo prazo.' },
                    { text: 'Lês tudo muito rápido a olhar para o chão, só para despachar.', points: 5, feedback: 'Conseguiste enfrentar grande parte do medo! Da próxima vez, tenta treinar o contacto visual e fazer as pausas.' }
                ]
            },
            {
                id: 3,
                title: '📱 Falar ao Telemóvel',
                text: 'O teu telemóvel está a tocar. É um número que não tens gravado e estás à espera de uma resposta sobre uma entrevista.',
                options: [
                    { text: 'Deixas tocar até ao fim e depois pesquisas o número no Google.', points: 0, feedback: 'A evitação prolonga a tua ansiedade. Enfrentar a chamada quebra imediatamente o ciclo da preocupação.' },
                    { text: 'Atendes prontamente: "Estou sim, bom dia!"', points: 10, feedback: 'Parabéns! Atender chamadas desconhecidas é um grande passo na habituação social.' },
                    { text: 'Passas o telemóvel a um amigo ou pai para atenderem por ti.', points: 0, feedback: 'Delegaste a situação (comportamento de segurança). Para ganhares autonomia, tenta atender tu mesmo num ambiente calmo.' }
                ]
            }
        ];
    }

    getAllScenarios() {
        return this.scenarios;
    }
}