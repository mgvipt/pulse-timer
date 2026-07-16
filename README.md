# Пульс — интервальный таймер

Веб-версия: https://mgvipt.github.io/pulse-timer/

Проект остаётся единым: iOS-оболочка собирает те же HTML, CSS, JavaScript и аудиофайлы, что и веб-приложение. Исходный веб-код находится в корне репозитория; `native-web/` создаётся автоматически и не редактируется вручную.

## iOS

Требования на Mac: Node.js 20+, Xcode и CocoaPods.

```bash
npm install
npm run ios:sync
npm run ios:open
```

В Xcode открывается `ios/App/App.xcworkspace`, а не файл `.xcodeproj`. Для реального iPhone в **Signing & Capabilities** должна быть активна команда Apple Developer, у которой есть право создать профиль для `com.wallcov.pulse`.

Приложение запрашивает камеру только после включения режима «Жест»: она нужна для двойного взмаха рукой — бесконтактного старта и паузы. Звук, программы и история хранятся локально на конкретном устройстве. Синхронизация между вебом, iPhone и Android появится после подключения отдельного облачного аккаунта и базы данных.

## Проверка перед выпуском

```bash
npm run ios:sync
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer \
  xcodebuild -workspace ios/App/App.xcworkspace -scheme App \
  -configuration Debug -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' build CODE_SIGNING_ALLOWED=NO
```

Перед TestFlight нужно проверить запуск на реальном iPhone, настроить выпускную подпись, политику конфиденциальности и метаданные App Store. Публикация в App Store выполняется только после явного подтверждения владельца аккаунта.
