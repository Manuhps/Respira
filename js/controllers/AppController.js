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
        const result = this.userModel.login(email, password);
        if (result.success) {
            this.askForUsernameAndGoToDashboard();
        } else if (result.banned) {
            this.authView.showMessageModal(
                "Conta suspensa",
                "Esta conta está temporariamente suspensa. Se precisares de ajuda, fala com a administração."
            );
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
            this.userModel.ventinhos,
            this.userModel.streakCount,
            this.userModel.isAdminEnabled,
            this.goToCatalog.bind(this),
            this.goToBreathing.bind(this),
            this.handleLogout.bind(this),
            this.handleProfile.bind(this),
            this.openAdminPanel.bind(this)
        );
    }

    handleProfile() {
        const quote = getRandomQuote();

        this.dashboardView.renderProfileModal(
            this.userModel.name,
            this.userModel.points,
            this.userModel.ventinhos,
            this.userModel.streakCount,
            quote,
            this.handleAdminFlag.bind(this)
        );
    }

    handleAdminFlag() {
        localStorage.setItem('respira_admin_enabled', JSON.stringify(true));
    }

    openAdminPanel() {
        if (!this.userModel.isAdminEnabled) {
            this.authView.showMessageModal(
                "Acesso restrito",
                "Ativa o modo admin no teu perfil para gerir exercícios e utilizadores."
            );
            return;
        }

        this.dashboardView.renderAdminPanel(
            this.scenarioModel.getAllScenarios(),
            this.userModel.listUsers(),
            this.userModel.currentEmail,
            this.handleAddExercise.bind(this),
            this.handleRemoveExercise.bind(this),
            this.handleToggleBan.bind(this)
        );
    }

    handleAddExercise(exerciseData) {
        const created = this.scenarioModel.addScenario(exerciseData);
        if (!created) {
            this.authView.showMessageModal(
                "Dados incompletos",
                "Preenche o título e a descrição do exercício para continuar."
            );
            return;
        }

        this.openAdminPanel();
    }

    handleRemoveExercise(id) {
        this.scenarioModel.removeScenario(id);
        this.openAdminPanel();
    }

    handleToggleBan(email, shouldBan) {
        const updated = this.userModel.setUserBanned(email, shouldBan);
        if (!updated) return;

        if (shouldBan && email === this.userModel.currentEmail) {
            this.userModel.logout();
            this.goToLanding();
            this.authView.showMessageModal(
                "Conta suspensa",
                "A tua conta foi suspensa pelo modo admin."
            );
            return;
        }

        this.openAdminPanel();
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
            (option) => this.handleOptionSelected(scenario, option),
            this.handleBack.bind(this)
        );
    }

    handleOptionSelected(scenario, option) {
        const result = this.userModel.completeExercise(option.points);

        this.scenarioView.renderFeedback(
            option.feedback,
            result.pointsGained,
            result.ventinhoGained,
            result.streakCount,
            result.ventinhos,
            this.handleBack.bind(this)
        );
    }
}