/**
 * ScenarioModel — Gere os cenários/exercícios da aplicação.
 * Os dados iniciais são injetados pelo MockServer no localStorage.
 * Suporta CRUD (admin) e sistema de recomendação.
 */
export default class ScenarioModel {
    constructor() {
        this.storageKey = 'respira_scenarios';
        const stored = JSON.parse(localStorage.getItem(this.storageKey));

        if (Array.isArray(stored) && stored.length > 0) {
            this.scenarios = this.normalizeScenarios(stored);
        } else {
            this.scenarios = [];
        }
    }

    // ── Normalizar cenários (compatibilidade com dados antigos) ──
    normalizeScenarios(list) {
        let hasChanges = false;

        const normalized = list.map((scenario, index) => {
            const copy = { ...scenario };

            if (!copy.id) {
                copy.id = index + 1;
                hasChanges = true;
            }

            if (!copy.type) {
                copy.type = 'social';
                hasChanges = true;
            }

            if (!Array.isArray(copy.options) || copy.options.length === 0) {
                copy.options = [this.createCompletionOption(10)];
                hasChanges = true;
            }

            return copy;
        });

        if (hasChanges) {
            this.saveScenarios(normalized);
        }

        return normalized;
    }

    // ── Guardar no localStorage ──
    saveScenarios(list) {
        localStorage.setItem(this.storageKey, JSON.stringify(list));
    }

    // ── Criar opção de conclusão simples ──
    createCompletionOption(points) {
        const safePoints = Number.isFinite(points) && points > 0 ? Math.round(points) : 10;
        return {
            text: 'Concluí o exercício',
            points: safePoints,
            feedback: 'Excelente! Registaste o exercício como concluído.'
        };
    }

    // ── Obter todos os cenários ──
    getAllScenarios() {
        return this.scenarios;
    }

    // ── Obter cenário por ID ──
    getScenarioById(id) {
        return this.scenarios.find(s => s.id === id) || null;
    }

    // ── Adicionar cenário (admin) ──
    addScenario({ title, text, points, type }) {
        const trimmedTitle = title ? title.trim() : '';
        const trimmedText = text ? text.trim() : '';

        if (!trimmedTitle || !trimmedText) {
            return null;
        }

        const safeType = type || 'soft-skills';
        const nextId = this.scenarios.reduce((maxId, item) => Math.max(maxId, item.id || 0), 0) + 1;
        const scenario = {
            id: nextId,
            title: trimmedTitle,
            type: safeType,
            text: trimmedText,
            options: [this.createCompletionOption(points)]
        };

        this.scenarios.push(scenario);
        this.saveScenarios(this.scenarios);
        return scenario;
    }

    // ── Remover cenário (admin) ──
    removeScenario(id) {
        const before = this.scenarios.length;
        this.scenarios = this.scenarios.filter(item => item.id !== id);
        if (this.scenarios.length !== before) {
            this.saveScenarios(this.scenarios);
            return true;
        }
        return false;
    }

    // ═══════════════════════════════════════
    //  SISTEMA DE RECOMENDAÇÃO
    // ═══════════════════════════════════════

    /**
     * Gera recomendações personalizadas para o utilizador.
     * Lógica:
     * 1. Cenários favoritos que ainda não completou
     * 2. Cenários de tipos que o user menos praticou (diversificar)
     * 3. Cenários que o user nunca fez
     * 
     * @param {Array} completedIds — IDs de cenários completados pelo user
     * @param {Array} favoriteIds — IDs de cenários favoritos do user
     * @param {Array} mostPracticedTypes — tipos mais praticados (ordenados)
     * @returns {Array} — lista de cenários recomendados (máx 4)
     */
    getRecommendations(completedIds, favoriteIds, mostPracticedTypes) {
        const recommended = [];
        const allTypes = ['social', 'soft-skills', 'vida-real'];

        // 1. Favoritos não completados
        this.scenarios.forEach(s => {
            if (favoriteIds.includes(s.id) && !completedIds.includes(s.id)) {
                if (!recommended.some(r => r.id === s.id)) {
                    recommended.push(s);
                }
            }
        });

        // 2. Cenários de tipos menos praticados
        const leastPracticed = allTypes.filter(t => !mostPracticedTypes.includes(t));
        // Juntar tipos por ordem inversa (menos praticados primeiro)
        const typePriority = leastPracticed.concat([...mostPracticedTypes].reverse());

        typePriority.forEach(type => {
            this.scenarios.forEach(s => {
                if (s.type === type && !completedIds.includes(s.id)) {
                    if (!recommended.some(r => r.id === s.id)) {
                        recommended.push(s);
                    }
                }
            });
        });

        // 3. Qualquer cenário não completado (fallback)
        this.scenarios.forEach(s => {
            if (!completedIds.includes(s.id)) {
                if (!recommended.some(r => r.id === s.id)) {
                    recommended.push(s);
                }
            }
        });

        // Devolver no máximo 4 recomendações
        const result = [];
        for (let i = 0; i < Math.min(4, recommended.length); i++) {
            result.push(recommended[i]);
        }
        return result;
    }
}