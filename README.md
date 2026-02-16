# Taavoni Front

A modern e-commerce frontend application built with Next.js 15, TypeScript, and Material-UI, integrated with the Taavoni API.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 Documentation

### For AI Coding Agents
This project includes AI-optimized documentation in the `/docs` folder:

- **[01_project_context.md](./docs/01_project_context.md)** - Architecture, patterns, and rules
- **[02_type_definitions.md](./docs/02_type_definitions.md)** - Complete TypeScript type definitions
- **[03_api_endpoints.md](./docs/03_api_endpoints.md)** - Full API reference with examples

See [docs/README.md](./docs/README.md) for detailed usage instructions.

### For Developers
- **API Specification**: `docs/tavooni-api.json` (OpenAPI 3.0)
- **Task Management**: `plan-and-tasks/` folder
- **Progress Tracking**: `plan-and-tasks/tavooni-api-integration/progress.md`

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Styling**: Emotion (CSS-in-JS)
- **API**: Taavoni REST API

## 📁 Project Structure

```
src/
├── app/                    # Next.js pages (App Router)
├── components/             # Reusable UI components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── services/              # API service layer
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
└── theme/                 # MUI theme configuration
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.taavoni.online
NEXT_PUBLIC_USE_MOCK=false
```

## ✨ Features

- 🔐 User authentication (login, register, OTP verification)
- 🛍️ Product catalog with search and filtering
- 🛒 Shopping cart (guest and authenticated)
- 📦 Order management and checkout
- 📍 Address management
- 💬 Product reviews and comments
- 🎫 Support ticket system
- 📱 Fully responsive design
- 🎨 Material-UI components
- 🔒 Secure API integration with JWT

## 🚢 Deployment

### Docker
```bash
# Build image
docker build -t taavoni-front .

# Run container
docker run -p 3000:3000 taavoni-front
```

### Production Build
```bash
npm run build
npm start
```

## 📝 Development Guidelines

- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error handling
- Write meaningful commit messages
- Keep components small and focused
- Use the service layer for API calls
- Reference AI-optimized docs in `/docs`

## 🤝 Contributing

1. Read the [project context](./docs/01_project_context.md)
2. Check [type definitions](./docs/02_type_definitions.md)
3. Review [API endpoints](./docs/03_api_endpoints.md)
4. Follow existing code patterns
5. Submit pull requests with clear descriptions

## 📄 License

This project is proprietary software.

## 🔗 Links

- **API Documentation**: `docs/tavooni-api.json`
- **Task Management**: `plan-and-tasks/`
- **GitLab**: https://hamgit.ir/bijankhazaei/taavoni-front
