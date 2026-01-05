#!/bin/bash
# Shanda Backend Setup Script
# Run this in Git Bash: ./setup-backend.sh

echo "🚀 Setting up Shanda Backend with Prisma..."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Prisma generate failed"
    exit 1
fi

echo "✅ Prisma Client generated"
echo ""

echo "🗄️  Creating database tables..."
npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo "❌ Database migration failed"
    echo "   Make sure DATABASE_URL in .env is correct"
    exit 1
fi

echo "✅ Database tables created"
echo ""

echo "🌱 Seeding database with test data..."
npm run prisma:seed

if [ $? -ne 0 ]; then
    echo "❌ Database seeding failed"
    exit 1
fi

echo "✅ Database seeded"
echo ""

echo "🏗️  Building backend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Backend built successfully"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "🎉 Setup complete! You can now start the backend:"
echo ""
echo "   npm start"
echo ""
echo "API will be available at:"
echo "   http://localhost:4201/shanda"
echo ""
echo "API Documentation:"
echo "   http://localhost:4201/shanda/reference"
echo ""
echo "Test accounts created:"
echo "   Owner:    owner@shanda.com / password123"
echo "   Provider: provider@shanda.com / password123"
echo ""
echo "To view database:"
echo "   npx prisma studio"
echo "═══════════════════════════════════════════════════════════════"
