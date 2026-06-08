import BaseView from './BaseView.js';

export default class ScenarioView extends BaseView {
    constructor() {
        super();
    }

    renderScenario(scenario, optionSelectedCallback, backCallback) {
        const typeLabel = this.getTypeLabel(scenario.type);
        const typeHtml = typeLabel ? `<p class="scenario-tag">${typeLabel}</p>` : '';

        let optionsHtml = scenario.options.map((opt, index) => 
            `<button class="option-btn" data-index="${index}">${opt.text}</button>`
        ).join('');

        this.appElement.innerHTML = `
            <div class="screen scenario">
                <h2>${scenario.title}</h2>
                ${typeHtml}
                <div class="scenario-text">${scenario.text}</div>
                <div class="options">
                    ${optionsHtml}
                </div>
            </div>
        `;

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                optionSelectedCallback(scenario.options[index]);
            });
        });

        this.renderBackButton(backCallback);
    }

    renderFeedback(feedbackMsg, pointsGained, ventinhoGained, streakCount, ventinhos, continueCallback) {
        let titleBlock = pointsGained > 0 ? "Excelente Trabalho!" : "Continua a Tentar";
        let pointsBlock = pointsGained > 0 ? `<p class="points-gain">+${pointsGained} Pontos de Brisa!</p>` : '';
        let ventinhoBlock = ventinhoGained ? `<p class="streak-award">🔥 Sequência Ativa! (+1 💨)</p>` : '';
        let streakBlock = ventinhos < 3 ? `<p class="streak-info">Sequência: ${streakCount}/3</p>` : '';
        let ventinhosBlock = `<p class="streak-total">Total de Ventinhos: 💨 ${ventinhos}</p>`;

        this.appElement.innerHTML = `
            <div class="screen feedback">
                <h2>${titleBlock}</h2>
                <div class="scenario-text">${feedbackMsg}</div>
                ${pointsBlock}
                ${ventinhoBlock}
                ${streakBlock}
                ${ventinhosBlock}
                <button id="btnContinue" style="margin-top: 30px;">Concluir</button>
            </div>
        `;

        document.getElementById('btnContinue').addEventListener('click', continueCallback);
    }

    getTypeLabel(type) {
        if (type === 'vida-real') return 'Vida real';
        if (type === 'soft-skills') return 'Soft skills';
        if (type === 'social') return 'Social';
        return '';
    }
}