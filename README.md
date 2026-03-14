# 🚀 NLW Operator

Projeto desenvolvido durante o **NLW Operator**, evento de programação prática da Rocketseat.

## 📚 Trilha escolhida

🔵 **Trilha Iniciante — Aplicação de Cortes Virais com IA**

Aplicação web capaz de gerar **cortes virais automaticamente a partir de vídeos longos**.  
O projeto integra **Cloudinary** e **Gemini** para analisar transcrições e identificar os momentos mais impactantes do vídeo.

A interface permite visualizar o clipe selecionado em tempo real.

👨‍🏫 **Educador:** Mayk Brito

## 🧠 O que o projeto faz

- Analisa vídeos longos
- Usa IA para encontrar momentos virais
- Gera automaticamente cortes do vídeo
- Exibe o clipe selecionado em uma interface web moderna

## 🛠 Tecnologias

- HTML
- CSS
- JavaScript
- Cloudinary
- Gemini AI
- Node.js (para o servidor backend)

## 🚀 Como executar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente no arquivo `.env` (veja `.env.example` se existir)
4. Execute o servidor: `npm run server`
5. Em outro terminal, execute o frontend: `npm run dev`
6. Abra o navegador em `http://localhost:5173` (ou a porta do Vite)

## 🌐 Deploy no Vercel

1. Faça push do código para o GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente no dashboard do Vercel:
   - `GEMINI_API_KEY`: Sua chave da API Gemini
   - `VITE_CLOUDINARY_CLOUD_NAME`: Nome do cloud do Cloudinary
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: Preset de upload do Cloudinary
4. O Vercel detectará automaticamente o `vercel.json` e fará o deploy

## 🔒 Segurança da API

A chave da API do Gemini é mantida segura no lado do servidor/serverless para evitar exposição no cliente.

## 👨‍💻 Autor

Desenvolvido por **Guilherme** durante o NLW Operator da Rocketseat.