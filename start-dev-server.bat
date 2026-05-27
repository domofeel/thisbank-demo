@echo off
cd /d C:\Projects\MyFirstApp
"C:\Users\domof\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" .codex-dev-server.mjs > server-live.log 2>&1
pause
