# Food Waste Management System

A full-stack web application for managing food waste by connecting cafés, charities, and farms to reduce waste and promote sustainability.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Frontend**: React
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Validation**: Zod

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Set Up Database

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NODE_ENV="development"
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

This will create the SQLite database file at `prisma/dev.db` and set up all the necessary tables.

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Routes

### Authentication
- `POST /api/auth/register` - Register a new user/business
- `POST /api/auth/login` - User login
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication handler

### Admin Routes (`/api/admin`)
- `GET /api/admin/stats` - Get admin dashboard statistics
- `GET /api/admin/pickups` - Get all pickup requests
- `POST /api/admin/pickups/[id]/approve` - Approve a pickup request
- `POST /api/admin/pickups/[id]/reject` - Reject a pickup request
- `POST /api/admin/pickups/[id]/collected` - Mark pickup as collected
- `GET /api/admin/pickups/approved` - Get approved pickups
- `GET /api/admin/transportations` - Get all transportation records
- `POST /api/admin/transportations/[id]/complete` - Complete a transportation
- `GET /api/admin/activity` - Get system activity logs
- `GET /api/admin/waste-breakdown` - Get waste breakdown statistics
- `GET /api/admin/actions-breakdown` - Get actions breakdown statistics

### Staff Routes (`/api/staff`)
- `GET /api/staff/waste` - Get waste entries for staff's business
- `POST /api/staff/waste` - Create a new waste entry
- `POST /api/staff/waste/[id]/drop` - Mark waste as dropped
- `GET /api/staff/stats` - Get staff dashboard statistics
- `GET /api/staff/waste-breakdown` - Get waste breakdown for staff's business
- `GET /api/staff/actions-breakdown` - Get actions breakdown for staff's business
- `GET /api/staff/drop-alerts` - Get drop alerts

### Charity Routes (`/api/charity`)
- `GET /api/charity/requests` - Get charity's pickup requests
- `POST /api/charity/requests` - Create a new pickup request
- `POST /api/charity/requests/[id]/collected` - Mark request as collected

### Farmer Routes (`/api/farmer`)
- `GET /api/farmer/requests` - Get farmer's pickup requests
- `POST /api/farmer/requests` - Create a new pickup request
- `POST /api/farmer/requests/[id]/collected` - Mark request as collected

### Marketplace Routes (`/api/marketplace`)
- `GET /api/marketplace/waste` - Get available waste for pickup

### Waste Management (`/api/waste`)
- `GET /api/waste` - Get all waste entries (with filters)
- `POST /api/waste` - Create a new waste entry
- `GET /api/waste/[id]` - Get a specific waste entry
- `PATCH /api/waste/[id]` - Update a waste entry
- `DELETE /api/waste/[id]` - Delete a waste entry

### Transportation (`/api/transportation`)
- `GET /api/transportation` - Get all transportation records
- `POST /api/transportation` - Create a transportation record
- `GET /api/transportation/[id]` - Get a specific transportation record
- `PATCH /api/transportation/[id]` - Update transportation record

### Collections (`/api/collections`)
- `GET /api/collections` - Get all pickup requests

### Reports (`/api/reports`)
- `GET /api/reports` - Get reports and statistics

### Points (`/api/points`)
- `GET /api/points` - Get user points and history

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Get user notifications

### User Management (`/api/user`)
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile
- `PATCH /api/user/password` - Change user password

### Statistics (`/api/stats`)
- `GET /api/stats/impact` - Get impact statistics

## User Roles

### Admin
- Full system access and oversight
- Approve or reject pickup requests from charities and farmers
- Manage transportation records
- View system-wide statistics and analytics
- Monitor all waste entries and business activities

### Café Staff
- Log daily waste entries (food waste, coffee grounds, organic materials)
- View waste statistics and breakdowns for their business
- Track sustainability points earned
- Manage waste entries (update, delete)
- Mark waste as dropped when no longer available

### Charity
- Browse available waste suitable for donation
- Create pickup requests for edible food waste
- Track pickup request status
- Mark pickups as collected when received
- View donation history and impact

### Farmer
- Browse available organic waste and coffee grounds
- Create pickup requests for composting materials
- Track pickup request status
- Mark pickups as collected when received
- View collection history and impact

## Database Models

- **User**: System users with roles (ADMIN, STAFF, PARTNER)
- **Business**: Registered businesses (cafés, restaurants, NGOs, farms)
- **WasteEntry**: Logged waste entries with type, quantity, action, and status
- **PickupRequest**: Requests from NGOs/farms for waste pickup
- **Transportation**: Waste transportation records and logistics
- **PointsHistory**: User points tracking for sustainability rewards


