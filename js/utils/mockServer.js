/**
 * MockServer — Simula um servidor que injeta dados iniciais na aplicação.
 * Na primeira utilização, guarda os dados no localStorage.
 * Nas utilizações seguintes, não sobrescreve (os dados já persistem).
 */
export default class MockServer {

    // ── Dados iniciais dos cenários ──
    static getDefaultScenarios() {
        return [
            {
                id: 1, title: 'No Supermercado', type: 'social',
                text: 'A caixa do supermercado enganou-se no troco e deu-te menos 2 euros. A fila atrás de ti está grande.',
                options: [
                    { text: 'Ficas calado e vais embora para não atrapalhar a fila.', points: 0, feedback: 'Evitaste a situação por medo do confronto. Tenta ser mais assertivo, os teus direitos importam!' },
                    { text: 'Falas bem alto dizendo que te estão a tentar roubar.', points: 0, feedback: 'Foste agressivo. A assertividade procura o respeito mútuo sem ataques a terceiros.' },
                    { text: 'Dizes calmamente: "Desculpe, acho que faltam 2 euros no troco."', points: 10, feedback: 'Excelente! Foste claro, educado e defendeste a tua posição com confiança.' }
                ]
            },
            {
                id: 2, title: 'Apresentação na Aula', type: 'social',
                text: 'O professor chamou o teu nome para apresentar o trabalho perante a turma inteira. Sentes o coração a bater muito forte.',
                options: [
                    { text: 'Levantas-te devagar, respiras fundo 1 vez e começas a falar.', points: 10, feedback: 'Muito bem! Usaste a âncora da respiração e enfrentaste de imediato a situação.' },
                    { text: 'Dizes que te sentes mal e pedes para não apresentar hoje.', points: 0, feedback: 'Fugiste do desafio. A fuga traz alívio momentâneo, mas a exposição gradual diminui o medo a longo prazo.' },
                    { text: 'Lês tudo muito rápido a olhar para o chão, só para despachar.', points: 5, feedback: 'Conseguiste enfrentar grande parte do medo! Da próxima vez, treina o contacto visual.' }
                ]
            },
            {
                id: 3, title: 'Falar ao Telemóvel', type: 'social',
                text: 'O teu telemóvel está a tocar. É um número que não tens gravado e estás à espera de uma resposta sobre uma entrevista.',
                options: [
                    { text: 'Deixas tocar até ao fim e depois pesquisas o número no Google.', points: 0, feedback: 'A evitação prolonga a tua ansiedade. Enfrentar a chamada quebra o ciclo da preocupação.' },
                    { text: 'Atendes prontamente: "Estou sim, bom dia!"', points: 10, feedback: 'Parabéns! Atender chamadas desconhecidas é um grande passo na habituação social.' },
                    { text: 'Passas o telemóvel a um amigo para atender por ti.', points: 0, feedback: 'Delegaste a situação. Para ganhares autonomia, tenta atender tu mesmo.' }
                ]
            },
            {
                id: 4, title: 'Iniciar uma Conversa Curta', type: 'soft-skills',
                text: 'Escolhe alguém da turma e faz uma pergunta aberta ("Como correu o teu dia?", "O que achaste da aula?").',
                options: [{ text: 'Concluí o exercício', points: 15, feedback: 'Excelente! Registaste o exercício como concluído.' }]
            },
            {
                id: 5, title: 'Pedir Ajuda com Clareza', type: 'soft-skills',
                text: 'Pede ajuda a um colega ou professor. Diz o que precisas e agradece no final.',
                options: [{ text: 'Concluí o exercício', points: 15, feedback: 'Excelente! Registaste o exercício como concluído.' }]
            },
            {
                id: 6, title: 'Dar um Elogio Sincero', type: 'vida-real',
                text: 'Elogia alguém de forma simples e sincera ("Gostei da tua apresentação", "Boa explicação!").',
                options: [{ text: 'Concluí o exercício', points: 15, feedback: 'Excelente! Registaste o exercício como concluído.' }]
            },
            {
                id: 7, title: 'Pedir Indicações na Rua', type: 'vida-real',
                text: 'Pede indicações a uma pessoa na rua ou num estabelecimento. Mantém contacto visual e agradece.',
                options: [{ text: 'Concluí o exercício', points: 20, feedback: 'Excelente! Registaste o exercício como concluído.' }]
            },
            {
                id: 8, title: 'Fazer uma Pergunta em Aula', type: 'vida-real',
                text: 'Durante uma aula, coloca uma pergunta curta. Pode ser algo que te ajude a compreender melhor.',
                options: [{ text: 'Concluí o exercício', points: 20, feedback: 'Excelente! Registaste o exercício como concluído.' }]
            },
            {
                id: 9, title: 'Apresentação Final de POO', type: 'vida-real',
                text: 'Faz a apresentação final de POO em frente aos professores. Respira fundo, fala com calma e mantém a tua estrutura.',
                options: [{ text: 'Concluí o exercício', points: 50, feedback: 'Excelente! Registaste o exercício como concluído.' }]
            },
            {
                id: 10, title: 'Telefonar para Marcar', type: 'soft-skills',
                text: 'Faz uma chamada curta para marcar ou confirmar algo simples. Prepara 2 frases antes de ligar.',
                options: [{ text: 'Concluí o exercício', points: 15, feedback: 'Excelente! Registaste o exercício como concluído.' }]
            },
            {
                id: 11, title: 'Dizer "Não" com Educação', type: 'soft-skills',
                text: 'Pratica rejeitar um pedido de forma assertiva e educada. Exemplo: "Gostava muito de ajudar, mas neste momento não consigo."',
                options: [{ text: 'Concluí o exercício', points: 20, feedback: 'Excelente! Dizer "não" é um direito teu e demonstra respeito pelo teu próprio tempo.' }]
            },
            {
                id: 12, title: 'Conversar com um Lojista', type: 'vida-real',
                text: 'Entra numa loja, pergunta o preço ou informações sobre um produto a um assistente, e no final agradece com um sorriso.',
                options: [{ text: 'Concluí o exercício', points: 25, feedback: 'Muito bem! Pequenas interações diárias fortalecem a tua confiança social.' }]
            },
            {
                id: 13, title: 'Reconhecer um Erro e Pedir Desculpa', type: 'soft-skills',
                text: 'Quando cometeres um pequeno erro hoje, em vez de inventar desculpas, diz simplesmente: "Tens razão, foi erro meu. Peço desculpa."',
                options: [{ text: 'Concluí o exercício', points: 30, feedback: 'Excelente! Assumir erros demonstra maturidade e inteligência emocional.' }]
            }
        ];
    }

    // ── Dados iniciais do quiz sobre ansiedade social ──
    static getDefaultQuizQuestions() {
        return [
            {
                id: 1,
                question: 'O que é a ansiedade social?',
                options: [
                    'Medo de aranhas e insetos',
                    'Medo persistente de ser julgado em situações sociais',
                    'Medo de estar sozinho em casa',
                    'Medo de lugares com muita altura'
                ],
                correct: 1,
                explanation: 'A ansiedade social é o medo intenso e persistente de ser avaliado negativamente pelos outros em contextos sociais.',
                points: 10
            },
            {
                id: 2,
                question: 'Qual destas técnicas ajuda a acalmar a ansiedade no momento?',
                options: [
                    'Beber café para ficar mais alerta',
                    'Evitar completamente a situação',
                    'Respiração profunda (ex.: técnica 4-7-8)',
                    'Pensar em tudo o que pode correr mal'
                ],
                correct: 2,
                explanation: 'A respiração profunda ativa o sistema nervoso parassimpático, ajudando o corpo a sair do modo "luta ou fuga".',
                points: 10
            },
            {
                id: 3,
                question: 'O que é a "exposição gradual"?',
                options: [
                    'Enfrentar o medo de uma vez, sem preparação',
                    'Evitar todas as situações que causam desconforto',
                    'Expor-se progressivamente a situações temidas, com intensidade crescente',
                    'Falar sobre os medos apenas com um terapeuta'
                ],
                correct: 2,
                explanation: 'A exposição gradual é uma técnica comprovada onde a pessoa enfrenta as suas situações temidas passo a passo, reduzindo o medo ao longo do tempo.',
                points: 10
            },
            {
                id: 4,
                question: 'Qual destes é um "comportamento de segurança" na ansiedade social?',
                options: [
                    'Respirar fundo antes de falar em público',
                    'Pedir a outra pessoa para falar em teu nome',
                    'Preparar o que vais dizer com antecedência',
                    'Fazer contacto visual durante uma conversa'
                ],
                correct: 1,
                explanation: 'Comportamentos de segurança (como delegar ou evitar) mantêm a ansiedade porque impedem a pessoa de aprender que consegue lidar com a situação.',
                points: 10
            },
            {
                id: 5,
                question: 'A ansiedade social afeta apenas pessoas tímidas?',
                options: [
                    'Sim, é exclusiva de pessoas introvertidas',
                    'Não, qualquer pessoa pode ter ansiedade social',
                    'Sim, só afeta quem não gosta de socializar',
                    'Não, mas só afeta adultos'
                ],
                correct: 1,
                explanation: 'A ansiedade social pode afetar qualquer pessoa, independentemente do tipo de personalidade ou idade. Até pessoas extrovertidas podem sentir ansiedade social.',
                points: 10
            },
            {
                id: 6,
                question: 'Qual é o primeiro passo para lidar com a ansiedade social?',
                options: [
                    'Ignorar completamente os sintomas',
                    'Reconhecer e aceitar o que estás a sentir',
                    'Evitar todas as interações sociais',
                    'Forçar-te a ser a pessoa mais faladora do grupo'
                ],
                correct: 1,
                explanation: 'O primeiro passo é reconhecer e aceitar os sentimentos sem julgamento. A aceitação reduz a luta interna e permite agir com mais calma.',
                points: 10
            },
            {
                id: 7,
                question: 'A técnica de respiração 4-7-8 consiste em:',
                options: [
                    'Inspirar 4s, expirar 7s, pausa 8s',
                    'Inspirar 4s, suster 7s, expirar 8s',
                    'Inspirar 8s, suster 7s, expirar 4s',
                    'Inspirar 7s, suster 4s, expirar 8s'
                ],
                correct: 1,
                explanation: 'Na técnica 4-7-8: inspiras durante 4 segundos, susténs a respiração durante 7 segundos e expiras lentamente durante 8 segundos.',
                points: 10
            },
            {
                id: 8,
                question: 'O que são "pensamentos automáticos negativos"?',
                options: [
                    'Pensamentos positivos que surgem naturalmente',
                    'Pensamentos negativos e distorcidos que surgem sem controlo',
                    'Reflexões profundas sobre o passado',
                    'Planos conscientes para o futuro'
                ],
                correct: 1,
                explanation: 'São pensamentos rápidos, negativos e muitas vezes distorcidos (ex.: "Toda a gente vai rir de mim") que alimentam a ansiedade.',
                points: 10
            }
        ];
    }

    // ── Definições dos badges (conquistas) ──
    static getDefaultBadges() {
        return [
            { id: 'first_step', name: 'Primeiro Passo', description: 'Completaste o teu primeiro exercício!', icon: '🌱' },
            { id: 'explorer', name: 'Explorador', description: 'Completaste 5 exercícios.', icon: '🧭' },
            { id: 'warrior', name: 'Guerreiro Calmo', description: 'Completaste 10 exercícios.', icon: '🛡️' },
            { id: 'breeze', name: 'Primeira Brisa', description: 'Ganhaste o teu primeiro Ventinho!', icon: '💨' },
            { id: 'quiz_start', name: 'Curioso', description: 'Completaste o teu primeiro quiz.', icon: '❓' },
            { id: 'streak_master', name: 'Mestre da Sequência', description: 'Alcançaste 5 Ventinhos!', icon: '🌪️' },
        ];
    }

    // ── Dicas para visitantes (não autenticados) ──
    static getDefaultTips() {
        return [
            'A respiração profunda ativa o sistema nervoso parassimpático, ajudando a acalmar o corpo.',
            'A exposição gradual é uma das técnicas mais eficazes para reduzir a ansiedade social.',
            'Praticar situações sociais em ambiente seguro ajuda a construir confiança real.',
            'A ansiedade social é mais comum do que pensas — afeta cerca de 7% da população.',
            'Pequenos passos diários somam grandes mudanças ao longo do tempo.',
            'O contacto visual pode ser treinado: começa por 3 segundos e aumenta gradualmente.',
            'Preparar o que vais dizer antes de uma interação reduz significativamente a ansiedade.',
            'A atividade física regular reduz os níveis de cortisol (hormona do stress).'
        ];
    }

    // ── Conta admin predefinida ──
    static getDefaultAdmin() {
        return {
            firstName: 'Admin',
            lastName: 'Respira',
            email: 'admin@gmail.com',
            password: '123',
            role: 'admin',
            username: 'manu',
            breezePoints: 0,
            ventinhos: 0,
            exerciseStreak: 0,
            banned: false,
            favorites: [],
            completedExercises: [],
            badges: [],
            lastLogin: null
        };
    }

    // ── Conta utilizador de teste predefinida ──
    static getDefaultUser() {
        return {
            firstName: 'Rui',
            lastName: 'Silva',
            email: 'rui@gmail.com',
            password: '123',
            role: 'user',
            username: 'Rui',
            breezePoints: 0,
            ventinhos: 0,
            exerciseStreak: 0,
            banned: false,
            favorites: [],
            completedExercises: [],
            badges: [],
            lastLogin: null
        };
    }

    /**
     * seed() — Injeta os dados iniciais no localStorage SE ainda não existirem.
     * Chamado uma vez no arranque da aplicação (main.js).
     */
    static seed() {
        // Cenários: só injeta se não houver dados guardados
        if (!localStorage.getItem('respira_scenarios')) {
            localStorage.setItem('respira_scenarios', JSON.stringify(this.getDefaultScenarios()));
        }

        // Quiz: só injeta se não houver dados guardados
        if (!localStorage.getItem('respira_quiz')) {
            localStorage.setItem('respira_quiz', JSON.stringify(this.getDefaultQuizQuestions()));
        }

        // Badges (definições): sempre atualiza para garantir novas conquistas
        localStorage.setItem('respira_badges_defs', JSON.stringify(this.getDefaultBadges()));

        // Dicas para visitantes
        if (!localStorage.getItem('respira_tips')) {
            localStorage.setItem('respira_tips', JSON.stringify(this.getDefaultTips()));
        }

        // Utilizadores predefinidos (Admin e Rui)
        let users = JSON.parse(localStorage.getItem('respira_users')) || [];
        let usersChanged = false;

        const adminExists = users.some(u => u.email === 'admin@gmail.com');
        if (!adminExists) {
            users.push(this.getDefaultAdmin());
            usersChanged = true;
        }

        const ruiExists = users.some(u => u.email === 'rui@gmail.com');
        if (!ruiExists) {
            users.push(this.getDefaultUser());
            usersChanged = true;
        }

        if (usersChanged) {
            localStorage.setItem('respira_users', JSON.stringify(users));
        }
    }
}
