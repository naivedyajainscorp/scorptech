@echo off
title SAPPHIRE CONTENT STUDIO
color 0A

:menu
cls
echo.
echo =====================================================
echo      S A P P H I R E   C O N T E N T   S T U D I O
echo =====================================================
echo.
echo    [1] Export Master JSON (New Version)
echo    [2] Generate JS From Version
echo    [3] Generate Word From Version
echo    [4] List Available Versions
echo    [5] Exit
echo.
echo -----------------------------------------------------
echo.
set /p choice=Select an option:

if "%choice%"=="1" goto export
if "%choice%"=="2" goto genjs
if "%choice%"=="3" goto gendoc
if "%choice%"=="4" goto list
if "%choice%"=="5" exit

goto menu


:export
cls
echo.
echo ================================
echo  EXPORTING MASTER JSON...
echo ================================
echo.
node export-master-json.js
echo.
pause
goto menu


:genjs
cls
echo.
echo =====================================
echo  GENERATE JS FROM SPECIFIC VERSION
echo =====================================
echo.
echo Available JSON versions:
dir exports\json
echo.
set /p version=Enter version (example v1):
echo.
echo Generating JS for %version% ...
node generate-js-from-master.js %version%
echo.
pause
goto menu


:gendoc
cls
echo.
echo =====================================
echo  GENERATE WORD FROM SPECIFIC VERSION
echo =====================================
echo.
echo Available JSON versions:
dir exports\json
echo.
set /p version=Enter version (example v1):
echo.
echo Generating Word for %version% ...
node extract-to-word.js %version%
echo.
pause
goto menu


:list
cls
echo.
echo ===========================
echo   AVAILABLE JSON VERSIONS
echo ===========================
echo.
dir exports\json
echo.
echo ===========================
echo   AVAILABLE JS VERSIONS
echo ===========================
echo.
dir exports\js
echo.
echo ===========================
echo   AVAILABLE DOC VERSIONS
echo ===========================
echo.
dir exports\doc
echo.
pause
goto menu