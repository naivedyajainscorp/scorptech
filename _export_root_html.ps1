$root = $PWD.Path
$outputFile = "scorp_root_html.txt"

# Target files — root only, explicit list
$targetFiles = @(
    "about.html",
    "analytics.html",
    "announcement.html",
    "assessment-report.html",
    "assessment.html",
    "book-demo.html",
    "contact.html",
    "faq.html",
    "how-do-I-use-sapphire.html",
    "index.html",
    "intelligence.html",
    "mobileUSP.html",
    "module-tour-test.html",
    "privacy_policy.html",
    "sapphire.html",
    "terms_of_use.html"
)

Remove-Item -ErrorAction SilentlyContinue $outputFile

$targetFiles | ForEach-Object {
    $filePath = Join-Path $root $_
    if (Test-Path $filePath) {
        "========== FILE: $_ ==========";
        Get-Content $filePath;
        "`n"
    } else {
        "========== FILE: $_ — NOT FOUND ==========`n"
    }
} | Out-File $outputFile -Encoding utf8

Write-Host "Export complete!" -ForegroundColor Cyan
Get-Item $outputFile | Select-Object Name, @{N='Size (KB)';E={[math]::Round($_.Length/1KB,1)}}
