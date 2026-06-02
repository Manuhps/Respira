export default class BaseView {
    constructor() {
        this.appElement = document.getElementById('app');
    }

    /**
     * Remove a modal que esteja aberta (se existir).
     * Mantemos esta lógica aqui para todas as Views conseguirem reutilizar.
     */
    closeModal() {
        const existingOverlay = document.getElementById('respira-modal-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
    }

    /**
     * Mostra uma modal simples (apenas mensagem + botão).
     * @param {string} title - Título da modal.
     * @param {string} message - Texto a apresentar.
     * @param {Function} [onCloseCallback] - Callback quando o utilizador fecha.
     */
    showMessageModal(title, message, onCloseCallback) {
        this.closeModal();

        const overlay = document.createElement('div');
        overlay.id = 'respira-modal-overlay';
        overlay.className = 'modal-overlay';

        overlay.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true">
                <h3 class="modal-title">${title}</h3>
                <p class="modal-message">${message}</p>
                <div class="modal-actions">
                    <button type="button" id="respira-modal-btn-ok">OK</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const okBtn = document.getElementById('respira-modal-btn-ok');
        okBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.closeModal();
            if (onCloseCallback) onCloseCallback();
        });

        // Clique fora da modal fecha (comportamento de pop-up).
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                this.closeModal();
                if (onCloseCallback) onCloseCallback();
            }
        });
    }

    /**
     * Modal com input (username) e botões Confirmar/Usar nome real.
     * Usamos callbacks para manter a matéria do aluno (sem Promises).
     */
    showPromptModal(title, message, inputPlaceholder, onConfirmCallback, onCancelCallback) {
        this.closeModal();

        const overlay = document.createElement('div');
        overlay.id = 'respira-modal-overlay';
        overlay.className = 'modal-overlay';

        overlay.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true">
                <h3 class="modal-title">${title}</h3>
                <p class="modal-message">${message}</p>
                <form id="respira-modal-form" class="modal-form">
                    <input type="text" id="respira-modal-input" placeholder="${inputPlaceholder}" />
                    <div class="modal-actions">
                        <button type="submit" id="respira-modal-btn-confirm">Continuar</button>
                        <button type="button" id="respira-modal-btn-cancel" class="btn-secondary">Continuar com nome real</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);

        const form = document.getElementById('respira-modal-form');
        const input = document.getElementById('respira-modal-input');
        const cancelBtn = document.getElementById('respira-modal-btn-cancel');

        // Foco imediato para dar sensação de pop-up “a sério”.
        input.focus();

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const value = input.value;
            this.closeModal();
            if (onConfirmCallback) onConfirmCallback(value);
        });

        cancelBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.closeModal();
            if (onCancelCallback) onCancelCallback();
        });

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                this.closeModal();
                if (onCancelCallback) onCancelCallback();
            }
        });
    }

    renderBackButton(onBackCallback) {
        const existingBtn = this.appElement.querySelector('.btn-back-arrow');
        if (existingBtn) existingBtn.remove();

        const backBtn = document.createElement('button');
        backBtn.className = 'btn-back-arrow';
        backBtn.innerHTML = '&#8592;';
        backBtn.title = "Voltar";
        backBtn.addEventListener('click', onBackCallback);
        
        this.appElement.prepend(backBtn);
    }
}
