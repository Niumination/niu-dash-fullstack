#!/bin/bash
set -e
echo "⚡ NIU-DASH v3.0 Deployment Script"
echo "=================================="
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'
echo -e "${BLUE}1. Building production...${NC}"
npm run build
echo -e "${BLUE}2. Running Prisma migration...${NC}"
npx prisma migrate deploy
echo -e "${BLUE}3. Seeding database...${NC}"
npm run db:seed
echo -e "${GREEN}✅ Build & Migration complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Push to GitHub"
echo "2. Connect on Vercel + add env vars"
echo ""
echo -e "${GREEN}Ready for deployment!${NC}"
