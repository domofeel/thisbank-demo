# Codex Runbook

## Start MyFirstApp quickly

The project itself builds correctly. If `http://127.0.0.1:5173/` refuses the connection, the usual cause is the local PowerShell environment:

- `npm` may not be on `PATH`.
- A Vite process spawned from a short-lived `node -e` command can answer once, then close when the command exits.
- Old `vite-dev.out.log` lines are appended forever, so `Local: 5173` in the tail is not proof that the server is alive.

Use the project launcher. It avoids the slow failure loop by checking whether the server is already alive, starting it only when needed, and polling until `127.0.0.1:5173` actually returns HTTP 200:

```powershell
.\scripts\start-dev.ps1
```

Manual fallback: use the bundled Node runtime and `Start-Process` so the Vite process survives the shell command. After dependency or config changes, wait for a real HTTP response instead of trusting old appended log lines:

```powershell
$node = 'C:\Users\domof\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$p = Start-Process -FilePath $node -ArgumentList '.codex-dev-server.mjs' -WorkingDirectory 'C:\Projects\MyFirstApp' -WindowStyle Hidden -PassThru
do {
  Start-Sleep -Milliseconds 500
  try { $ready = (Invoke-WebRequest -Uri http://127.0.0.1:5173/ -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200 } catch { $ready = $false }
} until ($ready)
```

Build check without relying on `npm`:

```powershell
$node = 'C:\Users\domof\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node node_modules\vite\bin\vite.js build
```

## Replace a black-background image quickly

Use the project script below. It removes only near-black pixels connected to the canvas edge, so dark cards inside the image are preserved and the image is not rotated, cropped, or resized.

```powershell
$python = 'C:\Users\domof\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
& $python scripts\remove-black-edge-background.py 'C:\path\to\source.png' 'C:\Projects\MyFirstApp\src\assets\thisbank-cards-transparent.png'
```

If the source path has Cyrillic characters and Python has trouble reading it, copy it first to an ASCII temporary filename in the project, process that file, then delete the temporary copy.
