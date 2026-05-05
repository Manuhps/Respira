export default class ScenarioView {
    constructor() {
        this.appElement = document.getElementById('app');
    }

    renderScenario(scenario, optionSelectedCallback, backCallback) {
        let optionsHtml = scenario.options.map((opt, index) => 
            `<button class="option-btn" data-index="${index}">${opt.text}</button>`
        ).join('');

        this.appElement.innerHTML = `
            <div class="screen scenario">
                <h2>${scenario.title}</h2>
                <div class="scenario-text">${scenario.text}</div>
                <div class="options">
                    ${optionsHtml}
                </div>
                <button id="btnCancel" class="btn-secondary" style="margin-top: 20px;">Desistir do Desafio</button>
            </div>
        `;

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                optionSelectedCallback(scenario.options[index]);
            });
        });

        document.getElementById('btnCancel').addEventListener('click', backCallback);
    }

    renderFeedback(feedbackMsg, pointsGained, continueCallback) {
        let titleBlock = pointsGained > 0 ? "🎉 Excelente Trabalho!" : "🫂 Continua a Tentar";
        let pointsBlock = pointsGained > 0 ? `<p class="points-gain">+${pointsGained} Pontos Adquiridos!</p>` : '';

        this.appElement.innerHTML = `
            <div class="screen feedback">
                <h2>${titleBlock}</h2>
                <div class="scenario-text">${feedbackMsg}</div>
                ${pointsBlock}
                <button id="btnContinue" style="margin-top: 30px;">Concluir e Voltar</button>
            </div>
        `;

        document.getElementById('btnContinue').addEventListener('click', continueCallback);
    }
}