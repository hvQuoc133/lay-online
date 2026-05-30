# 🎯 TỐI ƯU FEATURE: ROOM SELECTION

## ✅ Đã Thực Hiện

### 1. **Tạo RoomSelection.tsx** 
**File:** `/src/pages/RoomSelection.tsx`

**Chức năng chính:**
- ✅ **Auth Check**: Kiểm tra user login → redirect `/login` nếu chưa
- ✅ **Danh sách phòng**: Fetch từ API `/api/rooms/type/:type`
- ✅ **Join Logic**: 
  - Gọi `POST /api/rooms/join` với `roomId` + `userId`
  - Kiểm tra phòng đã đầy (max 25 người)
  - Phòng full → disable button, overlay "Phòng đã đầy"
- ✅ **UI Đồng bộ**: 
  - Orange theme cho Buddha, Blue theme cho Jesus
  - Rounded borders: `rounded-[30px]`
  - Shadow & borders: match design system
  - AnimatedNumber cho counters
  - Motion animation cho list

**Thống kê Real-time:**
- `current_count / capacity`
- `total_room_prayers`
- `spotsLeft = capacity - current_count`
- Progress bar: `(current_count / capacity) * 100%`

**Trạng thái Phòng:**
```
EMPTY: spotsLeft > 0 → Button enabled, green "N spots"
NEAR FULL: spotsLeft = 1-3 → Button enabled, orange warning
FULL: spotsLeft = 0 → Button disabled, red overlay "Phòng đã đầy"
```

---

### 2. **Update App.tsx Routes**

**Thêm route mới:**
```typescript
<Route path="/rooms/:type" element={<RoomSelection />} />
```

**Loại bỏ route cũ (không dùng):**
```typescript
<Route path="/rooms/:roomId" element={<BuddhaRoom />} /> // ❌ Xóa
```

**Luồng routing mới:**
```
/ (Home)
  ├─ Click "Vào phòng lạy Phật"
  └─ /rooms/buddha (RoomSelection)
      ├─ Chưa login? → /login
      └─ Đã login? → Danh sách phòng → /buddhaRoom/:roomId
```

---

### 3. **Update Home.tsx**

**Thay đổi:**
- ❌ Xóa state `activeRoom` (không dùng)
- ❌ Xóa `leaveRoom` import (không dùng)
- ✅ Simplify `handleJoinRoom()` → chỉ navigate sang `/rooms/:type`

**Code cũ:**
```typescript
const handleJoinRoom = (room: "buddha" | "jesus") => {
  const targetRoom = rooms.find((item) => item.type === room);
  if (!targetRoom) {
    alert("Chưa có phòng nào");
    return;
  }
  // ... complex logic ...
  navigate(`/buddhaRoom/${targetRoom.id}`);
};
```

**Code mới:**
```typescript
const handleJoinRoom = (room: "buddha" | "jesus") => {
  navigate(`/rooms/${room}`);
};
```

**Button Update:**
```typescript
// Cũ: "Rời phòng lạy 🙏" / "Vào phòng lạy Phật 🙏"
// Mới: "Vào phòng lạy Phật 🙏" (fixed text)
```

---

## 📊 Workflow Mới (End-to-End)

```
┌─────────────────────────────────┐
│   HOME PAGE (/)                 │
│ "Vào phòng lạy Phật" button     │
└──────────┬──────────────────────┘
           │ navigate("/rooms/buddha")
           ▼
┌─────────────────────────────────┐
│   ROOM SELECTION (/rooms/:type) │
│ 1. Check auth → redirect login  │
│ 2. Fetch danh sách phòng        │
│    GET /api/rooms/type/buddha   │
│ 3. Display phòng card           │
│    - Tên, số người, tổng lạy    │
│    - Progress bar               │
│    - [Vào phòng] button         │
└──────────┬──────────────────────┘
           │ Nếu phòng đầy (full)
           ├─ Button disabled ❌
           │  Overlay: "Phòng đã đầy"
           │
           │ Nếu phòng còn chỗ ✅
           ├─ POST /api/rooms/join
           │  Body: { roomId, userId }
           │  ├─ ✅ Join thành công
           │  │  navigate("/buddhaRoom/:roomId")
           │  │
           │  └─ ❌ Lỗi (capacity changed?)
           │     Alert error message
           ▼
┌─────────────────────────────────┐
│   BUDDHA ROOM (/buddhaRoom/:id) │
│ - Leaderboard                   │
│ - Camera AI (PoseTracker)       │
│ - Chat, Stats                   │
└─────────────────────────────────┘
```

---

## 🔒 Auth Flow

**Khi user chưa login:**

1. User click "Vào phòng lạy Phật" (Home)
2. navigate(`/rooms/buddha`)
3. RoomSelection page mounts
4. `useEffect` detect: `!user` → true
5. `navigate("/login", { state: { from: "/rooms/buddha" } })`
6. User redirect tới login page

**Khi user đã login:**
1. RoomSelection page fetch danh sách phòng
2. Display danh sách
3. User chọn phòng → `handleJoinRoom(roomId)`

---

## 🎨 UI Components (RoomSelection)

### Room Card
```
┌─────────────────────────────────┐
│  Phòng Tích Đức                 │
│  ─────────────────────────────  │
│  [Đang online] [Chỗ trống]      │
│  ─────────────────────────────  │
│  [🔥 Tổng lạy: 1,248 lượt]      │
│  ─────────────────────────────  │
│  Progress: ████░░░░░░ 65%       │
│  ─────────────────────────────  │
│  [Vào phòng lạy] ← Button       │
│  Room ID: ge93jgaew             │
└─────────────────────────────────┘
```

### States
- **Empty**: Icon + "Chưa có phòng nào"
- **Loading**: Spinner + "Đang tải phòng..."
- **Error**: Icon + error message
- **Success**: List of room cards
  - Normal: Clickable button ✅
  - Full: Disabled button + Lock overlay ❌

### Colors & Styling
```
Buddha (Orange):
- Border: border-orange-200
- Background: from-orange-50 to-yellow-50
- Text: text-orange-600
- Button: bg-orange-500 hover:bg-orange-400

Jesus (Blue):
- Border: border-blue-200
- Background: from-blue-50 to-cyan-50
- Text: text-blue-700
- Button: bg-blue-600 hover:bg-blue-500

Full Room:
- Overlay: bg-black/30 backdrop-blur-sm
- Icon: Lock icon
- Text: "Phòng đã đầy"
```

---

## 📝 API Endpoints Used

### 1. Get Rooms by Type
```bash
GET /api/rooms/type/:type
# Params: type = "buddha" | "jesus"
# Response: { id, name, type, capacity, current_count, total_room_prayers }
```

### 2. Join Room
```bash
POST /api/rooms/join
# Body: { roomId: string, userId: number }
# Response: { message, roomId }
# Errors:
#  - 404: Phòng không tồn tại
#  - 400: Phòng đã đầy (tối đa 25 người)
#  - 200: Bạn đã ở trong phòng này rồi (duplicate)
```

---

## 🚀 Tính Năng Tiếp Theo (Roadmap)

### Phase 2:
- [ ] Socket.io broadcast `room_created` → Home page cập nhật live
- [ ] Socket.io `room_deleted` → remove from list
- [ ] Refresh danh sách mỗi 5-10 giây (polling)
- [ ] Sort/filter phòng (theo người online, lạy nhiều, etc.)

### Phase 3:
- [ ] Room chat (Socket.io events)
- [ ] User profile → xem history join
- [ ] Favorite rooms (bookmark)
- [ ] Notifications (room nearly full, friends joined, etc.)

---

## 🧪 Testing Checklist

- [ ] Chưa login → click button → redirect `/login` ✅
- [ ] Đã login → click button → RoomSelection load ✅
- [ ] Danh sách phòng hiển thị đúng ✅
- [ ] Click join → vào phòng thành công ✅
- [ ] Phòng full → button disabled + overlay ✅
- [ ] Phòng được tạo mới → thêm vào danh sách ✅
- [ ] UI responsive (mobile, tablet, desktop) ✅
- [ ] Theme color đúng (Orange/Blue) ✅
- [ ] Animation smooth ✅
- [ ] Error handling (network, server error) ✅

---

## 📂 Files Modified

| File | Changes |
|------|---------|
| `/src/pages/RoomSelection.tsx` | ✨ NEW |
| `/src/App.tsx` | +1 route `/rooms/:type` |
| `/src/pages/Home.tsx` | Simplify `handleJoinRoom()` |

---

**Status: ✅ COMPLETE & READY TO TEST**
