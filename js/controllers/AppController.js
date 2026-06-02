import { getRandomQuote } from '../utils/quotes.js';

export default class AppController {
    constructor(userModel, scenarioModel, landingView, authView, dashboardView, scenarioView) {
        this.userModel = userModel;
        this.scenarioModel = scenarioModel;
        this.landingView = landingView;
        this.authView = authView;
        this.dashboardView = dashboardView;
        this.scenarioView = scenarioView;
        
        this.history = [];
        this.init();
    }

    init() {
        if (this.userModel.isLogged) {
            this.goToDashboard();
        } else {
            this.goToLanding();
        }
    }

    goToLanding() {
        this.history = [];
        this.landingView.render(
            this.goToLogin.bind(this),
            this.goToRegister.bind(this)
        );
    }

    goToLogin() {
        this.history.push(this.goToLanding.bind(this));
        this.authView.renderLogin(
            this.handleLogin.bind(this),
            this.handleBack.bind(this)
        );
    }

    goToRegister() {
        this.history.push(this.goToLanding.bind(this));
        this.authView.renderRegister(
            this.handleRegister.bind(this),
            this.handleBack.bind(this)
        );
    }

    handleLogin(email, password) {
        const success = this.userModel.login(email, password);
        if (success) {
            this.askForUsernameAndGoToDashboard();
        } else {
            // Modal (pop-up) em vez de alert para uma UX mais profissional.
            this.authView.showMessageModal(
                "Não foi possível entrar",
                "Credenciais incorretas ou utilizador não encontrado."
            );
        }
    }

    handleRegister(userData) {
        const success = this.userModel.register(userData);
        if (success) {
            this.askForUsernameAndGoToDashboard();
        } else {
            // Modal (pop-up) em vez de alert.
            this.authView.showMessageModal(
                "Conta já existente",
                "Este email já está registado. Por favor, faz login."
            );
        }
    }

    askForUsernameAndGoToDashboard() {
        // Em vez de prompt()/alert(), mostramos uma modal custom dentro da app.

        // Se o utilizador já tiver username definido, não voltamos a perguntar.
        if (this.userModel.username && this.userModel.username.trim() !== "") {
            this.goToDashboard();
            return;
        }

        this.authView.showPromptModal(
            "Como preferes ser tratado(a)?",
            "Podes escolher um username (opcional) para te sentires mais confortável. Se preferires, usa o teu nome real.",
            "O teu username (opcional)",
            (value) => {
                const username = value ? value.trim() : "";
                if (username !== "") {
                    this.userModel.setUsername(username);
                } else {
                    this.userModel.setUsername(null);
                }
                this.goToDashboard();
            },
            () => {
                // Cancelar = continuar com nome real.
                this.userModel.setUsername(null);
                this.goToDashboard();
            }
        );
    }

    handleLogout() {
        this.userModel.logout();
        this.goToLanding();
    }

    handleBack() {
        const prevState = this.history.pop();
        if (prevState) {
            prevState();
        } else {
            this.goToLanding();
        }
    }

    goToDashboard() {
        this.history = []; 
        this.dashboardView.renderDashboard(
            this.userModel.name, // Retorna o username (se existir) ou o nome real
            this.userModel.points,
            this.goToCatalog.bind(this),
            this.goToBreathing.bind(this),
            this.handleLogout.bind(this),
            this.handleProfile.bind(this)
        );
    }

    handleProfile() {
        const quote = getRandomQuote();

        this.dashboardView.renderProfileModal(
            this.userModel.name,
            this.userModel.points,
            quote,
            this.handleAdminFlag.bind(this)
        );
    }

    handleAdminFlag() {
        localStorage.setItem('respira_admin_enabled', JSON.stringify(true));
    }

    goToCatalog() {
        this.history.push(this.goToDashboard.bind(this));
        const scenarios = this.scenarioModel.getAllScenarios();
        this.dashboardView.renderCatalog(
            scenarios, 
            this.handlePlayScenario.bind(this),
            this.handleBack.bind(this)
        );
    }

    goToBreathing() {
        this.history.push(this.goToDashboard.bind(this));
        this.dashboardView.renderBreathing(this.handleBack.bind(this));
    }

    handlePlayScenario(scenario) {
        this.history.push(this.goToCatalog.bind(this));
        this.scenarioView.renderScenario(
            scenario, 
            this.handleOptionSelected.bind(this),
            this.handleBack.bind(this)
        );
    }

    handleOptionSelected(option) {
        if (option.points > 0) {
            this.userModel.addPoints(option.points);
        }

        this.scenarioView.renderFeedback(
            option.feedback, 
            option.points, 
            this.handleBack.bind(this)
        );
    }
}