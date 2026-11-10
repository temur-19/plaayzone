# PlayZone mobil ilovasi

Android uchun Expo va React Native ilovasi. Ilova PlayZone Django backendiga internet orqali ulanadi.

## Ishga tushirish

1. `application` papkasida `.env.example` faylidan `.env` nusxa oling.
2. `EXPO_PUBLIC_API_URL` qiymatini backend manziliga moslang.
3. Shu papkada `npm install` va so‘ng `npx expo start` bajaring.
4. Android emulatorda `a` tugmasini bosing yoki telefondagi Expo Go ilovasi bilan QR-kodni skaner qiling.

Android emulyatori uchun `http://10.0.2.2:8000` kompyuterdagi `localhost:8000` manziliga yo‘naltiriladi. Haqiqiy telefonda `localhost` ishlamaydi: kompyuter va telefon bir Wi-Fi tarmog‘ida bo‘lsin, backendni `python manage.py runserver 0.0.0.0:8000` bilan ishga tushiring va `.env` ichida kompyuterning lokal IP manzilini ko‘rsating. Masalan, `http://192.168.1.20:8000`.

Ommaviy maskanlar `/head/api/locations/` dan, kirish esa `/login/` dan olinadi. Ilova Android Studio talab qilmaydi; VS Code va Expo Go bilan ishlab chiqish mumkin. Android emulyatori yoki yakuniy APK/AAB yig‘ish uchun Android SDK vositalari kerak bo‘lishi mumkin. Expo usulida emulyator o‘rniga jismoniy Android telefonda ham sinash mumkin.

`EXPO_PUBLIC_API_URL` ilova ichida ko‘rinadigan qiymat bo‘ladi; unga parol yoki maxfiy kalit kiritmang. Haqiqiy serverga chiqarishda HTTPS manzilidan foydalaning.

## Telefonga o‘rnatiladigan APK yig‘ish

APK yig‘ish uchun Expo hisobiga kiring va ilova papkasida `npm run build:apk` buyrug‘ini bajaring. Birinchi marta EAS loyihani sozlash va Android signing key yaratishni taklif qiladi. Build tugagach, Expo build sahifasidagi APK havolasini telefonda ochib, faylni o‘rnating.

APK ichida oldindan backend manzili shart emas. Ilovani ochganda `Server` tugmasini bosing, joriy backend URL’ini kiriting va saqlang. Keyingi safar ham manzil telefonda saqlanadi; URL o‘zgarsa shu joyda yangilang, APK’ni qayta yig‘ish shart emas. Internetdagi server uchun HTTPS manzilidan foydalaning; `localhost` va emulyator manzili haqiqiy telefonda ishlamaydi. `eas.json` ichidagi build profile `android.buildType: "apk"` qilib sozlangan.
