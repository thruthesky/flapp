# Flutter Multi Apps

* 플러터의 monorepo 기능을 쉽게 도와준다.

## TODO


* Anndroid app store key 및 자동 sign
  * 참고: https://flutter.dev/docs/deployment/android#reference-the-keystore-from-the-app
* 앱 변경시,
  * default.app-icon.png 와 같이 하고 flutter icon 자동 생성. 또는 pubspec 을 바탕으로 자동 생성.
  * Android 의 경우, res/splash/ 폴더의 것을 android 폴더로 복사. Splash screen 을 자동으로 저장.


## 플러터의 Monorepo 한계점

* 플러터의 monorepo 한계가 있다.
  * Flavors 로 많은 것을 할 수 있지만,
    * pubspec.yaml 분리
    * assets 분리
    * 소스 파일을 분리

    등이 Flavors 로는 해결이 안된다.

* 예를 들어, Flavors 에서 지원하지 않는 부분을 프로그램을 개발하여 자동을로 설정 변경을 한다고 해도,
  * App - A 가 launch 패키지를 쓰고
  * App - B 가 launch 패키지를 쓰지 않느다면,
  * A 와 B 의 소스 코드는 동일한 프로젝트에 존재하고, B 를 컴파일 할 때,
    * B 의 pubspec.yaml 을 사용하게 되는데, B 는 launch 패키지를 쓰지 않으므로, launch 패키지를 설치하지 않는다.
    * 하지만 A 에서는 필요하므로, A 의 소스코드에서 에러가 난다.
    * 즉, B 소스를 컴파일 할 수 없는 것이다.

* 그래서 A 와 B 모두 동일한 패키지를 쓰며, 거의 동일한 코드에서 UI 만 바꾸어서 앱을 만드는 경우를 (현재로서는) 목표로 하고 있다.


## 사용법

* 설치
  * `# npm i -g flapp` 와 같이 global 영역에 설치한다.

* Flutter 프로젝트 폴더에 설정 파일 생성
  * `flapp.json` 파일을 생성하고 설정한다.

* `--path` 플러터 프로젝트 경로. 생략되면 현재 폴더를 플러터 프로젝트 경로로 인식
  * 예)
    * flapp --path ~/tmp/fluttercms --app korea_flutter_community
* `--app` 앱 폴더 이름
  * 기본 앱은 `lib/apps/default/res` 에 정보가 위치하도록 한다.
  * 앱 이름은 하이픈(-) 대신 언더바(_)를 사용한다.
  * 예)
    * flapp --app default
    * flapp --app my_app


### 설정

* 설정 파일의 이름은 `flaap.json` 이며, Flutter 프로젝트 폴더에 존재해야 한다.

예제)
``` json
{
    "apps": {
        "default": {
            "AppId": "com.sonub.fluttercms",
        },
        "korea_flutter_community": {
            "AppId": "com.sonub.koreafluttercommunity"
        }
    },
    "MainActivity": "android/app/src/main/kotlin/com/example/fluttercms/MainActivity.kt"
}
```

* "apps" 하위에 각 앱 설정을 한다.
  * "AppId" 는 Android 의 package name 이며, iOS 의 Bundle ID 이다.

* MainActivity 에는 MainActivity.kt 경로를 적어준다.
  * 예) "android/app/src/main/kotlin/com/example/fluttercms/MainActivity.kt"


* 파일 Hard link
  * 각 앱 폴더에 있는 파일을 플러터 프로젝트의 특정 위치로 hard link 를 한다.
  * 예를 들면, Info.plist 나 google-service.json 이나 GoogleServie-Info.plsit 와 같은 파일을 어느 위치로 link 를 하라고 지시하는 것이다.
    * 이렇게 하면, 보다 편리하게 앱 소스 관리를 할 수 있다.
    * 예를 들어, 카카오톡 로그인을 경우, 앱 마다 client id 가 모두 틀리다. 그래서 각 앱 마다 설정이 달라야 한다.
    * 이 때, 설정 파일을 `lib/settings.dart` 로 해 놓고 사용하는데,
      * 각 앱에서 `lib/apps/APP_NAME/APP_NAME.settings.dart` 를 `lib/settings.dart` 로 링크해서 쓰도록 하면 된다.
  * 예) flapp.config.json

``` dart
{
    "apps": {
        "default": {
            "AppId": "com.sonub.fluttercms",
            "files": {
                "lib/apps/default/res/default.pubspec.yaml": "pubspec.yaml",
                "lib/apps/default/res/default.Info.plist": "ios/Runner/Info.plist",
                "lib/apps/default/res/default.GoogleService-Info.plist": "ios/Runner/GoogleService-Info.plist",
                "lib/apps/default/res/default.google-services.json": "android/app/google-service.json",
                "lib/apps/default/res/default.key.properties": "android/key.properties",
                "lib/apps/default/default.settings.dart": "lib/settings.dart"
            },
            "folders": {
                "lib/apps/default/res/splash-images": "android/app/src/main/res"
            }
        },
        "korea_flutter_community": {
            "AppId": "com.sonub.koreafluttercommunity",
            "files": {
                "lib/apps/korea_flutter_community/res/korea_flutter_community.pubspec.yaml": "pubspec.yaml",
                "lib/apps/korea_flutter_community/res/korea_flutter_community.Info.plist": "ios/Runner/Info.plist",
                "lib/apps/korea_flutter_community/res/korea_flutter_community.GoogleService-Info.plist": "ios/Runner/GoogleService-Info.plist",
                "lib/apps/korea_flutter_community/res/korea_flutter_community.google-services.json": "android/app/google-service.json",
                "lib/apps/korea_flutter_community/res/korea_flutter_community.key.properties": "android/key.properties",
                "lib/apps/korea_flutter_community/korea_flutter_community.settings.dart": "lib/settings.dart"
            },
            "folders": {
                "lib/apps/korea_flutter_community/res/splash-images": "android/app/src/main/res"
            }
        }
    },
    "MainActivity": "android/app/src/main/kotlin/com/example/fluttercms/MainActivity.kt"
}
```

      와 같이 복사 할 위치를 적어준다.

  * 참고로 `main.dart` 는 `-t` 옵션으로 지정하므로, hard link 를 할 필요가 없다.

  * 이렇게 하면 앱 별로 쓰는 파일과 안쓰는 파일을 구분 할 수 있다.

* 폴더 복사
  * 폴더는 hard link 가 안되고 복사만 된다.
  * "folders": { ... } 로 복사 할 소스 폴더와 저장할 대상 폴더를 지정하면 된다.
  * 예를 들면, 각 앱 마다 Android Splash Images 를 다르게 작성해야하는데, 앱 폴더 별로 저장해 놓고, 복사를 할 수 있다.



## 하는 일

### 공통

* 각 앱의 pubspec.yaml 를 프로젝트 루트 폴더의 pubspec.yaml 로 hard link
* 

### Android 에서 하는 일

* main, debug, profile 의 AppMainifest.xml 에서 package 를 패치
* build.gradle 에서 ApplicationId 를 패치
* MainActivity.kt 에서 package 패치
* google-service.josn 을 hard link
* lib/apps/APP_NAME/res/[APP_NAME].key.properties 파일을 android 폴더로 hard link


### iOS 에서 하는 일

* 각 앱의 Info.plist 를 ios/Runnder 폴더로 hard link
* 각 앱의 GoogleService-Info.plist 를 ios/Runner 폴더로 hard link



## 수동으로 해야 하는 것

* Xcode 에서 Bundle ID 지정
* Xcode 에서 기타 설정. 예) URL Scheme 등. 참고로 URL Scheme 은 Info.plist 에 저장되는데,
  Info.plist 에 저장되는 정보는 Info.plist 가 분리되어져 있기 때문에 괜찮다.
* Splash screen
* Signing
* Publishing
  





## 개발자 노트

### 실행

```
nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts --path ~/tmp/fluttercms --app korea_flutter_community
```

### 배포

* npm run build
* npm publish



## 알려진 문제점

* 앱을 변경하면, VSCode 에서 파일을 자동으로 로드를하지 못한다.
  * 이 때, 해당 파일을 닫고 다시 열면, 파일이 바뀌어져 있는데,
  * 앱을 변경하고, VSCode 를 종료하고 다시 오픈한다.
    * Xcode 도 마찬가지로, 종료하고 다시 오픈한다.