import BaseView from './BaseView.js';
import { getRandomQuote } from '../utils/quotes.js';

/**
 * LandingView — Página de acolhimento da aplicação.
 * Inclui conteúdos acessíveis SEM autenticação:
 * - Mensagem motivacional (quote aleatória)
 * - Secção educativa sobre ansiedade social
 * - Dicas práticas para visitantes
 */
export default class LandingView extends BaseView {
    constructor() {
        super();
    }

    render(goToLoginCallback, goToRegisterCallback) {
        let quote = getRandomQuote();
        const lastQuote = localStorage.getItem('respira_last_quote');
        let attempts = 0;

        // Garantir que a frase muda entre carregamentos seguidos
        while (quote === lastQuote && attempts < 6) {
            quote = getRandomQuote();
            attempts += 1;
        }

        localStorage.setItem('respira_last_quote', quote);


        this.appElement.innerHTML = `
            <div class="screen landing">
                <h1>Respira</h1>

                <!-- Conteúdo para visitantes (sem autenticação) -->
                <div class="visitor-section">
                    <div class="visitor-card">
                        <h3><img src="img/gj.png" alt="">O que é a Ansiedade Social?</h3>
                        <p>É o medo persistente de ser avaliado negativamente em situações sociais. Pode causar coração acelerado, tensão muscular e vontade de evitar contacto. A boa notícia: o treino gradual ajuda a reduzir esse medo.</p>
                    </div>
                    <div class="visitor-card text-center" style="text-align: center; margin-bottom: 16px;">
                        <p style="margin-bottom: 10px; font-size: 16px;">A ansiedade social pode ser um peso invisível, mas não tens de o enfrentar sozinho. Este é um espaço seguro e calmo para treinares as tuas interações ao teu próprio ritmo.</p>
                        <p class="mission" style="margin-bottom: 0; font-size: 16px;">A nossa missão é ajudar-te a ganhar confiança, praticar exposição gradual e celebrar cada pequeno progresso.</p>
                    </div>
                </div>

                <p class="quote">"${quote}"</p>

                <div class="options">
                    <button id="btnLogin">Fazer Login</button>
                    <button id="btnRegister" class="btn-secondary">Criar Conta</button>
                </div>
            </div>
        `;

        document.getElementById('btnLogin').addEventListener('click', goToLoginCallback);
        document.getElementById('btnRegister').addEventListener('click', goToRegisterCallback);
    }
}
