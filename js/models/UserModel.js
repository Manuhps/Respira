export default class UserModel {
    constructor() {
        this.name = localStorage.getItem('userName') || null;
        this.points = parseInt(localStorage.getItem('points')) || 0;
    }

    login(name) {
        this.name = name;
        localStorage.setItem('userName', name);
    }

    logout() {
        this.name = null;
        this.points = 0;
        localStorage.removeItem('userName');
        localStorage.removeItem('points');
    }

    addPoints(pts) {
        this.points += pts;
        localStorage.setItem('points', this.points);
    }
}
