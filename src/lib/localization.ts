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
  };
  infoPage?: {
    title: string;
    fullName: string;
    email: string;
    appleId: string;
    region: string;
    appVersion: string;
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
      welcome: 'Chào mừng đến với ÍO',
      title: 'Đăng nhập bằng Apple ID',
      description: 'Chúng tôi chỉ hỗ trợ Apple Sign In để giữ dữ liệu dinh dưỡng an toàn và onboarding đơn giản.',
      appleUnavailableTitle: 'Không hỗ trợ Apple Sign In',
      appleUnavailableMessage: 'Thiết bị này không hỗ trợ đăng nhập bằng Apple.',
      loginFailedTitle: 'Đăng nhập thất bại',
      loginFailedMessage: 'Không thể đăng nhập bằng Apple. Vui lòng thử lại.',
      footer: 'Tiếp tục nghĩa là bạn đồng ý dùng Apple ID làm phương thức đăng nhập duy nhất của ứng dụng.',
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
    },
    infoPage: {
      title: 'Thông tin tài khoản',
      fullName: 'Họ và tên',
      email: 'Địa chỉ Email',
      appleId: 'Apple ID',
      region: 'Quốc gia / Vùng',
      appVersion: 'Phiên bản ứng dụng',
    },
  },
  us: {
    login: {
      welcome: 'Welcome to ÍO',
      title: 'Sign in with Apple ID',
      description: 'We only support Apple Sign In to keep your nutrition data secure and onboarding simple.',
      appleUnavailableTitle: 'Apple Sign In unavailable',
      appleUnavailableMessage: 'This device does not support Apple authentication.',
      loginFailedTitle: 'Login failed',
      loginFailedMessage: 'Could not sign in with Apple. Please try again.',
      footer: 'By continuing, you agree to use Apple ID as the only sign-in method for this app.',
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
    },
    infoPage: {
      title: 'Account Information',
      fullName: 'Full Name',
      email: 'Email Address',
      appleId: 'Apple ID',
      region: 'Country / Region',
      appVersion: 'App Version',
    },
  },
  gb: {
    login: {
      welcome: 'Welcome to ÍO',
      title: 'Sign in with Apple ID',
      description: 'We only support Apple Sign In to keep your nutrition data secure and onboarding simple.',
      appleUnavailableTitle: 'Apple Sign In unavailable',
      appleUnavailableMessage: 'This device does not support Apple authentication.',
      loginFailedTitle: 'Login failed',
      loginFailedMessage: 'Could not sign in with Apple. Please try again.',
      footer: 'By continuing, you agree to use Apple ID as the only sign-in method for this app.',
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
    },
  },
  jp: {
    login: {
      welcome: 'ÍOへようこそ',
      title: 'Apple IDでサインイン',
      description: '栄養データを安全に保つため、Apple Sign In のみをサポートしています。',
      appleUnavailableTitle: 'Apple Sign In は利用できません',
      appleUnavailableMessage: 'この端末は Apple 認証をサポートしていません。',
      loginFailedTitle: 'ログインに失敗しました',
      loginFailedMessage: 'Appleでサインインできませんでした。もう一度お試しください。',
      footer: '続行すると、このアプリの唯一のサインイン方法として Apple ID を使用することに同意したものとみなされます。',
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
    },
  },
  kr: {
    login: {
      welcome: 'ÍO에 오신 것을 환영합니다',
      title: 'Apple ID로 로그인',
      description: '데이터를 안전하게 유지하기 위해 Apple Sign In만 지원합니다.',
      appleUnavailableTitle: 'Apple Sign In을 사용할 수 없습니다',
      appleUnavailableMessage: '이 기기는 Apple 인증을 지원하지 않습니다.',
      loginFailedTitle: '로그인 실패',
      loginFailedMessage: 'Apple로 로그인할 수 없습니다. 다시 시도해 주세요.',
      footer: '계속하면 이 앱의 유일한 로그인 방식으로 Apple ID를 사용하는 데 동의하게 됩니다.',
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
    },
  },
  cn: {
    login: {
      welcome: '欢迎使用 ÍO',
      title: '使用 Apple ID 登录',
      description: '为了保证您的营养数据安全，我们仅支持 Apple Sign In。',
      appleUnavailableTitle: 'Apple Sign In 不可用',
      appleUnavailableMessage: '此设备不支持 Apple 身份验证。',
      loginFailedTitle: '登录失败',
      loginFailedMessage: '无法使用 Apple 登录，请重试。',
      footer: '继续即表示您同意将 Apple ID 作为此应用的唯一登录方式。',
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
    },
  },
  fr: {
    login: {
      welcome: 'Bienvenue sur ÍO',
      title: 'Se connecter avec Apple ID',
      description: 'Nous prenons uniquement en charge Apple Sign In afin de sécuriser vos données nutritionnelles.',
      appleUnavailableTitle: 'Apple Sign In indisponible',
      appleUnavailableMessage: 'Cet appareil ne prend pas en charge l’authentification Apple.',
      loginFailedTitle: 'Échec de la connexion',
      loginFailedMessage: 'Impossible de se connecter avec Apple. Veuillez réessayer.',
      footer: 'En continuant, vous acceptez d’utiliser Apple ID comme unique méthode de connexion de cette application.',
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
      welcome: 'Willkommen bei ÍO',
      title: 'Mit Apple ID anmelden',
      description: 'Wir unterstützen nur Apple Sign In, um Ihre Ernährungsdaten sicher zu halten.',
      appleUnavailableTitle: 'Apple Sign In nicht verfügbar',
      appleUnavailableMessage: 'Dieses Gerät unterstützt die Apple-Authentifizierung nicht.',
      loginFailedTitle: 'Anmeldung fehlgeschlagen',
      loginFailedMessage: 'Anmeldung mit Apple nicht möglich. Bitte versuchen Sie es erneut.',
      footer: 'Mit dem Fortfahren stimmen Sie zu, Apple ID als einzige Anmeldemethode dieser App zu verwenden.',
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
      welcome: 'Bienvenido a ÍO',
      title: 'Iniciar sesión con Apple ID',
      description: 'Solo soportamos Apple Sign In para mantener seguros tus datos nutricionales.',
      appleUnavailableTitle: 'Apple Sign In no disponible',
      appleUnavailableMessage: 'Este dispositivo no admite autenticación de Apple.',
      loginFailedTitle: 'Error de inicio de sesión',
      loginFailedMessage: 'No se pudo iniciar sesión con Apple. Inténtalo de nuevo.',
      footer: 'Al continuar, aceptas usar Apple ID como único método de inicio de sesión de esta app.',
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
      welcome: 'Bem-vindo ao ÍO',
      title: 'Entrar com Apple ID',
      description: 'Apenas suportamos Apple Sign In para manter seus dados nutricionais seguros.',
      appleUnavailableTitle: 'Apple Sign In indisponível',
      appleUnavailableMessage: 'Este dispositivo não suporta autenticação da Apple.',
      loginFailedTitle: 'Falha no login',
      loginFailedMessage: 'Não foi possível entrar com Apple. Tente novamente.',
      footer: 'Ao continuar, você concorda em usar o Apple ID como o único método de login deste app.',
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
      welcome: 'Selamat datang di ÍO',
      title: 'Masuk dengan Apple ID',
      description: 'Kami hanya mendukung Apple Sign In agar data nutrisi Anda tetap aman.',
      appleUnavailableTitle: 'Apple Sign In tidak tersedia',
      appleUnavailableMessage: 'Perangkat ini tidak mendukung autentikasi Apple.',
      loginFailedTitle: 'Gagal masuk',
      loginFailedMessage: 'Tidak dapat masuk dengan Apple. Silakan coba lagi.',
      footer: 'Dengan melanjutkan, Anda setuju menggunakan Apple ID sebagai satu-satunya metode masuk aplikasi ini.',
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
      welcome: 'ยินดีต้อนรับสู่ ÍO',
      title: 'เข้าสู่ระบบด้วย Apple ID',
      description: 'เรารองรับเฉพาะ Apple Sign In เพื่อรักษาความปลอดภัยข้อมูลโภชนาการของคุณ',
      appleUnavailableTitle: 'ไม่สามารถใช้งาน Apple Sign In ได้',
      appleUnavailableMessage: 'อุปกรณ์นี้ไม่รองรับการยืนยันตัวตนของ Apple',
      loginFailedTitle: 'เข้าสู่ระบบไม่สำเร็จ',
      loginFailedMessage: 'ไม่สามารถเข้าสู่ระบบด้วย Apple ได้ โปรดลองอีกครั้ง',
      footer: 'การดำเนินการต่อหมายความว่าคุณยอมรับให้ใช้ Apple ID เป็นวิธีเข้าสู่ระบบเพียงวิธีเดียวของแอปนี้',
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
    },
    infoPage: {
      title: 'ข้อมูลบัญชี',
      fullName: 'ชื่อ-นามสกุล',
      email: 'ที่อยู่อีเมล',
      appleId: 'Apple ID',
      region: 'ประเทศ / ภูมิภาค',
      appVersion: 'เวอร์ชันแอป',
    },
  },
};

type FullDictionary = Dictionary & {
  scan: NonNullable<Required<Dictionary['scan']>>;
  result: NonNullable<Dictionary['result']>;
  infoPage: NonNullable<Dictionary['infoPage']>;
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

  return {
    ...dict,
    scan: scan as Required<NonNullable<Dictionary['scan']>>,
    result: dict.result ?? dictionaries.us.result!,
    infoPage: dict.infoPage ?? dictionaries.us.infoPage!,
  };
}
