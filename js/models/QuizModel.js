/**
 * QuizModel — Gere as perguntas do quiz sobre ansiedade social.
 * Os dados são lidos do localStorage (injetados pelo MockServer).
 */
export default class QuizModel {

    constructor() {
        this.storageKey = 'respira_quiz';
        this.questions = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    // ── Obter todas as perguntas ──
    getAllQuestions() {
        return this.questions;
    }

    // ── Obter N perguntas aleatórias (para uma sessão de quiz) ──
    getRandomQuestions(count) {
        // Copiar o array para não alterar o original
        const shuffled = [...this.questions];

        // Algoritmo de Fisher-Yates para baralhar
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }

        // Devolver apenas o número pedido (ou todas se count > total)
        const total = Math.min(count, shuffled.length);
        const result = [];
        for (let i = 0; i < total; i++) {
            result.push(shuffled[i]);
        }
        return result;
    }

    // ── Verificar se a resposta está correta ──
    checkAnswer(questionId, selectedIndex) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) {
            return { correct: false, explanation: '', points: 0 };
        }

        const isCorrect = selectedIndex === question.correct;
        return {
            correct: isCorrect,
            explanation: question.explanation,
            points: isCorrect ? question.points : 0
        };
    }

    // ── Adicionar uma pergunta (admin) ──
    addQuestion(questionData) {
        const trimmedQ = questionData.question ? questionData.question.trim() : '';
        if (!trimmedQ || !Array.isArray(questionData.options) || questionData.options.length < 2) {
            return null;
        }

        const nextId = this.questions.reduce((max, q) => Math.max(max, q.id || 0), 0) + 1;

        const newQuestion = {
            id: nextId,
            question: trimmedQ,
            options: questionData.options,
            correct: questionData.correct || 0,
            explanation: questionData.explanation || '',
            points: questionData.points || 10
        };

        this.questions.push(newQuestion);
        this.saveQuestions();
        return newQuestion;
    }

    // ── Remover uma pergunta (admin) ──
    removeQuestion(id) {
        const before = this.questions.length;
        this.questions = this.questions.filter(q => q.id !== id);
        if (this.questions.length !== before) {
            this.saveQuestions();
            return true;
        }
        return false;
    }

    // ── Guardar no localStorage ──
    saveQuestions() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.questions));
    }
}
