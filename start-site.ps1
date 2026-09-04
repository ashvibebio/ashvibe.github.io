$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
Write-Host "Сайт доступен локально: http://localhost:8000" -ForegroundColor Green
python -m http.server 8000
