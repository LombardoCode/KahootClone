# Kahoot Clone - Educational Project

> **WARNING:** This is an educational project created solely for learning purposes and portfolio demonstration. It is **NOT** affiliated with, endorsed by, or connected to Kahoot! ASA. "Kahoot!" is a registered trademark of Kahoot! ASA. This project is not intended for commercial use.

## Table of Contents

- [About This Project](#about-this-project)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [DevOps](#devops)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Legal & Compliance](#legal--compliance)
  - [Educational Purpose](#educational-purpose)
  - [Important Documents](#important-documents)
  - [Trademark Notice](#trademark-notice)
  - [Data Privacy](#data-privacy)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

## About This Project

This is a full-stack web application that replicates the core functionality of Kahoot!, built as a learning exercise to demonstrate skills in:

- Full-stack web development
- Real-time multiplayer game mechanics
- RESTful API design
- Modern frontend frameworks
- Database design and management
- Authentication and authorization
- DevOps and deployment

## Tech Stack

### Frontend
- **Framework:** Next.js (React)
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Real-time:** SignalR
- **APIs:** Pexels, Unsplash (image search)

### Backend
- **Framework:** ASP.NET Core 8.0 (C#)
- **Database:** MySQL 8.0
- **Authentication:** JWT tokens with HTTP-only cookies
- **Email:** Gmail SMTP via Hangfire background jobs
- **ORM:** Entity Framework Core

### DevOps
- **Containerization:** Docker & Docker Compose
- **Version Control:** Git & GitHub

## Features

- User registration and authentication
- Create custom Kahoot quizzes with questions and answers
- Browse and discover Kahoots created by the community
- Real-time multiplayer game lobbies
- Host and join games using PIN codes
- Live scoreboards and statistics
- Profile management
- Password reset functionality
- Public/private quiz visibility

## Getting Started

### Prerequisites
- Node.js (for client development)
- .NET 8.0 SDK (for API development)
- Docker & Docker Compose (optional, only if using containerized setup)
- MySQL 8.0 (only if running without Docker)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LombardoCode/KahootClone.git
cd KahootClone
```

2. Choose your setup method:

#### **Option A: Using Docker (Recommended)**

Configure environment variables for Docker:
```bash
# Edit these files with your configuration
# DevOps/environment/api.dev.env
# DevOps/environment/client.dev.env
# DevOps/environment/mysql.dev.env
```

Start the application:
```bash
make dev
```

#### **Option B: Running Locally (Without Docker)**

**Step 1:** Install and start MySQL 8.0 locally

**Step 2:** Configure API settings in `API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "MySQLConnString": "server=localhost;user=root;password=yourpassword;database=kahootclone;Allow User Variables=true"
  },
  "Client": {
    "BaseUrl": "http://localhost:3000"
  },
  "Jwt": {
    "Audience": "http://localhost:3000",
    "Issuer": "http://localhost:5000",
    "Key": "YourSuperSecretKeyHere"
  },
  "Email": {
    "SmtpServer": "smtp.gmail.com",
    "Port": 587,
    "FromEmail": "your-email@gmail.com",
    "FromEmailAppPassword": "your-app-password"
  }
}
```

**Step 3:** Configure client environment in `client/.env.local`:
```bash
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_HUBS_URL=http://localhost:5000/hubs
NEXT_PUBLIC_PEXELS_API_KEY=your-pexels-api-key
NEXT_PUBLIC_UNSPLASH_API_KEY=your-unsplash-api-key
JWT_SECRET=YourSuperSecretKeyHere
JWT_AUDIENCE=http://localhost:3000
JWT_ISSUER=http://localhost:3000
```

**Step 4:** Install dependencies and run:
```bash
# Terminal 1: Start the client
cd client
npm install
npm run dev

# Terminal 2: Start the API
cd API
dotnet restore
dotnet ef database update  # Apply migrations
dotnet watch run --no-hot-reload
```

4. Access the application:
- **Client:** http://localhost:3000
- **API:** http://localhost:5000

## Project Structure

```
KahootClone/
├── API/                           # ASP.NET Core backend
│   ├── Controllers/               # API endpoints
│   ├── Models/                    # Data models
│   ├── Services/                  # Business logic
│   ├── Data/                      # Database context and seeding
│   └── Migrations/                # EF Core migrations
│
├── client/                        # Next.js frontend
│   └── src/
│       └── app/
│           ├── (routes)/          # Next.js pages (auth, creator, lobby, etc.)
│           ├── components/        # React components
│           │   ├── UIComponents/  # Reusable UI elements
│           │   └── ...            # Feature-specific components
│           ├── hooks/             # Custom React hooks
│           ├── stores/            # Zustand state management stores
│           ├── interfaces/        # TypeScript type definitions
│           └── utils/             # Utility functions and helpers
│
├── DevOps/                        # Docker and deployment configs
│   └── environment/               # Environment variables
│
├── LICENSE                        # MIT License
├── PRIVACY_POLICY.md              # Privacy policy
├── TERMS_OF_SERVICE.md            # Terms of service
└── README.md                      # This file
```

## Legal & Compliance

### Educational Purpose
This project was created for:
- Learning full-stack web development
- Demonstrating programming skills in a portfolio
- Understanding real-time web application architecture
- **NOT** for commercial use or competing with Kahoot! services

### Important Documents
- **[LICENSE](./LICENSE)** - MIT License (open source)
- **[Privacy Policy](./PRIVACY_POLICY.md)** - How user data is collected and used
- **[Terms of Service](./TERMS_OF_SERVICE.md)** - Usage terms and conditions

### Trademark Notice
"Kahoot!" is a registered trademark of Kahoot! ASA. This project acknowledges and respects Kahoot! ASA's intellectual property rights. This clone is purely educational and demonstrates no intention to infringe on Kahoot! ASA's trademarks or business.

### Data Privacy
If you deploy this application publicly, please review:
- The [Privacy Policy](./PRIVACY_POLICY.md) and update with your contact information
- The [Terms of Service](./TERMS_OF_SERVICE.md) and update with your jurisdiction
- GDPR, CCPA, and other data protection regulations applicable to your region

## Contributing

This is a personal educational project created for learning purposes. While active maintenance is not provided, you are welcome to:
- Fork the project for your own learning and experimentation
- Explore the codebase to understand full-stack development patterns
- Use it as a reference for your own projects
- Modify and adapt it to your needs

## License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### What This Means:
- You can use, modify, and distribute this code
- You can use it for personal or educational purposes
- Attribution is appreciated but not required
- No warranty or liability is provided
- Not for commercial use without understanding the implications

## Contact

- **GitHub:** [@LombardoCode](https://github.com/LombardoCode)
- **Project Repository:** [KahootClone](https://github.com/LombardoCode/KahootClone)

## Acknowledgments

This project was inspired by [Kahoot!](https://kahoot.com/) as a learning exercise. All design and functionality similarities are for educational demonstration purposes only.

Thank you to:
- Kahoot! ASA for creating an inspiring platform
- The open-source community for tools and libraries used in this project
- Everyone who provides feedback and suggestions

---

**Educational Project Notice:**
This is a learning project created for portfolio purposes. Use at your own risk. No warranties or guarantees are provided. See [Terms of Service](./TERMS_OF_SERVICE.md) for full details.
