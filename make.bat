@ECHO OFF

pushd %~dp0

REM Command file for Sphinx documentation

if "%SPHINXBUILD%" == "" (
	set SPHINXBUILD=sphinx-build
)
set SOURCEDIR=source
set BUILDDIR=build
set SPHINXOPTS=-W --keep-going
set LINTER=doc8
set LINTEROPTS=--ignore D001 --ignore D002 --ignore D004

if "%1" == "" goto help

if "%1" == "lint" goto lint

if "%1" == "translate" goto translate

%SPHINXBUILD% >NUL 2>NUL
if errorlevel 9009 (
	echo.
	echo.The 'sphinx-build' command was not found. Make sure you have Sphinx
	echo.installed, then set the SPHINXBUILD environment variable to point
	echo.to the full path of the 'sphinx-build' executable. Alternatively you
	echo.may add the Sphinx directory to PATH.
	echo.
	echo.If you don't have Sphinx installed, grab it from
	echo.http://sphinx-doc.org/
	exit /b 1
)

%SPHINXBUILD% -M %1 %SOURCEDIR% %BUILDDIR% %SPHINXOPTS%
goto end

:help
%SPHINXBUILD% -M help %SOURCEDIR% %BUILDDIR% %SPHINXOPTS%
goto end

:lint
%LINTER% %LINTEROPTS%
goto end

:translate
%SPHINXBUILD% -M gettext %SOURCEDIR% %BUILDDIR% %SPHINXOPTS%
sphinx-intl update-txconfig-resources --transifex-project-name frc-docs

:end
popd
