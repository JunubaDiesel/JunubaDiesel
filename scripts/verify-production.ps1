# Verify www.junubadiesel.com deployment
$ErrorActionPreference = "Continue"
$base = "https://www.junubadiesel.com"
$checks = @(
  @{ name = "home"; url = "$base/"; expect = 200 },
  @{ name = "catalog_redirect"; url = "$base/catalog"; expect = 308 },
  @{ name = "contact"; url = "$base/contact"; expect = 200 },
  @{ name = "parts"; url = "$base/parts"; expect = 200 }
)

Write-Host "`n=== Production verification ===" -ForegroundColor Cyan

foreach ($c in $checks) {
  try {
    $resp = Invoke-WebRequest -Uri $c.url -MaximumRedirection 0 -SkipHttpErrorCheck -TimeoutSec 20
    $ok = $resp.StatusCode -eq $c.expect -or ($c.name -eq "catalog_redirect" -and $resp.StatusCode -in 301, 302, 307, 308)
    $color = if ($ok) { "Green" } else { "Red" }
    Write-Host ("  [{0}] {1} -> {2} (expected {3})" -f $(if ($ok) { "OK" } else { "FAIL" }), $c.name, $resp.StatusCode, $c.expect) -ForegroundColor $color
    if ($c.name -eq "catalog_redirect" -and $resp.Headers.Location) {
      Write-Host "       Location: $($resp.Headers.Location)"
    }
  } catch {
    Write-Host "  [FAIL] $($c.name): $_" -ForegroundColor Red
  }
}

try {
  $apex = Invoke-WebRequest -Uri "https://junubadiesel.com/" -MaximumRedirection 0 -SkipHttpErrorCheck -TimeoutSec 20
  $redirectOk = $apex.StatusCode -in 301, 302, 307, 308
  Write-Host ("  [{0}] apex_redirect -> {1}" -f $(if ($redirectOk) { "OK" } else { "FAIL" }), $apex.StatusCode) -ForegroundColor $(if ($redirectOk) { "Green" } else { "Yellow" })
  if ($apex.Headers.Location) { Write-Host "       Location: $($apex.Headers.Location)" }
} catch {
  Write-Host "  [WARN] apex_redirect: $_" -ForegroundColor Yellow
}

try {
  $admin = Invoke-WebRequest -Uri "$base/admin/sync" -MaximumRedirection 0 -SkipHttpErrorCheck -TimeoutSec 20
  $authOk = $admin.StatusCode -eq 401
  Write-Host ("  [{0}] admin_auth (401 expected) -> {1}" -f $(if ($authOk) { "OK" } else { "FAIL" }), $admin.StatusCode) -ForegroundColor $(if ($authOk) { "Green" } else { "Yellow" })
} catch {
  Write-Host "  [WARN] admin_auth: $_" -ForegroundColor Yellow
}

$server = (Invoke-WebRequest -Uri $base -SkipHttpErrorCheck -TimeoutSec 20).Headers["Server"]
Write-Host "`n  Server header: $server" -ForegroundColor $(if ($server -match "Vercel") { "Green" } else { "Yellow" })
