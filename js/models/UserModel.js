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
            breezePoints: 0
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
            this.#user = foundUser;
            localStorage.setItem('respira_current_user', email);
            return true;
        }
        return false;
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

    get isLogged() {
        return this.#user !== null;
    }
}
