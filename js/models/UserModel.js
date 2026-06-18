/**
 * UserModel — Gere os dados dos utilizadores da aplicação Respira.
 * 
 * Cada utilizador tem:
 * - Dados pessoais (nome, email, password, etc.)
 * - Role ('user' ou 'admin')
 * - Gamificação (breezePoints, ventinhos, exerciseStreak)
 * - Favoritos (array de IDs de cenários)
 * - Histórico de exercícios (completedExercises)
 * - Badges conquistados (array de IDs)
 * 
 * Tudo é persistido no localStorage.
 */
export default class UserModel {
    #user;

    constructor() {
        this.#user = null;
        this.loadCurrentUser();
    }

    // ── Carregar o utilizador atual (se houver sessão) ──
    loadCurrentUser() {
        const currentUserEmail = localStorage.getItem('respira_current_user');
        if (currentUserEmail) {
            const users = this.getUsers();
            const foundUser = users.find(u => u.email === currentUserEmail);
            if (foundUser) {
                this.#user = foundUser;
            }
        }
    }

    // ── Ler lista de utilizadores do localStorage (com migração) ──
    getUsers() {
        const users = JSON.parse(localStorage.getItem('respira_users')) || [];
        let hasMigration = false;

        users.forEach((u) => {
            // Migração de nickname → username (versões antigas)
            if (u.username === undefined) {
                u.username = (u.nickname !== undefined) ? u.nickname : null;
                hasMigration = true;
            }

            if (u.breezePoints === undefined) {
                u.breezePoints = 0;
                hasMigration = true;
            }

            if (u.ventinhos === undefined) {
                u.ventinhos = 0;
                hasMigration = true;
            }

            if (u.exerciseStreak === undefined) {
                u.exerciseStreak = 0;
                hasMigration = true;
            }

            if (u.banned === undefined) {
                u.banned = false;
                hasMigration = true;
            }

            // Novos campos (migração para versão atual)
            if (u.role === undefined) {
                u.role = 'user';
                hasMigration = true;
            }

            if (!Array.isArray(u.favorites)) {
                u.favorites = [];
                hasMigration = true;
            }

            if (!Array.isArray(u.completedExercises)) {
                u.completedExercises = [];
                hasMigration = true;
            }

            if (!Array.isArray(u.badges)) {
                u.badges = [];
                hasMigration = true;
            }

            if (u.quizzesCompleted === undefined) {
                u.quizzesCompleted = 0;
                hasMigration = true;
            }

            if (u.lastLogin === undefined) {
                u.lastLogin = null;
                hasMigration = true;
            }

            if (u.lastQuizTime === undefined) {
                u.lastQuizTime = null;
                hasMigration = true;
            }

            if (u.profilePic === undefined) {
                u.profilePic = null;
                hasMigration = true;
            }
        });

        if (hasMigration) {
            this.saveUsers(users);
        }

        return users;
    }

    // ── Guardar lista de utilizadores ──
    saveUsers(users) {
        localStorage.setItem('respira_users', JSON.stringify(users));
    }

    // ── Guardar as alterações do user atual no array global ──
    _syncCurrentUser() {
        if (!this.#user) return;
        const users = this.getUsers();
        let index = -1;
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === this.#user.email) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            // Copiar as propriedades do user atual para o array
            const copy = {};
            for (const key in this.#user) {
                copy[key] = this.#user[key];
            }
            users[index] = copy;
            this.saveUsers(users);
        }
    }

    // ═══════════════════════════════════════
    //  REGISTO / LOGIN / LOGOUT
    // ═══════════════════════════════════════

    register(userData) {
        const users = this.getUsers();

        if (users.some(u => u.email === userData.email)) {
            return false; // Email já existe
        }

        const newUser = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            birthDate: userData.birthDate,
            gender: userData.gender,
            username: null,
            role: 'user',
            breezePoints: 0,
            ventinhos: 0,
            exerciseStreak: 0,
            banned: false,
            favorites: [],
            completedExercises: [],
            badges: [],
            quizzesCompleted: 0,
            lastLogin: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        this.#user = newUser;
        localStorage.setItem('respira_current_user', newUser.email);
        return true;
    }

    login(email, password) {
        const users = this.getUsers();
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            if (foundUser.banned) {
                return { success: false, banned: true };
            }

            // Atualizar lastLogin
            foundUser.lastLogin = new Date().toISOString();
            this.#user = foundUser;
            this._syncCurrentUser();
            localStorage.setItem('respira_current_user', email);
            return { success: true, banned: false };
        }

        return { success: false, banned: false };
    }

    logout() {
        this.#user = null;
        localStorage.removeItem('respira_current_user');
    }

    // ═══════════════════════════════════════
    //  USERNAME
    // ═══════════════════════════════════════

    setUsername(username) {
        if (this.#user) {
            this.#user.username = username;
            this._syncCurrentUser();
        }
    }

    // Mantido por compatibilidade com versões antigas
    setNickname(nickname) {
        this.setUsername(nickname);
    }

    // ═══════════════════════════════════════
    //  GAMIFICAÇÃO (Pontos, Ventinhos, Streak)
    // ═══════════════════════════════════════

    addPoints(pts) {
        if (this.#user) {
            this.#user.breezePoints += pts;
            this._syncCurrentUser();
        }
    }

    completeExercise(points, scenarioId) {
        if (!this.#user) {
            return {
                pointsGained: 0,
                ventinhoGained: false,
                streakCount: 0,
                ventinhos: 0
            };
        }

        const pointsGained = (typeof points === 'number' && !isNaN(points)) ? Math.max(0, Math.round(points)) : 0;
        this.#user.breezePoints += pointsGained;

        // Registar no histórico
        if (scenarioId !== undefined) {
            this.#user.completedExercises.push({
                scenarioId: scenarioId,
                date: new Date().toISOString(),
                pointsGained: pointsGained
            });
        }

        // Lógica do streak e ventinhos (Estilo TikTok)
        let ventinhoGained = false;
        this.#user.exerciseStreak = (this.#user.exerciseStreak || 0) + 1;

        if (this.#user.exerciseStreak >= 3) {
            // A sequência ativa aos 3 e os ventinhos refletem a sequência
            this.#user.ventinhos = this.#user.exerciseStreak;
            ventinhoGained = true;
        } else {
            // Se a sequência for menor que 3, os ventinhos ainda não estão ativos
            if (!this.#user.ventinhos || this.#user.ventinhos < 3) {
                this.#user.ventinhos = 0;
            }
        }

        this._syncCurrentUser();

        return {
            pointsGained,
            ventinhoGained,
            streakCount: this.#user.exerciseStreak,
            ventinhos: this.#user.ventinhos
        };
    }

    // ═══════════════════════════════════════
    //  FAVORITOS
    // ═══════════════════════════════════════

    toggleFavorite(scenarioId) {
        if (!this.#user) return false;

        const index = this.#user.favorites.indexOf(scenarioId);
        if (index !== -1) {
            // Remover dos favoritos
            this.#user.favorites.splice(index, 1);
        } else {
            // Adicionar aos favoritos
            this.#user.favorites.push(scenarioId);
        }

        this._syncCurrentUser();
        return this.#user.favorites.includes(scenarioId);
    }

    isFavorite(scenarioId) {
        if (!this.#user) return false;
        return this.#user.favorites.includes(scenarioId);
    }

    get favorites() {
        return this.#user ? this.#user.favorites.filter(function() { return true; }) : [];
    }

    // ═══════════════════════════════════════
    //  HISTÓRICO DE EXERCÍCIOS
    // ═══════════════════════════════════════

    get completedExercises() {
        return this.#user ? this.#user.completedExercises.filter(function() { return true; }) : [];
    }

    get totalExercisesCompleted() {
        return this.#user ? this.#user.completedExercises.length : 0;
    }

    // ═══════════════════════════════════════
    //  BADGES (CONQUISTAS)
    // ═══════════════════════════════════════

    earnBadge(badgeId) {
        if (!this.#user) return;
        if (!this.#user.badges.includes(badgeId)) {
            this.#user.badges.push(badgeId);
            this._syncCurrentUser();
        }
    }

    get badges() {
        return this.#user ? this.#user.badges.filter(function() { return true; }) : [];
    }

    // ═══════════════════════════════════════
    //  QUIZ
    // ═══════════════════════════════════════

    incrementQuizzesCompleted() {
        if (!this.#user) return;
        this.#user.quizzesCompleted = (this.#user.quizzesCompleted || 0) + 1;
        this._syncCurrentUser();
    }

    get quizzesCompleted() {
        return this.#user ? (this.#user.quizzesCompleted || 0) : 0;
    }

    // ═══════════════════════════════════════
    //  DADOS DO USER (para o BadgeModel)
    // ═══════════════════════════════════════

    getUserData() {
        if (!this.#user) return null;
        return {
            completedExercises: this.#user.completedExercises,
            favorites: this.#user.favorites,
            ventinhos: this.#user.ventinhos,
            breezePoints: this.#user.breezePoints,
            badges: this.#user.badges,
            quizzesCompleted: this.#user.quizzesCompleted || 0
        };
    }

    // ═══════════════════════════════════════
    //  ADMIN — Gestão de utilizadores
    // ═══════════════════════════════════════

    listUsers() {
        return this.getUsers();
    }

    setUserBanned(email, isBanned) {
        const users = this.getUsers();
        let index = -1;
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === email) {
                index = i;
                break;
            }
        }
        if (index === -1) return false;

        users[index].banned = Boolean(isBanned);
        this.saveUsers(users);

        if (this.#user && this.#user.email === email) {
            this.#user.banned = Boolean(isBanned);
        }

        return true;
    }



    // ═══════════════════════════════════════
    //  RECOMENDAÇÃO — dados para o sistema
    // ═══════════════════════════════════════

    /**
     * Retorna os IDs de cenários que o user já completou.
     */
    getCompletedScenarioIds() {
        if (!this.#user) return [];
        return this.#user.completedExercises.map(ex => ex.scenarioId);
    }

    /**
     * Retorna os tipos de cenários mais praticados.
     */
    getMostPracticedTypes(scenarios) {
        if (!this.#user) return [];
        const completedIds = this.getCompletedScenarioIds();
        const typeCounts = {};

        completedIds.forEach(id => {
            const scenario = scenarios.find(s => s.id === id);
            if (scenario) {
                typeCounts[scenario.type] = (typeCounts[scenario.type] || 0) + 1;
            }
        });

        // Ordenar por count (mais praticados primeiro)
        const entries = [];
        for (const type in typeCounts) {
            entries.push({ type: type, count: typeCounts[type] });
        }
        entries.sort((a, b) => b.count - a.count);
        return entries.map(e => e.type);
    }

    // ═══════════════════════════════════════
    //  GETTERS (propriedades de leitura)
    // ═══════════════════════════════════════

    get name() {
        if (!this.#user) return null;
        const display = this.#user.username || this.#user.nickname;
        if (display && display.trim() !== "") {
            return display.trim();
        }
        return `${this.#user.firstName} ${this.#user.lastName}`;
    }

    get username() {
        if (!this.#user) return null;
        return this.#user.username || this.#user.nickname || null;
    }

    get points() {
        return this.#user ? this.#user.breezePoints : 0;
    }

    get ventinhos() {
        return this.#user ? this.#user.ventinhos : 0;
    }

    get streakCount() {
        return this.#user ? this.#user.exerciseStreak : 0;
    }

    get currentEmail() {
        return this.#user ? this.#user.email : null;
    }

    get quizzesCompleted() {
        return this.#user ? (this.#user.quizzesCompleted || 0) : 0;
    }

    get profilePic() {
        return this.#user ? this.#user.profilePic : null;
    }

    setProfilePic(url) {
        if (!this.#user) return;
        this.#user.profilePic = url;
        this._syncCurrentUser();
    }

    // Admin é agora determinado pelo role do user (não por flag global)
    get isAdmin() {
        return this.#user ? this.#user.role === 'admin' : false;
    }

    // ── Cooldown do Quiz ──
    canTakeQuiz() {
        if (!this.#user || !this.#user.lastQuizTime) return { canTake: true, remainingMinutes: 0 };
        
        const lastTime = new Date(this.#user.lastQuizTime).getTime();
        const now = new Date().getTime();
        const diffMs = now - lastTime;
        const cooldownMs = 30 * 60 * 1000; // 30 minutos em milissegundos
        
        if (diffMs >= cooldownMs) {
            return { canTake: true, remainingMinutes: 0 };
        }
        
        const remainingMinutes = Math.ceil((cooldownMs - diffMs) / (60 * 1000));
        return { canTake: false, remainingMinutes: remainingMinutes };
    }

    setLastQuizTime() {
        if (!this.#user) return;
        this.#user.lastQuizTime = new Date().toISOString();
        this._syncCurrentUser();
    }

    // Mantido para compatibilidade — agora usa o role
    get isAdminEnabled() {
        return this.isAdmin;
    }

    get isBanned() {
        return this.#user ? Boolean(this.#user.banned) : false;
    }

    get isLogged() {
        return this.#user !== null;
    }

    get lastLogin() {
        return this.#user ? this.#user.lastLogin : null;
    }
}
