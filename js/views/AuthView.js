import BaseView from './BaseView.js';

export default class AuthView extends BaseView {
    constructor() {
        super();
    }

    renderLogin(loginCallback, backCallback) {
        this.appElement.innerHTML = `
            <div class="screen auth">
                <h2>Bem-vindo de volta!</h2>
                <form id="login-form">
                    <input type="email" id="email-input" placeholder="O teu email" required />
                    <input type="password" id="password-input" placeholder="A tua password" required />
                    <button type="submit">Entrar</button>
                </form>
            </div>
        `;

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-input').value.trim();
            const password = document.getElementById('password-input').value.trim();
            if (email && password) {
                loginCallback(email, password);
            }
        });

        this.renderBackButton(backCallback);
    }

    renderRegister(registerCallback, backCallback) {
        this.appElement.innerHTML = `
            <div class="screen auth">
                <h2>Cria a tua conta</h2>
                <form id="register-form" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                    <input type="text" id="fname-input" placeholder="Primeiro Nome" required />
                    <input type="text" id="lname-input" placeholder="Último Nome" required />
                    <input type="email" id="email-input" placeholder="Email" required />
                    <input type="password" id="password-input" placeholder="Password" required />
                    <input type="date" id="bdate-input" required title="Data de Nascimento" />
                    <select id="gender-input" required>
                        <option value="" disabled selected>Género</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Prefiro não dizer">Prefiro não dizer</option>
                    </select>
                    <button type="submit">Começar</button>
                </form>
            </div>
        `;

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const userData = {
                firstName: document.getElementById('fname-input').value.trim(),
                lastName: document.getElementById('lname-input').value.trim(),
                email: document.getElementById('email-input').value.trim(),
                password: document.getElementById('password-input').value.trim(),
                birthDate: document.getElementById('bdate-input').value,
                gender: document.getElementById('gender-input').value
            };

            if (userData.firstName && userData.lastName && userData.email && userData.password) {
                registerCallback(userData);
            }
        });

        this.renderBackButton(backCallback);
    }
}
