/**
 * BadgeModel — Gere as conquistas (badges) do utilizador.
 * As definições dos badges vêm do MockServer (localStorage).
 * O progresso de cada user é guardado no seu objeto (campo 'badges').
 */
export default class BadgeModel {

    constructor() {
        this.storageKey = 'respira_badges_defs';
        this.definitions = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    // ── Obter todas as definições de badges ──
    getAllBadges() {
        return this.definitions;
    }

    // ── Obter info de um badge pelo id ──
    getBadgeById(badgeId) {
        return this.definitions.find(b => b.id === badgeId) || null;
    }

    /**
     * Verificar quais badges novos o user desbloqueou.
     * @param {Object} userData — dados do user (completedExercises, ventinhos, favorites, badges, quizzesCompleted)
     * @returns {Array} — lista de badges novos (ainda não conquistados)
     */
    checkNewBadges(userData) {
        const earned = userData.badges || [];
        const newBadges = [];

        const totalExercises = Array.isArray(userData.completedExercises) ? userData.completedExercises.length : 0;
        const totalFavorites = Array.isArray(userData.favorites) ? userData.favorites.length : 0;
        const totalVentinhos = userData.ventinhos || 0;
        const totalQuizzes = userData.quizzesCompleted || 0;
        const totalPoints = userData.breezePoints || 0;

        // Primeiro Passo: 1 exercício completado
        if (totalExercises >= 1 && !earned.includes('first_step')) {
            newBadges.push('first_step');
        }

        // Explorador: 5 exercícios completados
        if (totalExercises >= 5 && !earned.includes('explorer')) {
            newBadges.push('explorer');
        }

        // Guerreiro Calmo: 10 exercícios completados
        if (totalExercises >= 10 && !earned.includes('warrior')) {
            newBadges.push('warrior');
        }

        // Primeira Brisa: 1 ventinho ganho
        if (totalVentinhos >= 1 && !earned.includes('breeze')) {
            newBadges.push('breeze');
        }

        // Curioso: 1 quiz completado
        if (totalQuizzes >= 1 && !earned.includes('quiz_start')) {
            newBadges.push('quiz_start');
        }

        // Colecionador: 3 favoritos
        if (totalFavorites >= 3 && !earned.includes('collector')) {
            newBadges.push('collector');
        }

        // Mestre da Sequência: 5 ventinhos
        if (totalVentinhos >= 5 && !earned.includes('streak_master')) {
            newBadges.push('streak_master');
        }

        // Centurião: 100 pontos
        if (totalPoints >= 100 && !earned.includes('centurion')) {
            newBadges.push('centurion');
        }

        return newBadges;
    }
}
