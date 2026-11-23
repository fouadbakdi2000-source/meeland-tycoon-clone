# ميلاند تايكون — لعبة تايكون للحيوانات الأليفة (Idle Pet Tycoon)

لعبة ويب من نوع **تايكو خامل (Idle Tycoon)** مستوحاة من [meeland.io](https://meeland.io)، تُلعب مباشرة في المتصفح دون تنصيب.

## كيف تلعب
1. اضغط على زر **"ابدأ اللعب"** لفتح اللعبة.
2. اشتري حيوانات من المتجر (قطط، كلاب، أرانب، ثعالب، تنانين).
3. كل حيوان置 على المنصة يحقق لك دخلاً سلبياً في الثانية.
4. اضغط على "منطقة التجميع السريع" أو على الحيوانات لتحقيق مكافآت فورية.
5.طوّر حيواناتك وقاعدتك باستخدام التطويرات في المتجر.

## المميزات
- واجهة متجاوبة تعمل على الجوال والحاسب
- حفظ تلقائي للتقدم في متصفحك (localStorage)
- حيوانات بمستويات مختلفة ومضاعفات دخل
- تطويرات عامة (ضغط أقوى، مضاعف الدخل)

## النشر على GitHub Pages
هذا المشروع جاهز للرفع على GitHub وتفعيل GitHub Pages لمشاركة اللعبة على الويب:

```bash
git init
git add .
git commit -m "Initial commit: Meeland clone idle pet tycoon"
git branch -M main
git remote add origin https://github.com/<مستخدمك>/<المستودع>.git
git push -u origin main
```
ثم اذهب إلى **Settings → Pages** في المستودع واختر الفرع `main` ومجلد `/root`، وسيصبح لعبتك متاحاً على `https://<مستخدمك>.github.io/<المستودع>/`.

## تحويل إلى تطبيق أندرويد (APK)
اللعبة مكتوبة بلغة HTML/CSS/JavaScript خالية من الاعتماديات، لذا يمكن تحويلها إلى APK بطرق عدة:

### الطريقة 1: WebView (أبسط)
أنشئ تطبيق أندرويد بسيط يحتوي على `WebView` يحمل `index.html` من ملفات الأصول أو من رابط GitHub Pages.

### الطريقة 2: Cordova / Capacitor
```bash
npm install -g cordova
cordova create meeland-app com.example.meeland "Meeland Tycoon"
cd meeland-app
cordova platform add android
# انسخ ملفات اللعبة إلى www/
cordova build android
```

### الطريقة 3: PWA
أضف ملف `manifest.json` و `service-worker.js` لتثبيت اللعبة كتطبيق ويب تقدمي على الجوال.

## ملفات المشروع
- `index.html` — واجهة اللعبة
- `style.css` — الأنماط والتصميم
- `game.js` — منطق اللعبة (المتجر، الدخل، التطويرات، الحفظ)
- `README.md` — هذا الملف

---

صُنع للمشاركة والتعلم. استمتع بالبناء!