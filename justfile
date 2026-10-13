# List the commands
default:
    @just --list

# Install dependencies
install:
    pnpm install

# Run the CLI from source
dev:
    pnpm dev

# Typecheck, then build
check:
    pnpm tsc --noEmit
    pnpm build

# Build, then run the CLI
start:
    pnpm build
    pnpm start

# Publish a patch. Pass minor or major to bump further
release version="patch":
    gh workflow run "CI/CD Pipeline" --ref main -f version={{version}}
