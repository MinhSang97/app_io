# Fix Flow Plan — app_io × scan_service × ai_service

## Vấn đề tổng quan

### Flow hiện tại (sai)

```
scan.tsx
  └─► createScan() POST /scans
          └─► navigate /result?id   ← NGAY LẬP TỨC
                  └─► getScan(id)   ← scan vẫn status: "pending"
                          └─► analysis = null ❌ crash / màn trắng
```

### Flow đúng

```
scan.tsx
  └─► createScan() POST /scans → nhận scanId
          └─► navigate /processing?id=scanId

processing.tsx
  └─► connect SSE GET /api/v1/analyzer?scan_id=xxx
          ├─► event "progress" → update progress bar UI
          ├─► event "text_chunk" → stream text (optional)
          ├─► event "result" → navigate /result?id=scanId ✅
          └─► event "error"  → Alert + back về /scan

result.tsx
  └─► getScan(id) → analysis đã completed ✅
```

---

## Phase 1 — Fix Interface & URL

**Ưu tiên: cao | Effort: ~30 phút**

### 1.1 Sửa `src/interfaces/scan.ts`

> **Backend đã được cập nhật** để trả về `fiber`:
> - `ai_service/app/domain/entity/scan_prompt.go` — thêm `fiber` vào JSON Schema prompt
> - `ai_service/app/interface/api/presenter/analyzer.go` — thêm `Fiber float64` vào `ResultData`
> - `ai_service/app/usecases/dto/analyzer.go` — thêm `Fiber float64` vào `AnalyzeImageResponse`
> - `ai_service/app/usecases/analyze_image.go` — map `result.Fiber` vào response

```ts
// TRƯỚC (thiếu grade, suggestions)
export type ScanAnalysis = {
  meal_name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

// SAU (đầy đủ, khớp với backend)
export type ScanAnalysis = {
  meal_name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;           // ✅ giữ nguyên (backend đã có)
  grade: string;           // ✅ thêm
  suggestions: string[];   // ✅ thêm
};

export type ScanStatus = 'pending' | 'completed' | 'failed';

export type Scan = {
  id: string;
  image_urls: string[];
  analysis: ScanAnalysis | null;   // ✅ nullable khi status: pending
  status: ScanStatus;              // ✅ thêm
  created_at: string;
};
```

### 1.2 Thêm AI service URL vào `src/config/urls.ts`

```ts
const aiBase = process.env.EXPO_PUBLIC_AI_URL?.trim();

export const AI_PATHS = {
  ANALYZE_SSE: '/api/v1/analyzer',
} as const;

export const AI_BASE_URL = aiBase ?? '';
```

### 1.3 Thêm env variable

Thêm vào `.env` và `.env.example`:

```env
EXPO_PUBLIC_AI_URL=http://192.168.x.x:PORT
```

---

## Phase 2 — Tạo SSE Hook

**Ưu tiên: cao | Effort: ~2 giờ**

> **Note:** React Native không hỗ trợ `EventSource` native.  
> Dùng `fetch` với `ReadableStream` + manual SSE parsing, hoặc package `react-native-event-source`.

### 2.1 Tạo `src/hooks/use-scan-sse.ts`

```ts
export type SSEProgressEvent = {
  percent: number;
  status: string;
  message: string;
};

export type SSEResultEvent = {
  meal_name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  grade: string;
  suggestions: string[];
};

export type SSEState = {
  progress: SSEProgressEvent | null;
  result: SSEResultEvent | null;
  error: string | null;
  isConnected: boolean;
};

// Usage:
// const { progress, result, error, isConnected } = useScanSSE(scanId);
export function useScanSSE(scanId: string | null): SSEState
```

**Logic bên trong:**

```
connect(scanId)
  │
  ├─► parse line by line (SSE format: "event: <type>\ndata: <json>\n\n")
  │
  ├─► on "progress"    → setState({ progress })
  ├─► on "text_chunk"  → (optional) accumulate text
  ├─► on "result"      → setState({ result }), disconnect
  ├─► on "error"       → setState({ error }), disconnect
  └─► on stream close  → cleanup
```

---

## Phase 3 — Tạo màn hình `/processing.tsx`

**Ưu tiên: cao | Effort: ~1 giờ**

Màn hình trung gian hiển thị progress SSE, thay thế `ActivityIndicator` đơn giản hiện tại.

### UI

```
┌─────────────────────────────┐
│                             │
│   🍜  Đang phân tích...    │
│                             │
│   ████████████░░░  70%      │
│                             │
│   Processing...             │
│   AI is generating your     │
│   nutritional insights...   │
│                             │
└─────────────────────────────┘
```

### Logic

```ts
export default function ProcessingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { progress, result, error } = useScanSSE(id);

  // Khi có result → navigate /result
  useEffect(() => {
    if (result) {
      router.replace({ pathname: '/result', params: { id } });
    }
  }, [result]);

  // Khi có error → Alert + back
  useEffect(() => {
    if (error) {
      Alert.alert('Phân tích thất bại', error, [
        { text: 'Thử lại', onPress: () => router.replace('/scan') },
      ]);
    }
  }, [error]);

  // Render progress bar + message từ SSE
}
```

---

## Phase 4 — Refactor `scan.tsx`

**Ưu tiên: cao | Effort: ~30 phút**

### Thay đổi `handleProcessScan`

```ts
// TRƯỚC
const res = await createScan(params);
if (res.success && res.data?.data?.id) {
  router.push({ pathname: '/result', params: { id: res.data.data.id } });
}

// SAU
const res = await createScan(params);
if (res.success && res.data?.data?.id) {
  router.push({ pathname: '/processing', params: { id: res.data.data.id } });
}
```

Bỏ `isScanning` modal (ActivityIndicator) vì UI loading đã chuyển sang `/processing.tsx`.

---

## Phase 5 — Fix `result.tsx`

**Ưu tiên: trung bình | Effort: ~1 giờ**

### 5.1 Giữ fiber, thêm grade + suggestions

```ts
// Giữ nguyên (backend đã có fiber)
{ label: locale.result.fiber, value: `${scan.analysis.fiber} g`, icon: Sprout }

// Thêm grade
{ label: locale.result.grade, value: scan.analysis.grade }

// Thêm suggestions section
{scan.analysis.suggestions.map((suggestion, index) => (
  <Text key={index}>• {suggestion}</Text>
))}
```

### 5.2 Guard cho `analysis = null`

```ts
// Khi status: "pending" (user vào từ history khi scan chưa xong)
if (!scan.analysis) {
  return <Text>Đang xử lý, vui lòng thử lại sau...</Text>;
}
```

---

## Phase 6 — Polling Fallback (Safety Net)

**Ưu tiên: thấp | Effort: ~30 phút**

Nếu SSE mất kết nối giữa chừng (network flaky), result screen tự poll `getScan` cho đến khi có data.

```ts
// Trong result.tsx
useEffect(() => {
  if (!scan || scan.status !== 'pending') return;

  const interval = setInterval(async () => {
    const res = await getScan(id);
    if (res.success && res.data?.data?.status !== 'pending') {
      setScan(res.data.data);
      clearInterval(interval);
    }
  }, 3000); // poll mỗi 3 giây

  // Timeout sau 60s
  const timeout = setTimeout(() => clearInterval(interval), 60_000);

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
  };
}, [scan?.status]);
```

---

## Thứ tự implement

| # | Phase | File | Effort |
|---|---|---|---|
| 1 | Fix interface + URL + env | `src/interfaces/scan.ts`, `src/config/urls.ts`, `.env` | 30 phút |
| 2 | SSE hook | `src/hooks/use-scan-sse.ts` | 2 giờ |
| 3 | Processing screen | `app/processing.tsx` | 1 giờ |
| 4 | Refactor scan screen | `app/scan.tsx` | 30 phút |
| 5 | Fix result screen | `app/result.tsx` | 1 giờ |
| 6 | Polling fallback | `app/result.tsx` | 30 phút |

**Tổng: ~5.5 giờ**

---

## Checklist

- [x] Backend `ai_service` thêm `fiber` vào prompt, `ResultData`, `AnalyzeImageResponse`, `analyze_image.go`
- [x] `ScanAnalysis` thêm `grade` + `suggestions` (giữ `fiber`)
- [x] `Scan` thêm `status: ScanStatus` + `analysis: ScanAnalysis | null`
- [x] Thêm `EXPO_PUBLIC_AI_URL` vào `.env.local`
- [x] Thêm `AI_BASE_URL` + `AI_PATHS` vào `src/config/urls.ts`
- [x] Thêm localization keys `grade`, `suggestions`, `processing.*` cho tất cả ngôn ngữ
- [x] Tạo `src/hooks/use-scan-sse.ts`
- [x] Tạo `app/processing.tsx`
- [x] `scan.tsx` navigate sang `/processing` thay vì `/result`
- [x] `result.tsx` thêm `grade` + `suggestions` section
- [x] `result.tsx` guard khi `analysis = null` / `status === 'pending'`
- [x] Polling fallback trong `result.tsx` (3s interval, 60s timeout)
- [x] AI service dùng cùng API gateway → `AI_BASE_URL = API_BASE_URL`, bỏ `EXPO_PUBLIC_AI_URL`
- [x] SSE URL: `http://192.168.1.153/api/v1/analyzer?scan_id=xxx`
- [ ] Test end-to-end: scan → processing → result
