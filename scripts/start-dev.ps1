$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$url = "http://127.0.0.1:5173/"
$node = "C:\Users\domof\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

function Test-DevServer {
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

if (Test-DevServer) {
  Write-Output "ready $url"
  exit 0
}

$process = Start-Process `
  -FilePath $node `
  -ArgumentList ".codex-dev-server.mjs" `
  -WorkingDirectory $root `
  -WindowStyle Hidden `
  -PassThru

Write-Output "started $($process.Id)"

$deadline = (Get-Date).AddSeconds(25)
do {
  Start-Sleep -Milliseconds 500
  if (Test-DevServer) {
    Write-Output "ready $url"
    exit 0
  }
} while ((Get-Date) -lt $deadline)

Write-Output "not-ready $url"
exit 1
