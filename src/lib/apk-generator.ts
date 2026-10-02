import JSZip from 'jszip';
import { downloadBlob } from './pdf';

export interface ApkConfig {
  appName: string;
  appId: string;
  versionName: string;
  versionCode: number;
  themeColor: string;
  appUrl: string;
}

export const DEFAULT_APK_CONFIG: ApkConfig = {
  appName: 'ColorNote',
  appId: 'com.colornote.app',
  versionName: '2.4.0',
  versionCode: 24,
  themeColor: '#4f46e5',
  appUrl: window.location.origin,
};

export async function generateAndroidStudioProjectZip(config: ApkConfig = DEFAULT_APK_CONFIG): Promise<Blob> {
  const zip = new JSZip();

  // Root build.gradle
  zip.file(
    'build.gradle',
    `// Top-level build file for ColorNote Android APK
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`
  );

  // settings.gradle
  zip.file(
    'settings.gradle',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "${config.appName}"
include ':app'
`
  );

  // gradle.properties
  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
`
  );

  // app/build.gradle
  zip.file(
    'app/build.gradle',
    `plugins {
    id 'com.android.application'
}

android {
    namespace '${config.appId}'
    compileSdk 34

    defaultConfig {
        applicationId "${config.appId}"
        minSdk 24
        targetSdk 34
        versionCode ${config.versionCode}
        versionName "${config.versionName}"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables.useSupportLibrary = true
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            applicationIdSuffix ".debug"
            debuggable true
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.webkit:webkit:1.10.0'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
}
`
  );

  // AndroidManifest.xml
  zip.file(
    'app/src/main/AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.appId}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${config.appName}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:theme="@style/Theme.ColorNote">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`
  );

  // MainActivity.java
  const packagePath = config.appId.replace(/\./g, '/');
  zip.file(
    `app/src/main/java/${packagePath}/MainActivity.java`,
    `package ${config.appId};

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private static final String APP_URL = "${config.appUrl}";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri.getHost() != null && uri.toString().startsWith(APP_URL)) {
                    return false;
                }
                Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                startActivity(intent);
                return true;
            }
        });

        // Load the ColorNote app
        if (savedInstanceState == null) {
            webView.loadUrl(APP_URL);
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK) && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
`
  );

  // Resources
  zip.file(
    'app/src/main/res/values/strings.xml',
    `<resources>
    <string name="app_name">${config.appName}</string>
</resources>
`
  );

  zip.file(
    'app/src/main/res/values/colors.xml',
    `<resources>
    <color name="primary">${config.themeColor}</color>
    <color name="primary_dark">#3730a3</color>
    <color name="colorAccent">#6366f1</color>
    <color name="background">#ffffff</color>
</resources>
`
  );

  zip.file(
    'app/src/main/res/values/styles.xml',
    `<resources>
    <style name="Theme.ColorNote" parent="Theme.MaterialComponents.Light.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryDark">@color/primary_dark</item>
        <item name="colorAccent">@color/colorAccent</item>
        <item name="android:windowBackground">@color/background</item>
    </style>
</resources>
`
  );

  // Capacitor config
  zip.file(
    'capacitor.config.json',
    JSON.stringify(
      {
        appId: config.appId,
        appName: config.appName,
        webDir: 'dist',
        bundledWebRuntime: false,
        server: {
          url: config.appUrl,
          cleartext: true,
        },
        android: {
          allowMixedContent: true,
        },
      },
      null,
      2
    )
  );

  // Bubblewrap twa-manifest.json
  zip.file(
    'twa-manifest.json',
    JSON.stringify(
      {
        packageId: config.appId,
        host: new URL(config.appUrl).host,
        name: config.appName,
        launcherName: config.appName,
        themeColor: config.themeColor,
        navigationColor: config.themeColor,
        backgroundColor: '#ffffff',
        startUrl: '/',
        iconUrl: `${config.appUrl}/pwa-512x512.png`,
        maskableIconUrl: `${config.appUrl}/pwa-maskable-512x512.png`,
        appVersionName: config.versionName,
        appVersionCode: config.versionCode,
        signingKey: {
          path: './android.keystore',
          alias: 'android',
        },
      },
      null,
      2
    )
  );

  // Comprehensive README instructions
  zip.file(
    'README_BUILD_APK.md',
    `# How to Build ColorNote APK from this Project

This zip contains the complete Android source code configured for **${config.appName}** (\`${config.appId}\`).

---

### Option 1: 1-Command Build with Gradle (Fastest)

Prerequisites: Android SDK or Java JDK 17+.

\`\`\`bash
# 1. Unzip the project and enter directory:
cd ColorNote-Android-Project

# 2. Build Debug APK:
./gradlew assembleDebug

# Your ready-to-install APK will be at:
# app/build/outputs/apk/debug/app-debug.apk
\`\`\`

You can directly transfer \`app-debug.apk\` to your Android phone and tap to install!

---

### Option 2: Open in Android Studio

1. Open **Android Studio**
2. Click **Open an existing Project**
3. Select this unzipped folder
4. Let Gradle sync for 10-20 seconds
5. Go to menu: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
6. Click the **locate** popup link to get your \`app-debug.apk\`!

---

### Option 3: Build with Google's Bubblewrap CLI (Official TWA APK)

\`\`\`bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest="${config.appUrl}/manifest.webmanifest"
bubblewrap build
\`\`\`

---

### Option 4: Direct WebAPK Install on Android (Zero Compilation)

1. Open ${config.appUrl} in Google Chrome or Samsung Internet on your phone.
2. Tap the **Install APK** button in the app or the 3-dots browser menu > **Install app**.
3. Android creates an official WebAPK on your device home screen and app drawer!
`
  );

  return zip.generateAsync({ type: 'blob' });
}

export async function downloadAndroidStudioProjectZip(config: ApkConfig = DEFAULT_APK_CONFIG) {
  const blob = await generateAndroidStudioProjectZip(config);
  downloadBlob(blob, `ColorNote-Android-APK-Project-v${config.versionName}.zip`);
}
