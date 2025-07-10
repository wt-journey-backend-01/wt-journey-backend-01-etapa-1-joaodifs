// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para interpretar dados POST (formulários)
app.use(express.urlencoded({ extended: true }));

// Rota principal: index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rota /sugestao via query string
app.get('/sugestao', (req, res) => {
  const { nome, ingredientes } = req.query;

  const html = `
    <html>
      <head><title>Agradecimento</title></head>
      <body>
        <h1>Obrigado pela sugestão, ${nome || 'Cliente'}!</h1>
        <p>Seu lanche com os seguintes ingredientes foi sugerido:</p>
        <p>${ingredientes || 'Não informado'}</p>
        <a href="/">Voltar para o início</a>
      </body>
    </html>
  `;
  res.status(200).send(html);
});

// Rota GET para exibir o formulário de contato
app.get('/contato', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contato.html'));
});

// Rota POST que recebe os dados do formulário e redireciona (PRG)
app.post('/contato', (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;

  // Armazena os dados temporariamente na URL como query string
  const query = new URLSearchParams({ nome, email, assunto, mensagem }).toString();
  res.redirect(`/contato-recebido?${query}`);
});

// Rota GET que exibe os dados enviados (padrão PRG)
app.get('/contato-recebido', (req, res) => {
  const { nome, email, assunto, mensagem } = req.query;

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Contato Recebido</title>
    </head>
    <body>
      <h1>Obrigado pela mensagem, ${nome || 'Cliente'}!</h1>
      <p><strong>Email:</strong> ${email || '-'}</p>
      <p><strong>Assunto:</strong> ${assunto || '-'}</p>
      <p><strong>Mensagem:</strong><br>${mensagem || '-'}</p>
      <a href="/">Voltar para a página inicial</a>
    </body>
    </html>
  `;

  res.status(200).type('html').send(html);
});

// Rota da API: retorna dados do JSON
app.get('/api/lanches', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'data', 'lanches.json');
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao ler o arquivo de lanches' });
    }
    res.status(200).json(JSON.parse(data));
  });
});

// 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor da DevBurger rodando em http://localhost:${PORT}`);
});
