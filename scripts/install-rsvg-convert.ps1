if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process PowerShell -Verb RunAs "-NoProfile -ExecutionPolicy Bypass -Command `"cd '$pwd'; & '$PSCommandPath';`"";
    exit;
}

$DOWNLOAD_URL = 'https://github.com/miyako/console-rsvg-convert/releases/download/2.1/x64-static.zip'
$PATH_BASE = 'C:\rsvg-convert\'
$EXECUTABLE_PATH = $PATH_BASE + 'x64-static\'

echo "Creating Directory"
New-Item -ItemType Directory -Force -Path $PATH_BASE | Out-Null

if (!(gwmi win32_operatingsystem | select osarchitecture).osarchitecture -eq "64-bit") {
    Read-Host -Prompt "This script is only available for 64 bit machines"
    return
}

echo "Downloading RSVG-Convert"

try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $client = new-object System.Net.WebClient

    $client.DownloadFile($DOWNLOAD_URL, $PATH_BASE + 'rsvg-convert.zip')
} catch {
    echo ($PATH_BASE + 'rsvg-convert.zip')
    Read-Host -Prompt "Downloading file failed!"
    return   
}

echo "Extracting"

try {
    Expand-Archive -Force ($PATH_BASE + 'rsvg-convert.zip') $PATH_BASE
} catch {
    Read-Host -Prompt "Error extracting file!"
    return
}

$arrPath = $env:Path -split ';'


if ($arrPath -like $EXECUTABLE_PATH) {
    Read-Host -Prompt "Already added to path! Script has completed!"
} else {
    [Environment]::SetEnvironmentVariable(
        "Path",
        [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine) + ";" + $EXECUTABLE_PATH,
        [EnvironmentVariableTarget]::Machine)

    Read-Host -Prompt "Script has completed! Press restart any open command prompts!"
}
