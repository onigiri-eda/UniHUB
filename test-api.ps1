Start-Sleep -Seconds 2
$ProgressPreference = 'SilentlyContinue'

try {
    Write-Host "Testing /api/health..."
    $response = Invoke-WebRequest -Uri http://localhost:5432/api/health -UseBasicParsing
    Write-Host "✅ Health endpoint response:"
    $response.Content | ConvertFrom-Json | Format-Table
    
    Write-Host "`nTesting /api/universities..."
    $response = Invoke-WebRequest -Uri http://localhost:5432/api/universities -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Found $(($data | Measure-Object).Count) universities"
    $data | Select-Object -First 1 | Format-Table
    
} catch {
    Write-Host "❌ Error: $_"
}
