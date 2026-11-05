# PowerShell скрипт для запуска API-тестов с правильной настройкой SSL
# Использование: .\run-tests.ps1 [test-file] [options]

# Установка переменной окружения для игнорирования ошибок SSL
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"

# Получаем аргументы командной строки
$testFiles = @()
$otherArgs = @()

foreach ($arg in $args) {
    if ($arg -match "\.spec\.ts$" -or $arg -match "\.test\.ts$") {
        $testFiles += $arg
    } else {
        $otherArgs += $arg
    }
}

# Формируем команду
$command = "npx playwright test -c API-Tests/playwright.config.ts"

if ($testFiles.Count -gt 0) {
    $command += " " + ($testFiles -join " ")
}

if ($otherArgs.Count -gt 0) {
    $command += " " + ($otherArgs -join " ")
}

# Запускаем команду
Write-Host "Running: $command"
Invoke-Expression $command
