# Kế Hoạch Cải Tiến UI Bảng Dữ Liệu & Triển Khai Song Ngữ VN/EN

Kế hoạch này giải quyết chính xác các điểm tồn đọng trên giao diện theo ảnh chụp thực tế và yêu cầu mới của bạn, đồng thời xây dựng hệ thống chuyển đổi ngôn ngữ Việt - Anh trực quan trên Header.

---

## 1. Phân Tích & Giải Pháp Cho Từng Trang Dữ Liệu

### A. Quản Lý Khách Hàng (`CustomerList.tsx` / `CustomersView.tsx`)
- **Bỏ cột "LOẠI KH"**: Loại bỏ hoàn toàn cột Loại KH để mở rộng không gian cho bảng dữ liệu, vì ở cột Khách hàng đã có phân loại rõ ràng (Tên công ty cho Doanh nghiệp, hoặc nhãn "Cá nhân" ở dòng phụ).
- **Đổi tên tiêu đề**: Đổi `CÔNG TY / HỌ TÊN` thành **`KHÁCH HÀNG`**.
- Điều chỉnh lại độ rộng các cột còn lại để dàn trang cân đối, thanh lịch.

### B. Quản Lý Booking (`BookingList.tsx`)
- **Khắc phục triệt để lỗi ngắt dòng ở cột "Kiện / CW"**:
  - *Hiện trạng trong ảnh*: Số `10` và `12.5` bị ngắt dòng rơi chữ `kg` xuống dòng dưới thành 4 mảnh vụn rời rạc.
  - *Giải pháp mới*:
    - Thiết lập `whitespace-nowrap` tuyệt đối cho từng nhóm số liệu.
    - Dòng 1 (Số kiện): Nếu có tách kiện/thay đổi số kiện thực tế sau cân đo: Hiển thị dạng so sánh rõ ràng: `<del className="text-slate-400">1 kiện</del> ➔ <span className="font-bold text-slate-800">2 kiện</span>` (hoặc `2 kiện` chuẩn).
    - Dòng 2 (Cân nặng CW): Hiển thị hàng ngang liền mạch có mũi tên chuyển đổi: `<del className="text-slate-400">10 kg</del> ➔ <span className="font-bold text-rose-600">12.5 kg</span>` (kèm biểu tượng cân đo `Scale`).
- **Nút "Xóa" đồng bộ**:
  - Thêm nhãn chữ **"Xóa"** bên cạnh icon thùng rác, định dạng viền và kích thước đồng bộ hoàn hảo với 2 nút **"Sửa"** và **"Gửi"** (`px-2.5 py-1 text-xs font-bold border rounded flex items-center gap-1`).
- **Mở rộng cột "Ghi chú"**:
  - Tăng độ rộng cột Ghi chú bằng với cột Tên hàng (`w-[230px]`), áp dụng `FixedWrapTextBox` để ghi chú dài tự xuống dòng tối đa 3 dòng và không bị xô lệch bảng.
- **Đổi tên cột**:
  - Đổi `TÊN HÀNG TRÊN BILL` thành **`TÊN HÀNG`**.

### C. Quản Lý Vận Đơn (`WaybillList.tsx`)
- **Bỏ chữ "CW" thừa**:
  - Đổi từ `45 kg CW` thành **`45 kg`** gọn gàng, đúng chuẩn vận đơn quốc tế.
- **Tối ưu lại giao diện cột "Hành trình"**:
  - *Hiện trạng trong ảnh*: Badge chữ song ngữ dài dòng `In Transit (Đang vận chuyển)` bị vỡ 2 dòng trong khung tròn nhìn chật chội.
  - *Thiết kế mới*: Chuyển thành badge trạng thái tinh gọn kèm **chấm tròn màu tiến độ (status dot)**:
    - 🔵 `Đang vận chuyển` (Chấm xanh dương phát sáng)
    - 🟡 `Thông quan` (Chấm vàng cam)
    - 🟢 `Giao thành công` (Chấm xanh lá)
  - Khi hover rê chuột, tooltip hiển thị chi tiết tiến trình vận chuyển.

---

## 2. Phương Án Triển Khai Tính Năng Song Ngữ (VN / EN)

Xây dựng hệ sinh thái ngôn ngữ linh hoạt và trực quan:
- **Language Switcher trên Header**:
  - Bổ sung nút chuyển đổi ngôn ngữ dạng pill hiện đại trên thanh Header chính (cạnh nút chuyển vai trò CTV / Điều hành): `🇻🇳 VN | 🇬🇧 EN`.
  - Lưu trạng thái ngôn ngữ đã chọn vào `localStorage` để duy trì giữa các lần tải trang.
- **Bộ Từ Điển i18n Tinh Gọn (`src/locales/i18n.ts`)**:
  - Định nghĩa bộ từ khóa chuẩn xác cho ngành logistics quốc tế:
    - Sidebar: Dashboard / Tổng quan, CRM / Cơ hội, Customers / Khách hàng, Bookings / Booking, Waybills / Vận đơn, RFQs / Báo giá, Accounting / Công nợ, Settings / Cài đặt.
    - Tiêu đề cột bảng: Tracking, Carrier, Route, Goods Name, Packages / CW, Status, Notes, Actions.
    - Nút bấm: Create Booking / Tạo Booking, Edit / Sửa, Send / Gửi, Delete / Xóa.

---

## 3. Các Tệp Sẽ Tạo & Chỉnh Sửa
1. `src/context/LanguageContext.tsx`: Context quản lý ngôn ngữ toàn cục (`vi` / `en`) và hook `useTranslation()`.
2. `src/locales/translations.ts`: Bộ từ điển song ngữ hoàn chỉnh cho toàn app.
3. `src/components/common/Header.tsx`: Bổ sung nút chuyển đổi ngôn ngữ `VN | EN`.
4. `src/components/customers/CustomerList.tsx`: Xóa cột Loại KH, đổi tên cột thành Khách hàng, tinh chỉnh độ rộng.
5. `src/components/booking/BookingList.tsx`: Sửa lỗi hiển thị cột Kiện/CW, thêm chữ nút Xóa, mở rộng cột Ghi chú lên 230px, đổi tên cột Tên hàng.
6. `src/components/waybill/WaybillList.tsx`: Xóa chữ CW thừa, làm mới cột Hành trình với status dot và badge tinh gọn.

---

## 4. Kế Hoạch Kiểm Tra & Đảm Bảo Chất Lượng (Verification)
- Kiểm tra bảng Khách hàng: Cột Loại KH đã được lược bỏ, cột "Khách hàng" hiển thị cả tên và phân loại công ty / cá nhân gọn gàng.
- Kiểm tra bảng Booking: Cột Kiện/CW hiển thị rõ ràng trên từng dòng ngang liền mạch `10 kg ➔ 12.5 kg` không bị ngắt dòng. Nút Xóa có chữ đồng bộ. Cột Ghi chú rộng bằng Tên hàng.
- Kiểm tra bảng Vận đơn: Chữ CW đã được bỏ, cột Hành trình hiển thị badge chấm màu trực quan và đẹp mắt.
- Kiểm tra tính năng song ngữ: Chuyển đổi giữa VN và EN mượt mà trên toàn hệ thống.
- Chạy `lint_applet` và `compile_applet` để xác nhận không có lỗi mã nguồn.
