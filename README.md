# Dükkan Cepte - API Testing Platform

This is a [Next.js](https://nextjs.org) project that provides a comprehensive testing interface for the Dükkan Cepte API integration platform, supporting Getir, Trendyol, and DeliveryHero platforms.

## 🚀 Getting Started

### Prerequisites

1. **FastAPI Backend**: Ensure the FastAPI server is running
2. **Supabase Database**: Set up with required tables
3. **Environment Variables**: Configure your `.env.local` file

### Quick Start

1. **Start the FastAPI Backend**:
   ```bash
   cd fastapi-api
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## 📱 Available Testing Pages

### Getir Platform
- **Login**: `/getir/login` - Test authentication with app and restaurant secret keys
- **Restaurant Info**: `/getir/restaurant-info` - Fetch restaurant details using token
- **Open Restaurant**: `/getir/status-open` - Open restaurant status
- **Close Restaurant**: `/getir/status-close` - Close restaurant
- **Working Hours**: `/getir/working-hours` - Get and update working hours
- **Menu Information**: `/getir/menu` - Fetch and view restaurant menu (NEW)

### Trendyol Platform
- **Restaurant Info**: `/trendyol/restaurant-info` - Get store information with Basic Auth
- **Status Management**: `/trendyol/status` - Update store open/close status
- **Working Hours**: `/trendyol/working-hours` - Manage store working hours
- **Menu Information**: `/trendyol/menu` - Fetch and view store menu (NEW)
- **Delivery Areas**: `/trendyol/delivery-areas` - Fetch and view store delivery areas (NEW)

### DeliveryHero Platform
- **Login**: `/deliveryhero/login` - Authenticate with username/password (form-encoded, returns a short-lived token)
- **Availability**: `/deliveryhero/availability` - Get and update availability status (requires valid, non-expired token)

## 🔧 Features

- **Interactive Testing**: Real-time API testing with immediate feedback
- **Error Handling**: Comprehensive error display and validation. Expired tokens will result in a 401 error; log in again to refresh your token.
- **Token Management**: Copy tokens to clipboard for easy testing. Tokens for Getir and DeliveryHero expire after a set period; you must re-authenticate to obtain a new token.
- **Form Validation**: Client-side validation for all inputs
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Consistent Navigation**: All test pages now feature a home icon in the top-left for easy return to the main page (NEW)

## 📊 API Documentation

- **Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs) - Swagger UI
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc) - Clean documentation
- **OpenAPI Spec**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python, Pydantic
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Header-based tokens (Getir, Trendyol), Bearer tokens (DeliveryHero, short-lived), Basic Auth
- **Validation**: Pydantic models with comprehensive type checking

## 📁 Project Structure

```
API_Playground/
├── src/
│   └── app/
│       ├── getir/           # Getir platform testing
│       │   └── menu/        # Getir menu testing (NEW)
│       ├── trendyol/        # Trendyol platform testing
│       │   ├── menu/        # Trendyol menu testing (NEW)
│       │   └── delivery-areas/ # Trendyol delivery areas testing (NEW)
│       ├── deliveryhero/    # DeliveryHero platform testing
│       ├── globals.css      # Global styles
│       ├── layout.tsx       # Root layout
│       └── page.tsx         # Home page
├── public/                  # Static assets
├── package.json
└── README.md
```

## 🧪 Testing Workflow

1. **Start Backend**: Ensure FastAPI server is running
2. **Navigate to Platform**: Choose Getir, Trendyol, or DeliveryHero
3. **Test Authentication**: Use login pages to get tokens (note: tokens expire; re-login as needed)
4. **Test Endpoints**: Use the various testing pages
5. **Check Responses**: View real-time API responses
6. **Debug Issues**: Use browser console for detailed error information

## 🚀 Deployment

This is a testing platform. For production deployment:

1. Configure production environment variables
2. Set up proper CORS settings
3. Use production database connections
4. Implement proper security measures
5. Set up monitoring and logging

## 📝 Notes

- All API calls are made to `http://localhost:8000`
- Authentication tokens are stored in browser memory only
- Tokens for Getir and DeliveryHero expire after a set period; re-authenticate as needed
- No sensitive data is persisted in the frontend
- All validation is handled by the backend
- Error messages are displayed in real-time
- All test pages now feature a home icon for consistent navigation (NEW)

## 🤝 Contributing

1. Test new features using the provided pages
2. Report issues with detailed error information
3. Follow the existing code structure and patterns
4. Ensure all changes work across all platforms

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)
