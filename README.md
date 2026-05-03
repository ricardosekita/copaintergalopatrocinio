# Copa Intergalo Sub 16 — Convite Clubes

Apresentação institucional da Copa Intergalo Sub 16 (edição 2026), em formato de slide deck HTML.

## 🌐 Publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex: `copa-intergalo-convite`).
2. Faça upload de **todos os arquivos desta pasta** (incluindo a subpasta `assets/` e o arquivo oculto `.nojekyll`) na raiz do repositório.
3. No repositório, vá em **Settings → Pages**.
4. Em **Source**, selecione a branch `main` (ou `master`) e a pasta `/ (root)`.
5. Salve. Em alguns minutos a apresentação estará disponível em:
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

## 📂 Estrutura

```
.
├── index.html            ← apresentação principal
├── styles.css            ← estilos do deck
├── deck-stage.js         ← componente de palco/navegação dos slides
├── tweaks-panel.jsx      ← painel de ajustes (React/JSX)
├── tweaks-app.jsx        ← lógica dos tweaks (React/JSX)
├── assets/
│   ├── inter-sg.png      ← logo Inter SG
│   └── cam.png           ← logo CAM
├── .nojekyll             ← desabilita Jekyll (necessário no GH Pages)
└── README.md
```

## ⌨️ Navegação

- **→ / Espaço** — próximo slide
- **←** — slide anterior
- **F** — tela cheia
- A interface também responde a toque/clique nas laterais.

## 🛠️ Rodando localmente

Abra `index.html` direto no navegador. Para desenvolvimento sem problemas de CORS, sirva via servidor local:

```bash
# Python 3
python -m http.server 8000

# ou Node
npx serve .
```

Depois acesse `http://localhost:8000`.
