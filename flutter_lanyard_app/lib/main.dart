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
      title: 'RS Amanah - 3D Doctor ID Card',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: isDark ? Brightness.dark : Brightness.light,
        scaffoldBackgroundColor: isDark
            ? const Color(0xFF030712)
            : const Color(0xFFF8FAFC),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00D4FF),
          brightness: isDark ? Brightness.dark : Brightness.light,
        ),
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
      _controller?.runJavaScript(
        "if (window.setAppTheme) window.setAppTheme('$themeStr');",
      );
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
      Uri.parse(
        'http://127.0.0.1:$_port/index.html?theme=$themeStr&v=$cacheBuster',
      ),
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
            request.response.headers.contentType = ContentType(
              'application',
              'javascript',
              charset: 'utf-8',
            );
          } else if (path.endsWith('.wasm')) {
            request.response.headers.contentType = ContentType(
              'application',
              'wasm',
            );
          } else if (path.endsWith('.glb')) {
            request.response.headers.contentType = ContentType(
              'model',
              'gltf-binary',
            );
          } else if (path.endsWith('.png')) {
            request.response.headers.contentType = ContentType('image', 'png');
          } else if (path.endsWith('.svg')) {
            request.response.headers.contentType = ContentType(
              'image',
              'svg+xml',
            );
          }

          // Anti-Cache Headers: Cegah WebView menyimpan response lama (no-stale architecture)
          request.response.headers.add(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, max-age=0',
          );
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
                _controller?.runJavaScript(
                  "if (window.setAppTheme) window.setAppTheme('$themeStr');",
                );
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
        Uri.parse(
          'http://127.0.0.1:$_port/index.html?theme=$themeStr&v=$cacheBuster',
        ),
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
                    final nextDark = !isDark;
                    widget.onToggleTheme(nextDark);
                    final themeStr = nextDark ? 'dark' : 'light';
                    _controller?.runJavaScript(
                      "if (window.setAppTheme) window.setAppTheme('$themeStr');",
                    );
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
