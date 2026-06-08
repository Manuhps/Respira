import { getRandomQuote } from '../utils/quotes.js';
/**
 * AppController — Controlador principal da aplicação Respira.
 * Liga Models ↔ Views e gere toda a lógica de navegação, eventos e dados.
 */
export default class AppController {
    constructor(userModel, scenarioModel, quizModel, badgeModel, landingView, authView, dashboardView, scenarioView, quizView) {
        this.userModel = userModel;
        this.scenarioModel = scenarioModel;
        this.quizModel = quizModel;
        this.badgeModel = badgeModel;
        this.landingView = landingView;
        this.authView = authView;
        this.dashboardView = dashboardView;
        this.scenarioView = scenarioView;
        this.quizView = quizView;

        // Estado do quiz em curso
        this._quizQuestions = [];
        this._quizIndex = 0;
        this._quizScore = 0;
        this._quizCorrect = 0;

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

    // ═══════════════════════════════════════
    //  NAVEGAÇÃO
    // ═══════════════════════════════════════

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

    handleBack() {
        const prevState = this.history.pop();
        if (prevState) {
            prevState();
        } else {
            this.goToLanding();
        }
    }

    // ═══════════════════════════════════════
    //  AUTENTICAÇÃO
    // ═══════════════════════════════════════

    handleLogin(email, password) {
        const result = this.userModel.login(email, password);
        if (result.success) {
            this._generateAutoNotifications();
            this.askForUsernameAndGoToDashboard();
        } else if (result.banned) {
            this.authView.showMessageModal(
                "Conta suspensa",
                "Esta conta está temporariamente suspensa. Se precisares de ajuda, fala com a administração."
            );
        } else {
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
            this.authView.showMessageModal(
                "Conta já existente",
                "Este email já está registado. Por favor, faz login."
            );
        }
    }

    askForUsernameAndGoToDashboard() {
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
                this.userModel.setUsername(username !== "" ? username : null);
                this.goToDashboard();
            },
            () => {
                this.userModel.setUsername(null);
                this.goToDashboard();
            }
        );
    }

    handleLogout() {
        this.userModel.logout();
        this.goToLanding();
    }

    // ═══════════════════════════════════════
    //  DASHBOARD
    // ═══════════════════════════════════════

    goToDashboard() {
        this.history = [];
        this.dashboardView.renderDashboard(
            this.userModel.name,
            this.userModel.points,
            this.userModel.ventinhos,
            this.userModel.streakCount,
            this.userModel.isAdmin,
            this.userModel.totalExercisesCompleted,
            {
                catalog: this.goToCatalog.bind(this),
                breathing: this.goToBreathing.bind(this),
                logout: this.handleLogout.bind(this),
                profile: this.handleProfile.bind(this),
                admin: this.openAdminPanel.bind(this),
                quiz: this.goToQuiz.bind(this)
            }
        );
    }

    // ═══════════════════════════════════════
    //  PERFIL
    // ═══════════════════════════════════════

    handleProfile() {
        const quote = getRandomQuote();
        const badges = this.userModel.badges;
        const badgeDefs = this.badgeModel.getAllBadges();

        this.dashboardView.renderProfileModal(
            this.userModel.name,
            this.userModel.points,
            this.userModel.ventinhos,
            this.userModel.streakCount,
            quote,
            badges,
            badgeDefs,
            this.userModel.totalExercisesCompleted,
            this.userModel.favorites.length
        );
    }

    // ═══════════════════════════════════════
    //  CATÁLOGO (com favoritos e recomendações)
    // ═══════════════════════════════════════

    goToCatalog() {
        this.history.push(this.goToDashboard.bind(this));
        const scenarios = this.scenarioModel.getAllScenarios();
        const favoriteIds = this.userModel.favorites;
        const completedIds = this.userModel.getCompletedScenarioIds();
        const mostPracticed = this.userModel.getMostPracticedTypes(scenarios);
        const recommendations = this.scenarioModel.getRecommendations(completedIds, favoriteIds, mostPracticed);

        this.dashboardView.renderCatalog(
            scenarios,
            recommendations,
            favoriteIds,
            this.handlePlayScenario.bind(this),
            this.handleToggleFavorite.bind(this),
            this.handleBack.bind(this)
        );
    }

    handleToggleFavorite(scenarioId) {
        this.userModel.toggleFavorite(scenarioId);
        this._checkAndAwardBadges();
        // Re-renderizar o catálogo para atualizar os ícones
        this.history.pop(); // Remover a entrada duplicada
        this.goToCatalog();
    }

    // ═══════════════════════════════════════
    //  CENÁRIOS (Jogar)
    // ═══════════════════════════════════════

    handlePlayScenario(scenario) {
        this.history.push(this.goToCatalog.bind(this));
        this.scenarioView.renderScenario(
            scenario,
            (option) => this.handleOptionSelected(scenario, option),
            this.handleBack.bind(this)
        );
    }

    handleOptionSelected(scenario, option) {
        const result = this.userModel.completeExercise(option.points, scenario.id);

        this._checkAndAwardBadges();

        this.scenarioView.renderFeedback(
            option.feedback,
            result.pointsGained,
            result.ventinhoGained,
            result.streakCount,
            result.ventinhos,
            this.handleBack.bind(this)
        );
    }

    // ═══════════════════════════════════════
    //  RESPIRAÇÃO
    // ═══════════════════════════════════════

    goToBreathing() {
        this.history.push(this.goToDashboard.bind(this));
        this.dashboardView.renderBreathing(this.handleBack.bind(this));
    }

    // ═══════════════════════════════════════
    //  QUIZ
    // ═══════════════════════════════════════

    goToQuiz() {
        this.history.push(this.goToDashboard.bind(this));
        const allQuestions = this.quizModel.getAllQuestions();

        if (allQuestions.length === 0) {
            this.authView.showMessageModal("Quiz", "De momento não existem perguntas no quiz.");
            return;
        }

        this.quizView.renderQuizStart(
            allQuestions.length,
            this.handleBack.bind(this),
            () => this.startQuiz()
        );
    }

    startQuiz() {
        this._quizQuestions = this.quizModel.getRandomQuestions(5);
        this._quizIndex = 0;
        this._quizScore = 0;
        this._quizCorrect = 0;
        this._showNextQuestion();
    }

    _showNextQuestion() {
        if (this._quizIndex >= this._quizQuestions.length) {
            this._finishQuiz();
            return;
        }

        const question = this._quizQuestions[this._quizIndex];
        this.quizView.renderQuestion(
            question,
            this._quizIndex,
            this._quizQuestions.length,
            (questionId, selectedIndex) => this._handleQuizAnswer(questionId, selectedIndex),
            this.handleBack.bind(this)
        );
    }

    _handleQuizAnswer(questionId, selectedIndex) {
        const result = this.quizModel.checkAnswer(questionId, selectedIndex);

        if (result.correct) {
            this._quizCorrect += 1;
            this._quizScore += result.points;
            // Somar pontos ao user
            this.userModel.addPoints(result.points);
        }

        this.quizView.renderAnswerFeedback(
            result.correct,
            result.explanation,
            result.points,
            () => {
                this._quizIndex += 1;
                this._showNextQuestion();
            }
        );
    }

    _finishQuiz() {
        this.userModel.incrementQuizzesCompleted();
        this._checkAndAwardBadges();

        this.quizView.renderQuizResults(
            this._quizCorrect,
            this._quizQuestions.length,
            this._quizScore,
            () => this.goToDashboard()
        );
    }

    // ═══════════════════════════════════════
    //  BADGES (Verificação automática)
    // ═══════════════════════════════════════

    _checkAndAwardBadges() {
        const userData = this.userModel.getUserData();
        if (!userData) return;

        const newBadges = this.badgeModel.checkNewBadges(userData);

        newBadges.forEach(badgeId => {
            this.userModel.earnBadge(badgeId);

            // Notificação de conquista
            const badgeDef = this.badgeModel.getBadgeById(badgeId);
            if (badgeDef) {
                const notification = NotificationModel.badgeNotification(badgeDef.name, badgeDef.icon);
                this.userModel.addNotification(notification);
            }
        });
    }

    // ═══════════════════════════════════════
    //  ADMIN
    // ═══════════════════════════════════════

    openAdminPanel() {
        if (!this.userModel.isAdmin) {
            this.authView.showMessageModal(
                "Acesso restrito",
                "Apenas administradores podem aceder a este painel."
            );
            return;
        }

        this.dashboardView.renderAdminPanel(
            this.scenarioModel.getAllScenarios(),
            this.userModel.listUsers(),
            this.userModel.currentEmail,
            {
                addExercise: this.handleAddExercise.bind(this),
                removeExercise: this.handleRemoveExercise.bind(this),
                toggleBan: this.handleToggleBan.bind(this),
            }
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
                "A tua conta foi suspensa pelo administrador."
            );
            return;
        }

        this.openAdminPanel();
    }
}