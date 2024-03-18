const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');

const app = express();

// Middleware para permitir o acesso à API apenas durante o horário especificado
app.use((req, res, next) => {
  const date = new Date();
  const hour = date.getHours();
  if (hour < 8 || hour >= 17) {
    res.status(403).send('Fora do horário de funcionamento da API.');
  } else {
    next();
  }
});

app.use(bodyParser.json());

const laboratorios = [
  { nome: 'Laboratório 1', capacidade: 20, descricao: 'Laboratório de Química' },
  { nome: 'Laboratório 2', capacidade: 15, descricao: 'Laboratório de Física' },
  { nome: 'Laboratório 3', capacidade: 25, descricao: 'Laboratório de Biologia' },
  { nome: 'Laboratório 4', capacidade: 30, descricao: 'Laboratório de Informática' },
  { nome: 'Laboratório 5', capacidade: 10, descricao: 'Laboratório de Matemática' },
  { nome: 'Laboratório 6', capacidade: 18, descricao: 'Laboratório de Geografia' }
];

// Rota GET para obter todos os laboratórios
app.get('/laboratorio/todos', (req, res) => {
  res.json(laboratorios);
});

// Servir o arquivo index.html quando a rota /laboratorio/novo for acessada
app.get('/laboratorio/novo', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  app.post('/laboratorio/novo', (req, res) => {
    // Verificar se os dados foram enviados no formato JSON
    if (req.is('json')) {
      const novoLaboratorio = req.body;
      laboratorios.push(novoLaboratorio);
    
      res.status(201).send('Laboratório cadastrado com sucesso.');
    } else {
      res.status(400).send('Os dados devem ser enviados no formato JSON.');
    }
  });
    
  // Rota GET para gerar relatório em PDF
  app.get('/laboratorio/relatorio', (req, res) => {
    const doc = new PDFDocument();
    doc.pipe(res);
  
    doc.fontSize(20).text('Relatório de Laboratórios\n\n');
    laboratorios.forEach((lab, index) => {
      doc.fontSize(14).text(`Laboratório ${index + 1}: ${lab.nome}`);
      doc.fontSize(12).text(`Capacidade: ${lab.capacidade}`);
      doc.fontSize(12).text(`Descrição: ${lab.descricao}\n\n`);
    });
  
    doc.end();
  });

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
