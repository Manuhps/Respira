# 🍃 Respira

**Respira** é uma Web Application (Single Page Application) desenvolvida com **JavaScript, HTML e CSS**, desenhada para ajudar jovens e adultos a lidar com a Ansiedade Social através de exposição gradual, gamificação e técnicas de relaxamento.

Este projeto foi desenvolvido como trabalho final da disciplina de **Programação Orientada a Objetos (POO)**.

---

## ✨ Funcionalidades Principais

- **🎓 Desafios de Exposição Gradual:** Catálogo de cenários práticos focados em *Soft Skills*, *Vida Real* e interações *Sociais*.
- **🎮 Gamificação e Streaks:** Ganha "Pontos de Brisa" e acumula "Ventinhos" ao manteres uma sequência (streak) de exercícios concluídos.
- **🙂 Avatar Evolutivo:** O teu companheiro de viagem muda de estado (ansioso para feliz) consoante a tua evolução e pontos ganhos.
- **🧠 Quiz Interativo:** Testa os teus conhecimentos sobre ansiedade social e ganha pontos extra através de feedback imediato.
- **🏅 Sistema de Badges (Conquistas):** Desbloqueia medalhas automáticas à medida que progrides e tentas novas atividades na plataforma.
- **❤️ Favoritos e Recomendações:** Guarda os teus exercícios preferidos e recebe sugestões personalizadas do sistema para a tua próxima exposição.
- **🧘‍♂️ Exercícios de Respiração:** Pratica a técnica de respiração 4-7-8 acompanhada de animações visuais calmantes e temporizadas.
- **📺 Recursos Multimédia:** Acesso direto a vídeos inspiracionais (ex: TED Talks) aleatórios sobre confiança, e frases motivacionais dinâmicas.
- **🛠️ Painel de Administração (POO):** Permite aos utilizadores com cargo `admin` gerir a plataforma: banir/desbanir utilizadores e adicionar/remover exercícios dinamicamente.

---

## 🏗️ Arquitetura e Tecnologias

O projeto foi construído **estritamente em JavaScript, HTML e CSS**, sem recurso a bibliotecas ou frameworks externas, respeitando na íntegra as regras académicas estipuladas.

- **Padrão MVC (Model-View-Controller):** Separação rigorosa entre a lógica MVC (`Models`), a manipulação do DOM (`Views`) e o controlo de navegação (`Controller`).
- **Programação Orientada a Objetos (POO):** Utilização de Classes (`class`), Herança (`extends BaseView`), Encapsulamento de dados (variáveis privadas `#`), Métodos Estáticos e Getters.
- **Persistência de Dados (`localStorage`):** Toda a informação é guardada localmente, com mecanismos de migração automática para contas antigas e proteção de dados nulos.
- **Mock Server:** Um módulo inteligente (`js/utils/mockServer.js`) que deteta arranques a limpo e injeta os dados estruturais iniciais (cenários, badges, admin).
- **Design Clean & Responsivo:** Interface com cores creme suaves que promovem a calma, totalmente adaptável a ecrãs de computador.

---

## 🚀 Como Executar

A aplicação funciona inteiramente do lado do cliente (offline). Não requer instalação de Node.js, npm, ou servidores de backend.

1. Clona este repositório ou extrai a pasta do projeto.
2. Abre o ficheiro `index.html` em qualquer browser moderno (Chrome, Edge, Firefox, Safari).
3. Podes criar a tua própria conta ou entrar diretamente no modo Administrador usando:
   - **Email:** `admin@gmail.com`
   - **Password:** `123`

*(Nota: Para simular a primeira visita, podes usar a ferramenta de Developer Tools do browser `(F12) -> Application -> Local Storage` e apagar todos os dados registados antes de fazeres refresh).*

---

## 📂 Estrutura do Projeto

```text
Respira/
├── index.html
├── css/
│   ├── index.css            # Variáveis globais, reset e modais
│   ├── auth.css             # Estilos do login e registo
│   ├── dashboard.css        # Layout da área principal
│   └── ...                  # Outras folhas de estilo modulares
├── js/
│   ├── main.js              # Ponto de entrada (arranque do MockServer e AppController)
│   ├── controllers/
│   │   └── AppController.js # Lógica de rotas e orquestração MVC
│   ├── models/
│   │   ├── UserModel.js     # Entidade central do utilizador e progresso
│   │   ├── ScenarioModel.js # Exercícios e algoritmo de recomendação
│   │   ├── QuizModel.js     # Dados e verificação das perguntas
│   │   └── BadgeModel.js    # Condições de desbloqueio das conquistas
│   ├── views/
│   │   ├── BaseView.js      # Classe mãe (herança para Modais e navegação)
│   │   └── ...              # Diferentes ecrãs da UI (DashboardView, AuthView, etc.)
│   └── utils/
│       ├── mockServer.js    # Injeção inicial de dados no LocalStorage
│       ├── videos.js        # Repositório estático de recursos vídeo
│       └── quotes.js        # Repositório de citações motivacionais
└── img/
    ├── Sab.png              # Avatar (nível inicial)
    ├── Good.png             # Avatar (nível avançado)
    └── gj.png               # Ilustração gráfica para Landing Page
```

---

*Desenvolvido no âmbito da disciplina de POO, com o objetivo de promover a literacia emocional e a coragem frente à ansiedade social.*
