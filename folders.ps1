# Save this file as setup-structure.ps1 in your project root

# 1. Define all directories to create
$directories = @(
    "src/app",
    "src/components/common", 
    "src/components/dashboard",
    "src/features/analytics", 
    "src/features/market", 
    "src/features/websocket", 
    "src/features/performance", 
    "src/features/settings",
    "src/hooks",
    "src/layouts",
    "src/lib",
    "src/services/websocket", 
    "src/services/analytics",
    "src/store/selectors",
    "src/styles",
    "src/types",
    "src/utils",
    "src/workers"
)

# 2. Define initial files to create
$files = @(
    "src/app/App.tsx", 
    "src/app/providers.tsx", 
    "src/app/router.tsx",
    "src/store/marketStore.ts", 
    "src/store/connectionStore.ts", 
    "src/store/performanceStore.ts", 
    "src/store/uiStore.ts"
)

Write-Host "Scaffolding directory structure..." -ForegroundColor Cyan

# Create folders
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Create files
foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Path $file -Force | Out-Null
    }
}

Write-Host "Project structure successfully created!" -ForegroundColor Green