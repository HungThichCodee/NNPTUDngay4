# Postman / cURL Test Commands

Dưới đây là các lệnh để test API tạo Role và User.

## 1. Tạo Role mới (POST /roles)

```bash
curl --location 'http://localhost:3000/roles' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Nhân viên kiểm duyệt",
    "description": "Chịu trách nhiệm kiểm duyệt bài viết trước khi xuất bản"
}'
```

**Kết quả mong đợi:** Trả về status `201 Created` và JSON của role mới với `id` được sinh tự động (ví dụ: `r-...`).

---

## 2. Tạo User mới (POST /users)

_Lưu ý: `roleId` được sử dụng ở đây là `r3` (Người dùng) đã có sẵn trong dữ liệu mẫu để đảm bảo request thành công._

```bash
curl --location 'http://localhost:3000/users' \
--header 'Content-Type: application/json' \
--data '{
    "username": "nguyenvanmoi",
    "password": "password123",
    "email": "moi@example.com",
    "fullName": "Nguyễn Văn Mới",
    "roleId": "r3"
}'
```

**Kết quả mong đợi:** Trả về status `201 Created` và JSON của user mới.
