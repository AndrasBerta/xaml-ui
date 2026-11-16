Write-Host 'Collecting build version information...' -ForegroundColor Magenta
$version = if ($env:PACKAGE_VERSION) { $env:PACKAGE_VERSION } elseif ($env:APPVEYOR_BUILD_VERSION) { $env:APPVEYOR_BUILD_VERSION } else { "1.0.0.0" }
$version = [Version]::Parse($version).ToString(3)
Write-Host "Version: $version"

Write-Host 'Creating output directory...' -ForegroundColor Magenta
New-Item -Path '.\Output' -ItemType Directory -Force

Write-Host 'Updating package.json...' -ForegroundColor Magenta

$packageJson = Get-Content ./projects/xaml-ui/package.json | ConvertFrom-Json
$packageJson.version = $version
Set-Content ./projects/xaml-ui/package.json -Value ($packageJson | ConvertTo-Json)

Write-Host 'Installing dependencies...' -ForegroundColor Magenta
npm install

Write-Host 'Building xaml-ui...' -ForegroundColor Magenta
npm run build xaml-ui

if ($LastExitCode -eq 0) {
  Write-Host "Building xaml-ui succeeded!" -ForegroundColor Green
}
else {
  Write-Host "Building xaml-ui failed!" -ForegroundColor Red 
  throw "Building xaml-ui failed!"
}

Write-Host 'Creating npm package...' -ForegroundColor Magenta
Push-Location ./dist/xaml-ui

# npm.ps1 re-evaluates its command line in its own scope, so pass a plain variable (not $PSScriptRoot)
$outputPath = Join-Path $PSScriptRoot 'Output'
npm pack --pack-destination $outputPath

Pop-Location

Write-Host 'Done.' -ForegroundColor Green