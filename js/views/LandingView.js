import BaseView from './BaseView.js';
import { getRandomQuote } from '../utils/quotes.js';

export default class LandingView extends BaseView {
    constructor() {
        super();
    }

    render(goToLoginCallback, goToRegisterCallback) {
        let quote = getRandomQuote();
        const lastQuote = localStorage.getItem('respira_last_quote');
        let attempts = 0;

        // Garantir que a frase muda entre carregamentos seguidos.
        while (quote === lastQuote && attempts < 6) {
            quote = getRandomQuote();
            attempts += 1;
        }

        localStorage.setItem('respira_last_quote', quote);

        this.appElement.innerHTML = `
            <div class="screen landing">
                <h1>Respira</h1>
                <p>A ansiedade social pode ser um peso invisível, mas não tens de o enfrentar sozinho. Este é um espaço seguro e calmo para treinares as tuas interações ao teu próprio ritmo.</p>
                <p class="mission">A nossa missão é ajudar-te a ganhar confiança, praticar exposição gradual e celebrar cada pequeno progresso.</p>
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
