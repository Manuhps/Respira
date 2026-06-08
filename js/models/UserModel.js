export default class UserModel {
    #user;

    constructor() {
        this.#user = null;
        this.loadCurrentUser();
    }

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

    getUsers() {
        // Lê lista de utilizadores do localStorage.
        // Compatibilidade: versões antigas guardavam `nickname` em vez de `username`.
        const users = JSON.parse(localStorage.getItem('respira_users')) || [];
        let hasMigration = false;

        users.forEach((u) => {
            // Se não existir username, tentamos migrar de nickname.
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
        });

        // Guardar uma vez a migração para não repetir sempre que a app abre.
        if (hasMigration) {
            this.saveUsers(users);
        }

        return users;
    }

    saveUsers(users) {
        localStorage.setItem('respira_users', JSON.stringify(users));
    }

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
            breezePoints: 0,
            ventinhos: 0,
            exerciseStreak: 0,
            banned: false
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

            this.#user = foundUser;
            localStorage.setItem('respira_current_user', email);
            return { success: true, banned: false };
        }

        return { success: false, banned: false };
    }

    setUsername(username) {
        if (this.#user) {
            this.#user.username = username;
            
            const users = this.getUsers();
            const index = users.findIndex(u => u.email === this.#user.email);
            if (index !== -1) {
                users[index].username = username;
                this.saveUsers(users);
            }
        }
    }

    // Mantido por compatibilidade com versões antigas do Controller.
    setNickname(nickname) {
        this.setUsername(nickname);
    }

    logout() {
        this.#user = null;
        localStorage.removeItem('respira_current_user');
    }

    addPoints(pts) {
        if (this.#user) {
            this.#user.breezePoints += pts;
            
            const users = this.getUsers();
            const index = users.findIndex(u => u.email === this.#user.email);
            if (index !== -1) {
                users[index].breezePoints = this.#user.breezePoints;
                this.saveUsers(users);
            }
        }
    }

    completeExercise(points) {
        if (!this.#user) {
            return {
                pointsGained: 0,
                ventinhoGained: false,
                streakCount: 0,
                ventinhos: 0
            };
        }

        const pointsGained = Number.isFinite(points) ? Math.max(0, Math.round(points)) : 0;
        this.#user.breezePoints += pointsGained;

        let ventinhoGained = false;
        const nextStreak = (this.#user.exerciseStreak || 0) + 1;

        if (nextStreak >= 3) {
            this.#user.exerciseStreak = 0;
            this.#user.ventinhos = (this.#user.ventinhos || 0) + 1;
            ventinhoGained = true;
        } else {
            this.#user.exerciseStreak = nextStreak;
        }

        const users = this.getUsers();
        const index = users.findIndex(u => u.email === this.#user.email);
        if (index !== -1) {
            users[index].breezePoints = this.#user.breezePoints;
            users[index].exerciseStreak = this.#user.exerciseStreak;
            users[index].ventinhos = this.#user.ventinhos;
            this.saveUsers(users);
        }

        return {
            pointsGained,
            ventinhoGained,
            streakCount: this.#user.exerciseStreak,
            ventinhos: this.#user.ventinhos
        };
    }

    listUsers() {
        return this.getUsers();
    }

    setUserBanned(email, isBanned) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.email === email);
        if (index === -1) return false;

        users[index].banned = Boolean(isBanned);
        this.saveUsers(users);

        if (this.#user && this.#user.email === email) {
            this.#user.banned = Boolean(isBanned);
        }

        return true;
    }

    get name() {
        if (!this.#user) return null;
        // Preferimos `username`, mas aceitamos `nickname` (dados antigos).
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

    get isAdminEnabled() {
        return JSON.parse(localStorage.getItem('respira_admin_enabled')) === true;
    }

    get isBanned() {
        return this.#user ? Boolean(this.#user.banned) : false;
    }

    get isLogged() {
        return this.#user !== null;
    }
}
