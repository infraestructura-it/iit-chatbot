# IIT Chatbot — InfraestructuraIT

Chatbot por temas con Claude AI. Interfaz React + Vite desplegada en GitHub Pages.

## Stack

- React 18 + Vite 5
- Claude API (Anthropic) — modelo `claude-sonnet-4-20250514`
- GitHub Actions para deploy automático
- Sin backend — llamada directa o vía relay propio

---

## Instalación local

```bash
# 1. Clona el repo
git clone https://github.com/infraestructura-it/iit-chatbot.git
cd iit-chatbot

# 2. Instala dependencias
npm install

# 3. Crea tu .env
cp .env.example .env
# Edita .env y agrega tu VITE_ANTHROPIC_API_KEY

# 4. Corre en desarrollo
npm run dev
```

Abre http://localhost:5173/iit-chatbot/

---

## Deploy en GitHub Pages

### Paso 1 — Crear el repo en GitHub

Ve a https://github.com/infraestructura-it → New repository  
Nombre: `iit-chatbot`  
Visibilidad: Public (GitHub Pages gratis requiere repo público)

### Paso 2 — Subir el código

```bash
git init
git add .
git commit -m "feat: IIT chatbot inicial"
git branch -M main
git remote add origin https://github.com/infraestructura-it/iit-chatbot.git
git push -u origin main
```

### Paso 3 — Agregar el API key como Secret

GitHub → Settings → Secrets and variables → Actions → New repository secret

- Name: `VITE_ANTHROPIC_API_KEY`
- Value: `sk-ant-api03-...` (tu key real)

### Paso 4 — Activar GitHub Pages

GitHub → Settings → Pages  
Source: **GitHub Actions**

### Paso 5 — Deploy automático

Cada `git push` a `main` dispara el workflow y actualiza la página.  
URL final: `https://infraestructura-it.github.io/iit-chatbot/`

---

## Usar tu relay propio (recomendado para producción)

Si tienes `relay.js` corriendo con PM2, edita `src/api.js`:

1. Comenta el bloque OPCIÓN A
2. Descomenta el bloque OPCIÓN B
3. Ajusta `RELAY_URL` y el token Bearer

Ventaja: la API key nunca sale del servidor.

---

## Cambiar el nombre del repo

Si el repo se llama diferente a `iit-chatbot`, edita `vite.config.js`:

```js
base: "/nombre-de-tu-repo/",
```

---

## Agregar o editar temas

Edita `src/topics.js` — cada objeto tiene:

```js
{
  id: 1,
  icon: "⚡",
  cat: "Categoría",
  title: "Título del tema",
  color: "#00d4ff",        // cyan, green o purple de BRAND
  desc: "Descripción corta",
  system: "Instrucción específica para Claude sobre este tema",
}
```

---

## Estructura del proyecto

```
iit-chatbot/
├── src/
│   ├── main.jsx       # Entry point React
│   ├── App.jsx        # HomeView + ChatView
│   ├── api.js         # Llamadas a Anthropic / relay
│   ├── config.js      # API key, colores, modelo
│   └── topics.js      # Los 20 temas con sus prompts
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Actions
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

InfraestructuraIT © 2026 · Bogotá, Colombia
