# DUKKAN CEPTE V1 - Setup Guide

## 🚀 Getting Started

This is your production API integration project with support for Getir, Trendyol, and DeliveryHero platforms.

## 📋 Prerequisites

1. **Supabase Project**: You'll need a Supabase project with the following tables:
   - `getir_restaurants`
   - `trendyol_restaurants` 
   - `deliveryhero_restaurants`
2. **Environment Variables**: Set up your `.env.local` file
3. **FastAPI Backend**: Ensure the FastAPI server is running

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 🗄️ Database Schema

### Getir Restaurants Table
```sql
CREATE TABLE getir_restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id TEXT NOT NULL,
  restaurant_name TEXT,
  restaurant_secret_key TEXT NOT NULL,
  app_secret_key TEXT NOT NULL,
  token TEXT NOT NULL,
  token_created_at TIMESTAMP,
  averagePreparationTime TEXT DEFAULT '30',
  status TEXT DEFAULT '0',
  isCourierAvailable TEXT DEFAULT 'true',
  isStatusChangedByUser TEXT DEFAULT 'false',
  closedSource TEXT DEFAULT '0',
  restaurantWorkingHours JSONB,
  courierWorkingHours JSONB
);
```

### Trendyol Restaurants Table
```sql
CREATE TABLE trendyol_restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id TEXT NOT NULL,
  restaurant_name TEXT,
  api_key TEXT NOT NULL,
  api_secret TEXT NOT NULL,
  integrator_id TEXT NOT NULL,
  status TEXT DEFAULT '0',
  working_hours JSONB,
  average_preparation_time INTEGER DEFAULT 30
);
```

### DeliveryHero Restaurants Table
```sql
CREATE TABLE deliveryhero_restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  access_token TEXT NOT NULL,
  token_expires_at TIMESTAMP,
  chainCode TEXT NOT NULL,
  posVendorId TEXT NOT NULL,
  platformRestaurantId TEXT NOT NULL,
  platformKey TEXT NOT NULL,
  platformId TEXT,
  platformType TEXT,
  availabilityState TEXT DEFAULT 'OPEN',
  changeable BOOLEAN DEFAULT true,
  closingReason TEXT,
  closingMinutes TEXT DEFAULT '30',
  availabilityStates JSONB,
  closingReasons JSONB
);
```

## 🏃‍♂️ Running the Project

1. **Start the FastAPI Backend**:
   ```bash
   cd fastapi-api
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Install frontend dependencies**:
   ```bash
   cd API_Playground
   npm install
   ```

3. **Set up environment variables** (see above)

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to `http://localhost:3000`

## 📡 API Endpoints

### Getir Integration
- **Login**: `POST /api/getir/auth/login` (returns a token valid for 1 hour)
- **Restaurant Info**: `GET /api/getir/restaurants` (requires valid token)
- **Open Restaurant**: `PUT /api/getir/restaurants/status/open` (requires valid token)
- **Close Restaurant**: `PUT /api/getir/restaurants/status/close` (requires valid token)
- **Working Hours**: `GET /api/getir/restaurants/working-hours` (requires valid token)
- **Update Working Hours**: `PUT /api/getir/restaurants/working-hours` (requires valid token)
- **Menu**: `GET /api/getir/menu` (requires valid token) (NEW)

### Trendyol Integration
- **Get Stores**: `GET /api/trendyol/stores`
- **Update Status**: `PUT /api/trendyol/stores/{store_id}/status`
- **Update Working Hours**: `PUT /api/trendyol/stores/{store_id}/working-hours`
- **Menu**: `GET /api/trendyol/menu` (NEW)
- **Delivery Areas**: `GET /api/trendyol/delivery-areas` (NEW)

### DeliveryHero Integration
- **Login**: `POST /api/deliveryhero/v2/login` (form-encoded, returns a short-lived token)
- **Availability Status**: `GET /api/deliveryhero/v2/chains/{chainCode}/remoteVendors/{posVendorId}/availability` (requires valid, non-expired token)
- **Update Availability**: `PUT /api/deliveryhero/v2/chains/{chainCode}/remoteVendors/{posVendorId}/availability` (requires valid, non-expired token)

## 🔗 Project Structure

```
fastapi-api/
├── app/
│   ├── models/
│   │   ├── getir.py
│   │   ├── trendyol.py
│   │   └── deliveryhero.py
│   ├── routers/
│   │   ├── getir.py
│   │   ├── trendyol.py
│   │   └── deliveryhero.py
│   └── database/
│       └── supabase.py
└── main.py

API_Playground/
├── src/
│   └── app/
│       ├── getir/
│       │   ├── login/
│       │   ├── restaurant-info/
│       │   ├── status-open/
│       │   ├── status-close/
│       │   ├── working-hours/
│       │   └── menu/           # Getir menu testing (NEW)
│       ├── trendyol/
│       │   ├── restaurant-info/
│       │   ├── status/
│       │   ├── working-hours/
│       │   ├── menu/           # Trendyol menu testing (NEW)
│       │   └── delivery-areas/ # Trendyol delivery areas testing (NEW)
│       └── deliveryhero/
│           ├── login/
│           └── availability/
```

## 🧪 Testing

You can test the API endpoints using:
- **Interactive Documentation**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **Frontend Testing Pages**: Navigate through the app, including new menu and delivery areas pages (NEW)
- **Postman/cURL**: Direct API testing

## 📝 Notes

- **Authentication**: Getir and Trendyol use header-based tokens, DeliveryHero uses Bearer tokens (short-lived)
- **Token Expiration**: Tokens for Getir (1 hour) and DeliveryHero (15-60 minutes) expire; a 401 error means you must log in again to get a new token.
- **Data Formats**: Working hours are stored as JSON arrays
- **Validation**: All endpoints include comprehensive input validation
- **Error Handling**: Consistent error responses across all platforms
- **Type Safety**: Pydantic models ensure data integrity
- **Consistent Navigation**: All test pages now feature a home icon in the top-left for easy return to the main page (NEW)

## 🚀 Deployment

For production deployment:
1. Set up proper environment variables
2. Configure CORS settings in FastAPI
3. Use a production WSGI server (Gunicorn)
4. Set up proper database connections
5. Configure logging and monitoring 