export default class DashboardView {
    constructor() {
        this.appElement = document.getElementById('app');
        this.breathTimeout1 = null;
        this.breathTimeout2 = null;
        this.breathTimeout3 = null;
    }

    clearTimeouts() {
        clearTimeout(this.breathTimeout1);
        clearTimeout(this.breathTimeout2);
        clearTimeout(this.breathTimeout3);
    }

    renderLanding(onLoginCallback) {
        this.clearTimeouts();
        this.appElement.innerHTML = `
            <div class="screen landing">
                <h1>Respira</h1>
                <p>O teu espaço compassivo e seguro para treinares habilidades sociais e superares a ansiedade passo-a-passo.</p>
                <input type="text" id="nameInput" placeholder="Como gostas de ser chamado?" />
                <button id="loginBtn">Entrar na Aplicação</button>
            </div>
        `;

        document.getElementById('loginBtn').addEventListener('click', () => {
            const name = document.getElementById('nameInput').value.trim();
            if (name !== '') onLoginCallback(name);
        });
    }

    renderDashboard(userName, points, catalogCallback, breathingCallback, logoutCallback) {
        this.clearTimeouts();
        this.appElement.innerHTML = `
            <div class="screen dashboard">
                <h1>Bem-vindo, ${userName}! ✨</h1>
                <div class="stats">
                    <p>Os teus pontos de superação</p>
                    <h2>⭐ ${points}</h2>
                </div>
                <div class="options">
                    <button id="btnCatalog">📖 Catálogo de Desafios</button>
                    <button id="btnBreathe">🧘 Exercício de Respiração</button>
                    <button id="btnLogout" class="btn-secondary">Sair da Aplicação</button>
                </div>
            </div>
        `;

        document.getElementById('btnCatalog').addEventListener('click', catalogCallback);
        document.getElementById('btnBreathe').addEventListener('click', breathingCallback);
        document.getElementById('btnLogout').addEventListener('click', logoutCallback);
    }

    renderCatalog(scenarios, playScenarioCallback, backCallback) {
        this.clearTimeouts();
        
        let buttonsHtml = scenarios.map(sc => 
            `<button class="option-btn" data-id="${sc.id}">${sc.title}</button>`
        ).join('');

        this.appElement.innerHTML = `
            <div class="screen catalog">
                <h2>Catálogo de Cenários</h2>
                <p>Escolhe a situação com a qual te queres expor hoje:</p>
                <div class="options catalog-list">
                    ${buttonsHtml}
                </div>
                <button id="btnBack" class="btn-secondary" style="margin-top: 30px;">Voltar ao Dashboard</button>
            </div>
        `;

        document.querySelectorAll('.catalog-list .option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const scenario = scenarios.find(s => s.id === id);
                playScenarioCallback(scenario);
            });
        });

        document.getElementById('btnBack').addEventListener('click', backCallback);
    }

    renderBreathing(backCallback) {
        this.clearTimeouts();
        this.appElement.innerHTML = `
            <div class="screen breathing">
                <h2>Técnica 4-7-8</h2>
                <p>Acompanha o círculo. Vai ajudar a acalmar o teu sistema nervoso.</p>
                
                <div class="breathing-container">
                    <div id="breatheCircle" class="breathe-circle"></div>
                    <div id="breatheText" class="breathe-text">Prepara-te...</div>
                </div>

                <button id="btnBack" class="btn-secondary" style="margin-top: 40px;">Parar e Voltar</button>
            </div>
        `;

        document.getElementById('btnBack').addEventListener('click', () => {
            this.clearTimeouts();
            backCallback();
        });

        this.startBreathingCycle();
    }

    startBreathingCycle() {
        const circle = document.getElementById('breatheCircle');
        const text = document.getElementById('breatheText');
        
        if (!circle || !text) return; // Segurança caso o utilizador saia do ecrã

        const cycle = () => {
            if (!document.getElementById('breatheCircle')) return;

            // Fase 1: Inspirar 4s
            text.innerText = "Inspira (4s)";
            circle.style.transition = "transform 4s linear, background-color 4s";
            circle.style.transform = "scale(1.8)";
            circle.style.backgroundColor = "var(--color-15)";

            this.breathTimeout1 = setTimeout(() => {
                if (!document.getElementById('breatheCircle')) return;
                
                // Fase 2: Suster 7s
                text.innerText = "Sustém (7s)";
                circle.style.backgroundColor = "var(--color-10)";
                circle.style.color = "var(--color-black)";
                
                this.breathTimeout2 = setTimeout(() => {
                    if (!document.getElementById('breatheCircle')) return;
                    
                    // Fase 3: Expirar 8s
                    text.innerText = "Expira (8s)";
                    circle.style.transition = "transform 8s linear, background-color 8s";
                    circle.style.transform = "scale(1)";
                    circle.style.backgroundColor = "var(--color-60)";

                    this.breathTimeout3 = setTimeout(() => {
                        if (document.getElementById('breatheCircle')) cycle();
                    }, 8000);
                }, 7000);
            }, 4000);
        };

        // Delay inicial pequenino para o render acontecer primeiro
        this.breathTimeout1 = setTimeout(cycle, 1000);
    }
}