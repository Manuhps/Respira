import './index.css';
import UserModel from './js/models/UserModel.js';
import ScenarioModel from './js/models/ScenarioModel.js';
import DashboardView from './js/views/DashboardView.js';
import ScenarioView from './js/views/ScenarioView.js';
import AppController from './js/controllers/AppController.js';

document.addEventListener('DOMContentLoaded', () => {
    // Instanciar Models
    const userModel = new UserModel();
    const scenarioModel = new ScenarioModel();

    // Instanciar Views
    const dashboardView = new DashboardView();
    const scenarioView = new ScenarioView();

    // Injetar dependências no Controller
    const app = new AppController(userModel, scenarioModel, dashboardView, scenarioView);
});
