import UserModel from './models/UserModel.js';
import ScenarioModel from './models/ScenarioModel.js';
import LandingView from './views/LandingView.js';
import AuthView from './views/AuthView.js';
import DashboardView from './views/DashboardView.js';
import ScenarioView from './views/ScenarioView.js';
import AppController from './controllers/AppController.js';

document.addEventListener('DOMContentLoaded', () => {
    // Instanciar Models
    const userModel = new UserModel();
    const scenarioModel = new ScenarioModel();

    // Instanciar Views
    const landingView = new LandingView();
    const authView = new AuthView();
    const dashboardView = new DashboardView();
    const scenarioView = new ScenarioView();

    // Injetar dependências no Controller
    const app = new AppController(
        userModel, 
        scenarioModel, 
        landingView, 
        authView, 
        dashboardView, 
        scenarioView
    );
});
