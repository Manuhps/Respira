import BaseView from './BaseView.js';

export default class DashboardView extends BaseView {
    constructor() {
        super();
        this.breathTimeout1 = null;
        this.breathTimeout2 = null;
        this.breathTimeout3 = null;
    }

    clearTimeouts() {
        clearTimeout(this.breathTimeout1);
        clearTimeout(this.breathTimeout2);
        clearTimeout(this.breathTimeout3);
    }

    getAvatarInfo(points) {
        if (points >= 300) {
            return {
                src: "./assets/avatar-happy.png",
                label: "Avatar alegre"
            };
        }

        if (points >= 100) {
            return {
                src: "./assets/avatar-neutral.png",
                label: "Avatar neutro"
            };
        }

        return {
            src: "./assets/avatar-sad.png",
            label: "Avatar triste"
        };
    }

    renderDashboard(userName, points, catalogCallback, breathingCallback, logoutCallback, profileCallback) {
        this.clearTimeouts();

        const avatar = this.getAvatarInfo(points);

        this.appElement.innerHTML = `
            <div class="screen dashboard">
                <div class="topbar">
                    <div class="logo">Respira</div>
                    <button id="btnProfile" class="btn-profile">Perfil</button>
                </div>

                <div class="avatar-area">
                    <img src="${avatar.src}" alt="${avatar.label}" class="avatar-img" />
                    <p class="avatar-label">${avatar.label}</p>
                </div>

                <h1>Bem-vindo, ${userName}! </h1>
                <div class="stats">
                    <p>Os teus Pontos de Brisa</p>
                    <h2>🌬️ ${points}</h2>
                </div>
                <div class="options">
                    <button id="btnCatalog">Catálogo de Desafios</button>
                    <button id="btnBreathe">Exercício de Respiração</button>
                    <button id="btnLogout" class="btn-secondary">Sair da Viagem</button>
                </div>

                <div class="floating-bubbles">
                    <button id="bubbleInfo" class="float-bubble bubble-info" title="O que é a ansiedade social?">i</button>
                    <button id="bubbleResources" class="float-bubble bubble-resources" title="Recursos de respiração">▶</button>
                </div>
            </div>
        `;

        document.getElementById('btnCatalog').addEventListener('click', catalogCallback);
        document.getElementById('btnBreathe').addEventListener('click', breathingCallback);
        document.getElementById('btnLogout').addEventListener('click', logoutCallback);

        const profileBtn = document.getElementById('btnProfile');
        if (profileBtn && profileCallback) {
            profileBtn.addEventListener('click', profileCallback);
        }

        const bubbleInfo = document.getElementById('bubbleInfo');
        if (bubbleInfo) {
            bubbleInfo.addEventListener('click', (event) => {
                event.preventDefault();
                this.renderInfoModal();
            });
        }

        const bubbleResources = document.getElementById('bubbleResources');
        if (bubbleResources) {
            bubbleResources.addEventListener('click', (event) => {
                event.preventDefault();
                this.renderResourcesModal();
            });
        }
    }

    renderProfileModal(userName, points, quote, adminCallback) {
        this.closeModal();

        const avatar = this.getAvatarInfo(points);

        const overlay = document.createElement('div');
        overlay.id = 'respira-modal-overlay';
        overlay.className = 'modal-overlay';

        overlay.innerHTML = `
            <div class="modal profile-modal" role="dialog" aria-modal="true">
                <button type="button" class="modal-close" id="profile-modal-close">&#10005;</button>
                <h3 class="modal-title">Perfil</h3>

                <div class="profile-avatar">
                    <img src="${avatar.src}" alt="${avatar.label}" class="profile-avatar-img" />
                    <p class="avatar-label">${avatar.label}</p>
                </div>

                <div class="profile-grid">
                    <div class="profile-row">
                        <span>Username</span>
                        <strong>${userName}</strong>
                    </div>
                    <div class="profile-row">
                        <span>Pontos de Brisa</span>
                        <strong>${points}</strong>
                    </div>
                </div>

                <p class="quote">"${quote}"</p>

                <button type="button" id="btnAdminSecret" class="admin-secret" title="Preparar modo admin">Admin</button>
                <p id="admin-flag-msg" class="admin-flag-msg"></p>
            </div>
        `;

        document.body.appendChild(overlay);

        const closeBtn = document.getElementById('profile-modal-close');
        closeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.closeModal();
        });

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                this.closeModal();
            }
        });

        const adminBtn = document.getElementById('btnAdminSecret');
        const adminMsg = document.getElementById('admin-flag-msg');

        adminBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if (adminCallback) adminCallback();
            if (adminMsg) adminMsg.textContent = "Modo admin preparado.";
        });
    }

    renderInfoModal() {
        this.closeModal();

        const overlay = document.createElement('div');
        overlay.id = 'respira-modal-overlay';
        overlay.className = 'modal-overlay';

        overlay.innerHTML = `
            <div class="modal info-modal" role="dialog" aria-modal="true">
                <button type="button" class="modal-close" id="info-modal-close">&#10005;</button>
                <h3 class="modal-title">O que é a Ansiedade Social?</h3>
                <p class="info-text">A ansiedade social é o medo persistente de ser julgado em situações sociais. É comum sentires o coração acelerado, tensão muscular ou vontade de evitar. A boa notícia é que o treino gradual ajuda a reduzir esse medo.</p>
                <p class="info-text">Aqui podes praticar com calma, no teu ritmo, e celebrar cada pequeno progresso.</p>
            </div>
        `;

        document.body.appendChild(overlay);

        const closeBtn = document.getElementById('info-modal-close');
        closeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.closeModal();
        });

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                this.closeModal();
            }
        });
    }

    renderResourcesModal() {
        this.closeModal();

        const overlay = document.createElement('div');
        overlay.id = 'respira-modal-overlay';
        overlay.className = 'modal-overlay';

        overlay.innerHTML = `
            <div class="modal resources-modal" role="dialog" aria-modal="true">
                <button type="button" class="modal-close" id="resources-modal-close">&#10005;</button>
                <h3 class="modal-title">Recursos de Respiração</h3>
                <p class="info-text">Experimenta estas dicas rápidas:</p>
                <ul class="tips">
                    <li>Respira 4-7-8 por 3 ciclos.</li>
                    <li>Relaxa ombros e maxilar.</li>
                    <li>Foca nos sentidos (5-4-3-2-1).</li>
                    <li>Bebe água e faz pausas curtas.</li>
                </ul>
                <iframe
                    class="relax-video"
                    src="https://www.youtube.com/embed/eVFzbxmKNUw"
                    title="Como ganhar confiança"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
        `;

        document.body.appendChild(overlay);

        const closeBtn = document.getElementById('resources-modal-close');
        closeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.closeModal();
        });

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                this.closeModal();
            }
        });
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
            </div>
        `;

        document.querySelectorAll('.catalog-list .option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const scenario = scenarios.find(s => s.id === id);
                playScenarioCallback(scenario);
            });
        });

        this.renderBackButton(backCallback);
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
            </div>
        `;

        this.renderBackButton(() => {
            this.clearTimeouts();
            backCallback();
        });

        this.startBreathingCycle();
    }

    startBreathingCycle() {
        const circle = document.getElementById('breatheCircle');
        const text = document.getElementById('breatheText');
        
        if (!circle || !text) return;

        const cycle = () => {
            if (!document.getElementById('breatheCircle')) return;

            text.innerText = "Inspira (4s)";
            circle.style.transition = "transform 4s linear, background-color 4s";
            circle.style.transform = "scale(1.8)";
            circle.style.backgroundColor = "var(--color-15)";

            this.breathTimeout1 = setTimeout(() => {
                if (!document.getElementById('breatheCircle')) return;
                
                text.innerText = "Sustém (7s)";
                circle.style.backgroundColor = "var(--color-10)";
                circle.style.color = "var(--color-black)";
                
                this.breathTimeout2 = setTimeout(() => {
                    if (!document.getElementById('breatheCircle')) return;
                    
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

        this.breathTimeout1 = setTimeout(cycle, 1000);
    }
}