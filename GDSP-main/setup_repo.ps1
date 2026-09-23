# setup_repo.ps1
# Script interactivo para inicializar y subir el proyecto a GitHub
# Ejecutar dentro de la carpeta del proyecto (donde están index.html, index.css, index.js)

param()

function Read-YesNo($msg){
    while($true){
        $r = Read-Host "$msg ([y]/n)"
        if([string]::IsNullOrWhiteSpace($r) -or $r -match '^(y|Y)$') { return $true }
        if($r -match '^(n|N)$') { return $false }
    }
}

Write-Host "== Preparar repo local -> remoto GitHub ==`n" -ForegroundColor Cyan

# Preguntar URL remoto
$defaultUrl = 'https://github.com/irvda/GDSP.git'
$repoUrl = Read-Host "URL del repositorio remoto (Enter para usar $defaultUrl)"
if ([string]::IsNullOrWhiteSpace($repoUrl)) { $repoUrl = $defaultUrl }

# Pedir ramas (lista separada por comas) o usar valores por defecto
$defaultBranches = 'feature/miembro1,feature/miembro2,feature/miembro3,feature/miembro4'
$bInput = Read-Host "Lista de ramas para integrantes (separadas por comas) (Enter para usar: $defaultBranches)"
if ([string]::IsNullOrWhiteSpace($bInput)) { $branches = $defaultBranches.Split(',') } else { $branches = $bInput.Split(',') }

# Verificar git
try{
    git --version > $null 2>&1
} catch {
    Write-Error "Git no está instalado o no está en PATH. Instala Git for Windows y vuelve a ejecutar el script."
    exit 1
}

# Confirmación
Write-Host "\nResumen:" -ForegroundColor Yellow
Write-Host "Repositorio remoto: $repoUrl"
Write-Host "Ramas a crear: $($branches -join ', ')"
if (-not (Read-YesNo "Continuar y ejecutar los pasos?")) { Write-Host "Cancelado por usuario."; exit 0 }

# Paso 1: inicializar si no hay .git
if (-not (Test-Path ".git")){
    Write-Host "Inicializando repositorio git local..."
    git init
    git add .
    git commit -m "Inicial: sitio de bienvenida" 2>$null | Out-Null
    git branch -M main
} else {
    Write-Host "Ya existe repositorio git local. Asegurando rama 'main'..."
    git branch -M main
}

# Paso 2: configurar remoto
$hasOrigin = $false
try{ git remote get-url origin > $null; $hasOrigin = $true } catch{}
if ($hasOrigin){
    Write-Host "Remoto 'origin' ya existe. Actualizando URL a $repoUrl"
    git remote set-url origin $repoUrl
} else {
    Write-Host "Añadiendo remoto origin -> $repoUrl"
    git remote add origin $repoUrl
}

# Paso 3: push main
Write-Host "Haciendo push de 'main' al remoto..."
try{
    git add .
    git commit -m "Actualizar antes de push" -a 2>$null | Out-Null
} catch{}

$pushOk = $true
try{
    git push -u origin main
} catch {
    Write-Warning "No se pudo hacer push de main. Verifica credenciales o que el repo remoto exista y tengas permisos."
    $pushOk = $false
}

# Paso 4: crear y push de ramas para integrantes
foreach($b in $branches){
    $bTrim = $b.Trim()
    if ([string]::IsNullOrWhiteSpace($bTrim)) { continue }
    Write-Host "\nProcesando rama: $bTrim"
    $exists = $false
    try{ git show-ref --verify --quiet refs/heads/$bTrim; $exists = ($LASTEXITCODE -eq 0) } catch{}
    if ($exists){
        Write-Host "Rama $bTrim ya existe localmente, saltando creación."
    } else {
        git checkout -b $bTrim
        try{ git push -u origin $bTrim } catch { Write-Warning "No se pudo pushear $bTrim: verifica permisos/remote." }
    }
}

# Volver a main
git checkout main 2>$null | Out-Null

# Paso 5: agregar README y plantilla PR si no existen
if (-not (Test-Path "README.md")){
    Write-Host "Creando README.md..."
    @"
# GDSP - Sitio del equipo

Este repositorio contiene un sitio web con 4 secciones. Cada integrante trabajará en su rama.
"@ | Out-File -Encoding utf8 README.md
    git add README.md
    git commit -m "Añadir README" 2>$null | Out-Null
    if ($pushOk) { git push }
}

if (-not (Test-Path ".github/PULL_REQUEST_TEMPLATE.md")){
    Write-Host "Creando plantilla de Pull Request..."
    New-Item -ItemType Directory -Force -Path ".github" | Out-Null
    @"
### Descripción
(Describe brevemente los cambios)

### Miembro responsable
- Nombre:

### Archivos modificados
-

### Checklist
- [ ] Funciona localmente
- [ ] Commiteado con mensajes claros
"@ | Out-File -Encoding utf8 ".github/PULL_REQUEST_TEMPLATE.md"
    git add ".github/PULL_REQUEST_TEMPLATE.md"
    git commit -m "Añadir plantilla de Pull Request" 2>$null | Out-Null
    if ($pushOk) { git push }
}

# Final: mostrar estado
Write-Host "\n== Resumen final ==" -ForegroundColor Green
git branch -a
Write-Host "\nÚltimos commits (resumen):" -ForegroundColor Green
git log --oneline -n 30
Write-Host "\nSi quieres crear Pull Requests desde la CLI, instala y autentica 'gh' y usa:`n gh pr create --base main --head feature/miembro1 --title 'Sección: miembro1' --body 'Descripción'"
Write-Host "\nScript terminado. Si hay errores de push revisa permisos y que el repo remoto exista."