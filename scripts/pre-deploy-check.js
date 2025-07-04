#!/usr/bin/env node

/**
 * Pre-deployment check script
 * Runs all quality checks before deploying
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running pre-deployment checks...\n');

const checks = [
  {
    name: 'Environment Variables',
    command: () => {
      const envFile = path.join(process.cwd(), '.env.local');
      if (!fs.existsSync(envFile)) {
        throw new Error('.env.local file not found');
      }
      const envContent = fs.readFileSync(envFile, 'utf8');
      const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY'
      ];
      
      for (const varName of requiredVars) {
        if (!envContent.includes(varName)) {
          throw new Error(`Missing environment variable: ${varName}`);
        }
      }
      console.log('✅ Environment variables check passed');
    }
  },
  {
    name: 'Dependencies',
    command: () => {
      execSync('npm ci', { stdio: 'pipe' });
      console.log('✅ Dependencies installed successfully');
    }
  },
  {
    name: 'TypeScript Check',
    command: () => {
      execSync('npm run type-check', { stdio: 'pipe' });
      console.log('✅ TypeScript check passed');
    }
  },
  {
    name: 'ESLint',
    command: () => {
      execSync('npm run lint', { stdio: 'pipe' });
      console.log('✅ ESLint check passed');
    }
  },
  {
    name: 'Build',
    command: () => {
      execSync('npm run build', { stdio: 'pipe' });
      console.log('✅ Build successful');
    }
  }
];

async function runChecks() {
  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      console.log(`🔍 Running ${check.name}...`);
      await check.command();
      passed++;
    } catch (error) {
      console.error(`❌ ${check.name} failed:`);
      console.error(error.message);
      failed++;
    }
    console.log('');
  }

  console.log('📊 Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n🚨 Some checks failed. Please fix the issues before deploying.');
    process.exit(1);
  } else {
    console.log('\n🎉 All checks passed! Ready to deploy.');
    process.exit(0);
  }
}

runChecks().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
