# Force correct working directory
Set-Location $PSScriptRoot

# Force UTF-8 rendering
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
$Host.UI.RawUI.WindowTitle = "SAPPHIRE CONTENT STUDIO v4.0 - NEON TERMINAL EDITION"

function Show-Banner {

    Clear-Host

    $width = $Host.UI.RawUI.WindowSize.Width

    $banner = @(
"███████╗ █████╗ ██████╗ ██████╗ ██╗  ██╗██╗██████╗ ███████╗",
"██╔════╝██╔══██╗██╔══██╗██╔══██╗██║  ██║██║██╔══██╗██╔════╝",
"███████╗███████║██████╔╝██████╔╝███████║██║██████╔╝█████╗  ",
"╚════██║██╔══██║██╔═══╝ ██╔═══╝ ██╔══██║██║██╔══██╗██╔══╝  ",
"███████║██║  ██║██║     ██║     ██║  ██║██║██║  ██║███████╗",
"╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝"
    )

    # Gradient colors (top to bottom)
    $colors = @(
        "`e[38;2;0;255;255m",
        "`e[38;2;0;230;255m",
        "`e[38;2;0;200;255m",
        "`e[38;2;0;170;255m",
        "`e[38;2;0;140;255m",
        "`e[38;2;0;110;255m"
    )

    Write-Host ""

    for ($i = 0; $i -lt $banner.Count; $i++) {

        $line = $banner[$i]
        $paddingSize = [Math]::Max(0, [int](($width - $line.Length) / 2))
        $padding = " " * $paddingSize

        Write-Host $padding -NoNewline
        Write-Host "$($colors[$i])$line`e[0m"
    }

    Write-Host ""

    $subtitle = "CONTENT STUDIO COMMAND CENTER - ELITE TERMINAL EDITION"
    $paddingSize = [Math]::Max(0, [int](($width - $subtitle.Length) / 2))
    $padding = " " * $paddingSize

    Write-Host $padding -NoNewline
    Write-Host "`e[38;2;255;200;0m$subtitle`e[0m"

    Write-Host ""
}

function Pause-Return {
    Write-Host ""
    Write-Host "`e[38;2;255;200;0mPress Enter to return to command center...`e[0m"
    Read-Host | Out-Null
}

function List-Versions {

    Write-Host ""
    Write-Host "`e[38;2;0;200;255mJSON Versions:`e[0m"

    if (Test-Path "exports/json") {
        Get-ChildItem "exports/json" -Directory | Select-Object -ExpandProperty Name
    }

    Write-Host ""
    Write-Host "`e[38;2;0;200;255mJS Versions:`e[0m"

    if (Test-Path "exports/js") {
        Get-ChildItem "exports/js" -Directory | Select-Object -ExpandProperty Name
    }

    Write-Host ""
    Write-Host "`e[38;2;0;200;255mDOC Versions:`e[0m"

    if (Test-Path "exports/doc") {
        Get-ChildItem "exports/doc" -Directory | Select-Object -ExpandProperty Name
    }
}

while ($true) {

    Show-Banner

    Write-Host "[1] Export Master JSON" -ForegroundColor White
    Write-Host "[2] Generate JS From Version" -ForegroundColor White
    Write-Host "[3] Generate Word From Version" -ForegroundColor White
    Write-Host "[4] List Version Registry" -ForegroundColor White
    Write-Host "[5] Exit" -ForegroundColor White
    Write-Host ""

    $choice = Read-Host "Select option"

    switch ($choice) {

        "1" {
            Show-Banner
            Write-Host "`e[38;2;255;200;0m>> Exporting Master JSON...`e[0m"
            node export-master-json.js
            Write-Host "`e[38;2;0;255;150m>> Operation completed.`e[0m"
            Pause-Return
        }

        "2" {
            Show-Banner
            List-Versions
            Write-Host ""
            $version = Read-Host "Enter version (example v1)"
            Write-Host ""
            Write-Host "`e[38;2;255;200;0m>> Generating JS for $version ...`e[0m"
            node generate-js-from-master.js $version
            Write-Host "`e[38;2;0;255;150m>> Operation completed.`e[0m"
            Pause-Return
        }

        "3" {
            Show-Banner
            List-Versions
            Write-Host ""
            $version = Read-Host "Enter version (example v1)"
            Write-Host ""
            Write-Host "`e[38;2;255;200;0m>> Generating Word document for $version ...`e[0m"
            node extract-to-word.js $version
            Write-Host "`e[38;2;0;255;150m>> Operation completed.`e[0m"
            Pause-Return
        }

        "4" {
            Show-Banner
            List-Versions
            Pause-Return
        }

        "5" {
            Write-Host ""
            Write-Host "`e[38;2;255;200;0mShutting down SAPPHIRE CONTENT STUDIO...`e[0m"
            Start-Sleep -Milliseconds 600
            Write-Host "`e[38;2;0;255;150mSession terminated.`e[0m"
            Start-Sleep -Milliseconds 600
            exit
        }

        default {
            Write-Host "`e[38;2;255;0;0mInvalid selection.`e[0m"
            Start-Sleep -Milliseconds 800
        }
    }
}
