# Flutter Multi Apps

* 플러터의 monorepo 기능을 쉽게 도와준다.

## TODO

* 설정
  * google-service.json 이나 GoogleServie-Info.plsit 와 같은 추가 파일을 어느 위치로 복사를 하라는 설정을 둔다.
  * 예)
    * flapp.config.json
      * { "files": [{ "gogole-service.json": "android/app/google-service.json"}, {"GoogleService-Info.plist": "..." }] }

      와 같이 복사 할 위치를 적어준다.

  * 어떤 앱에서는 google-service.json 을 안 쓸 수도 있다.

* Anndroid app store key 및 자동 sign
* 앱 변경시, flutter icon 자동 생성
* Android 의 경우, Splash screen 을 자동으로 저장.


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

* 그래서 A 와 B 모두 동일한 패키지를 쓰며, 거의 동일한 코드에서 UI 만 바꾸어서 앱을 만드는 경우에 유용 하다고 할 수 있다.


## 사용법

* 설치
  * `# npm i -g flapp` 와 같이 global 영역에 설치한다.

* Flutter 프로젝트 폴더에 설정 파일 생성
  * `flapp.json` 파일을 생성하고 설정한다.

* `--path` 플러터 프로젝트 경로. 생략되면 현재 폴더를 플러터 프로젝트 경로로 인식
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


## 하는 일

### 공통

* 각 앱의 pubspec.yaml 를 프로젝트 루트 폴더의 pubspec.yaml 로 hard link
* 

### Android 에서 하는 일

* main, debug, profile 의 AppMainifest.xml 에서 package 를 패치
* build.gradle 에서 ApplicationId 를 패치
* MainActivity.kt 에서 package 패치
* google-service.josn 을 hard link


### iOS 에서 하는 일

* 각 앱의 Info.plist 를 ios/Runnder 폴더로 hard link
* 각 앱의 GoogleService-Info.plist 를 ios/Runner 폴더로 hard link



## 수동으로 해야 하는 것

* Xcode 에서 Bundle ID 지정
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


