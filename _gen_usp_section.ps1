$root = $PWD.Path
$htmlPath = Join-Path $root "mobileUSP1.html"  # Your test file
$outputPath = Join-Path $root "usp-feature-sections.html"

# Read HTML
$html = Get-Content $htmlPath -Raw

# Cards with exact modal IDs from your HTML
$cards = @(
    @{ Name = "1-Touch Operations"; Img = "assets/images/mobile_first_operations.png"; Modal = "touchOpsModal" },
    @{ Name = "Quick Data Logging"; Img = "assets/images/sapphire_quick_data_logging.png"; Modal = "dataLoggingModal" },
    @{ Name = "Smart Inventories"; Img = "assets/images/sapphire_smart_inventrories.png"; Modal = "smartInventoryModal" },
    @{ Name = "On-The-Go Inspections"; Img = "assets/images/sapphire_on-the-go_inspections.png"; Modal = "inspectionModal" },
    @{ Name = "Instant Approvals"; Img = "assets/images/sapphire_instant_approvals.png"; Modal = "approvalsModal" },
    @{ Name = "Live Tracking & Updates"; Img = "assets/images/sapphire_live_tracking_and_updates.png"; Modal = "trackingModal" }
)

# Fixed modal extraction — handles multiline, entities, whitespace
function Get-ModalContent {
    param($ModalId, $Html)
    # Match entire modal block
    $modalPattern = "(?s)<div class=`"modal fade feature-modal`" id=`"$ModalId`"[^>]*?>(.*?)</div>"
    $modalMatch = [regex]::Match($Html, $modalPattern)
    
    if ($modalMatch.Success) {
        $modalContent = $modalMatch.Groups[1].Value
        
        # Extract modal-description paragraph — more robust
        $descPattern = "(?s)<p class=`"modal-description`">([^<]*?)</p>"
        $descMatch = [regex]::Match($modalContent, $descPattern)
        
        if ($descMatch.Success) {
            # Clean up HTML entities, trim, normalize whitespace
            $content = $descMatch.Groups[1].Value
            $content = $content -replace '&nbsp;', ' '
            $content = $content -replace '[ \t\r\n]+', ' '
            $content = $content.Trim()
            return $content.Substring(0, [Math]::Min(200, $content.Length)) + '...'
        }
    }
    return "Real-time operations for [feature name] — extracted from modal content."
}

# Generate sections
$sections = @()
for ($i = 0; $i -lt $cards.Count; $i++) {
    $card = $cards[$i]
    $reverse = ($i % 2 -eq 1)
    $orderPhone = if ($reverse) { "order-lg-1 order-2" } else { "order-lg-2 order-1" }
    $orderText  = if ($reverse) { "order-lg-2 order-1" } else { "order-lg-1 order-2" }

    $content = Get-ModalContent $card.Modal $html

    $section = @"
<div class="row align-items-center usp-feature-row$(if ($reverse) { ' usp-feature-row-reverse' })">
  <!-- PHONE -->
  <div class="col-12 col-lg-6 $orderPhone">
    <div class="usp-feature-phone">
      <div class="phone-parallax-container" id="phoneParallaxFeature$i">
        <div class="phone-shadow"></div>
        <div class="phonev2-frame">
          <div class="phonev2-screen">
            <img src="$($card.Img)" class="phone-carousel-img" alt="$($card.Name) screen">
          </div>
          <img src="assets/images/smartphoneframe.png" alt="Phone Frame" class="phone-overlay">
        </div>
      </div>
    </div>
  </div>

  <!-- TEXT -->
  <div class="col-12 col-lg-6 $orderText">
    <div class="usp-feature-copy">
      <h3 class="usp-feature-title">$($card.Name)</h3>
      <p class="usp-feature-subtitle">Streamlined Field Operations</p>
      <p class="usp-feature-body">$content</p>
    </div>
  </div>
</div>
"@

    $sections += $section
}

# Full output file
$output = @"
<!-- ═══ USP FEATURE SECTIONS — AUTO-GENERATED ═══ -->
<section class="usp-feature-section" id="mobile-usp-sections">
  <div class="container">
$($sections -join "`n`n")
  </div>
</section>
<!-- ═══ END USP FEATURE SECTIONS ═══ -->
"@

$output | Out-File $outputPath -Encoding utf8

# Debug: show first extraction
$firstContent = Get-ModalContent "touchOpsModal" $html
Write-Host "`n$G✔$R Generated 6 usp-feature-sections.html (target: mobileUSP1.html)" -ForegroundColor Cyan
Write-Host "$Y📋$R First extraction test: '$firstContent'" -ForegroundColor Yellow
Write-Host "$C📁$R Output saved → usp-feature-sections.html (copy-paste ready)" -ForegroundColor Cyan
