# FTC Scout (Firebase Firestore, GitHub Pages из /docs)

Сайт целиком в `docs/`, сборка и Node.js не нужны.

1. В `docs/js/firebase.js` замените `ВСТАВЬТЕ_apiKey_ИЗ_КОНСОЛИ` на apiKey из Firebase Console (Project settings → Your apps).
2. Firestore → Rules → вставьте и Publish:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /sessions/{s} {
      allow read, write: if true;
      match /teams/{t} { allow read, write: if true; }
    }
  }
}
```
3. GitHub: Settings → Pages → Deploy from a branch → main → /docs.
