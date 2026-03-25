$root = $PWD.Path

# ── ANSI ──────────────────────────────────────────────────────────────────────
$E = [char]27
$G = "$E[92m"; $C = "$E[96m"; $Y = "$E[93m"; $RD = "$E[91m"
$W = "$E[97m"; $D = "$E[2m";  $B = "$E[1m";  $R  = "$E[0m"
$M = "$E[95m"
$spin = @('⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏')

# ── Classes to check ──────────────────────────────────────────────────────────
$classes = @(
  's-wrap','s-eyebrow',
  's-cta','s-cta__accent','s-cta__inner','s-cta__headline','s-cta__sub','s-cta__actions','s-cta__pills',
  's-blogs-featured','s-section-intro','s-view-all','s-blog-grid',
  's-marquee-section','s-marquee-top','s-marquee-rule','s-marquee-wrap','s-mq-row',
  's-footer','s-footer__top-strip','s-footer__status','s-status-dot','s-footer__top-cta',
  's-footer__body','s-footer__logo','s-footer__logomark','s-footer__logoname','s-footer__tagline',
  's-footer__contact','s-footer__contact-item','s-footer__location','s-footer__links',
  's-footer__blog-section','s-footer__blog-header','s-footer__col-title','s-footer__bottom',
  's-footer__copy','s-footer__legal','s-footer__made',
  's-blog-categories','s-acc',
  's-dot-fundamentals','s-dot-modules','s-dot-industries','s-dot-analytics','s-dot-business','s-dot-special'
)

# ── Header ────────────────────────────────────────────────────────────────────
function Show-Header {
  Clear-Host
  Write-Host ""
  Write-Host "$G$B  ╔══════════════════════════════════════════════════╗$R"
  Write-Host "$G$B  ║   ░▒▓  SCORP CONFLICT SCANNER  ▓▒░              ║$R"
  Write-Host "$G$B  ║   CSS Class Rename Safety Check  v1.0           ║$R"
  Write-Host "$G$B  ╚══════════════════════════════════════════════════╝$R"
  Write-Host ""
  Start-Sleep -Milliseconds 300
  Write-Host "$D$C  [ Initialising conflict detection engine... ]$R"
  Start-Sleep -Milliseconds 200
  Write-Host "$D  root $W→$R $W$root$R"
  Write-Host "$D  scanning $W→$R $W$($classes.Count) class names$R"
  Write-Host ""
  Start-Sleep -Milliseconds 300
}

# ── Progress Bar ──────────────────────────────────────────────────────────────
function Get-Bar {
  param([int]$Pct, [int]$W = 28)
  $f = [math]::Round($W * $Pct / 100)
  return "$G$('█' * $f)$D$('░' * ($W - $f))$R $B$W$Pct%$R"
}

# ── Main ──────────────────────────────────────────────────────────────────────
Show-Header

# Step 1 — collect files
Write-Host "  $C⟳$R  Crawling project tree..."
$allFiles = Get-ChildItem -Recurse -Include *.html,*.css -File -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch 'node_modules' }
$totalFiles = $allFiles.Count
Write-Host "  $G✔$R  Found $W$B$totalFiles$R files to scan`n"
Start-Sleep -Milliseconds 200

# Step 2 — scan
Write-Host "  $M$B⌕  Running pattern match across all files...$R"
Write-Host "$D  ────────────────────────────────────────────────────────$R"

$results = [System.Collections.Generic.List[PSObject]]::new()
$i = 0

foreach ($file in $allFiles) {
  $i++
  $pct   = [math]::Round($i / $totalFiles * 100)
  $bar   = Get-Bar $pct
  $sf    = $spin[$i % $spin.Count]
  $fname = $file.FullName.Replace($root + '\', '')
  $short = if ($fname.Length -gt 52) { '...' + $fname.Substring($fname.Length - 49) } else { $fname }

  Write-Host "`r  $G$sf$R [$bar]  $D$short$R$(' ' * 4)" -NoNewline

  $content = Get-Content $file.FullName -ErrorAction SilentlyContinue
  if (-not $content) { continue }

  foreach ($class in $classes) {
    $pattern = "(?:\.${class}[\s{:,\[>+~)]|[`"'\s]${class}[\s`"'])"
    $lineNum = 0
    foreach ($line in $content) {
      $lineNum++
      if ($line -match $pattern) {
        $type = if ($line.Trim() -match '^\.' -or $line.Trim() -match '[{:;]') { 'CSS DECL' } else { 'HTML USE' }
        $results.Add([PSCustomObject]@{
          Class   = $class
          Type    = $type
          File    = $fname
          Line    = $lineNum
          Snippet = $line.Trim().Substring(0, [Math]::Min(72, $line.Trim().Length))
        })
      }
    }
  }
}

Write-Host "`r  $G✔$R [$(Get-Bar 100)]  $G$B Scan complete $R$(' ' * 30)"
Write-Host ""
Start-Sleep -Milliseconds 300

# Step 3 — build report
$outPath = Join-Path $root "conflict-check.txt"
$lines   = [System.Collections.Generic.List[string]]::new()

$header  = "SCORP CONFLICT SCANNER — $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
$divider = "═" * 140
$thin    = "─" * 140

$lines.Add($divider)
$lines.Add($header)
$lines.Add("Root : $root")
$lines.Add("Files scanned : $totalFiles   |   Classes checked : $($classes.Count)   |   Hits : $($results.Count)")
$lines.Add($divider)

if ($results.Count -eq 0) {
  $lines.Add("")
  $lines.Add("  ✔  NO CONFLICTS FOUND — all $($classes.Count) replacement class names are safe to use.")
  $lines.Add("")
  $lines.Add($divider)

  Write-Host "  $G$B✔  ZERO CONFLICTS — every class name is clean and safe.$R"
  Write-Host ""
} else {
  $conflicts  = ($results | Select-Object -ExpandProperty Class -Unique).Count
  $cssHits    = ($results | Where-Object { $_.Type -eq 'CSS DECL' }).Count
  $htmlHits   = ($results | Where-Object { $_.Type -eq 'HTML USE' }).Count

  $lines.Add("")
  $lines.Add(("  {0,-38} {1,-10} {2,-48} {3,-6} {4}" -f 'CLASS','TYPE','FILE (breadcrumb)','LINE','SNIPPET'))
  $lines.Add($thin)

  $prevClass = ''
  foreach ($r in $results | Sort-Object Class, File, Line) {
    if ($r.Class -ne $prevClass) {
      if ($prevClass -ne '') { $lines.Add("") }
      $prevClass = $r.Class
    }
    $typeLabel = if ($r.Type -eq 'CSS DECL') { '[CSS]' } else { '[HTM]' }
    $lines.Add(("  {0,-38} {1,-10} {2,-48} {3,-6} {4}" -f $r.Class, $typeLabel, $r.File, $r.Line, $r.Snippet))
  }

  $lines.Add("")
  $lines.Add($divider)
  $lines.Add("  SUMMARY")
  $lines.Add($thin)
  $lines.Add("  Conflicting class names : $conflicts  of  $($classes.Count)")
  $lines.Add("  CSS declarations found  : $cssHits")
  $lines.Add("  HTML usages found       : $htmlHits")
  $lines.Add("  Total hits              : $($results.Count)")
  $lines.Add($divider)

  # terminal summary
  Write-Host "  $RD$B⚠  CONFLICTS DETECTED$R"
  Write-Host ""
  Write-Host "  $W$B  CLASS                                  TYPE     FILE$R"
  Write-Host "$D  $thin$R"
  $prevClass = ''
  foreach ($r in $results | Sort-Object Class, File, Line) {
    if ($r.Class -ne $prevClass) {
      if ($prevClass -ne '') { Write-Host "" }
      $prevClass = $r.Class
    }
    $col  = if ($r.Type -eq 'CSS DECL') { $RD } else { $Y }
    $tag  = if ($r.Type -eq 'CSS DECL') { '[CSS]' } else { '[HTM]' }
    $fshort = if ($r.File.Length -gt 45) { '...' + $r.File.Substring($r.File.Length-42) } else { $r.File }
    Write-Host ("  $C{0,-38}$R $col{1,-8}$R $D{2}$R : $W{3}$R" -f $r.Class, $tag, $fshort, $r.Line)
  }
  Write-Host ""
}

$lines | Out-File $outPath -Encoding utf8
$kb = [math]::Round((Get-Item $outPath).Length / 1KB, 1)

# ── Footer ────────────────────────────────────────────────────────────────────
Write-Host "$G$B  ╔══════════════════════════════════════════════════╗$R"
Write-Host "$G$B  ║           SCAN COMPLETE  ✔                      ║$R"
Write-Host "$G$B  ╚══════════════════════════════════════════════════╝$R"
Write-Host ""
Write-Host "  $G●$R  $Wconflict-check.txt$R  $D→  $G$B$kb KB$R"
Write-Host "  $D  $root\conflict-check.txt$R"
Write-Host ""
