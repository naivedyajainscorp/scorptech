$root  = $PWD.Path
$out   = Join-Path $root "scorp_css_tight.txt"

# ── ANSI ─────────────────────────────────────────────────────────────────────
$E = [char]27
$G = "$E[92m"; $C = "$E[96m"; $Y = "$E[93m"
$W = "$E[97m"; $D = "$E[2m";  $B = "$E[1m"; $R = "$E[0m"
$spin = @('|','/','-','\')

# ── Minifier ─────────────────────────────────────────────────────────────────
function Compress-CSS {
    param([string]$Raw)
    # Strip block comments /* ... */
    $c = [regex]::Replace($Raw, '/\*[\s\S]*?\*/', '')
    # Strip line comments //
    $c = [regex]::Replace($c, '//[^\n]*', '')
    # Collapse all whitespace to single space
    $c = [regex]::Replace($c, '\s+', ' ')
    # Remove spaces around structural characters
    $c = [regex]::Replace($c, '\s*([\{\}:;,>~+])\s*', '$1')
    # Remove space before ( and after )
    $c = [regex]::Replace($c, '\s*\(\s*', '(')
    $c = [regex]::Replace($c, '\s*\)\s*', ')')
    # Remove trailing semicolon before closing brace
    $c = $c.Replace(';}', '}')
    # Remove leading/trailing whitespace
    return $c.Trim()
}

# ── Progress Bar ──────────────────────────────────────────────────────────────
function Get-Bar {
    param([int]$Pct, [int]$W = 30)
    $f = [math]::Round($W * $Pct / 100)
    return "$G$('█' * $f)$D$('░' * ($W - $f))$R $B$W$Pct%$R"
}

# ══════════════════════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════════════════════
Clear-Host
Write-Host ""
Write-Host "$G$B  ╔══════════════════════════════════════════════╗$R"
Write-Host "$G$B  ║   ░▒▓  SCORP CSS EXTRACTOR  ▓▒░             ║$R"
Write-Host "$G$B  ║   Tight-Pack Mode  ·  Comments Stripped     ║$R"
Write-Host "$G$B  ╚══════════════════════════════════════════════╝$R"
Write-Host ""
Start-Sleep -Milliseconds 300
Write-Host "$D  root $W→$R $W$root$R"
Write-Host ""
Start-Sleep -Milliseconds 250

# Purge old
Write-Host "  $Y⟳$R  Purging old export..."
Remove-Item -ErrorAction SilentlyContinue $out
Start-Sleep -Milliseconds 200
Write-Host "  $G✔$R  Cache cleared`n"

# Collect CSS files
$files = Get-ChildItem -Recurse -Include *.css -File |
    Where-Object { $_.FullName -notmatch 'assets|node_modules' } |
    Sort-Object FullName

$total = $files.Count
if ($total -eq 0) {
    Write-Host "  $Y⚠  No CSS files found. Exiting.$R"
    exit
}

Write-Host "  $C$B{ }  CSS Files — Minify + Extract$R"
Write-Host "$D  ──────────────────────────────────────────────────$R"

$result   = [System.Collections.Generic.List[string]]::new()
$rawTotal = 0
$minTotal = 0

for ($i = 0; $i -lt $total; $i++) {
    $file  = $files[$i]
    $pct   = [math]::Round(($i + 1) / $total * 100)
    $bar   = Get-Bar $pct
    $fname = $file.FullName.Replace($root + '\', '')
    $sf    = $spin[$i % 4]

    Write-Host "`r  $G$sf$R [$bar]  $D$fname$R$(' ' * 4)" -NoNewline

    $raw     = Get-Content $file.FullName -Raw
    $mini    = Compress-CSS $raw
    $rawKB   = [math]::Round($raw.Length / 1KB, 1)
    $miniKB  = [math]::Round($mini.Length / 1KB, 1)
    $rawTotal  += $raw.Length
    $minTotal  += $mini.Length

    $result.Add("/* === $fname | raw:${rawKB}KB → min:${miniKB}KB === */")
    $result.Add($mini)
    $result.Add("")

    Start-Sleep -Milliseconds 30
}

$result | Out-File $out -Encoding utf8

# ── Final Stats ───────────────────────────────────────────────────────────────
$fileKB    = [math]::Round((Get-Item $out).Length / 1KB, 1)
$rawKBt    = [math]::Round($rawTotal / 1KB, 1)
$minKBt    = [math]::Round($minTotal / 1KB, 1)
$saved     = [math]::Round(100 - ($minTotal / $rawTotal * 100), 1)

Write-Host "`r  $G✔$R [$(Get-Bar 100)]  $G$Bscorp_css_tight.txt$R $D($fileKB KB)$R$(' ' * 10)"
Write-Host ""
Write-Host "$G$B  ╔══════════════════════════════════════════════╗$R"
Write-Host "$G$B  ║           EXTRACTION COMPLETE  ✔            ║$R"
Write-Host "$G$B  ╚══════════════════════════════════════════════╝$R"
Write-Host ""
Write-Host "  $D  Files processed  $R  $W$B$total$R"
Write-Host "  $D  Raw size         $R  $Y$B${rawKBt} KB$R"
Write-Host "  $D  Minified size    $R  $G$B${minKBt} KB$R"
Write-Host "  $D  Space saved      $R  $G$B${saved}%$R"
Write-Host "  $D  Output           $R  $W$Bscorp_css_tight.txt$R"
Write-Host ""
