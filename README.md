# io

AI nutrition app built with Expo Router, NativeWind, Zustand, and React Query.

## Features

- Apple-only sign-in flow
- AI nutrition scan landing screen
- Scan result summary screen
- Expo Router navigation

## Run

```bash
npm install
npm run web
npm run ios
npm run android
```

## API config

- `src/config/urls.ts` — `API_BASE_URL`, `USER_PATHS` / `USER`, `GET_CONFIG`, `GOOGLE_OAUTH`, `UserRole`
- `src/lib/axios.ts` — axios instance (`withCredentials`, CSRF header)
- `src/apis/user/` — `sign-in.ts`, `logout.ts`, `user-information.ts`, `search-user.ts`
- `src/lib/utils.ts` — `generateNonce`, validators
- `.env.local`: `EXPO_PUBLIC_API_URL` phải trỏ tới `/api/v1` (ví dụ `http://192.168.1.153:2003/api/v1`)

## iOS bundle & Apple Sign In

- **Bundle ID:** `io.ai.nutrition` — cấu hình trong `app.json` (`ios.bundleIdentifier` / `android.package`).
- **Backend:** `APPLE_CLIENT_ID` phải khớp bundle; khi dev bằng Expo Go thêm `host.exp.Exponent` (ví dụ `io.ai.nutrition,host.exp.Exponent`).
- Trên [Apple Developer](https://developer.apple.com): tạo App ID với bundle `io.ai.nutrition`, bật **Sign In with Apple**, rồi build lại native (`npx expo prebuild` hoặc EAS) nếu không dùng Expo Go.

## Notes

- Login supports Google and Apple OAuth.
- The scan flow is currently mocked and ready to be connected to camera and AI services.
