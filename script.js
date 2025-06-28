// Classe principal do aplicativo de flashcards
class FlashcardsApp {
    constructor() {
        this.flashcards = [];
        this.currentIndex = 0;
        this.score = 0;
        this.studyCards = [];
        this.isFlipped = false;
        this.currentTheme = 'light';

        this.init();
    }

    init() {
        this.loadFlashcards();
        this.loadTheme();
        this.setupEventListeners();
        this.updateUI();
        this.loadCategories();
    }

    // Carregar flashcards do localStorage
    loadFlashcards() {
        const saved = localStorage.getItem('flashcards');
        this.flashcards = saved ? JSON.parse(saved) : [];
        this.studyCards = [...this.flashcards];
    }

    // Salvar flashcards no localStorage
    saveFlashcards() {
        localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
    }

    // Carregar tema do localStorage
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    // Salvar tema no localStorage
    saveTheme() {
        localStorage.setItem('theme', this.currentTheme);
    }

    // Configurar event listeners
    setupEventListeners() {
        // Toggle de tema
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Navegação entre abas
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Métodos de adição
        document.querySelectorAll('.method-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMethod(e.target.dataset.method);
            });
        });

        // Formulário de adição individual
        document.getElementById('single-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSingleFlashcard();
        });

        // Importar JSON
        document.getElementById('import-json').addEventListener('click', () => {
            this.importJSON();
        });

        // Controles de estudo
        document.getElementById('flip-btn').addEventListener('click', () => {
            this.flipCard();
        });

        document.getElementById('current-card').addEventListener('click', () => {
            this.flipCard();
        });

        // Botões de dificuldade
        document.querySelectorAll('[data-difficulty]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.rateCard(e.target.dataset.difficulty);
            });
        });

        // Opções de estudo
        document.getElementById('shuffle-btn').addEventListener('click', () => {
            this.shuffleCards();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetStudy();
        });

        // Gerenciamento
        document.getElementById('export-json').addEventListener('click', () => {
            this.exportJSON();
        });

        document.getElementById('clear-all').addEventListener('click', () => {
            this.showConfirmModal('Tem certeza que deseja apagar todos os flashcards?', () => {
                this.clearAllCards();
            });
        });

        // Filtros
        document.getElementById('category-filter').addEventListener('change', () => {
            this.filterCards();
        });

        document.getElementById('difficulty-filter').addEventListener('change', () => {
            this.filterCards();
        });

        document.getElementById('search-cards').addEventListener('input', () => {
            this.filterCards();
        });

        // Modal de confirmação
        document.getElementById('confirm-yes').addEventListener('click', () => {
            this.confirmAction();
        });

        document.getElementById('confirm-no').addEventListener('click', () => {
            this.hideConfirmModal();
        });

        // Fechar modal ao clicar fora
        document.getElementById('confirm-modal').addEventListener('click', (e) => {
            if (e.target.id === 'confirm-modal') {
                this.hideConfirmModal();
            }
        });

        // Modal de ajuda IA
        document.getElementById('ai-help-btn').addEventListener('click', () => {
            this.showAIHelpModal();
        });

        document.getElementById('close-ai-help').addEventListener('click', () => {
            this.hideAIHelpModal();
        });

        document.getElementById('close-ai-help-footer').addEventListener('click', () => {
            this.hideAIHelpModal();
        });

        document.getElementById('copy-prompt').addEventListener('click', () => {
            this.copyGeneratedPrompt();
        });

        // Event listeners para geração dinâmica do prompt
        document.getElementById('prompt-topic').addEventListener('input', () => {
            this.updateGeneratedPrompt();
        });

        document.getElementById('prompt-count').addEventListener('change', () => {
            this.updateGeneratedPrompt();
        });

        document.getElementById('prompt-category').addEventListener('input', () => {
            this.updateGeneratedPrompt();
        });

        document.getElementById('prompt-difficulty').addEventListener('change', () => {
            this.updateGeneratedPrompt();
        });

        document.getElementById('prompt-instructions').addEventListener('input', () => {
            this.updateGeneratedPrompt();
        });

        // Fechar modal de ajuda ao clicar fora
        document.getElementById('ai-help-modal').addEventListener('click', (e) => {
            if (e.target.id === 'ai-help-modal') {
                this.hideAIHelpModal();
            }
        });
    }

    // Alternar tema
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    // Definir tema
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        this.saveTheme();

        // Atualizar ícone do botão
        const themeBtn = document.getElementById('theme-toggle');
        const icon = themeBtn.querySelector('i');

        if (theme === 'dark') {
            icon.className = 'fas fa-moon';
            themeBtn.title = 'Alternar para tema claro';
        } else {
            icon.className = 'fas fa-sun';
            themeBtn.title = 'Alternar para tema escuro';
        }
    }

    // Trocar entre abas
    switchTab(tabName) {
        // Remover classe active de todas as abas e botões
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Adicionar classe active na aba e botão selecionados
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Atualizar UI baseado na aba
        if (tabName === 'study') {
            this.updateStudyUI();
        } else if (tabName === 'manage') {
            this.updateManageUI();
        }
    }

    // Trocar entre métodos de adição
    switchMethod(methodName) {
        document.querySelectorAll('.method-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelectorAll('.method-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.getElementById(`${methodName}-add`).classList.add('active');
        document.querySelector(`[data-method="${methodName}"]`).classList.add('active');
    }

    // Adicionar flashcard individual
    addSingleFlashcard() {
        const question = document.getElementById('question').value.trim();
        const answer = document.getElementById('answer').value.trim();
        const category = document.getElementById('category').value.trim();

        if (!question || !answer) {
            this.showToast('Por favor, preencha pergunta e resposta!', 'error');
            return;
        }

        const flashcard = {
            id: Date.now(),
            question,
            answer,
            category: category || 'Sem categoria',
            createdAt: new Date().toISOString(),
            difficulty: 'medium',
            timesStudied: 0,
            timesCorrect: 0
        };

        this.flashcards.push(flashcard);
        this.saveFlashcards();
        this.updateUI();

        // Limpar formulário
        document.getElementById('single-form').reset();

        this.showToast('Flashcard adicionado com sucesso!', 'success');
    }

    // Importar JSON
    importJSON() {
        const jsonInput = document.getElementById('json-input').value.trim();

        if (!jsonInput) {
            this.showToast('Por favor, cole o JSON dos flashcards!', 'error');
            return;
        }

        try {
            const importedCards = JSON.parse(jsonInput);

            if (!Array.isArray(importedCards)) {
                throw new Error('JSON deve ser um array');
            }

            let addedCount = 0;
            importedCards.forEach(card => {
                if (card.question && card.answer) {
                    const flashcard = {
                        id: Date.now() + Math.random(),
                        question: card.question,
                        answer: card.answer,
                        category: card.category || 'Sem categoria',
                        createdAt: new Date().toISOString(),
                        difficulty: 'medium',
                        timesStudied: 0,
                        timesCorrect: 0
                    };
                    this.flashcards.push(flashcard);
                    addedCount++;
                }
            });

            this.saveFlashcards();
            this.updateUI();
            document.getElementById('json-input').value = '';

            this.showToast(`${addedCount} flashcards importados com sucesso!`, 'success');
        } catch (error) {
            this.showToast('Erro ao importar JSON. Verifique o formato!', 'error');
        }
    }

    // Exportar JSON
    exportJSON() {
        if (this.flashcards.length === 0) {
            this.showToast('Nenhum flashcard para exportar!', 'warning');
            return;
        }

        const exportData = this.flashcards.map(card => ({
            question: card.question,
            answer: card.answer,
            category: card.category
        }));

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `flashcards_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showToast('JSON exportado com sucesso!', 'success');
    }

    // Virar card
    flipCard() {
        if (this.studyCards.length === 0) return;

        const card = document.getElementById('current-card');
        this.isFlipped = !this.isFlipped;

        if (this.isFlipped) {
            card.classList.add('flipped');
        } else {
            card.classList.remove('flipped');
        }
    }

    // Avaliar dificuldade do card
    rateCard(difficulty) {
        if (this.studyCards.length === 0) return;

        const currentCard = this.studyCards[this.currentIndex];
        currentCard.timesStudied++;

        if (difficulty === 'easy') {
            currentCard.timesCorrect++;
            this.score++;
        }

        // Atualizar dificuldade no card original
        const originalCard = this.flashcards.find(card => card.id === currentCard.id);
        if (originalCard) {
            originalCard.difficulty = difficulty;
            originalCard.timesStudied = currentCard.timesStudied;
            originalCard.timesCorrect = currentCard.timesCorrect;
        }

        this.saveFlashcards();
        this.nextCard();
    }

    // Próximo card
    nextCard() {
        this.isFlipped = false;
        document.getElementById('current-card').classList.remove('flipped');

        this.currentIndex++;

        if (this.currentIndex >= this.studyCards.length) {
            this.showToast('Parabéns! Você completou todos os flashcards!', 'success');
            this.resetStudy();
        } else {
            this.updateStudyUI();
        }
    }

    // Embaralhar cards
    shuffleCards() {
        this.studyCards = [...this.flashcards];
        for (let i = this.studyCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.studyCards[i], this.studyCards[j]] = [this.studyCards[j], this.studyCards[i]];
        }
        this.currentIndex = 0;
        this.score = 0;
        this.isFlipped = false;
        document.getElementById('current-card').classList.remove('flipped');
        this.updateStudyUI();
        this.showToast('Cards embaralhados!', 'success');
    }

    // Reiniciar estudo
    resetStudy() {
        this.studyCards = [...this.flashcards];
        this.currentIndex = 0;
        this.score = 0;
        this.isFlipped = false;
        document.getElementById('current-card').classList.remove('flipped');
        this.updateStudyUI();
    }

    // Limpar todos os cards
    clearAllCards() {
        this.flashcards = [];
        this.studyCards = [];
        this.currentIndex = 0;
        this.score = 0;
        this.saveFlashcards();
        this.updateUI();
        this.hideConfirmModal();
        this.showToast('Todos os flashcards foram removidos!', 'success');
    }

    // Filtrar cards
    filterCards() {
        const categoryFilter = document.getElementById('category-filter').value;
        const difficultyFilter = document.getElementById('difficulty-filter').value;
        const searchTerm = document.getElementById('search-cards').value.toLowerCase();

        const filteredCards = this.flashcards.filter(card => {
            const matchesCategory = !categoryFilter || card.category === categoryFilter;
            const matchesDifficulty = !difficultyFilter || card.difficulty === difficultyFilter;
            const matchesSearch = !searchTerm ||
                card.question.toLowerCase().includes(searchTerm) ||
                card.answer.toLowerCase().includes(searchTerm);

            return matchesCategory && matchesDifficulty && matchesSearch;
        });

        this.renderCardsList(filteredCards);
    }

    // Carregar categorias
    loadCategories() {
        const categories = [...new Set(this.flashcards.map(card => card.category))];
        const select = document.getElementById('category-filter');

        // Manter a opção "Todas as categorias"
        select.innerHTML = '<option value="">Todas as categorias</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    }

    // Atualizar UI geral
    updateUI() {
        this.loadCategories();
        this.updateStudyUI();
        this.updateManageUI();
    }

    // Atualizar UI de estudo
    updateStudyUI() {
        if (this.studyCards.length === 0) {
            document.getElementById('question-text').textContent = 'Nenhum flashcard disponível';
            document.getElementById('answer-text').textContent = 'Adicione flashcards para começar';
            document.getElementById('progress').textContent = '0 / 0';
            document.getElementById('score').textContent = 'Acertos: 0';
            document.getElementById('correct-rate').textContent = 'Taxa: 0%';
            return;
        }

        const currentCard = this.studyCards[this.currentIndex];
        document.getElementById('question-text').textContent = currentCard.question;
        document.getElementById('answer-text').textContent = currentCard.answer;
        document.getElementById('progress').textContent = `${this.currentIndex + 1} / ${this.studyCards.length}`;
        document.getElementById('score').textContent = `Acertos: ${this.score}`;

        // Calcular taxa de acerto
        const correctRate = this.studyCards.length > 0 ? Math.round((this.score / this.studyCards.length) * 100) : 0;
        document.getElementById('correct-rate').textContent = `Taxa: ${correctRate}%`;
    }

    // Atualizar UI de gerenciamento
    updateManageUI() {
        this.renderCardsList(this.flashcards);
    }

    // Renderizar lista de cards
    renderCardsList(cards) {
        const container = document.getElementById('cards-list');

        if (cards.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">Nenhum flashcard encontrado</p>';
            return;
        }

        container.innerHTML = cards.map(card => `
            <div class="card-item">
                <div class="category">${card.category}</div>
                <div class="difficulty ${card.difficulty}">
                    ${this.getDifficultyText(card.difficulty)}
                </div>
                <h4>Pergunta:</h4>
                <p>${card.question}</p>
                <h4>Resposta:</h4>
                <p>${card.answer}</p>
                <div class="card-stats">
                    <small>Estudado: ${card.timesStudied} vezes | Acertos: ${card.timesCorrect}</small>
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary" onclick="app.editCard(${card.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger" onclick="app.deleteCard(${card.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Obter texto da dificuldade
    getDifficultyText(difficulty) {
        const difficultyMap = {
            'easy': 'Fácil',
            'medium': 'Médio',
            'hard': 'Difícil'
        };
        return difficultyMap[difficulty] || 'Médio';
    }

    // Editar card
    editCard(id) {
        const card = this.flashcards.find(c => c.id === id);
        if (!card) return;

        // Implementar edição (pode ser um modal ou navegação para a aba de adição)
        this.showToast('Funcionalidade de edição em desenvolvimento!', 'warning');
    }

    // Excluir card
    deleteCard(id) {
        this.showConfirmModal('Tem certeza que deseja excluir este flashcard?', () => {
            this.flashcards = this.flashcards.filter(card => card.id !== id);
            this.studyCards = this.studyCards.filter(card => card.id !== id);
            this.saveFlashcards();
            this.updateUI();
            this.hideConfirmModal();
            this.showToast('Flashcard excluído com sucesso!', 'success');
        });
    }

    // Mostrar modal de confirmação
    showConfirmModal(message, callback) {
        document.getElementById('confirm-message').textContent = message;
        document.getElementById('confirm-modal').style.display = 'block';
        this.pendingAction = callback;
    }

    // Esconder modal de confirmação
    hideConfirmModal() {
        document.getElementById('confirm-modal').style.display = 'none';
        this.pendingAction = null;
    }

    // Confirmar ação
    confirmAction() {
        if (this.pendingAction) {
            this.pendingAction();
        }
    }

    // Mostrar toast
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Mostrar modal de ajuda IA
    showAIHelpModal() {
        document.getElementById('ai-help-modal').style.display = 'block';
        this.updateGeneratedPrompt(); // Gerar prompt inicial
    }

    // Esconder modal de ajuda IA
    hideAIHelpModal() {
        document.getElementById('ai-help-modal').style.display = 'none';
    }

    // Atualizar prompt gerado
    updateGeneratedPrompt() {
        const prompt = this.generatePrompt();
        document.getElementById('final-prompt').value = prompt;
    }

    // Gerar prompt
    generatePrompt() {
        const topic = document.getElementById('prompt-topic').value || 'Tópico';
        const count = document.getElementById('prompt-count').value || '10';
        const category = document.getElementById('prompt-category').value || 'Categoria';
        const difficulty = document.getElementById('prompt-difficulty').value || 'intermediário';
        const instructions = document.getElementById('prompt-instructions').value || '';

        let prompt = `Gere ${count} flashcards educacionais sobre "${topic}" no formato JSON. `;

        if (instructions) {
            prompt += `${instructions} `;
        }

        prompt += `Nível de dificuldade: ${difficulty}. Responda APENAS com um JSON válido no formato:

[
  {
    "question": "Pergunta aqui",
    "answer": "Resposta aqui",
    "category": "${category}"
  }, 
  {
    "question": "Pergunta aqui",
    "answer": "Resposta aqui",
    "category": "${category}"
  }
]

Certifique-se de que o JSON seja válido e bem formatado.`;

        return prompt;
    }

    // Copiar prompt gerado
    copyGeneratedPrompt() {
        const prompt = this.generatePrompt();
        navigator.clipboard.writeText(prompt).then(() => {
            this.showToast('Prompt copiado para a área de transferência!', 'success');
        }).catch(() => {
            // Fallback para navegadores que não suportam clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = prompt;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Prompt copiado para a área de transferência!', 'success');
        });
    }
}

// Inicializar aplicativo quando a página carregar
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FlashcardsApp();
});

// Exemplo de JSON para teste
const exampleJSON = [
    {
        "question": "Qual é a capital do Brasil?",
        "answer": "Brasília",
        "category": "Geografia"
    },
    {
        "question": "2 + 2 = ?",
        "answer": "4",
        "category": "Matemática"
    },
    {
        "question": "Quem escreveu 'Dom Casmurro'?",
        "answer": "Machado de Assis",
        "category": "Literatura"
    },
    {
        "question": "Qual é o maior planeta do sistema solar?",
        "answer": "Júpiter",
        "category": "Ciência"
    },
    {
        "question": "Em que ano o Brasil se tornou independente?",
        "answer": "1822",
        "category": "História"
    }
];

// Função para carregar exemplo (pode ser chamada no console)
function loadExample() {
    const jsonInput = document.getElementById('json-input');
    jsonInput.value = JSON.stringify(exampleJSON, null, 2);
} 