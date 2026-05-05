export default class AppController {
    constructor(userModel, scenarioModel, dashboardView, scenarioView) {
        this.userModel = userModel;
        this.scenarioModel = scenarioModel;
        this.dashboardView = dashboardView;
        this.scenarioView = scenarioView;

        // Inicia a app
        this.init();
    }

    init() {
        if (this.userModel.name) {
            this.goToDashboard();
        } else {
            this.dashboardView.renderLanding(this.handleLogin.bind(this));
        }
    }

    handleLogin(name) {
        this.userModel.login(name);
        this.goToDashboard();
    }

    handleLogout() {
        this.userModel.logout();
        this.dashboardView.renderLanding(this.handleLogin.bind(this));
    }

    goToDashboard() {
        this.dashboardView.renderDashboard(
            this.userModel.name,
            this.userModel.points,
            this.goToCatalog.bind(this),
            this.goToBreathing.bind(this),
            this.handleLogout.bind(this)
        );
    }

    goToCatalog() {
        const scenarios = this.scenarioModel.getAllScenarios();
        this.dashboardView.renderCatalog(
            scenarios, 
            this.handlePlayScenario.bind(this),
            this.goToDashboard.bind(this)
        );
    }

    goToBreathing() {
        this.dashboardView.renderBreathing(this.goToDashboard.bind(this));
    }

    handlePlayScenario(scenario) {
        this.scenarioView.renderScenario(
            scenario, 
            this.handleOptionSelected.bind(this),
            this.goToCatalog.bind(this)
        );
    }

    handleOptionSelected(option) {
        if (option.points > 0) {
            this.userModel.addPoints(option.points);
        }

        this.scenarioView.renderFeedback(
            option.feedback, 
            option.points, 
            this.goToDashboard.bind(this)
        );
    }
}