#requires -Version 7.0

$ErrorActionPreference = "Stop"

if (!(Test-Path "./dist/hippity.es5.js")) {
  Throw "Please build first"
}

$job = Start-Job -ScriptBlock {
  npm run dev
  if (!$?) {
    throw "Server did not start"
  }
}

try {
  $status = $null
  $tries = 0
  while ($status -ne 200) {
    Try {
      $request = Invoke-WebRequest http://localhost:3000/heartbeat
      $status = $request.StatusCode
    }
    Catch {
      Start-Sleep -Seconds 1
      Write-Host "Failed to connect"
    }

    if (($tries++) -gt 10) {
      Throw "Could not start server"
    }
  }

  Write-Host "Server started"

  npm run test
  if (!$?) {
    throw "Test did not pass"
  }
}
finally {
  Stop-Job $job
  Receive-Job $job
}
