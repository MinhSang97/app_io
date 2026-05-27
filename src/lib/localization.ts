import type { CountryCode } from '../interfaces/auth';
import { COUNTRY_OPTIONS } from '../constants/countries';

export { COUNTRY_OPTIONS };

type Dictionary = {
  login: {
    welcome: string;
    title: string;
    description: string;
    appleUnavailableTitle: string;
    appleUnavailableMessage: string;
    googleButton: string;
    or: string;
    loginFailedTitle: string;
    loginFailedMessage: string;
    footer: string;
    countryLabel: string;
    countryOptions: Record<CountryCode, string>;
    benefits: Array<{ title: string; description: string }>;
  };
  permissions: {
    badge: string;
    title: string;
    checking: string;
    granted: string;
    needPermission: string;
    blocked: string;
    camera: string;
    cameraDesc: string;
    photo: string;
    photoDesc: string;
    grantButton: string;
    openSettings: string;
    logout: string;
    notAvailable: string;
  };
  scan?: {
    appSubtitle: string;
    title: string;
    description: string;
    uploadTitle: string;
    uploadDesc: string;
    cameraReady: string;
    cameraDesc: string;
    capture: string;
    close: string;
    savePhotoTitle: string;
    savePhotoDesc: string;
    yesSave: string;
    noDiscard: string;
    imageSelected: string;
    imagesSelected: string;
    change: string;
    process: string;
    scan: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    info?: string;
    logout?: string;
  };
  result?: {
    scanComplete: string;
    title: string;
    description: string;
    aiInsight: string;
    scanAnother: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    backToHistory: string;
  };
  infoPage?: {
    title: string;
    fullName: string;
    email: string;
    appleID: string;
    region: string;
    appVersion: string;
  };
  settingsPage?: {
    title: string;
    themeSection: string;
    light: string;
    dark: string;
    system: string;
    languageSection: string;
    healthSyncSection?: string;
    healthSyncButton?: string;
    healthSyncing?: string;
  };
  historyPage?: {
    title: string;
    noHistory: string;
    scanNew: string;
    searchPlaceholder: string;
  };
};

const countryNames: Record<CountryCode, string> = {
  vn: 'Việt Nam',
  us: 'United States',
  gb: 'United Kingdom',
  jp: '日本',
  kr: '대한민국',
  cn: '中国',
  fr: 'France',
  de: 'Deutschland',
  es: 'España',
  pt: 'Portugal',
  id: 'Indonesia',
  th: 'ประเทศไทย',
};

const dictionaries: Record<CountryCode, Dictionary> = {
  vn: {
    login: {
      welcome: 'Chào mừng đến với F Calories',
      title: 'Đăng nhập',
      description: 'Đăng nhập bằng Google hoặc Apple để bảo vệ dữ liệu dinh dưỡng và onboarding nhanh hơn.',
      appleUnavailableTitle: 'Không hỗ trợ Apple Sign In',
      appleUnavailableMessage: 'Thiết bị này không hỗ trợ đăng nhập bằng Apple.',
      googleButton: 'Đăng nhập bằng Google',
      or: 'hoặc',
      loginFailedTitle: 'Đăng nhập thất bại',
      loginFailedMessage: 'Không thể đăng nhập. Vui lòng thử lại.',
      footer: 'Tiếp tục nghĩa là bạn đồng ý điều khoản và chính sách bảo mật của ứng dụng.',
      countryLabel: 'Quốc gia',
      countryOptions: countryNames,
      benefits: [
        { title: 'Quét món ăn bằng AI', description: 'Ước tính dinh dưỡng tức thì từ ảnh chụp bữa ăn.' },
        { title: 'Gợi ý cá nhân hóa', description: 'Đề xuất phù hợp với thói quen và mục tiêu của bạn.' },
        { title: 'Theo dõi hằng ngày', description: 'Theo dõi calories, protein, carb, fat và hơn nữa.' },
      ],
    },
    permissions: {
      badge: 'Cổng quyền truy cập',
      title: 'Cần cấp quyền để tiếp tục',
      checking: 'Đang kiểm tra quyền camera và thư viện ảnh...',
      granted: 'Tất cả quyền đã sẵn sàng. Bạn có thể tiếp tục sang màn scan.',
      needPermission: 'Ứng dụng cần quyền Camera và Ảnh để quét món ăn. Hãy cấp quyền để tiếp tục.',
      blocked: 'Quyền Camera hoặc Ảnh đang bị chặn trong Settings. Hãy mở Settings để bật lại.',
      camera: 'Camera',
      cameraDesc: 'Dùng để chụp và quét món ăn.',
      photo: 'Ảnh',
      photoDesc: 'Dùng để chọn ảnh từ thư viện.',
      grantButton: 'Cấp quyền ngay',
      openSettings: 'Mở Settings',
      logout: 'Đăng xuất',
      notAvailable: 'Bạn chưa cấp đủ quyền. Hãy mở Settings để bật Camera và Ảnh.',
    },
    scan: {
      appSubtitle: 'Ứng dụng dinh dưỡng AI',
      title: 'Quét món ăn của bạn',
      description: 'Tải ảnh món ăn lên và nhận phân tích dinh dưỡng tức thì.',
      uploadTitle: 'Tải ảnh lên',
      uploadDesc: 'Nhấp vào đây để chọn ảnh từ thư viện',
      cameraReady: 'Camera đã sẵn sàng',
      cameraDesc: 'Hướng camera vào món ăn để bắt đầu quét.',
      capture: 'Chụp ảnh',
      close: 'Đóng',
      savePhotoTitle: 'Lưu ảnh?',
      savePhotoDesc: 'Bạn có muốn lưu ảnh chụp này vào thiết bị không?',
      yesSave: 'Có, lưu lại',
      noDiscard: 'Không, bỏ qua',
      imageSelected: 'Đã chọn 1 ảnh',
      imagesSelected: 'Đã chọn {count} ảnh',
      change: 'Thay đổi',
      process: 'Tiến hành',
      scan: 'Quét',
      step1Title: 'Chụp ảnh',
      step1Desc: 'Chụp món ăn của bạn bằng một bức ảnh rõ ràng, đủ sáng.',
      step2Title: 'AI phân tích',
      step2Desc: 'Mô hình sẽ nhận diện nguyên liệu, khẩu phần và dinh dưỡng.',
      step3Title: 'Xem kết quả',
      step3Desc: 'Xem lượng calories, protein, carb, chất béo và các đánh giá sức khỏe.',
      info: 'Thông tin cá nhân',
      logout: 'Đăng xuất',
    },
    result: {
      scanComplete: 'Quét hoàn tất',
      title: 'Ước tính dinh dưỡng',
      description: 'Đây là bảng tổng hợp dinh dưỡng cho món ăn do AI phân tích.',
      aiInsight: 'Đánh giá từ AI',
      scanAnother: 'Quét món ăn khác',
      calories: 'Calories',
      protein: 'Protein',
      carbs: 'Carbs',
      fat: 'Chất béo',
      fiber: 'Chất xơ',
      backToHistory: 'Quay lại lịch sử',
    },
    historyPage: {
      title: 'Lịch sử quét',
      noHistory: 'Chưa có lịch sử quét món ăn.',
      scanNew: 'Quét món ăn đầu tiên của bạn',
      searchPlaceholder: 'Tìm kiếm tên món ăn...',
    },
    infoPage: {
      title: 'Thông tin tài khoản',
      fullName: 'Họ và tên',
      email: 'Địa chỉ Email',
      appleID: 'Apple ID',
      region: 'Quốc gia / Vùng',
      appVersion: 'Phiên bản ứng dụng',
    },
    settingsPage: {
      title: 'Cài đặt',
      themeSection: 'Giao diện',
      light: 'Sáng',
      dark: 'Tối',
      system: 'Hệ thống',
      languageSection: 'Ngôn ngữ',
      healthSyncSection: 'Đồng bộ sức khỏe',
      healthSyncButton: 'Đồng bộ Apple Health',
      healthSyncing: 'Đang đồng bộ...',
    },
  },
  us: {
    login: {
      welcome: 'Welcome to F Calories',
      title: 'Sign in',
      description: 'Sign in with Google or Apple to keep your nutrition data secure and simplify onboarding.',
      appleUnavailableTitle: 'Apple Sign In unavailable',
      appleUnavailableMessage: 'This device does not support Apple authentication.',
      googleButton: 'Sign in with Google',
      or: 'or',
      loginFailedTitle: 'Login failed',
      loginFailedMessage: 'Could not sign in. Please try again.',
      footer: 'By continuing, you agree to the app terms and privacy policy.',
      countryLabel: 'Country',
      countryOptions: countryNames,
      benefits: [
        { title: 'AI meal scan', description: 'Instant nutrition estimates from camera photos.' },
        { title: 'Personalized insights', description: 'Recommendations tailored to your habits.' },
        { title: 'Daily tracking', description: 'Monitor calories, protein, carbs, fat, and more.' },
      ],
    },
    permissions: {
      badge: 'Permission gate',
      title: 'Permissions required to continue',
      checking: 'Checking camera and photo library permissions...',
      granted: 'All permissions are ready. You can continue to the scan screen.',
      needPermission: 'The app needs Camera and Photos access to scan meals. Please grant permissions to continue.',
      blocked: 'Camera or Photos access is blocked in Settings. Please open Settings and enable them.',
      camera: 'Camera',
      cameraDesc: 'Used to capture and scan meals.',
      photo: 'Photos',
      photoDesc: 'Used to pick images from your library.',
      grantButton: 'Grant permissions',
      openSettings: 'Open Settings',
      logout: 'Log out',
      notAvailable: 'You have not granted all permissions. Open Settings to enable Camera and Photos.',
    },
    scan: {
      appSubtitle: 'AI nutrition app',
      title: 'Scan your meal',
      description: 'Upload meal photos and get an instant nutrition breakdown.',
      uploadTitle: 'Upload images',
      uploadDesc: 'Tap here to select images from gallery',
      cameraReady: 'Camera is ready',
      cameraDesc: 'Point the camera at your meal to start scanning.',
      capture: 'Capture',
      close: 'Close',
      savePhotoTitle: 'Save photo?',
      savePhotoDesc: 'Do you want to save this captured photo to your device?',
      yesSave: 'Yes, save it',
      noDiscard: 'No, discard',
      imageSelected: '1 image selected',
      imagesSelected: '{count} images selected',
      change: 'Change',
      process: 'Process',
      scan: 'Scan',
      step1Title: 'Take a photo',
      step1Desc: 'Capture your meal with a clear, well-lit image.',
      step2Title: 'AI analyzes it',
      step2Desc: 'The model identifies ingredients, portions, and macros.',
      step3Title: 'Review results',
      step3Desc: 'See calories, protein, carbs, fat, and health insights.',
      info: 'Information',
      logout: 'Log out',
    },
    result: {
      scanComplete: 'Scan complete',
      title: 'Nutrition estimate',
      description: 'Here is your AI-generated summary for the scanned meal.',
      aiInsight: 'AI insight',
      scanAnother: 'Scan another meal',
      calories: 'Calories',
      protein: 'Protein',
      carbs: 'Carbs',
      fat: 'Fat',
      fiber: 'Fiber',
      backToHistory: 'Back to History',
    },
    historyPage: {
      title: 'Scan History',
      noHistory: 'No scans recorded yet.',
      scanNew: 'Scan your first meal',
      searchPlaceholder: 'Search by meal name...',
    },
    infoPage: {
      title: 'Account Information',
      fullName: 'Full Name',
      email: 'Email Address',
      appleID: 'Apple ID',
      region: 'Country / Region',
      appVersion: 'App Version',
    },
    settingsPage: {
      title: 'Settings',
      themeSection: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      languageSection: 'Language',
      healthSyncSection: 'Health Sync',
      healthSyncButton: 'Sync Apple Health',
      healthSyncing: 'Syncing...',
    },
  },
  gb: {
    login: {
      welcome: 'Welcome to F Calories',
      title: 'Sign in',
      description: 'Sign in with Google or Apple to keep your nutrition data secure and simplify onboarding.',
      appleUnavailableTitle: 'Apple Sign In unavailable',
      appleUnavailableMessage: 'This device does not support Apple authentication.',
      googleButton: 'Sign in with Google',
      or: 'or',
      loginFailedTitle: 'Login failed',
      loginFailedMessage: 'Could not sign in. Please try again.',
      footer: 'By continuing, you agree to the app terms and privacy policy.',
      countryLabel: 'Country',
      countryOptions: countryNames,
      benefits: [
        { title: 'AI meal scan', description: 'Instant nutrition estimates from camera photos.' },
        { title: 'Personalised insights', description: 'Recommendations tailored to your habits.' },
        { title: 'Daily tracking', description: 'Monitor calories, protein, carbs, fat, and more.' },
      ],
    },
    permissions: {
      badge: 'Permission gate',
      title: 'Permissions required to continue',
      checking: 'Checking camera and photo library permissions...',
      granted: 'All permissions are ready. You can continue to the scan screen.',
      needPermission: 'The app needs Camera and Photos access to scan meals. Please grant permissions to continue.',
      blocked: 'Camera or Photos access is blocked in Settings. Please open Settings and enable them.',
      camera: 'Camera',
      cameraDesc: 'Used to capture and scan meals.',
      photo: 'Photos',
      photoDesc: 'Used to pick images from your library.',
      grantButton: 'Grant permissions',
      openSettings: 'Open Settings',
      logout: 'Log out',
      notAvailable: 'You have not granted all permissions. Open Settings to enable Camera and Photos.',
    },
    scan: {
      appSubtitle: 'AI nutrition app',
      title: 'Scan your meal',
      description: 'Upload meal photos and get an instant nutrition breakdown.',
      uploadTitle: 'Upload images',
      uploadDesc: 'Tap here to select images from gallery',
      cameraReady: 'Camera is ready',
      cameraDesc: 'Point the camera at your meal to start scanning.',
      capture: 'Capture',
      close: 'Close',
      savePhotoTitle: 'Save photo?',
      savePhotoDesc: 'Do you want to save this captured photo to your device?',
      yesSave: 'Yes, save it',
      noDiscard: 'No, discard',
      imageSelected: '1 image selected',
      imagesSelected: '{count} images selected',
      change: 'Change',
      process: 'Process',
      scan: 'Scan',
      step1Title: 'Take a photo',
      step1Desc: 'Capture your meal with a clear, well-lit image.',
      step2Title: 'AI analyzes it',
      step2Desc: 'The model identifies ingredients, portions, and macros.',
      step3Title: 'Review results',
      step3Desc: 'See calories, protein, carbs, fat, and health insights.',
    },
    result: {
      scanComplete: 'Scan complete',
      title: 'Nutrition estimate',
      description: 'Here is your AI-generated summary for the scanned meal.',
      aiInsight: 'AI insight',
      scanAnother: 'Scan another meal',
      calories: 'Calories',
      protein: 'Protein',
      carbs: 'Carbs',
      fat: 'Fat',
      fiber: 'Fiber',
      backToHistory: 'Back to History',
    },
  },
  jp: {
    login: {
      welcome: 'F Caloriesへようこそ',
      title: 'サインイン',
      description: 'Google または Apple でサインインして、栄養データを安全に保ちましょう。',
      appleUnavailableTitle: 'Apple Sign In は利用できません',
      appleUnavailableMessage: 'この端末は Apple 認証をサポートしていません。',
      googleButton: 'Googleでサインイン',
      or: 'または',
      loginFailedTitle: 'ログインに失敗しました',
      loginFailedMessage: 'サインインできませんでした。もう一度お試しください。',
      footer: '続行すると、アプリの利用規約とプライバシーポリシーに同意したものとみなされます。',
      countryLabel: '国',
      countryOptions: countryNames,
      benefits: [
        { title: 'AIで食事をスキャン', description: '食事写真から即座に栄養を推定します。' },
        { title: 'パーソナライズされた提案', description: 'あなたの習慣に合わせた提案を表示します。' },
        { title: '毎日の記録', description: 'カロリー、たんぱく質、炭水化物、脂質を管理します。' },
      ],
    },
    permissions: {
      badge: '権限ゲート',
      title: '続行するには権限が必要です',
      checking: 'カメラと写真ライブラリの権限を確認しています...',
      granted: 'すべての権限が利用可能です。スキャン画面へ進めます。',
      needPermission: '食事をスキャンするにはカメラと写真へのアクセスが必要です。権限を許可してください。',
      blocked: 'カメラまたは写真のアクセスが設定で無効です。設定を開いて有効にしてください。',
      camera: 'カメラ',
      cameraDesc: '食事の撮影とスキャンに使用します。',
      photo: '写真',
      photoDesc: 'ライブラリから画像を選ぶために使用します。',
      grantButton: '権限を許可',
      openSettings: '設定を開く',
      logout: 'ログアウト',
      notAvailable: 'すべての権限が許可されていません。設定を開いてカメラと写真を有効にしてください。',
    },
    scan: {
      appSubtitle: 'AI栄養アプリ',
      title: '食事をスキャン',
      description: '食事の写真をアップロードして、即座に栄養素の分析を取得します。',
      uploadTitle: '画像をアップロード',
      uploadDesc: 'ここをタップしてライブラリから画像を選択します',
      cameraReady: 'カメラの準備ができました',
      cameraDesc: '食事にカメラを向けてスキャンを開始します。',
      capture: '撮影',
      close: '閉じる',
      savePhotoTitle: '写真を保存しますか？',
      savePhotoDesc: '撮影した写真をデバイスに保存しますか？',
      yesSave: 'はい、保存します',
      noDiscard: 'いいえ、破棄します',
      imageSelected: '1枚の画像が選択されました',
      imagesSelected: '{count}枚の画像が選択されました',
      change: '変更',
      process: '解析する',
      scan: 'スキャン',
      step1Title: '写真を撮る',
      step1Desc: '明るくはっきりした食事の写真を撮影します。',
      step2Title: 'AIによる分析',
      step2Desc: 'モデルが食材、分量、栄養素を特定します。',
      step3Title: '結果の確認',
      step3Desc: 'カロリー、タンパク質、炭水化物、脂質、健康への洞察を確認します。',
      info: '情報',
      logout: 'ログアウト',
    },
    result: {
      scanComplete: 'スキャン完了',
      title: '推定栄養素',
      description: '食事のスキャンが完了したAI要約です。',
      aiInsight: 'AI分析',
      scanAnother: '別の食事をスキャン',
      calories: 'カロリー',
      protein: 'タンパク質',
      carbs: '炭水化物',
      fat: '脂質',
      fiber: '食物繊維',
      backToHistory: '履歴に戻る',
    },
    infoPage: {
      title: 'アカウント情報',
      fullName: '氏名',
      email: 'メールアドレス',
      appleID: 'Apple ID',
      region: '国 / 地域',
      appVersion: 'アプリバージョン',
    },
    settingsPage: {
      title: '設定',
      themeSection: 'テーマ',
      light: 'ライト',
      dark: 'ダーク',
      system: 'システム',
      languageSection: '言語',
      healthSyncSection: 'ヘルスケア同期',
      healthSyncButton: 'Apple Healthを同期',
      healthSyncing: '同期中...',
    },
    historyPage: {
      title: 'スキャン履歴',
      noHistory: 'スキャン履歴はありません。',
      scanNew: '最初の食事をスキャン',
      searchPlaceholder: '食事名で検索...',
    },
  },
  kr: {
    login: {
      welcome: 'F Calories에 오신 것을 환영합니다',
      title: '로그인',
      description: 'Google 또는 Apple로 로그인하여 영양 데이터를 안전하게 보호하세요.',
      appleUnavailableTitle: 'Apple Sign In을 사용할 수 없습니다',
      appleUnavailableMessage: '이 기기는 Apple 인증을 지원하지 않습니다.',
      googleButton: 'Google로 로그인',
      or: '또는',
      loginFailedTitle: '로그인 실패',
      loginFailedMessage: '로그인할 수 없습니다. 다시 시도해 주세요.',
      footer: '계속하면 앱 이용약관 및 개인정보 처리방침에 동의하게 됩니다.',
      countryLabel: '국가',
      countryOptions: countryNames,
      benefits: [
        { title: 'AI 식사 스캔', description: '카메라 사진으로 즉시 영양 정보를 추정합니다.' },
        { title: '개인 맞춤 인사이트', description: '사용자 습관에 맞는 추천을 제공합니다.' },
        { title: '일일 기록', description: '칼로리, 단백질, 탄수화물, 지방 등을 추적합니다.' },
      ],
    },
    permissions: {
      badge: '권한 게이트',
      title: '계속하려면 권한이 필요합니다',
      checking: '카메라 및 사진 라이브러리 권한을 확인하는 중...',
      granted: '모든 권한이 준비되었습니다. 스캔 화면으로 이동할 수 있습니다.',
      needPermission: '식사 스캔을 위해 카메라와 사진 접근 권한이 필요합니다. 권한을 허용해 주세요.',
      blocked: '카메라 또는 사진 접근이 설정에서 차단되어 있습니다. 설정을 열어 활성화해 주세요.',
      camera: '카메라',
      cameraDesc: '식사를 촬영하고 스캔하는 데 사용됩니다.',
      photo: '사진',
      photoDesc: '라이브러리에서 이미지를 선택하는 데 사용됩니다.',
      grantButton: '권한 허용',
      openSettings: '설정 열기',
      logout: '로그아웃',
      notAvailable: '모든 권한이 허용되지 않았습니다. 설정에서 카메라와 사진을 활성화해 주세요.',
    },
    scan: {
      appSubtitle: 'AI 영양 앱',
      title: '식사 스캔',
      description: '식사 사진을 업로드하고 즉각적인 영양 분석을 받으세요.',
      uploadTitle: '이미지 업로드',
      uploadDesc: '갤러리에서 이미지를 선택하려면 여기를 누르세요',
      cameraReady: '카메라 준비 완료',
      cameraDesc: '스캔을 시작하려면 카메라를 식사에 맞추세요.',
      capture: '촬영',
      close: '닫기',
      savePhotoTitle: '사진을 저장하시겠습니까?',
      savePhotoDesc: '촬영한 사진을 장치에 저장하시겠습니까?',
      yesSave: '예, 저장합니다',
      noDiscard: '아니요, 취소합니다',
      imageSelected: '1개의 이미지가 선택됨',
      imagesSelected: '{count}개의 이미지가 선택됨',
      change: '변경',
      process: '분석하기',
      scan: '스캔',
      step1Title: '사진 촬영',
      step1Desc: '선명하고 밝은 식사 사진을 촬영합니다.',
      step2Title: 'AI 영양 분석',
      step2Desc: '모델이 식재료, 부분 및 영양소를 인식합니다.',
      step3Title: '결과 확인',
      step3Desc: '칼로리, 단백질, 탄수화물, 지방 및 건강 통찰력을 확인합니다.',
    },
    result: {
      scanComplete: '스캔 완료',
      title: '추정 영양소',
      description: '스캔된 식사에 대한 AI 요약 정보입니다.',
      aiInsight: 'AI 조언',
      scanAnother: '다른 식사 스캔',
      calories: '칼로리',
      protein: '단백질',
      carbs: '탄수화물',
      fat: '지방',
      fiber: '식이섬유',
      backToHistory: '기록으로 돌아가기',
    },
  },
  cn: {
    login: {
      welcome: '欢迎使用 F Calories',
      title: '登录',
      description: '使用 Google 或 Apple 登录，保护您的营养数据并简化入门流程。',
      appleUnavailableTitle: 'Apple Sign In 不可用',
      appleUnavailableMessage: '此设备不支持 Apple 身份验证。',
      googleButton: '使用 Google 登录',
      or: '或',
      loginFailedTitle: '登录失败',
      loginFailedMessage: '无法登录，请重试。',
      footer: '继续即表示您同意应用条款和隐私政策。',
      countryLabel: '国家',
      countryOptions: countryNames,
      benefits: [
        { title: 'AI 食物扫描', description: '通过相机照片即时估算营养信息。' },
        { title: '个性化洞察', description: '根据您的习惯提供建议。' },
        { title: '每日追踪', description: '记录热量、蛋白质、碳水、脂肪等。' },
      ],
    },
    permissions: {
      badge: '权限门禁',
      title: '继续操作需要权限',
      checking: '正在检查相机和照片库权限...',
      granted: '所有权限都已准备好。您可以继续进入扫描页面。',
      needPermission: '应用需要相机和照片访问权限来扫描餐食，请先授予权限。',
      blocked: '相机或照片权限在设置中被阻止。请打开设置并启用它们。',
      camera: '相机',
      cameraDesc: '用于拍摄并扫描餐食。',
      photo: '照片',
      photoDesc: '用于从相册中选择图片。',
      grantButton: '立即授权',
      openSettings: '打开设置',
      logout: '退出登录',
      notAvailable: '您尚未授予全部权限。请在设置中启用相机和照片。',
    },
    scan: {
      appSubtitle: 'AI 营养应用',
      title: '扫描餐食',
      description: '上传食物照片，即时获取营养成分分析。',
      uploadTitle: '上传照片',
      uploadDesc: '点击此处从相册选择照片',
      cameraReady: '相机已就绪',
      cameraDesc: '将相机对准您的食物以开始扫描。',
      capture: '拍照',
      close: '关闭',
      savePhotoTitle: '保存照片？',
      savePhotoDesc: '是否要将此照片保存到您的设备？',
      yesSave: '是，保存',
      noDiscard: '否，放弃',
      imageSelected: '已选择 1 张图片',
      imagesSelected: '已选择 {count} 张图片',
      change: '更改',
      process: '开始分析',
      scan: '扫描',
      step1Title: '拍摄照片',
      step1Desc: '拍摄清晰、光线充足的食物照片。',
      step2Title: 'AI 智能分析',
      step2Desc: '模型将识别食材、分量和营养素。',
      step3Title: '查看结果',
      step3Desc: '查看热量、蛋白质、碳水、脂肪和健康建议。',
    },
    result: {
      scanComplete: '扫描完成',
      title: '营养估算',
      description: '这是 AI 生成的扫描餐食营养分析摘要。',
      aiInsight: 'AI 建议',
      scanAnother: '扫描下一餐',
      calories: '热量',
      protein: '蛋白质',
      carbs: '碳水化合物',
      fat: '脂肪',
      fiber: '膳食纤维',
      backToHistory: '返回历史记录',
    },
  },
  fr: {
    login: {
      welcome: 'Bienvenue sur F Calories',
      title: 'Se connecter',
      description: 'Connectez-vous avec Google ou Apple pour sécuriser vos données nutritionnelles.',
      appleUnavailableTitle: 'Apple Sign In indisponible',
      appleUnavailableMessage: 'Cet appareil ne prend pas en charge l’authentification Apple.',
      googleButton: 'Se connecter avec Google',
      or: 'ou',
      loginFailedTitle: 'Échec de la connexion',
      loginFailedMessage: 'Impossible de se connecter. Veuillez réessayer.',
      footer: 'En continuant, vous acceptez les conditions et la politique de confidentialité de l’application.',
      countryLabel: 'Pays',
      countryOptions: countryNames,
      benefits: [
        { title: 'Scan de repas par IA', description: 'Estimation nutritionnelle instantanée à partir de photos.' },
        { title: 'Insights personnalisés', description: 'Recommandations adaptées à vos habitudes.' },
        { title: 'Suivi quotidien', description: 'Suivez calories, protéines, glucides, lipides et plus.' },
      ],
    },
    permissions: {
      badge: 'Portail des autorisations',
      title: 'Des autorisations sont requises pour continuer',
      checking: 'Vérification des autorisations caméra et photos...',
      granted: 'Toutes les autorisations sont prêtes. Vous pouvez accéder à l’écran de scan.',
      needPermission: 'L’application a besoin d’accéder à la caméra et aux photos pour scanner les repas. Veuillez autoriser l’accès.',
      blocked: 'L’accès à la caméra ou aux photos est bloqué dans les réglages. Veuillez ouvrir les réglages et les activer.',
      camera: 'Caméra',
      cameraDesc: 'Utilisée pour capturer et scanner les repas.',
      photo: 'Photos',
      photoDesc: 'Utilisées pour choisir des images depuis votre bibliothèque.',
      grantButton: 'Autoriser',
      openSettings: 'Ouvrir les réglages',
      logout: 'Se déconnecter',
      notAvailable: 'Vous n’avez pas accordé toutes les autorisations. Ouvrez les réglages pour activer la caméra et les photos.',
    },
  },
  de: {
    login: {
      welcome: 'Willkommen bei F Calories',
      title: 'Anmelden',
      description: 'Melden Sie sich mit Google oder Apple an, um Ihre Ernährungsdaten zu schützen.',
      appleUnavailableTitle: 'Apple Sign In nicht verfügbar',
      appleUnavailableMessage: 'Dieses Gerät unterstützt die Apple-Authentifizierung nicht.',
      googleButton: 'Mit Google anmelden',
      or: 'oder',
      loginFailedTitle: 'Anmeldung fehlgeschlagen',
      loginFailedMessage: 'Anmeldung nicht möglich. Bitte versuchen Sie es erneut.',
      footer: 'Mit dem Fortfahren stimmen Sie den Nutzungsbedingungen und der Datenschutzrichtlinie zu.',
      countryLabel: 'Land',
      countryOptions: countryNames,
      benefits: [
        { title: 'KI-Mahlzeitenscan', description: 'Sofortige Nährwertschätzung per Kamerafoto.' },
        { title: 'Personalisierte Einblicke', description: 'Empfehlungen passend zu Ihren Gewohnheiten.' },
        { title: 'Tägliches Tracking', description: 'Verfolge Kalorien, Protein, Kohlenhydrate, Fett und mehr.' },
      ],
    },
    permissions: {
      badge: 'Berechtigungs-Gate',
      title: 'Berechtigungen erforderlich, um fortzufahren',
      checking: 'Kamera- und Fotozugriff wird geprüft...',
      granted: 'Alle Berechtigungen sind bereit. Sie können zum Scan-Bildschirm fortfahren.',
      needPermission: 'Die App benötigt Kamera- und Fotozugriff, um Mahlzeiten zu scannen. Bitte erlauben Sie die Berechtigungen.',
      blocked: 'Kamera- oder Fotozugriff ist in den Einstellungen blockiert. Bitte öffnen Sie die Einstellungen und aktivieren Sie sie.',
      camera: 'Kamera',
      cameraDesc: 'Wird zum Aufnehmen und Scannen von Mahlzeiten verwendet.',
      photo: 'Fotos',
      photoDesc: 'Wird zum Auswählen von Bildern aus Ihrer Bibliothek verwendet.',
      grantButton: 'Berechtigungen erlauben',
      openSettings: 'Einstellungen öffnen',
      logout: 'Abmelden',
      notAvailable: 'Sie haben nicht alle Berechtigungen erteilt. Öffnen Sie die Einstellungen, um Kamera und Fotos zu aktivieren.',
    },
  },
  es: {
    login: {
      welcome: 'Bienvenido a F Calories',
      title: 'Iniciar sesión',
      description: 'Inicia sesión con Google o Apple para proteger tus datos nutricionales.',
      appleUnavailableTitle: 'Apple Sign In no disponible',
      appleUnavailableMessage: 'Este dispositivo no admite autenticación de Apple.',
      googleButton: 'Iniciar sesión con Google',
      or: 'o',
      loginFailedTitle: 'Error de inicio de sesión',
      loginFailedMessage: 'No se pudo iniciar sesión. Inténtalo de nuevo.',
      footer: 'Al continuar, aceptas los términos y la política de privacidad de la app.',
      countryLabel: 'País',
      countryOptions: countryNames,
      benefits: [
        { title: 'Escaneo de comidas con IA', description: 'Estimación nutricional instantánea desde fotos.' },
        { title: 'Insights personalizados', description: 'Recomendaciones adaptadas a tus hábitos.' },
        { title: 'Seguimiento diario', description: 'Controla calorías, proteínas, carbohidratos, grasas y más.' },
      ],
    },
    permissions: {
      badge: 'Puerta de permisos',
      title: 'Se requieren permisos para continuar',
      checking: 'Comprobando permisos de cámara y fotos...',
      granted: 'Todos los permisos están listos. Puedes continuar a la pantalla de escaneo.',
      needPermission: 'La app necesita acceso a Cámara y Fotos para escanear comidas. Concede los permisos para continuar.',
      blocked: 'El acceso a Cámara o Fotos está bloqueado en Ajustes. Ábrelos y actívalos.',
      camera: 'Cámara',
      cameraDesc: 'Se usa para capturar y escanear comidas.',
      photo: 'Fotos',
      photoDesc: 'Se usa para elegir imágenes de tu biblioteca.',
      grantButton: 'Conceder permisos',
      openSettings: 'Abrir Ajustes',
      logout: 'Cerrar sesión',
      notAvailable: 'No has concedido todos los permisos. Abre Ajustes para activar Cámara y Fotos.',
    },
  },
  pt: {
    login: {
      welcome: 'Bem-vindo ao F Calories',
      title: 'Entrar',
      description: 'Entre com Google ou Apple para manter seus dados nutricionais seguros.',
      appleUnavailableTitle: 'Apple Sign In indisponível',
      appleUnavailableMessage: 'Este dispositivo não suporta autenticação da Apple.',
      googleButton: 'Entrar com Google',
      or: 'ou',
      loginFailedTitle: 'Falha no login',
      loginFailedMessage: 'Não foi possível entrar. Tente novamente.',
      footer: 'Ao continuar, você concorda com os termos e a política de privacidade do app.',
      countryLabel: 'País',
      countryOptions: countryNames,
      benefits: [
        { title: 'Escaneamento de refeições com IA', description: 'Estimativa nutricional instantânea a partir de fotos.' },
        { title: 'Insights personalizados', description: 'Recomendações alinhadas aos seus hábitos.' },
        { title: 'Acompanhamento diário', description: 'Monitore calorias, proteínas, carboidratos, gorduras e mais.' },
      ],
    },
    permissions: {
      badge: 'Portal de permissões',
      title: 'Permissões necessárias para continuar',
      checking: 'Verificando permissões de câmera e fotos...',
      granted: 'Todas as permissões estão prontas. Você pode seguir para a tela de scan.',
      needPermission: 'O app precisa de acesso à Câmera e Fotos para escanear refeições. Conceda as permissões para continuar.',
      blocked: 'O acesso à Câmera ou Fotos está blocoado nas configurações. Abra as configurações e ative-os.',
      camera: 'Câmera',
      cameraDesc: 'Usada para capturar e escanear refeições.',
      photo: 'Fotos',
      photoDesc: 'Usada para escolher imagens da sua biblioteca.',
      grantButton: 'Conceder permissões',
      openSettings: 'Abrir configurações',
      logout: 'Sair',
      notAvailable: 'Você não concedeu todas as permissões. Abra as configurações para ativar Câmera e Fotos.',
    },
  },
  id: {
    login: {
      welcome: 'Selamat datang di F Calories',
      title: 'Masuk',
      description: 'Masuk dengan Google atau Apple untuk menjaga data nutrisi Anda tetap aman.',
      appleUnavailableTitle: 'Apple Sign In tidak tersedia',
      appleUnavailableMessage: 'Perangkat ini tidak mendukung autentikasi Apple.',
      googleButton: 'Masuk dengan Google',
      or: 'atau',
      loginFailedTitle: 'Gagal masuk',
      loginFailedMessage: 'Tidak dapat masuk. Silakan coba lagi.',
      footer: 'Dengan melanjutkan, Anda setuju dengan ketentuan dan kebijakan privasi aplikasi.',
      countryLabel: 'Negara',
      countryOptions: countryNames,
      benefits: [
        { title: 'Pindai makanan dengan AI', description: 'Estimasi nutrisi instan dari foto kamera.' },
        { title: 'Wawasan personal', description: 'Rekomendasi sesuai kebiasaan Anda.' },
        { title: 'Pelacakan harian', description: 'Pantau kalori, protein, karbohidrat, lemak, dan lainnya.' },
      ],
    },
    permissions: {
      badge: 'Gerbang izin',
      title: 'Izin diperlukan untuk melanjutkan',
      checking: 'Memeriksa izin kamera dan galeri foto...',
      granted: 'Semua izin siap. Anda bisa lanjut ke layar scan.',
      needPermission: 'Aplikasi membutuhkan akses Kamera dan Foto untuk memindai makanan. Berikan izin untuk melanjutkan.',
      blocked: 'Akses Kamera atau Foto diblokir di Pengaturan. Buka Pengaturan dan aktifkan.',
      camera: 'Kamera',
      cameraDesc: 'Digunakan untuk mengambil dan memindai makanan.',
      photo: 'Foto',
      photoDesc: 'Digunakan untuk memilih gambar dari galeri.',
      grantButton: 'Berikan izin',
      openSettings: 'Buka Pengaturan',
      logout: 'Keluar',
      notAvailable: 'Anda belum memberikan semua izin. Buka Pengaturan untuk mengaktifkan Kamera dan Foto.',
    },
  },
  th: {
    login: {
      welcome: 'ยินดีต้อนรับสู่ F Calories',
      title: 'เข้าสู่ระบบ',
      description: 'เข้าสู่ระบบด้วย Google หรือ Apple เพื่อรักษาความปลอดภัยข้อมูลโภชนาการของคุณ',
      appleUnavailableTitle: 'ไม่สามารถใช้งาน Apple Sign In ได้',
      appleUnavailableMessage: 'อุปกรณ์นี้ไม่รองรับการยืนยันตัวตนของ Apple',
      googleButton: 'เข้าสู่ระบบด้วย Google',
      or: 'หรือ',
      loginFailedTitle: 'เข้าสู่ระบบไม่สำเร็จ',
      loginFailedMessage: 'ไม่สามารถเข้าสู่ระบบได้ โปรดลองอีกครั้ง',
      footer: 'การดำเนินการต่อหมายความว่าคุณยอมรับข้อกำหนดและนโยบายความเป็นส่วนตัวของแอป',
      countryLabel: 'ประเทศ',
      countryOptions: countryNames,
      benefits: [
        { title: 'สแกนมื้ออาหารด้วย AI', description: 'ประเมินโภชนาการทันทีจากภาพถ่าย' },
        { title: 'ข้อมูลเชิงลึกเฉพาะบุคคล', description: 'คำแนะนำที่เหมาะกับพฤติกรรมของคุณ' },
        { title: 'ติดตามรายวัน', description: 'ติดตามแคลอรี โปรตีน คาร์บ ไขมัน และอื่น ๆ' },
      ],
    },
    permissions: {
      badge: 'เกตสิทธิ์',
      title: 'ต้องให้สิทธิ์ก่อนจึงจะดำเนินการต่อได้',
      checking: 'กำลังตรวจสอบสิทธิ์กล้องและรูปภาพ...',
      granted: 'สิทธิ์ทั้งหมดพร้อมแล้ว คุณสามารถไปยังหน้าสแกนได้',
      needPermission: 'แอปต้องใช้สิทธิ์กล้องและรูปภาพเพื่อสแกนมื้ออาหาร โปรดอนุญาตสิทธิ์เพื่อดำเนินการต่อ',
      blocked: 'สิทธิ์กล้องหรือรูปภาพถูกบล็อกใน Settings โปรดเปิด Settings และเปิดใช้งาน',
      camera: 'กล้อง',
      cameraDesc: 'ใช้สำหรับถ่ายและสแกนมื้ออาหาร',
      photo: 'รูปภาพ',
      photoDesc: 'ใช้เลือกภาพจากคลังรูปภาพ',
      grantButton: 'ให้สิทธิ์',
      openSettings: 'เปิด Settings',
      logout: 'ออกจากระบบ',
      notAvailable: 'คุณยังไม่ได้ให้สิทธิ์ครบถ้วน โปรดเปิด Settings เพื่อเปิดใช้งานกล้องและรูปภาพ',
    },
    scan: {
      appSubtitle: 'แอปโภชนาการ AI',
      title: 'สแกนมื้ออาหารของคุณ',
      description: 'อัปโหลดรูปภาพมื้ออาหารเพื่อรับข้อมูลโภชนาการทันที',
      uploadTitle: 'อัปโหลดรูปภาพ',
      uploadDesc: 'แตะที่นี่เพื่อเลือกรูปภาพจากคลังภาพ',
      cameraReady: 'กล้องพร้อมใช้งาน',
      cameraDesc: 'เล็งกล้องไปที่มื้ออาหารของคุณเพื่อเริ่มการสแกน',
      capture: 'ถ่ายภาพ',
      close: 'ปิด',
      savePhotoTitle: 'บันทึกรูปภาพ?',
      savePhotoDesc: 'คุณต้องการบันทึกภาพถ่ายนี้ลงในอุปกรณ์ของคุณหรือไม่?',
      yesSave: 'ใช่ บันทึกรูปภาพ',
      noDiscard: 'ไม่ ละทิ้ง',
      imageSelected: 'เลือกรูปภาพแล้ว 1 รูป',
      imagesSelected: 'เลือกรูปภาพแล้ว {count} รูป',
      change: 'เปลี่ยน',
      process: 'ดำเนินการต่อ',
      scan: 'สแกน',
      step1Title: 'ถ่ายรูปอาหาร',
      step1Desc: 'ถ่ายรูปอาหารของคุณให้ชัดเจนและมีแสงสว่างเพียงพอ',
      step2Title: 'AI ทำการวิเคราะห์',
      step2Desc: 'แบบจำลองจะระบุส่วนผสม ปริมาณ และสารอาหารหลัก',
      step3Title: 'ตรวจสอบผลลัพธ์',
      step3Desc: 'ดูข้อมูลแคลอรี โปรตีน คาร์โบไฮเดรต ไขมัน และข้อมูลโภชนาการ',
      info: 'ข้อมูลส่วนตัว',
      logout: 'ออกจากระบบ',
    },
    result: {
      scanComplete: 'สแกนเสร็จสิ้น',
      title: 'ค่าโภชนาการโดยประมาณ',
      description: 'นี่คือสรุปข้อมูลโภชนาการโดย AI สำหรับมื้ออาหารที่สแกน',
      aiInsight: 'ข้อมูลเชิงลึกจาก AI',
      scanAnother: 'สแกนมื้ออาหารอื่น',
      calories: 'แคลอรี',
      protein: 'โปรตีน',
      carbs: 'คาร์โบไฮเดรต',
      fat: 'ไขมัน',
      fiber: 'ใยอาหาร',
      backToHistory: 'กลับไปที่ประวัติ',
    },
    infoPage: {
      title: 'ข้อมูลบัญชี',
      fullName: 'ชื่อ-นามสกุล',
      email: 'ที่อยู่อีเมล',
      appleID: 'Apple ID',
      region: 'ประเทศ / ภูมิภาค',
      appVersion: 'เวอร์ชันแอป',
    },
    settingsPage: {
      title: 'การตั้งค่า',
      themeSection: 'ธีม',
      light: 'สว่าง',
      dark: 'มืด',
      system: 'ระบบ',
      languageSection: 'ภาษา',
    },
  },
};

type FullDictionary = Dictionary & {
  scan: NonNullable<Required<Dictionary['scan']>>;
  result: NonNullable<Dictionary['result']>;
  infoPage: NonNullable<Dictionary['infoPage']>;
  settingsPage: NonNullable<Dictionary['settingsPage']> & {
    healthSyncSection: string;
    healthSyncButton: string;
    healthSyncing: string;
  };
  historyPage: NonNullable<Dictionary['historyPage']>;
};

export function getLocale(country: CountryCode): FullDictionary {
  const dict = dictionaries[country] ?? dictionaries.vn;
  const usScan = dictionaries.us.scan!;
  const scan = dict.scan ? {
    ...usScan,
    ...dict.scan,
    info: dict.scan.info ?? usScan.info,
    logout: dict.scan.logout ?? usScan.logout,
  } : usScan;

  const usSettings = dictionaries.us.settingsPage!;
  const settingsPage = dict.settingsPage ? {
    ...usSettings,
    ...dict.settingsPage,
    healthSyncSection: dict.settingsPage.healthSyncSection ?? usSettings.healthSyncSection ?? "Health Sync",
    healthSyncButton: dict.settingsPage.healthSyncButton ?? usSettings.healthSyncButton ?? "Sync Apple Health",
    healthSyncing: dict.settingsPage.healthSyncing ?? usSettings.healthSyncing ?? "Syncing...",
  } : {
    ...usSettings,
    healthSyncSection: usSettings.healthSyncSection ?? "Health Sync",
    healthSyncButton: usSettings.healthSyncButton ?? "Sync Apple Health",
    healthSyncing: usSettings.healthSyncing ?? "Syncing...",
  };

  return {
    ...dict,
    scan: scan as Required<NonNullable<Dictionary['scan']>>,
    result: dict.result ?? dictionaries.us.result!,
    infoPage: dict.infoPage ?? dictionaries.us.infoPage!,
    settingsPage: settingsPage as Required<NonNullable<Dictionary['settingsPage']>> & {
      healthSyncSection: string;
      healthSyncButton: string;
      healthSyncing: string;
    },
    historyPage: dict.historyPage ?? dictionaries.us.historyPage!,
  };
}
