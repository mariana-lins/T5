# Script de Limpeza do Projeto WB
# Remove arquivos temporários e de build

Write-Host "Limpando projeto WB..." -ForegroundColor Cyan

# Remove pastas de build
if (Test-Path "frontend\dist") {
    Remove-Item "frontend\dist" -Recurse -Force
    Write-Host "Removido frontend\dist" -ForegroundColor Green
}

if (Test-Path "frontend\node_modules") {
    Remove-Item "frontend\node_modules" -Recurse -Force  
    Write-Host "Removido frontend\node_modules" -ForegroundColor Green
}

if (Test-Path "backend\target") {
    Remove-Item "backend\target" -Recurse -Force
    Write-Host "Removido backend\target" -ForegroundColor Green
}

# Remove arquivos temporários
Get-ChildItem -Recurse -Name | Where-Object { 
    $_ -match "\.(log|tmp)$" -or $_ -match "debug-.*" -or $_ -match "test-.*" 
} | ForEach-Object {
    Remove-Item $_ -Force
    Write-Host "Removido $_" -ForegroundColor Green
}

Write-Host "Limpeza concluída!" -ForegroundColor Green
Write-Host "Para reconstruir:" -ForegroundColor Yellow
Write-Host "  Frontend: cd frontend && npm install && npm run build" -ForegroundColor White
Write-Host "  Backend: cd backend && .\mvnw.cmd spring-boot:run" -ForegroundColor White
