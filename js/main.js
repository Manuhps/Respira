/**
 * main.js — Ponto de entrada da aplicação Respira.
 * 
 * 1. Chama o MockServer para injetar dados iniciais (seed).
 * 2. Instancia todos os Models, Views e o Controller.
 * 3. O Controller arranca a navegação (init).
 */
import MockServer from './utils/mockServer.js';
import UserModel from './models/UserModel.js';
import ScenarioModel from './models/ScenarioModel.js';
import QuizModel from './models/QuizModel.js';
import BadgeModel from './models/BadgeModel.js';
import LandingView from './views/LandingView.js';
import AuthView from './views/AuthView.js';
import DashboardView from './views/DashboardView.js';
import ScenarioView from './views/ScenarioView.js';
import QuizView from './views/QuizView.js';
import AppController from './controllers/AppController.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mock Server — injeta dados iniciais no localStorage (só na 1ª vez)
    MockServer.seed();

    // 2. Instanciar Models
    const userModel = new UserModel();
    const scenarioModel = new ScenarioModel();
    const quizModel = new QuizModel();
    const badgeModel = new BadgeModel();

    // 3. Instanciar Views
    const landingView = new LandingView();
    const authView = new AuthView();
    const dashboardView = new DashboardView();
    const scenarioView = new ScenarioView();
    const quizView = new QuizView();

    // 4. Injetar tudo no Controller (que arranca a app)
    const app = new AppController(
        userModel,
        scenarioModel,
        quizModel,
        badgeModel,
        landingView,
        authView,
        dashboardView,
        scenarioView,
        quizView
    );
});
