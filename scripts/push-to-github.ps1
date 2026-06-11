# Run after Git and GitHub CLI are installed (see DEPLOY.md)

$ErrorActionPreference = "Stop"
$env:Path = "C:\Program Files\Git\cmd;C:\Program Files\Git\bin;C:\Program Files\GitHub CLI;" + $env:Path

Set-Location $PSScriptRoot\..

Write-Host "Checking GitHub auth..."
gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Log in to GitHub first:"
  gh auth login
}

$repoName = Read-Host "GitHub repo name (default: personal-website)"
if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = "personal-website" }

Write-Host "Creating GitHub repo and pushing..."
gh repo create $repoName --public --source=. --remote=origin --push

Write-Host "Done. Import $repoName on https://vercel.com/new"
