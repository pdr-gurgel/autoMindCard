# Flashcards App

Um aplicativo de flashcards moderno e responsivo para ajudar no estudo e memorização de conteúdo.

## Funcionalidades

### 📚 Estudo
- Sistema de flashcards interativo
- Controle de progresso e estatísticas
- Avaliação de dificuldade (Fácil, Médio, Difícil)
- Embaralhamento de cards
- Reinicialização de sessão

### ➕ Adicionar Flashcards
- **Card Individual**: Adicione flashcards um por vez
- **Importar JSON**: Importe múltiplos flashcards via JSON
- **Geração com IA**: Use qualquer IA (ChatGPT, Claude, etc.) para gerar flashcards automaticamente

### ⚙️ Gerenciamento
- Visualizar todos os flashcards
- Filtrar por categoria e dificuldade
- Buscar por texto
- Editar e excluir cards
- Exportar dados em JSON

## Estrutura do JSON

Para importar flashcards via JSON, use este formato:

```json
[
  {
    "question": "Qual é a capital do Brasil?",
    "answer": "Brasília",
    "category": "Geografia"
  },
  {
    "question": "2 + 2 = ?",
    "answer": "4",
    "category": "Matemática"
  }
]
```

## 🤖 Gerando Flashcards com IA

Você pode usar qualquer IA (ChatGPT, Claude, Gemini, etc.) para gerar flashcards automaticamente:

### Como Usar:
1. **Acesse uma IA**: Use ChatGPT, Claude, Gemini ou qualquer outra IA
2. **Use um prompt de exemplo**: Clique em "Como gerar com IA" na seção de importação JSON
3. **Personalize o prompt**: Adapte o tópico, quantidade e instruções específicas
4. **Cole o resultado**: Copie o JSON gerado e cole no campo de importação

### Exemplo de Prompt:
```
Gere 10 flashcards educacionais sobre "História do Brasil Colonial" no formato JSON. 
Crie perguntas sobre datas importantes, eventos históricos e personagens principais. 
Responda APENAS com um JSON válido no formato:

[
  {
    "question": "Pergunta aqui",
    "answer": "Resposta aqui",
    "category": "História"
  }
]

Certifique-se de que o JSON seja válido e bem formatado.
```

### Dicas para Prompts Eficazes:
- **Seja específico** sobre o tópico que quer estudar
- **Mencione a quantidade** de flashcards desejada (5-20 é ideal)
- **Especifique o nível** de dificuldade (básico, intermediário, avançado)
- **Peça exemplos práticos** quando relevante
- **Sempre peça JSON válido** como resposta

## Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilização moderna e responsiva
- **JavaScript (ES6+)**: Lógica da aplicação
- **LocalStorage**: Persistência de dados local

## Características

- ✅ Design responsivo (mobile-first)
- ✅ Tema claro/escuro
- ✅ Interface moderna e intuitiva
- ✅ Persistência de dados local
- ✅ Animações suaves
- ✅ Acessibilidade

## Como Executar

1. Clone ou baixe os arquivos
2. Abra o arquivo `index.html` em um navegador moderno
3. Comece a estudar!

## Limitações

- Os dados são salvos apenas localmente (não há sincronização em nuvem)

## Contribuições

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades!

## Licença

Este projeto é de código aberto e está disponível sob a licença MIT. 