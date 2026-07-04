# Verify www.junubadiesel.com deployment
$ErrorActionPreference = "Continue"

function Test-Url {
  param(
    [string]$Url,
    [int[]]$ExpectCodes = @(200)
  )
  try {
    $resp = Invoke-WebRequest -Uri $Url -MaximumRedirection 0 -UseBasicParsing -TimeoutSec 20 -ErrorAction Stop
    return @{ ok = ($resp.StatusCode -in $ExpectCodes); code = $resp.StatusCode; location = $resp.Headers.Location }
  } catch {
    if ($_.Exception.Response) {
      $code = [int]$_.Exception.Response.StatusCode
      return @{ ok = ($code -in $ExpectCodes); code = $code; location = $_.Exception.Response.Headers["Location"] }
    }
    return @{ ok = $false; code = 0; location = $null; error = $_.Exception.Message }
  }
}

$base = "https://www.junubadiesel.com"
Write-Host "`n=== Production verification ===" -ForegroundColor Cyan

$checks = @(
  @{ name = "home"; url = "$base/"; expect = @(200) },
  @{ name = "catalog_redirect"; url = "$base/catalog"; expect = @(301, 302, 307, 308) },
  @{ name = "contact"; url = "$base/contact"; expect = @(200) },
  @{ name = "parts"; url = "$base/parts"; expect = @(200) }
)

foreach ($c in $checks) {
  $r = Test-Url -Url $c.url -ExpectCodes $c.expect
  $label = if ($r.ok) { "OK" } else { "FAIL" }
  $color = if ($r.ok) { "Green" } else { "Red" }
  Write-Host ("  [{0}] {1} -> {2}" -f $label, $c.name, $r.code) -ForegroundColor $color
  if ($r.location) { Write-Host "       Location: $($r.location)" }
  if ($r.error) { Write-Host "       Error: $($r.error)" -ForegroundColor Red }
}

$apex = Test-Url -Url "https://junubadiesel.com/" -ExpectCodes @(301, 302, 307, 308)
Write-Host ("  [{0}] apex_redirect -> {1}" -f $(if ($apex.ok) { "OK" } else { "WARN" }), $apex.code) -ForegroundColor $(if ($apex.ok) { "Green" } else { "Yellow" })
if ($apex.location) { Write-Host "       Location: $($apex.location)" }

$admin = Test-Url -Url "$base/admin/sync" -ExpectCodes @(401)
Write-Host ("  [{0}] admin_auth (401 expected) -> {1}" -f $(if ($admin.ok) { "OK" } else { "WARN" }), $admin.code) -ForegroundColor $(if ($admin.ok) { "Green" } else { "Yellow" })

try {
  $homeResp = Invoke-WebRequest -Uri $base -UseBasicParsing -TimeoutSec 20
  $server = $homeResp.Headers["Server"]
  $isVercel = $server -match "Vercel" -or $homeResp.Headers["X-Vercel-Id"]
  Write-Host "`n  Server: $server" -ForegroundColor $(if ($isVercel) { "Green" } else { "Yellow" })
  if (-not $isVercel) {
    Write-Host "  (Still on Squarespace — update DNS: @ A 76.76.21.21, www CNAME cname.vercel-dns.com)" -ForegroundColor Yellow
  }
} catch {
  Write-Host "  Server check failed: $_" -ForegroundColor Red
}
