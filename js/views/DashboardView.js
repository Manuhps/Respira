import BaseView from './BaseView.js';
import { getRandomVideo } from '../utils/videos.js';

/**
 * DashboardView — Vista principal após autenticação.
 * Inclui: topbar, avatar, stats, catálogo, respiração,
 * favoritos, recomendações, badges, perfil e admin.
 */
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

    getAvatarInfo(exerciseCount) {
        if (exerciseCount >= 5) {
            return { src: "./img/Good.png", label: "Avatar" };
        }
        return { src: "./img/Sab.png", label: "Avatar" };
    }

    // ═══════════════════════════════════════
    //  DASHBOARD PRINCIPAL
    // ═══════════════════════════════════════

    renderDashboard(userName, points, ventinhos, streakCount, isAdmin, exerciseCount, callbacks) {
        this.clearTimeouts();
        const avatar = this.getAvatarInfo(exerciseCount);

        const adminButton = isAdmin
            ? '<button id="btnAdmin" class="btn-admin">Admin</button>'
            : '';

        this.appElement.innerHTML = `
            <div class="screen dashboard">
                <div class="topbar">
                    <div class="logo">Respira</div>
                    <div class="topbar-actions">
                        ${adminButton}
                        <button id="btnProfile" class="btn-profile">Perfil</button>
                    </div>
                </div>

                <div class="avatar-area">
                    <img src="${avatar.src}" alt="${avatar.label}" class="avatar-img" />
                    <p class="avatar-label">${avatar.label}</p>
                </div>

                <h1>Bem-vindo, ${userName}! </h1>
                <div class="stats">
                    <p>Os teus Pontos de Brisa</p>
                    <h2>🌬️ ${points}</h2>
                    <p class="stats-line">Ventinhos: 💨 ${ventinhos}</p>
                    ${ventinhos < 3 ? `<p class="stats-line">Sequência: ${streakCount}/3</p>` : ''}
                </div>
                <div class="options">
                    <button id="btnCatalog">Catálogo de Desafios</button>
                    <button id="btnQuiz">Quiz: Ansiedade Social</button>
                    <button id="btnBreathe">Exercício de Respiração</button>
                    <button id="btnLogout" class="btn-secondary">Sair da Viagem</button>
                </div>

                <div class="floating-bubbles">
                    <button id="bubbleInfo" class="float-bubble bubble-info" title="O que é a ansiedade social?">i</button>
                    <button id="bubbleResources" class="float-bubble bubble-resources" title="Recursos de respiração">▶</button>
                </div>
            </div>
        `;

        // Ligar eventos
        document.getElementById('btnCatalog').addEventListener('click', callbacks.catalog);
        document.getElementById('btnBreathe').addEventListener('click', callbacks.breathing);
        document.getElementById('btnLogout').addEventListener('click', callbacks.logout);
        document.getElementById('btnQuiz').addEventListener('click', callbacks.quiz);

        const profileBtn = document.getElementById('btnProfile');
        if (profileBtn) profileBtn.addEventListener('click', callbacks.profile);

        const adminBtn = document.getElementById('btnAdmin');
        if (adminBtn) adminBtn.addEventListener('click', callbacks.admin);

        const bubbleInfo = document.getElementById('bubbleInfo');
        if (bubbleInfo) {
            bubbleInfo.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderInfoModal();
            });
        }

        const bubbleResources = document.getElementById('bubbleResources');
        if (bubbleResources) {
            bubbleResources.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderResourcesModal();
            });
        }
    }



    // ═══════════════════════════════════════
    //  PERFIL (modal expandido com favoritos, badges, histórico)
    // ═══════════════════════════════════════

    renderProfileModal(userName, points, ventinhos, streakCount, quote, badges, badgeDefs, historyCount, favCount) {
        this.closeModal();

        // Gerar iniciais do nome para a foto de perfil
        const initials = userName.split(' ').map(n => n.charAt(0).toUpperCase()).slice(0, 2).join('');

        // Badges conquistados
        let badgesHtml = '<p class="admin-empty">Ainda sem conquistas.</p>';
        if (badges.length > 0) {
            badgesHtml = badges.map(bId => {
                const def = badgeDefs.find(d => d.id === bId);
                if (!def) return '';
                return `<span class="badge-item" title="${def.description}">${def.icon} ${def.name}</span>`;
            }).join('');
        }

        const overlay = document.createElement('div');
        overlay.id = 'respira-modal-overlay';
        overlay.className = 'modal-overlay';

        overlay.innerHTML = `
            <div class="modal profile-modal" role="dialog" aria-modal="true">
                <button type="button" class="modal-close" id="profile-modal-close">&#10005;</button>
                <h3 class="modal-title">Perfil</h3>

                <div class="profile-avatar">
                    <div class="profile-initials">${initials}</div>
                    <p class="avatar-label">${userName}</p>
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
                    <div class="profile-row">
                        <span>Ventinhos</span>
                        <strong>💨 ${ventinhos}</strong>
                    </div>
                    ${ventinhos < 3 ? `<div class="profile-row">
                        <span>Sequência</span>
                        <strong>${streakCount}/3</strong>
                    </div>` : ''}
                    <div class="profile-row">
                        <span>Exercícios feitos</span>
                        <strong>${historyCount}</strong>
                    </div>
                    <div class="profile-row">
                        <span>Favoritos</span>
                        <strong>❤️ ${favCount}</strong>
                    </div>
                </div>

                <div class="profile-badges">
                    <h4>🏅 Conquistas</h4>
                    <div class="badges-grid">
                        ${badgesHtml}
                    </div>
                </div>

                <p class="quote">"${quote}"</p>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('profile-modal-close').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });
    }

    // ═══════════════════════════════════════
    //  CATÁLOGO (com favoritos e recomendações)
    // ═══════════════════════════════════════

    renderCatalog(scenarios, recommendations, favoriteIds, playCallback, toggleFavCallback, backCallback) {
        this.clearTimeouts();

        // Secção de recomendações
        let recsHtml = '';
        if (recommendations.length > 0) {
            const recButtons = recommendations.map(sc => {
                const isFav = favoriteIds.includes(sc.id);
                const favIcon = isFav ? '❤️' : '🤍';
                return `
                    <div class="catalog-card recommended">
                        <button class="fav-toggle" data-id="${sc.id}" title="Favorito">${favIcon}</button>
                        <button class="option-btn catalog-btn" data-id="${sc.id}">${sc.title}</button>
                        <span class="catalog-tag">${this.getTypeLabel(sc.type)}</span>
                    </div>
                `;
            }).join('');

            recsHtml = `
                <div class="catalog-section">
                    <h3>⭐ Recomendados para ti</h3>
                    <div class="catalog-grid">${recButtons}</div>
                </div>
                <hr class="catalog-divider" />
            `;
        }

        // Lista completa de cenários
        const allButtons = scenarios.map(sc => {
            const isFav = favoriteIds.includes(sc.id);
            const favIcon = isFav ? '❤️' : '🤍';
            return `
                <div class="catalog-card">
                    <button class="fav-toggle" data-id="${sc.id}" title="Favorito">${favIcon}</button>
                    <button class="option-btn catalog-btn" data-id="${sc.id}">${sc.title}</button>
                    <span class="catalog-tag">${this.getTypeLabel(sc.type)}</span>
                </div>
            `;
        }).join('');

        this.appElement.innerHTML = `
            <div class="screen catalog">
                <h2>Catálogo de Desafios</h2>
                <p>Escolhe a situação com a qual te queres expor hoje:</p>
                ${recsHtml}
                <div class="catalog-section">
                    <h3>📋 Todos os desafios</h3>
                    <div class="catalog-grid">${allButtons}</div>
                </div>
            </div>
        `;

        // Eventos de play
        document.querySelectorAll('.catalog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                const scenario = scenarios.find(s => s.id === id);
                if (scenario) playCallback(scenario);
            });
        });

        // Eventos de favorito
        document.querySelectorAll('.fav-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(btn.getAttribute('data-id'));
                if (toggleFavCallback) toggleFavCallback(id);
            });
        });

        this.renderBackButton(backCallback);
    }

    getTypeLabel(type) {
        if (type === 'vida-real') return 'Vida real';
        if (type === 'soft-skills') return 'Soft skills';
        return 'Social';
    }

    // ═══════════════════════════════════════
    //  PAINEL ADMIN
    // ═══════════════════════════════════════

    renderAdminPanel(scenarios, users, currentEmail, callbacks) {
        this.closeModal();

        // Estatísticas globais
        const totalUsers = users.filter(u => u.role !== 'admin').length;
        let totalCompleted = 0;
        users.forEach(u => {
            if (Array.isArray(u.completedExercises)) {
                totalCompleted += u.completedExercises.length;
            }
        });

        const typeLabel = (value) => {
            if (value === 'vida-real') return 'Vida real';
            if (value === 'soft-skills') return 'Soft skills';
            return 'Social';
        };

        const scenarioRows = scenarios.map((scenario) => {
            const label = typeLabel(scenario.type);
            return `
                <div class="admin-row">
                    <div class="admin-row-info">
                        <strong>${scenario.title}</strong>
                        <span class="admin-tag">${label}</span>
                    </div>
                    <button class="admin-remove" data-id="${scenario.id}">Remover</button>
                </div>
            `;
        }).join('');

        const userRows = users.map((user) => {
            const isCurrent = user.email === currentEmail;
            const statusLabel = user.banned ? 'Suspenso' : 'Ativo';
            const actionLabel = user.banned ? 'Desbanir' : 'Banir';
            const disabledAttr = isCurrent ? 'disabled' : '';
            const infoSuffix = isCurrent ? ' (tu)' : '';
            const roleTag = user.role === 'admin' ? '' : '';
            const exercisesCount = Array.isArray(user.completedExercises) ? user.completedExercises.length : 0;

            return `
                <div class="admin-row">
                    <div class="admin-row-info">
                        <strong>${user.firstName} ${user.lastName}${infoSuffix}${roleTag}</strong>
                        <span class="admin-tag">${statusLabel} · ${exercisesCount} exercícios</span>
                    </div>
                    <button class="admin-ban" data-email="${user.email}" data-next="${user.banned ? 'false' : 'true'}" ${disabledAttr}>
                        ${actionLabel}
                    </button>
                </div>
            `;
        }).join('');

        const overlay = document.createElement('div');
        overlay.id = 'respira-modal-overlay';
        overlay.className = 'modal-overlay';

        overlay.innerHTML = `
            <div class="modal admin-modal" role="dialog" aria-modal="true">
                <button type="button" class="modal-close" id="admin-modal-close">&#10005;</button>
                <h3 class="modal-title">Painel Admin</h3>

                <div class="admin-section">
                    <h4>Estatísticas</h4>
                    <div class="admin-stats-grid">
                        <div class="admin-stat"><strong>${totalUsers}</strong><span>Utilizadores</span></div>
                        <div class="admin-stat"><strong>${scenarios.length}</strong><span>Exercícios</span></div>
                        <div class="admin-stat"><strong>${totalCompleted}</strong><span>Completados</span></div>
                    </div>
                </div>


                <div class="admin-section">
                    <h4>Adicionar exercício</h4>
                    <form id="admin-add-form" class="admin-form">
                        <input type="text" id="admin-title" placeholder="Título do exercício" required />
                        <textarea id="admin-text" placeholder="Descrição do exercício" rows="4" required></textarea>
                        <div class="admin-form-row">
                            <input type="number" id="admin-points" min="1" max="100" value="15" />
                            <select id="admin-type">
                                <option value="soft-skills">Soft skills</option>
                                <option value="vida-real">Vida real</option>
                                <option value="social">Social</option>
                            </select>
                        </div>
                        <button type="submit">Adicionar</button>
                    </form>
                </div>

                <div class="admin-section">
                    <h4>Exercícios</h4>
                    <div class="admin-list">
                        ${scenarioRows || '<p class="admin-empty">Ainda não existem exercícios.</p>'}
                    </div>
                </div>

                <div class="admin-section">
                    <h4>Utilizadores</h4>
                    <div class="admin-list">
                        ${userRows || '<p class="admin-empty">Sem utilizadores registados.</p>'}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Fechar
        document.getElementById('admin-modal-close').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal();
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });

        // Adicionar exercício
        document.getElementById('admin-add-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('admin-title').value.trim();
            const text = document.getElementById('admin-text').value.trim();
            const points = Number(document.getElementById('admin-points').value);
            const type = document.getElementById('admin-type').value;
            if (callbacks.addExercise) callbacks.addExercise({ title: title, text: text, points: points, type: type });
        });



        // Remover exercícios
        overlay.querySelectorAll('.admin-remove').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = Number(btn.getAttribute('data-id'));
                if (callbacks.removeExercise) callbacks.removeExercise(id);
            });
        });

        // Ban/Unban utilizadores
        overlay.querySelectorAll('.admin-ban').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = btn.getAttribute('data-email');
                const shouldBan = btn.getAttribute('data-next') === 'true';
                if (callbacks.toggleBan) callbacks.toggleBan(email, shouldBan);
            });
        });
    }

    // ═══════════════════════════════════════
    //  MODAIS INFORMATIVOS
    // ═══════════════════════════════════════

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
        document.getElementById('info-modal-close').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal();
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });
    }

    renderResourcesModal() {
        this.closeModal();
        const video = getRandomVideo();

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
                    src="https://www.youtube.com/embed/${video.id}"
                    title="${video.title}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
        `;

        document.body.appendChild(overlay);
        document.getElementById('resources-modal-close').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal();
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });
    }

    // ═══════════════════════════════════════
    //  EXERCÍCIO DE RESPIRAÇÃO
    // ═══════════════════════════════════════

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

            text.textContent = "Inspira (4s)";
            circle.style.transition = "transform 4s linear, background-color 4s";
            circle.style.transform = "scale(1.8)";
            circle.style.backgroundColor = "var(--color-15)";

            this.breathTimeout1 = setTimeout(() => {
                if (!document.getElementById('breatheCircle')) return;

                text.textContent = "Sustém (7s)";
                circle.style.backgroundColor = "var(--color-10)";
                circle.style.color = "var(--color-black)";

                this.breathTimeout2 = setTimeout(() => {
                    if (!document.getElementById('breatheCircle')) return;

                    text.textContent = "Expira (8s)";
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