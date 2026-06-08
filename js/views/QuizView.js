import BaseView from './BaseView.js';

/**
 * QuizView — Renderiza o quiz sobre ansiedade social.
 * Mostra perguntas uma a uma com feedback imediato.
 */
export default class QuizView extends BaseView {
    constructor() {
        super();
    }

    // ── Ecrã inicial do quiz ──
    renderQuizStart(totalQuestions, backCallback, startCallback) {
        this.appElement.innerHTML = `
            <div class="screen quiz-start">
                <h2>Quiz: Ansiedade Social</h2>
                <p>Testa os teus conhecimentos sobre ansiedade social e técnicas para lidar com ela.</p>
                <div class="quiz-info-card">
                    <p class="quiz-detail">📝 ${totalQuestions} perguntas</p>
                    <p class="quiz-detail">⏱️ Sem limite de tempo</p>
                    <p class="quiz-detail">🌬️ Ganha pontos por cada resposta certa!</p>
                </div>
                <div class="options">
                    <button id="btnStartQuiz">Começar Quiz</button>
                </div>
            </div>
        `;

        document.getElementById('btnStartQuiz').addEventListener('click', startCallback);
        this.renderBackButton(backCallback);
    }

    // ── Renderizar uma pergunta ──
    renderQuestion(question, questionIndex, totalQuestions, onAnswerCallback, backCallback) {
        let optionsHtml = question.options.map((opt, index) =>
            `<button class="option-btn quiz-option" data-index="${index}">${opt}</button>`
        ).join('');

        this.appElement.innerHTML = `
            <div class="screen quiz-question">
                <div class="quiz-progress">
                    <span>Pergunta ${questionIndex + 1} de ${totalQuestions}</span>
                    <div class="quiz-progress-bar">
                        <div class="quiz-progress-fill" style="width: ${((questionIndex + 1) / totalQuestions) * 100}%"></div>
                    </div>
                </div>
                <h2>${question.question}</h2>
                <div class="options quiz-options">
                    ${optionsHtml}
                </div>
            </div>
        `;

        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedIndex = parseInt(e.target.getAttribute('data-index'));
                onAnswerCallback(question.id, selectedIndex);
            });
        });

        this.renderBackButton(backCallback);
    }

    // ── Feedback de uma resposta ──
    renderAnswerFeedback(isCorrect, explanation, pointsGained, nextCallback) {
        const title = isCorrect ? '✅ Correto!' : '❌ Incorreto';
        const pointsHtml = pointsGained > 0
            ? `<p class="points-gain">+${pointsGained} Pontos de Brisa!</p>`
            : '';

        this.appElement.innerHTML = `
            <div class="screen quiz-feedback">
                <h2>${title}</h2>
                <p class="quiz-explanation">${explanation}</p>
                ${pointsHtml}
                <div class="options">
                    <button id="btnNextQuestion">Continuar</button>
                </div>
            </div>
        `;

        document.getElementById('btnNextQuestion').addEventListener('click', nextCallback);
    }

    // ── Resultados finais do quiz ──
    renderQuizResults(totalCorrect, totalQuestions, totalPoints, backCallback) {
        const percentage = Math.round((totalCorrect / totalQuestions) * 100);
        let emoji = '🌱';
        let message = 'Continua a aprender!';

        if (percentage >= 80) {
            emoji = '🏆';
            message = 'Excelente! Tens um ótimo conhecimento!';
        } else if (percentage >= 60) {
            emoji = '💪';
            message = 'Bom trabalho! Estás no caminho certo.';
        } else if (percentage >= 40) {
            emoji = '📚';
            message = 'Não desistas! O conhecimento cresce com a prática.';
        }

        this.appElement.innerHTML = `
            <div class="screen quiz-results">
                <h2>${emoji} Resultados do Quiz</h2>
                <div class="quiz-results-card">
                    <p class="quiz-score">${totalCorrect}/${totalQuestions}</p>
                    <p class="quiz-percentage">${percentage}% corretas</p>
                    <p class="quiz-message">${message}</p>
                    <p class="points-gain">+${totalPoints} Pontos de Brisa no total!</p>
                </div>
                <div class="options">
                    <button id="btnQuizDone">Voltar ao Dashboard</button>
                </div>
            </div>
        `;

        document.getElementById('btnQuizDone').addEventListener('click', backCallback);
    }
}
