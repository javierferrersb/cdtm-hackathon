# ConsultIQ Dashboard

An intelligent meeting preparation platform for consultants that automatically analyzes upcoming calendar events, researches meeting attendees and companies, and provides AI-powered insights to make consultations more effective.

## 🚀 Features

- **Google OAuth Authentication**: Secure sign-in with Google accounts
- **Calendar Integration**: Automatic sync with Google Calendar for upcoming meetings (next 2 days)
- **Person Intelligence**: AI-powered research on meeting attendees including job titles, background, and recent activities
- **Company Research**: Comprehensive company analysis with industry insights, recent news, and key information
- **Meeting Preparation**: Automated generation of meeting summaries and actionable preparation tips
- **Intelligent Caching**: MongoDB-based API response caching to prevent redundant calls and optimize performance
- **Unicode Support**: Full support for international names with accented characters (José, María, François, etc.)
- **Material Design 3**: Professional, business-focused UI with blue color scheme
- **Debug Tools**: Built-in debug endpoints and cache management

## Technology Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** for data persistence and caching
- **Google OAuth 2.0** for authentication
- **Google Calendar API** for event retrieval
- **OpenAI GPT-4o mini** for AI analysis and insights
- **Tavily API** for web search and company research
- **Passport.js** for authentication middleware

### Frontend

- **React 18** with modern hooks
- **Material-UI 3** for professional design
- **React Router** for navigation
- **Axios** for API communication
- **Vite** for development and building

## Project Structure

```text
cdtm-hackathon/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── passport.js          # Google OAuth configuration
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Report.js            # Report caching schema
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication routes
│   │   │   ├── calendar.js          # Calendar API routes
│   │   │   └── reports.js           # Report generation routes
│   │   ├── services/
│   │   │   └── reportService.js     # AI analysis and report generation
│   │   └── server.js                # Express server setup
│   ├── .env.example                 # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Navigation component
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   └── EventDetails.jsx     # Meeting intelligence report
│   │   ├── services/
│   │   │   ├── api.js               # API client configuration
│   │   │   └── auth.jsx             # Authentication context
│   │   ├── theme.js                 # Material-UI theme configuration
│   │   ├── App.jsx                  # Main application component
│   │   └── main.jsx                 # Application entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Google Cloud Console account for OAuth and Calendar API
- OpenAI API account
- Tavily API account

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd cdtm-hackathon
npm run install:all
```

### 2. Environment Configuration

Copy the environment template and fill in your API keys:

```bash
cd backend
cp .env.example .env
```

Update `.env` with your credentials:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
SESSION_SECRET=your-super-secure-session-secret-key

# Frontend URL
FRONTEND_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/consultant-dashboard

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Tavily API Configuration
TAVILY_API_KEY=your-tavily-api-key
```

### 3. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3001/auth/google/callback`
6. Add your client ID and secret to the `.env` file

### 4. API Key Setup

#### OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env` file

#### Tavily API Key

1. Visit [Tavily](https://tavily.com/)
2. Sign up and get your API key
3. Add it to your `.env` file

### 5. Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend  # Backend on http://localhost:3001
npm run dev:frontend # Frontend on http://localhost:5173
```

## Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Dashboard**: View your upcoming meetings for the next 2 days
3. **Generate Reports**: Click on any meeting to generate an intelligence report
4. **Meeting Intelligence**: Review person and company insights, plus preparation tips

## Meeting Description Format

For the system to extract person and company information, format your calendar event descriptions like:

```text
John Smith - Acme Corporation
```

The system uses this pattern to identify who you're meeting with and which company they represent.

## Features in Detail

### Person Intelligence

- Job title and role identification
- Professional background analysis
- Recent news and activities
- LinkedIn profile discovery (when available)

### Company Intelligence

- Industry classification
- Company description and overview
- Recent company news and developments
- Website and key information

### Meeting Preparation

- AI-generated meeting summary
- Personalized preparation tips
- Context-aware recommendations
- Strategic talking points

## Caching Strategy

The application implements intelligent caching to:

- Store generated reports in MongoDB
- Prevent redundant API calls
- Optimize performance and reduce costs
- Enable offline report viewing

## Development

### Backend Development

```bash
cd backend
npm run dev
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Building for Production

```bash
npm run build
```

## API Endpoints

### Authentication

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - Logout user
- `GET /auth/user` - Get current user

### Calendar

- `GET /api/calendar/events` - Get upcoming events

### Reports

- `GET /api/reports/event/:eventId` - Get or generate event report
- `GET /api/reports` - Get all user reports
- `DELETE /api/reports/:reportId` - Delete a report
- `DELETE /api/reports/cache/clear` - Clear all cached reports (debug endpoint)

## 🔧 Recent Updates & Fixes

### Version 1.1.0 - Latest Improvements

- **✅ Unicode Support**: Fixed pattern matching for international names with accented characters (José, María, François, etc.)
- **✅ JSON Parsing**: Resolved OpenAI response parsing issues with markdown code blocks in API responses  
- **✅ Authentication Flow**: Fixed infinite redirect loops in login/logout process
- **✅ Cache Management**: Added debug endpoints for clearing cached reports during testing
- **✅ Environment Variables**: Fixed loading order to ensure proper configuration
- **✅ Error Handling**: Enhanced error logging and debugging throughout the application
- **✅ Documentation**: Added comprehensive .gitignore and updated README with latest features

### Debug Features

- **Cache Clearing**: Use `DELETE /api/reports/cache/clear` to clear all cached reports
- **Debug Logs**: Comprehensive logging in calendar and report services
- **Testing Mode**: Environment-aware configuration for development vs production

### Troubleshooting

- **Meeting Detection**: Ensure calendar events follow format "Name - Company" for proper extraction
- **API Responses**: OpenAI responses are automatically sanitized to remove markdown formatting
- **Authentication**: Login redirects are handled with proper navigation to prevent loops
- **Database**: MongoDB connection and caching work seamlessly with indexing optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please create an issue in the repository or contact the development team.
