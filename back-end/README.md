# Store Backend API

Backend API สำหรับระบบร้านค้า (Store/Market) ที่ใช้ Express + TypeScript + Prisma (PostgreSQL) พร้อมโครงสร้าง Clean Architecture

## โครงสร้างโปรเจกต์

```
src/
├── domain/              # Domain Layer (Business Logic)
│   ├── entities/        # Domain entities
│   └── repositories/    # Repository interfaces
├── application/         # Application Layer (Use Cases)
│   └── use-cases/       # Business use cases
├── infrastructure/      # Infrastructure Layer (External Services)
│   ├── database/        # Database setup (Prisma)
│   └── repositories/    # Repository implementations
└── presentation/        # Presentation Layer (API)
    ├── controllers/     # Request handlers
    ├── routes/          # Route definitions
    └── middleware/      # Express middleware
```

## การติดตั้ง

1. ติดตั้ง dependencies:
```bash
npm install
```

2. ตั้งค่า environment variables:
```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env` และตั้งค่า `DATABASE_URL` ให้เชื่อมต่อกับ PostgreSQL database ของคุณ

3. สร้าง Prisma client:
```bash
npm run prisma:generate
```

4. รัน database migrations:
```bash
npm run prisma:migrate
```

## การใช้งาน

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - ตรวจสอบสถานะ API

### Products
- `GET /api/products` - ดึงรายการสินค้าทั้งหมด
- `GET /api/products/:id` - ดึงข้อมูลสินค้าตาม ID
- `POST /api/products` - สร้างสินค้าใหม่

## Prisma Commands

- `npm run prisma:generate` - สร้าง Prisma Client
- `npm run prisma:migrate` - รัน database migrations
- `npm run prisma:studio` - เปิด Prisma Studio (Database GUI)
- `npm run prisma:seed` - รัน seed data (ถ้ามี)

## Clean Architecture

โปรเจกต์นี้ใช้ Clean Architecture ซึ่งแยก concerns ออกเป็น 4 layers:

1. **Domain Layer**: ประกอบด้วย entities และ repository interfaces (ไม่มี dependencies กับ external libraries)
2. **Application Layer**: ประกอบด้วย use cases ที่ใช้ business logic
3. **Infrastructure Layer**: ประกอบด้วย implementations ของ repositories และ external services
4. **Presentation Layer**: ประกอบด้วย controllers, routes, และ middleware สำหรับ API
