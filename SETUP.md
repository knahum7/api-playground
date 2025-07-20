# DUKKAN CEPTE V1 - Setup Guide

## 🚀 Getting Started

This is your production DeliveryHero integration project. It's separate from your API_Playground for testing.

## 📋 Prerequisites

1. **Supabase Project**: You'll need a Supabase project with the `deliveryhero_restaurants` table
2. **Environment Variables**: Set up your `.env.local` file

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# DeliveryHero Configuration (if needed)
DELIVERYHERO_API_BASE_URL=https://api.deliveryhero.com
```

## 🗄️ Database Schema

Your Supabase `deliveryhero_restaurants` table should have these columns:

```sql
CREATE TABLE deliveryhero_restaurants (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  access_token TEXT NOT NULL,
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

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (see above)

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:3000`

## 📡 API Endpoints

### DeliveryHero Integration

- **Login**: `POST /api/deliveryhero/v2/login`
- **Availability Status**: `GET /api/deliveryhero/v2/chains/{chainCode}/remoteVendors/{posVendorId}/availability`
- **Update Availability**: `PUT /api/deliveryhero/v2/chains/{chainCode}/remoteVendors/{posVendorId}/availability`

## 🔗 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── deliveryhero/
│   │       └── v2/
│   │           ├── login/
│   │           │   └── route.ts
│   │           └── chains/
│   │               └── [chainCode]/
│   │                   └── remoteVendors/
│   │                       └── [posVendorId]/
│   │                           └── availability/
│   │                               └── route.ts
│   ├── lib/
│   │   └── supabase/
│   │       └── client.ts
│   └── page.tsx
```

## 🧪 Testing

You can test the API endpoints using:
- **Postman**
- **cURL**
- **Your API_Playground** (running on a different port)

## 📝 Notes

- This project is separate from your API_Playground
- You can run both projects simultaneously on different ports
- The API_Playground can be used to test and develop new features
- This project is for production use with real data 