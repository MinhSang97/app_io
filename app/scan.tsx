import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Camera as CameraIcon, ArrowLeftRight, CameraOff, Sparkles, Upload, UtensilsCrossed, X, User, Info, LogOut, Settings, History } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { useMealPermissions } from '../src/hooks/use_meal_permissions';
import { getLocale } from '../src/lib/localization';
import { useAuthStore } from '../src/store/auth';
import { useAppTheme } from '../src/hooks/use_app_theme';
import { PrimaryButton, Screen, spacing } from '@/src/ui';
import { performSignOut } from '../src/lib/auth_session';
import { createScan } from '../src/apis/scan';


export default function ScanScreen() {
  const { syncPermissions } = useMealPermissions();
  const selectedCountry = useAuthStore((state) => state.selectedCountry);
  const locale = getLocale(selectedCountry);
  const { colors, isDark, palette } = useAppTheme();
  const user = useAuthStore((state) => state.user);

  const steps = useMemo(() => [
    {
      title: locale.scan.step1Title,
      description: locale.scan.step1Desc,
      icon: CameraIcon,
    },
    {
      title: locale.scan.step2Title,
      description: locale.scan.step2Desc,
      icon: Sparkles,
    },
    {
      title: locale.scan.step3Title,
      description: locale.scan.step3Desc,
      icon: UtensilsCrossed,
    },
  ], [locale]);

  const didInitialCheckRef = useRef(false);
  const [pickedImageUris, setPickedImageUris] = useState<string[]>([]);
  const [sliderWidth, setSliderWidth] = useState(Dimensions.get('window').width - 90);
  const [fullscreenImageUri, setFullscreenImageUri] = useState<string | null>(null);
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(280)).current;

  const openSidebar = () => {
    setUserMenuOpen(true);
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = (callback?: () => void) => {
    Animated.timing(sidebarAnim, {
      toValue: 280,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setUserMenuOpen(false);
      if (callback) callback();
    });
  };

  const handleShowInfo = () => {
    closeSidebar(() => {
      router.push('/info');
    });
  };

  const handleShowSettings = () => {
    closeSidebar(() => {
      router.push('/settings');
    });
  };

  const handleShowHistory = () => {
    closeSidebar(() => {
      router.push('/history');
    });
  };


  const handleLogout = () => {
    Alert.alert(
      locale.scan.logout,
      selectedCountry === 'vn' ? 'Bạn có chắc chắn muốn đăng xuất không?' : 'Are you sure you want to log out?',
      [
        { text: selectedCountry === 'vn' ? 'Hủy' : 'Cancel', style: 'cancel' },
        { 
          text: locale.scan.logout, 
          style: 'destructive',
          onPress: () => {
            closeSidebar(() => {
              void performSignOut().then(() => router.replace('/'));
            });
          }
        }
      ]
    );
  };
  
  const [cameraOpen, setCameraOpen] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [savePromptVisible, setSavePromptVisible] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleProcessScan = async () => {
    if (pickedImageUris.length === 0) return;
    setIsScanning(true);
    try {
      const params = {
        images: pickedImageUris.map((uri) => {
          const filename = uri.split('/').pop() || 'image.jpg';
          const ext = filename.split('.').pop()?.toLowerCase();
          let type = 'image/jpeg';
          if (ext === 'png') type = 'image/png';
          else if (ext === 'gif') type = 'image/gif';
          else if (ext === 'webp') type = 'image/webp';
          else if (ext === 'heic') type = 'image/heic';
          else if (ext === 'heif') type = 'image/heif';

          return {
            uri,
            name: filename,
            type,
          };
        }),
      };

      const res = await createScan(params);
      if (res.success && res.data?.data?.id) {
        setPickedImageUris([]);
        router.push({
          pathname: '/result',
          params: { id: res.data.data.id },
        });
      } else {
        Alert.alert(
          selectedCountry === 'vn' ? 'Lỗi phân tích' : 'Analysis Failed',
          res.error || (selectedCountry === 'vn' ? 'Đã xảy ra lỗi khi phân tích món ăn.' : 'Failed to analyze the meal. Please try again.')
        );
      }
    } catch (err: any) {
      Alert.alert(
        selectedCountry === 'vn' ? 'Lỗi kết nối' : 'Connection Error',
        err.message || (selectedCountry === 'vn' ? 'Đã xảy ra lỗi khi kết nối với máy chủ.' : 'Connection error. Please try again.')
      );
    } finally {
      setIsScanning(false);
    }
  };


  useEffect(() => {
    if (didInitialCheckRef.current) return;
    didInitialCheckRef.current = true;
    
    syncPermissions().then((snapshot) => {
      const hasAll = snapshot.cameraGranted && snapshot.mediaGranted;
      if (!hasAll) {
        router.replace('/permissions');
      }
    });
  }, [syncPermissions]);

  const handlePickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.9,
      });

      if (!result.canceled) {
        const uris = result.assets.map((asset) => asset.uri);
        setPickedImageUris(uris);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setPickedImageUris((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleOpenCamera = async () => {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert('Camera permission required', 'Please allow camera access to take photos.');
        return;
      }
    }
    setCameraOpen(true);
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9, skipProcessing: true });
      setCapturedImageUri(photo.uri);
      setSavePromptVisible(true);
    } catch {
      Alert.alert('Capture failed', 'Could not take a photo. Please try again.');
    }
  };

  const handleSaveCapturedImage = async () => {
    if (!capturedImageUri) return;
    try {
      const permission = await MediaLibrary.getPermissionsAsync();
      const hasPermission = permission.granted || (await MediaLibrary.requestPermissionsAsync()).granted;
      if (!hasPermission) {
        Alert.alert('Permission required', 'Please allow photo library access to save the image.');
        return;
      }

      await MediaLibrary.createAssetAsync(capturedImageUri);
      setSavePromptVisible(false);
      setCameraOpen(false);
      setPickedImageUris((prev) => [...prev, capturedImageUri]);
      setCapturedImageUri(null);
    } catch {
      Alert.alert('Save failed', 'Could not save the photo to your library.');
    }
  };

  const handleDiscardCapturedImage = () => {
    setSavePromptVisible(false);
    setCapturedImageUri(null);
  };

  if (cameraOpen) {
    return (
      <View className="flex-1 bg-black">
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />

        <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-6 pb-4 pt-14">
          <Pressable onPress={() => setCameraOpen(false)} className="rounded-full bg-black/60 p-3">
            <X size={20} color="#fff" />
          </Pressable>

          <Pressable onPress={() => setFacing((current) => (current === 'back' ? 'front' : 'back'))} className="rounded-full bg-black/60 p-3">
            <ArrowLeftRight size={20} color="#fff" />
          </Pressable>
        </View>

        <View className="absolute inset-x-0 bottom-0 px-6 pb-10">
          <View className="rounded-[28px] border border-white/10 bg-black/70 p-5">
            <Text className="text-center text-lg font-semibold text-white">{locale.scan.cameraReady}</Text>
            <Text className="mt-2 text-center text-sm text-zinc-300">
              {locale.scan.cameraDesc}
            </Text>
            <View className="mt-4 flex-row gap-3">
              <Pressable onPress={handleCapture} className="flex-1 rounded-2xl bg-emerald-400 py-3">
                <View className="flex-row items-center justify-center gap-2">
                  <CameraOff size={18} color="#09090b" />
                  <Text className="text-base font-bold text-zinc-950">{locale.scan.capture}</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => setCameraOpen(false)} className="rounded-2xl border border-white/15 px-4 py-3">
                <Text className="text-base font-bold text-white">{locale.scan.close}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Modal visible={savePromptVisible} transparent animationType="fade" onRequestClose={handleDiscardCapturedImage}>
          <View className="flex-1 items-center justify-center bg-black/70 px-6">
            <View className="w-full rounded-[28px] border border-white/10 bg-zinc-950 p-6">
              <Text className="text-xl font-bold text-white">{locale.scan.savePhotoTitle}</Text>
              <Text className="mt-3 text-base leading-6 text-zinc-400">
                {locale.scan.savePhotoDesc}
              </Text>

              {capturedImageUri ? (
                <Image source={{ uri: capturedImageUri }} style={{ width: '100%', height: 220, marginTop: 16, borderRadius: 20 }} />
              ) : null}

              <View className="mt-5 gap-3">
                <Pressable onPress={handleSaveCapturedImage} className="rounded-2xl bg-emerald-400 py-4">
                  <Text className="text-center text-base font-bold text-zinc-950">{locale.scan.yesSave}</Text>
                </Pressable>
                <Pressable onPress={handleDiscardCapturedImage} className="rounded-2xl border border-white/10 bg-white/5 py-4">
                  <Text className="text-center text-base font-bold text-white">{locale.scan.noDiscard}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  const scanFooter = (
    <PrimaryButton
      palette={palette}
      label={pickedImageUris.length > 0 ? locale.scan.process : locale.scan.scan}
      onPress={pickedImageUris.length > 0 ? handleProcessScan : handleOpenCamera}
    />
  );

  return (
    <Screen palette={palette} footer={scanFooter}>
      <View style={scanStyles.topRow}>
        <View style={scanStyles.topText}>
          <Text style={[scanStyles.eyebrow, { color: palette.accent }]}>{locale.scan.appSubtitle}</Text>
          <Text style={[scanStyles.title, { color: palette.text }]}>{locale.scan.title}</Text>
        </View>
        <Pressable
          onPress={openSidebar}
          style={[scanStyles.menuButton, { backgroundColor: palette.cardBg, borderColor: palette.border }]}
        >
          <User size={22} color={palette.text} />
        </Pressable>
      </View>
      <Text style={[scanStyles.description, { color: palette.subText }]}>{locale.scan.description}</Text>
 
      <Modal visible={userMenuOpen} transparent animationType="fade" onRequestClose={() => closeSidebar()}>
        <View className="flex-1 flex-row">
          {/* Backdrop */}
          <Pressable className="flex-1 bg-black/60" onPress={() => closeSidebar()} />
          
          {/* Sidebar */}
          <Animated.View 
            style={{
              transform: [{ translateX: sidebarAnim }],
              width: 280,
            }}
            className={`h-full border-l pt-16 px-6 pb-12 justify-between ${colors.bg} ${colors.border}`}
          >
            {/* Top part */}
            <View>
              {/* Close button row */}
              <View className="flex-row justify-end mb-4">
                <Pressable onPress={() => closeSidebar()} className={`rounded-full p-2.5 active:opacity-75 ${colors.closeButtonBg}`}>
                  <X size={20} color={isDark ? '#fff' : '#000'} />
                </Pressable>
              </View>
 
              {/* User Avatar & Name */}
              <View className={`items-center mb-8 pb-6 border-b ${colors.border}`}>
                <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 border ${colors.emeraldBg}`}>
                  <User size={38} color={isDark ? '#34d399' : '#059669'} />
                </View>
                <Text className={`text-lg font-bold text-center ${colors.text}`} numberOfLines={1}>
                  {user?.username?.trim() || 'F Calories User'}
                </Text>
                <Text className={`text-xs mt-1 text-center ${colors.subText}`} numberOfLines={1}>
                  {user?.email?.trim() || 'No email shared'}
                </Text>
              </View>
 
              {/* Sidebar Menu Options */}
              <View className="gap-3">
                <Pressable 
                  onPress={handleShowInfo} 
                  className={`flex-row items-center gap-3.5 px-4 py-3.5 rounded-2xl border ${colors.rowBg} ${colors.borderOnly}`}
                >
                  <Info size={20} color={isDark ? '#a1a1aa' : '#71717a'} />
                  <Text className={`text-base font-semibold ${colors.text}`}>{locale.scan.info}</Text>
                </Pressable>

                <Pressable 
                  onPress={handleShowHistory} 
                  className={`flex-row items-center gap-3.5 px-4 py-3.5 rounded-2xl border ${colors.rowBg} ${colors.borderOnly}`}
                >
                  <History size={20} color={isDark ? '#a1a1aa' : '#71717a'} />
                  <Text className={`text-base font-semibold ${colors.text}`}>{locale.historyPage.title}</Text>
                </Pressable>
 
                <Pressable 
                  onPress={handleShowSettings} 
                  className={`flex-row items-center gap-3.5 px-4 py-3.5 rounded-2xl border ${colors.rowBg} ${colors.borderOnly}`}
                >
                  <Settings size={20} color={isDark ? '#a1a1aa' : '#71717a'} />
                  <Text className={`text-base font-semibold ${colors.text}`}>{locale.settingsPage.title}</Text>
                </Pressable>
              </View>
            </View>
 
            {/* Bottom part: Logout */}
            <View>
              <Pressable 
                onPress={handleLogout} 
                className="flex-row items-center gap-3.5 bg-red-500/10 active:bg-red-500/15 px-4 py-3.5 rounded-2xl"
              >
                <LogOut size={20} color="#f87171" />
                <Text className="text-base font-semibold text-red-400">{locale.scan.logout}</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <View className={`mt-8 overflow-hidden rounded-[32px] border p-5 ${colors.card}`}>
        {pickedImageUris.length > 0 ? (
          <View 
            className={`overflow-hidden rounded-[28px] ${isDark ? 'bg-zinc-900/80' : 'bg-black/5'}`}
            onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
          >
            {pickedImageUris.length === 1 ? (
              <View className="relative w-full">
                <Pressable onPress={() => setFullscreenImageUri(pickedImageUris[0])}>
                  <Image source={{ uri: pickedImageUris[0] }} style={{ width: '100%', height: 280 }} resizeMode="cover" />
                </Pressable>
                <Pressable
                  onPress={() => handleRemoveImage(0)}
                  className="absolute right-3 top-3 rounded-full bg-black/60 p-2"
                >
                  <X size={16} color="#fff" />
                </Pressable>
              </View>
            ) : (
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} className="h-[280px]">
                {pickedImageUris.map((uri, index) => (
                  <View key={index} className="relative" style={{ width: sliderWidth }}>
                    <Pressable onPress={() => setFullscreenImageUri(uri)} style={{ width: '100%', height: '100%' }}>
                      <Image 
                        source={{ uri }} 
                        style={{ width: '100%', height: '100%' }} 
                        resizeMode="cover" 
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => handleRemoveImage(index)}
                      className="absolute right-3 top-3 rounded-full bg-black/60 p-2"
                    >
                      <X size={16} color="#fff" />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )}
            <View className="px-4 py-4 flex-row justify-between items-center">
              <Text className={`text-sm ${colors.subText}`}>
                {pickedImageUris.length === 1
                  ? locale.scan.imageSelected
                  : locale.scan.imagesSelected.replace('{count}', String(pickedImageUris.length))}
              </Text>
              <Pressable onPress={handlePickImages} className={`rounded-xl px-4 py-2 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
                <Text className={`text-xs font-bold ${colors.text}`}>{locale.scan.change}</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={handlePickImages}
            className={`h-72 items-center justify-center rounded-[28px] border border-dashed ${isDark ? 'border-emerald-400/35 bg-zinc-900/80' : 'border-emerald-500/35 bg-black/5'}`}
          >
            <Upload size={48} color={isDark ? '#34d399' : '#059669'} />
            <Text className={`mt-4 text-lg font-semibold ${colors.text}`}>{locale.scan.uploadTitle}</Text>
            <Text className={`mt-2 text-center text-sm ${colors.subText}`}>{locale.scan.uploadDesc}</Text>
          </Pressable>
        )}
      </View>
 
      <View className="mt-8 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <View key={step.title} className={`flex-row items-start gap-4 rounded-2xl p-4 ${colors.rowBg}`}>
              <View className={`rounded-2xl p-3 ${isDark ? 'bg-emerald-500/15' : 'bg-emerald-500/10'}`}>
                <Icon size={20} color={isDark ? '#34d399' : '#059669'} />
              </View>
              <View className="flex-1">
                <Text className={`font-semibold ${colors.text}`}>{step.title}</Text>
                <Text className={`mt-1 leading-5 ${colors.subText}`}>{step.description}</Text>
              </View>
            </View>
          );
        })}
      </View>
 
      <Modal visible={!!fullscreenImageUri} transparent animationType="fade" onRequestClose={() => setFullscreenImageUri(null)}>
        <View className="flex-1 bg-black justify-center items-center">
          <Pressable onPress={() => setFullscreenImageUri(null)} className="absolute right-6 top-16 z-10 rounded-full bg-white/20 p-3">
            <X size={24} color="#fff" />
          </Pressable>
          {fullscreenImageUri && (
            <Image source={{ uri: fullscreenImageUri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          )}
        </View>
      </Modal>

      <Modal visible={isScanning} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/60 px-6">
          <View className="w-full max-w-[280px] rounded-[28px] border border-white/10 bg-zinc-950 p-6 items-center">
            <ActivityIndicator size="large" color="#34d399" />
            <Text className="mt-4 text-center text-base font-bold text-white">
              {selectedCountry === 'vn' ? 'AI đang phân tích món ăn...' : 'AI is analyzing your meal...'}
            </Text>
            <Text className="mt-2 text-center text-xs text-zinc-400">
              {selectedCountry === 'vn' ? 'Vui lòng chờ trong giây lát' : 'Please wait a moment'}
            </Text>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const scanStyles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  topText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: spacing.sm,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
