# ío — AI Nutrition Scanner for Asians

> “Ăn gì cũng biết có hợp cơ thể bạn không”

---

# 1. Vision

ío là một AI nutrition scanner dành cho người Châu Á.

App giúp người dùng:
- scan món ăn
- hiểu calories & nutrition
- biết món đó có phù hợp với cơ thể/hệ ăn của họ không

Target users:
- gan nhiễm mỡ
- gym
- eat clean
- giảm cân
- keto
- low carb
- tiểu đường nhẹ

---

# 2. Core Problem

## 2.1 Người dùng không biết món ăn “xấu” cỡ nào

Ví dụ:
- cơm tấm
- trà sữa
- đồ chiên
- mì cay

Họ biết không healthy.

Nhưng không biết:
- bao nhiêu calories
- nhiều dầu không
- nhiều đường không
- sodium cao không
- có nên ăn thường xuyên không

---

## 2.2 Nutrition label quá khó hiểu

Ví dụ:
- saturated fat
- sodium
- trans fat

Đa số user:
- không hiểu
- không biết mức nguy hiểm

---

## 2.3 App hiện tại quá “Tây”

Nhiều app:
- không hiểu món Việt
- không hiểu khẩu phần Châu Á

Ví dụ:
- bún bò
- hủ tiếu
- cơm tấm
- bánh mì

=> AI US xử lý khá tệ.

Đây là cơ hội lớn.

---

# 3. Product Positioning

## Main positioning

“AI nutrition scanner for Asians”

---

## Emotional positioning

“Ăn ngon nhưng vẫn hiểu cơ thể mình”

---

## Personality

KHÔNG:
- bệnh viện
- clinical
- lạnh lùng

NÊN:
- friendly
- modern
- minimal
- giống AI companion

Ví dụ:

✅
“Món này ngon nhưng hơi nhiều dầu 😅”

❌
“High saturated fat detected.”

---

# 4. MVP V1

## Chỉ cần 3 chức năng

---

## 4.1 Scan món ăn

User có thể:
- chụp đồ ăn
- scan menu
- scan barcode

---

## 4.2 AI phân tích

Trả về:
- calories
- protein
- carb
- fat
- sugar
- sodium
- health insight

Ví dụ:

Cơm tấm sườn bì chả
- ~950 kcal
- dầu mỡ cao
- sodium cao
- protein tốt
- không phù hợp nếu bạn đang giảm mỡ gan

---

## 4.3 Health Score

Ví dụ:
- 92/100 → excellent
- 65/100 → moderate
- 30/100 → avoid frequently

User cực thích dạng “score”.

---

# 5. Premium Features

## 5.1 “Phù hợp với bạn không?”

User setup:
- gym tăng cơ
- low carb
- fatty liver
- keto
- giảm cân

=> cùng một món nhưng AI đánh giá khác nhau.

Ví dụ:
- chuối tốt cho gym
- không tốt cho keto

---

## 5.2 Burn Time

“Nếu ăn món này thì cần chạy bộ bao lâu?”

Ví dụ:
- trà sữa size L
= 47 phút chạy bộ

Feature cực viral.

---

## 5.3 Daily Balance

AI đánh giá:
- hôm nay ăn quá nhiều dầu?
- thiếu protein?
- quá nhiều đường?

---

## 5.4 Weekly Health Insight

Ví dụ:
- tuần này sodium quá cao
- protein đang thiếu
- đồ chiên tăng 43%

---

# 6. Tech Stack

# Mobile

## Flutter

Lý do:
- launch nhanh iOS + Android
- UI đẹp nhanh
- cost thấp
- MVP nhanh

---

# Backend

## Golang

Responsibilities:
- auth
- AI API
- image processing
- queue
- subscription
- analytics

---

# Database

## PostgreSQL

---

# Storage

## S3 / Cloudflare R2

---

# Queue

## Redis + Asynq

Dùng để:
- xử lý scan async
- retry AI jobs
- analytics

---

# 7. Backend Architecture

```text
Flutter App
    ↓
API Gateway (Go)
    ↓
Auth Middleware
    ↓
Scan Service
    ↓
AI Vision Service
    ↓
Nutrition Analyzer
    ↓
Health Scoring Engine
    ↓
PostgreSQL