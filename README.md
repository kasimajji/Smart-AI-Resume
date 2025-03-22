# Smart Resume AI

An open-source, AI-powered resume and cover letter builder that you can self-host to maintain full control of your data.

![Smart Resume AI Screenshot](https://via.placeholder.com/800x400)

## Features

- **Interactive Resume Builder** - Create professional resumes with a user-friendly interface
- **AI-Powered Enhancements** - Generate content suggestions using OpenAI's API
- **Cover Letter Generator** - Create tailored cover letters for specific job applications
- **ATS Compatibility Checker** - Ensure your resume passes through Applicant Tracking Systems
- **Multiple Export Options** - Export as PDF, DOCX, TXT, or JSON
- **Self-Hosted** - Deploy on your own infrastructure to maintain data privacy
- **Open Source** - Free to use, modify, and contribute

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/smart-resume-ai.git
cd smart-resume-ai

# Start the application using Docker
docker-compose up -d
```

The application will be available at http://localhost:3000

### Option 2: Manual Setup

#### Prerequisites

- Node.js 16+
- Python 3.9+
- PostgreSQL

#### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

#### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python app/main.py
```

## Using the App

### Resume Builder

1. Fill in your personal details, work experience, education, skills, and other sections
2. Preview your resume in real-time
3. Use AI suggestions to enhance your content
4. Export your resume in your preferred format

### Cover Letter Builder

1. Provide job details including position, company, and job description
2. Generate a tailored cover letter based on your resume and the job
3. Edit as needed and export

### ATS Checker

1. Upload an existing resume or use your current one
2. Get an ATS compatibility score and recommendations for improvement

## Configuration

### API Key Setup

To use AI features, you'll need an OpenAI API key:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Enter it when prompted in the application

### Custom Templates

Smart Resume AI comes with several built-in templates. To add your own:

1. Create a new template component in `src/components/resume/templates/`
2. Register it in the template selector component

## Development

### Project Structure

```
smart-resume-ai/
├── frontend/              # React frontend application
│   ├── public/            # Static assets
│   └── src/               # Source code
│       ├── components/    # React components
│       ├── hooks/         # Custom React hooks
│       ├── pages/         # Page components
│       ├── store/         # State management
│       ├── services/      # API services
│       └── utils/         # Utility functions
├── backend/               # Python FastAPI backend
│   ├── app/               # Application code
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core functionality
│   │   ├── models/        # Data models
│   │   ├── services/      # Services
│   │   └── utils/         # Utilities
│   └── tests/             # Backend tests
└── docker/                # Docker configuration
```

### Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project was inspired by existing open-source resume builders:

- [Reactive-Resume](https://github.com/AmruthPillai/Reactive-Resume)
- [Open-Resume](https://github.com/xitanggg/open-resume)
- [Resume Builder](https://github.com/sadanandpai/resume-builder)

## Support

For questions, issues, or feature requests, please [open an issue](https://github.com/yourusername/smart-resume-ai/issues) on GitHub.