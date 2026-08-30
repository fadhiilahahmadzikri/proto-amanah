# 🚀 FLUTTER STANDALONE WEBGL / THREE.JS ARCHITECTURE BLUEPRINT
> **Master Guide & AI Agent Instruction Prompt**  
> *Arsitektur lengkap untuk menjalankan 3D WebGL / WASM / Canvas di Flutter Android dengan Zero-Cache Live Hot-Reload, Embedded Localhost Server (Bypass CORS), dan Setup Android Emulator tanpa Android Studio.*

---

## 📋 PROMPT UNTUK AI AGENT (Copy & Paste ke AI Anda)

```markdown
Tolong setup sebuah project Flutter standalone yang merender 3D WebGL / Three.js / WASM secara offline menggunakan WebView dengan standar arsitektur profesional berikut:

1. Setup Environment & Tools (Tanpa Android Studio):
   - Gunakan Flutter SDK dan Command-line Tools / Android SDK yang ada di sistem.
   - Buat AVD Android Emulator performa tinggi (RAM 2048MB, Heap 256MB, GPU auto, no-sensor overhead).
   - Setup .vscode/launch.json agar bisa langsung F5 Run & Debug dari VS Code.

2. Atasi Isu Multi-Drive Windows & Gradle:
   - Tambahkan `kotlin.incremental=false` dan `kotlin.compiler.execution.strategy=in-process` di `android/gradle.properties` untuk mencegah error relative path pada drive Windows (C: dan D:).

3. Bypass CORS Android WebView via Embedded Local HTTP Server:
   - Chromium Android memblokir fetch() file GLTF/GLB dan WASM jika dibuka via `file:///android_asset/`.
   - Buat server HTTP lokal zero-dependency menggunakan `HttpServer.bind(InternetAddress.loopbackIPv4, 0)` di `dart:io`.
   - Sajikan semua asset web lokal (HTML, JS, WASM, GLB, PNG) melalui `http://127.0.0.1:<port>/` dengan header `Access-Control-Allow-Origin: *` dan MIME types yang sesuai.

4. Pasang Arsitektur Zero-Cache & Auto Hot-Reload:
   - Override method `reassemble()` di State widget Flutter. Setiap kali Hot Reload / Hot Restart dipicu di VS Code (`r` / `R` / Save), otomatis panggil `clearCache()` dan load URL baru dengan query parameter timestamp `?v=${DateTime.now().millisecondsSinceEpoch}`.
   - Sematkan header HTTP anti-cache: `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`.

5. Layout Minimalis & Zero-Collision:
   - Gunakan `Stack` layar penuh dengan `WebViewWidget` di latar belakang.
   - Letakkan tombol theme toggle di dalam `SafeArea` pojok kanan atas agar tidak tertabrak notch/status bar kamera.
```

---

## 🛠️ SPESIFIKASI TEKNIS & IMPLEMENTASI DETAIL

### 1. `android/gradle.properties` (Fix Multi-Drive Windows Path Bug)
Mencegah error `IllegalArgumentException: this and base files have different roots (C:\... and D:\...)`:

```properties
org.gradle.jvmargs=-Xmx4G -XX:MaxMetaspaceSize=2G -XX:+HeapDumpOnOutOfMemoryError
android.useAndroidX=true
android.newDsl=false
android.builtInKotlin=false
kotlin.incremental=false
kotlin.compiler.execution.strategy=in-process
```

---

### 2. `pubspec.yaml` (Asset Bundling Lengkap)
Pastikan semua subfolder asset terdaftar agar file gambar/3D ikut ter-bundle ke APK:

```yaml
name: flutter_lanyard_app
description: "A standalone 3D WebGL Lanyard Card Flutter application."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: ^3.13.0

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  webview_flutter: ^4.14.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^6.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/web/
    - assets/web/assets/3d/
    - assets/web/assets/images/
    - assets/web/assets/images/doctors/
```

---

### 3. `lib/main.dart` (Master Implementation)
Menggabungkan **Embedded Localhost Server**, **`reassemble()` Hot Reload Hook**, **Anti-Cache Headers**, dan **Minimalist UI**:

```dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF030712),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool isDark = true;

  void toggleTheme(bool dark) {
    setState(() {
      isDark = dark;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '3D WebGL Standalone App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: isDark ? Brightness.dark : Brightness.light,
        scaffoldBackgroundColor: isDark ? const Color(0xFF030712) : const Color(0xFFF8FAFC),
      ),
      home: LanyardCardScreen(isDark: isDark, onToggleTheme: toggleTheme),
    );
  }
}

class LanyardCardScreen extends StatefulWidget {
  final bool isDark;
  final ValueChanged<bool> onToggleTheme;

  const LanyardCardScreen({
    super.key,
    required this.isDark,
    required this.onToggleTheme,
  });

  @override
  State<LanyardCardScreen> createState() => _LanyardCardScreenState();
}

class _LanyardCardScreenState extends State<LanyardCardScreen> {
  WebViewController? _controller;
  HttpServer? _server;
  int? _port;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _startLocalServerAndLoadWebView();
  }

  @override
  void didUpdateWidget(covariant LanyardCardScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.isDark != widget.isDark) {
      final themeStr = widget.isDark ? 'dark' : 'light';
      _controller?.runJavaScript("if (window.setAppTheme) window.setAppTheme('$themeStr');");
    }
  }

  /// Hook dipanggil otomatis oleh Flutter engine setiap kali Hot Reload / Hot Restart dipicu di VS Code
  @override
  void reassemble() {
    super.reassemble();
    _reloadWebView();
  }

  Future<void> _reloadWebView() async {
    if (_controller == null || _port == null) return;
    setState(() {
      _isLoading = true;
    });
    // Hapus seluruh cache Chromium WebView
    await _controller!.clearCache();
    // Load ulang dengan cache-busting timestamp unik agar perubahan file seketika aktif tanpa stale
    final cacheBuster = DateTime.now().millisecondsSinceEpoch;
    final themeStr = widget.isDark ? 'dark' : 'light';
    await _controller!.loadRequest(
      Uri.parse('http://127.0.0.1:$_port/index.html?theme=$themeStr&v=$cacheBuster'),
    );
  }

  Future<void> _startLocalServerAndLoadWebView() async {
    try {
      // Start built-in local offline HTTP server on loopback to bypass Android WebView file:// CORS
      _server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
      _port = _server!.port;

      _server!.listen((HttpRequest request) async {
        final path = (request.uri.path.isEmpty || request.uri.path == '/')
            ? '/index.html'
            : request.uri.path;
        final assetKey = 'assets/web${path.startsWith('/') ? path : '/$path'}';

        try {
          final ByteData data = await rootBundle.load(assetKey);
          final bytes = data.buffer.asUint8List();

          // Set accurate MIME types for Three.js, Rapier WASM, and 3D GLB
          if (path.endsWith('.html')) {
            request.response.headers.contentType = ContentType.html;
          } else if (path.endsWith('.js')) {
            request.response.headers.contentType = ContentType('application', 'javascript', charset: 'utf-8');
          } else if (path.endsWith('.wasm')) {
            request.response.headers.contentType = ContentType('application', 'wasm');
          } else if (path.endsWith('.glb')) {
            request.response.headers.contentType = ContentType('model', 'gltf-binary');
          } else if (path.endsWith('.png')) {
            request.response.headers.contentType = ContentType('image', 'png');
          } else if (path.endsWith('.svg')) {
            request.response.headers.contentType = ContentType('image', 'svg+xml');
          }

          // Anti-Cache Headers: Cegah WebView menyimpan response lama (no-stale architecture)
          request.response.headers.add('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
          request.response.headers.add('Pragma', 'no-cache');
          request.response.headers.add('Expires', '0');
          request.response.headers.add('Access-Control-Allow-Origin', '*');

          request.response.add(bytes);
        } catch (_) {
          request.response.statusCode = HttpStatus.notFound;
          request.response.write('Asset not found: $assetKey');
        }
        await request.response.close();
      });

      final controller = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(Colors.transparent)
        ..setNavigationDelegate(
          NavigationDelegate(
            onPageFinished: (String url) {
              if (mounted) {
                setState(() {
                  _isLoading = false;
                });
                final themeStr = widget.isDark ? 'dark' : 'light';
                _controller?.runJavaScript("if (window.setAppTheme) window.setAppTheme('$themeStr');");
              }
            },
            onWebResourceError: (WebResourceError error) {
              debugPrint('WebView Error: ${error.description}');
            },
          ),
        );

      await controller.clearCache();
      final cacheBuster = DateTime.now().millisecondsSinceEpoch;
      final themeStr = widget.isDark ? 'dark' : 'light';
      await controller.loadRequest(
        Uri.parse('http://127.0.0.1:$_port/index.html?theme=$themeStr&v=$cacheBuster'),
      );

      if (mounted) {
        setState(() {
          _controller = controller;
        });
      }
    } catch (e) {
      debugPrint('Failed to start local server: $e');
    }
  }

  @override
  void dispose() {
    _server?.close(force: true);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = widget.isDark;
    final bgCol = isDark ? const Color(0xFF030712) : const Color(0xFFF8FAFC);

    return Scaffold(
      backgroundColor: bgCol,
      body: Stack(
        children: [
          // 1. Fullscreen 3D Lanyard Canvas
          if (_controller != null)
            Positioned.fill(
              child: WebViewWidget(controller: _controller!),
            ),

          // 2. Simple Minimalist Theme Toggle Button (SafeArea Top Right)
          Positioned(
            top: 0,
            right: 0,
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.only(top: 8, right: 16),
                child: InkWell(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    widget.onToggleTheme(!isDark);
                  },
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                    decoration: BoxDecoration(
                      color: isDark
                          ? const Color(0xFF1E293B).withValues(alpha: 0.8)
                          : Colors.white.withValues(alpha: 0.85),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: isDark
                            ? const Color(0xFF334155)
                            : const Color(0xFFE2E8F0),
                        width: 1,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          isDark ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
                          color: isDark ? const Color(0xFFFBBF24) : const Color(0xFF0284C7),
                          size: 16,
                        ),
                        const SizedBox(width: 5),
                        Text(
                          isDark ? 'Light' : 'Dark',
                          style: TextStyle(
                            color: isDark ? Colors.white : const Color(0xFF0F172A),
                            fontWeight: FontWeight.w700,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // 3. Clean Loading Indicator Overlay
          if (_isLoading)
            Container(
              color: bgCol,
              child: const Center(
                child: CircularProgressIndicator(
                  color: Color(0xFF00D4FF),
                  strokeWidth: 3,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
```

---

### 4. `.vscode/launch.json` (Konfigurasi 1-Click F5 VS Code)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Flutter: 3D Lanyard App",
      "cwd": "flutter_lanyard_app",
      "request": "launch",
      "type": "dart",
      "program": "flutter_lanyard_app/lib/main.dart"
    }
  ]
}
```

---

### 5. `config.ini` Emulator AVD (Optimasi Bebas Freeze)
Lokasi: `~/.android/avd/<NamaAVD>.avd/config.ini`

```ini
hw.ramSize=2048
vm.heapSize=256
hw.cpu.ncore=4
hw.gpu.enabled=yes
hw.gpu.mode=auto
hw.accelerometer=no
hw.gps=no
fastboot.forceFastBoot=yes
```

---

## 🎯 RINGKASAN VALUE

| Fitur | Manfaat |
| :--- | :--- |
| **Bypass CORS** | Model 3D `.glb` & WASM termuat 100% tanpa server eksternal / internet. |
| **Auto Hot Reload (`reassemble`)** | Edit file langsung ngefek ke WebView tanpa perlu relaunch aplikasi. |
| **Anti-Stale Cache-Buster** | Chromium tidak pernah menampilkan asset lama. |
| **No Android Studio Needed** | Setup bersih via CLI & VS Code, hemat penyimpanan disk puluhan GB. |
| **Zero UI Collision** | Antarmuka adaptif terhadap semua rasio layar HP dan notch kamera. |
