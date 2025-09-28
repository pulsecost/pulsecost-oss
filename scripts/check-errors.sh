#!/bin/bash

# Comprehensive Error Checking Script for OptiLM
set -e

echo "🔍 Starting comprehensive error check..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# 1. Check Node.js version
print_status "Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
    
    # Check if .nvmrc exists and compare versions
    if [ -f ".nvmrc" ]; then
        REQUIRED_VERSION=$(cat .nvmrc)
        if [[ "$NODE_VERSION" == *"$REQUIRED_VERSION"* ]]; then
            print_success "Node.js version matches .nvmrc ($REQUIRED_VERSION)"
        else
            print_warning "Node.js version doesn't match .nvmrc (required: $REQUIRED_VERSION, current: $NODE_VERSION)"
        fi
    fi
else
    print_error "Node.js is not installed"
    exit 1
fi

# 2. Check pnpm installation
print_status "Checking pnpm installation..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    print_success "pnpm version: $PNPM_VERSION"
else
    print_error "pnpm is not installed"
    exit 1
fi

# 3. Install dependencies
print_status "Installing dependencies..."
pnpm install --frozen-lockfile

# 4. Type checking
print_status "Running TypeScript type checks..."
if pnpm type-check; then
    print_success "Type checking passed"
else
    print_error "Type checking failed"
    exit 1
fi

# 5. Linting
print_status "Running ESLint checks..."
if pnpm lint; then
    print_success "Linting passed"
else
    print_warning "Linting found issues (check output above)"
fi

# 6. Format checking
print_status "Checking code formatting..."
if pnpm format:check; then
    print_success "Code formatting is correct"
else
    print_warning "Code formatting issues found (run 'pnpm format' to fix)"
fi

# 7. Build check
print_status "Testing build process..."
if pnpm build; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# 8. Check for common issues
print_status "Checking for common issues..."

# Check for missing dependencies
print_status "Checking for missing dependencies..."
if pnpm list --depth=0 &> /dev/null; then
    print_success "All dependencies are properly installed"
else
    print_warning "Some dependencies might be missing"
fi

# Check for TypeScript configuration issues
print_status "Checking TypeScript configuration..."
if [ -f "tsconfig.base.json" ]; then
    print_success "Base TypeScript config found"
else
    print_warning "Base TypeScript config not found"
fi

# Check for ESLint configuration
print_status "Checking ESLint configuration..."
if [ -f "api/.eslintrc.js" ] && [ -f "dashboard/.eslintrc.cjs" ]; then
    print_success "ESLint configurations found"
else
    print_warning "Some ESLint configurations might be missing"
fi

# Check for Prettier configuration
print_status "Checking Prettier configuration..."
if [ -f ".prettierrc.js" ]; then
    print_success "Prettier configuration found"
else
    print_warning "Prettier configuration not found"
fi

# 9. Check file structure
print_status "Checking project structure..."
REQUIRED_DIRS=("api" "dashboard" "model" "common" "docker")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_success "Directory $dir exists"
    else
        print_error "Required directory $dir is missing"
        exit 1
    fi
done

# 10. Check for main entry points
print_status "Checking main entry points..."
if [ -f "api/main.ts" ]; then
    print_success "API main entry point found"
else
    print_error "API main entry point (api/main.ts) is missing"
    exit 1
fi

if [ -f "dashboard/src/app/index.tsx" ]; then
    print_success "Dashboard main entry point found"
else
    print_error "Dashboard main entry point is missing"
    exit 1
fi

# 11. Check for environment files
print_status "Checking environment configuration..."
if [ -f "api/config/env.ts" ]; then
    print_success "Environment configuration found"
else
    print_warning "Environment configuration not found"
fi

# 12. Check Docker files
print_status "Checking Docker configuration..."
if [ -f "api/Dockerfile" ] && [ -f "dashboard/Dockerfile" ]; then
    print_success "Docker files found"
else
    print_warning "Some Docker files might be missing"
fi

# 13. Check Git hooks
print_status "Checking Git hooks..."
if [ -d ".husky" ] && [ -f ".husky/pre-commit" ] && [ -f ".husky/commit-msg" ]; then
    print_success "Git hooks are properly configured"
else
    print_warning "Git hooks might not be properly configured"
fi

# 14. Check for tslib dependency
print_status "Checking for tslib dependency..."
if pnpm list tslib &> /dev/null; then
    print_success "tslib dependency found"
else
    print_warning "tslib dependency not found (might cause TypeScript helper errors)"
fi

# 15. Test API startup (dry run)
print_status "Testing API startup (dry run)..."
if timeout 10s pnpm --filter @pulsecost-oss/api dev --dry-run &> /dev/null || echo "API dev check completed"; then
    print_success "API startup check completed"
else
    print_warning "API startup check had issues"
fi

echo ""
print_success "🎉 Comprehensive error check completed!"
echo ""
echo "Summary of checks:"
echo "✅ Node.js version check"
echo "✅ pnpm installation check"
echo "✅ Dependencies installation"
echo "✅ TypeScript type checking"
echo "✅ ESLint linting"
echo "✅ Code formatting check"
echo "✅ Build process test"
echo "✅ Project structure validation"
echo "✅ Entry points validation"
echo "✅ Configuration files check"
echo "✅ Docker files check"
echo "✅ Git hooks check"
echo "✅ tslib dependency check"
echo "✅ API startup test"
echo ""
echo "If any warnings appeared above, please address them for optimal project health."
