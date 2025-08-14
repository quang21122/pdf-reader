# PDF Reader - Advanced PDF Viewer with OCR

A modern PDF reader application built with Next.js, featuring OCR capabilities, note-taking, highlighting, and more.

## 🚀 Features

- **PDF Viewing**: Smooth PDF rendering with zoom and navigation controls
- **Advanced Search**: Real-time search in PDF content with text highlighting
- **Translation**: Select text and translate with MyMemory API integration
- **OCR Technology**: Extract text from scanned PDFs using Tesseract.js (8 languages)
- **Smart Navigation**: Page thumbnails, bookmarks, and smooth scrolling
- **Text Annotations**: Add text annotations and highlights with save to PDF
- **Dashboard**: Recent files view with quick access buttons
- **User Authentication**: Secure login with Supabase Auth
- **File Management**: Upload, organize, and manage PDF files
- **Responsive Design**: Works on desktop and mobile devices
- **State Management**: Zustand for efficient state handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Framework**: Material UI + Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **GraphQL**: Apollo Client with GraphQL queries/mutations
- **State Management**: Zustand for global state
- **OCR**: Tesseract.js for text extraction
- **Translation**: MyMemory API for text translation
- **PDF Processing**: PDF.js, react-pdf for rendering
- **File Upload**: Multipart upload with progress tracking

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pdf-reader
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Copy the `.env.local` file and update with your Supabase credentials:

   ```bash
   cp .env.local.example .env.local
   ```

   Update the following variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**

   Create the following tables in your Supabase database:

   ```sql
   -- PDF Files table
   CREATE TABLE pdf_files (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     filename TEXT NOT NULL,
     file_path TEXT NOT NULL,
     file_size BIGINT,
     upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Notes table
   CREATE TABLE notes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     file_id UUID REFERENCES pdf_files(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     page_number INTEGER NOT NULL,
     position_x FLOAT,
     position_y FLOAT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Highlights table
   CREATE TABLE highlights (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     file_id UUID REFERENCES pdf_files(id) ON DELETE CASCADE,
     page_number INTEGER NOT NULL,
     text_content TEXT NOT NULL,
     position_data JSONB,
     color TEXT DEFAULT '#ffeb3b',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- OCR Results table
   CREATE TABLE ocr_results (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     file_id UUID REFERENCES pdf_files(id) ON DELETE CASCADE,
     page_number INTEGER NOT NULL,
     extracted_text TEXT NOT NULL,
     confidence_score FLOAT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Storage Setup**

   Create a storage bucket in Supabase for PDF files:

   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `pdf-files`
   - Set appropriate policies for authenticated users.

## 🚀 Development

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── pdf/              # PDF-related components
│   ├── notes/            # Note-taking components
│   ├── ocr/              # OCR components
│   └── providers/        # Context providers
├── utils/                # Utility functions
│   ├── supabaseClient.ts # Supabase configuration
│   ├── pdfUtils.ts       # PDF processing utilities
│   └── ocrUtils.ts       # OCR utilities
├── graphql/              # GraphQL setup
│   ├── client.ts         # Apollo Client
│   ├── queries.ts        # GraphQL queries
│   └── mutations.ts      # GraphQL mutations
└── middleware.ts         # Next.js middleware
```

## 🔐 Authentication

The app uses Supabase Auth with the following features:

- Email/password authentication
- Protected routes with middleware
- Session management
- User context throughout the app

## 📝 Available Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server

### Quality Checks

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

### Deployment

- `npm run vercel-build` - Build with quality checks
- `npm run deploy` - Deploy to production
- `npm run deploy-preview` - Deploy preview
- `npm run pre-deploy` - Run all pre-deployment checks
- `npm run deploy-safe` - Safe deploy with checks

## 🚀 Auto Deployment

This project is configured for automatic deployment to Vercel:

- **Main branch** → Production deployment
- **Pull requests** → Preview deployments
- **Quality checks** run before every deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## 🔮 Future Enhancements

- [ ] Real-time collaboration
- [ ] Advanced highlighting tools
- [ ] Export notes to PDF/Word
- [ ] Mobile app with React Native
- [ ] AI-powered document analysis
- [ ] Multi-language OCR support
- [ ] Document version control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

---

Built with ❤️ using Next.js, Supabase, and modern web technologies.
