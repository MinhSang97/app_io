APP_NAME := io

.PHONY: help install start web ios android prebuild build-device build-android clean clean-all build-local build-local-release

help:
	@echo "Available commands:"
	@echo ""
	@echo "  Development (Expo Go):"
	@echo "    make install       Install dependencies"
	@echo "    make start         Start Expo dev server"
	@echo "    make web           Run the app on web"
	@echo "    make ios           Run the app on iOS simulator (Expo Go)"
	@echo "    make android       Run the app on Android emulator (Expo Go)"
	@echo ""
	@echo "  Build (Device / Production):"
	@echo "    make build-dev     Build dev client for iOS device (EAS)"
	@echo "    make build-preview Build preview for iOS (EAS)"
	@echo "    make build-prod    Build production for iOS (EAS)"
	@echo "    make build-local   Build iOS locally in Debug mode (Metro required)"
	@echo "    make build-local-release Build iOS locally in Release mode (standalone)"
	@echo ""
	@echo "  Cleanup:"
	@echo "    make clean         Remove node_modules and lockfile"
	@echo "    make clean-all     Remove node_modules, lockfile, and native builds"

# ─── Development ──────────────────────────────────────────────

install:
	npm install --legacy-peer-deps

start:
	npx expo start

web:
	npx expo start --web

ios:
	npx expo start --ios

android:
	npx expo start --android

# ─── Build (EAS / Device) ────────────────────────────────────

build-dev:
	npx eas build --platform ios --profile development

build-preview:
	npx eas build --platform ios --profile preview

build-prod:
	npx eas build --platform ios --profile production

build-local:
	npx expo run:ios --device

build-local-release:
	npx expo run:ios --device --configuration Release

# ─── Cleanup ─────────────────────────────────────────────────

clean:
	rm -rf node_modules package-lock.json

clean-all:
	rm -rf node_modules package-lock.json ios android .expo dist
