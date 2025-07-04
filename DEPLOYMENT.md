# 🚀 Hướng dẫn Auto Deploy lên Vercel

## 📋 Tổng quan
Dự án đã được thiết lập để tự động deploy lên Vercel mỗi khi commit. Có 2 phương án:

## 🎯 Phương án 1: Vercel Git Integration (KHUYẾN NGHỊ)

### Bước 1: Kết nối Repository với Vercel
1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub account
3. Click "New Project"
4. Import repository `pdf-reader`
5. Vercel tự động detect Next.js và thiết lập

### Bước 2: Thiết lập Environment Variables
Trong Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Production & Preview & Development
NEXT_PUBLIC_SUPABASE_URL=https://tosexyqkjcmpnrnzchfu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2V4eXFramNtcG5ybnpjaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1OTIyOTEsImV4cCI6MjA2NzE2ODI5MX0.z2etzbgwsjlMWOL2NB9lT2f6pwA5zcuUdF0xvlsz_VY
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Bước 3: Build Settings (Tự động detect)
- **Framework Preset**: Next.js
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### ✅ Hoàn thành!
Từ giờ mỗi khi push code:
- **Main branch** → Production deployment
- **Pull Request** → Preview deployment
- **Other branches** → Preview deployment

---

## 🔧 Phương án 2: GitHub Actions (Advanced)

Nếu muốn control nhiều hơn, đã có sẵn GitHub Actions workflow.

### Thiết lập GitHub Secrets
Trong GitHub Repository → Settings → Secrets and variables → Actions:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id  
VERCEL_PROJECT_ID=your_project_id
```

### Lấy Vercel Token:
1. Truy cập [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Tạo token mới
3. Copy và paste vào GitHub Secrets

### Lấy Org ID và Project ID:
```bash
npx vercel link
cat .vercel/project.json
```

---

## 📝 Scripts có sẵn

```bash
# Development
npm run dev              # Start dev server với Turbopack

# Build & Deploy
npm run build           # Build production
npm run vercel-build    # Build với linting và type checking
npm run deploy          # Deploy to production
npm run deploy-preview  # Deploy preview

# Quality checks
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run type-check      # TypeScript type checking
npm run clean           # Clean build artifacts
```

---

## 🔍 Monitoring & Debugging

### Vercel Dashboard
- **Deployments**: Xem history và logs
- **Functions**: Monitor API routes
- **Analytics**: Traffic và performance
- **Domains**: Custom domain setup

### Build Logs
Nếu build fail, check:
1. Vercel Dashboard → Deployments → View Function Logs
2. GitHub Actions → Workflow runs (nếu dùng phương án 2)

### Common Issues
1. **Environment Variables**: Đảm bảo đã set đúng trên Vercel
2. **Build Errors**: Check TypeScript và ESLint errors
3. **Dependencies**: Ensure package.json is correct

---

## 🎉 Kết quả

Sau khi setup thành công:
- ✅ Auto deploy on every commit
- ✅ Preview deployments for PRs  
- ✅ Production deployment on main branch
- ✅ Built-in CI/CD pipeline
- ✅ Rollback capabilities
- ✅ Performance monitoring
