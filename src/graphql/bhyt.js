import { gql } from "@apollo/client/core";

// 1. ĐỊNH NGHĨA FRAGMENT TẬP HỢP TOÀN BỘ TRƯỜNG NGHIỆP VỤ BHXH/BHYT
export const KHACH_HANG_FIELDS_FRAGMENT = gql`
  fragment KhachHangFields on KhachHangBHYT {
    id
    userId
    maSoBhxh
    hoTen
    ngaySinh
    gioiTinh
    diaChiLienHe
    maHoGiaDinh
    maToKhaiRieng
    soDienThoai
    trangThai

    bhytTuNgay
    bhytDenNgay
    maSoTheBhyt
    ngay5NamLienTuc
    noiKcbBanDau
    donViDong
    theoDoiCoQuanBhxh

    bhxhTuNgay
    bhxhDenNgay
    nhacDongBhxh
    soThangBhxh
    phuongThucDong
    mucThuNhapBhxh
    donViDongBhxh

    soTienBhyt
    soTienBhxh
    ngayBienLaiBhyt
    ngayBienLaiBhxh
    userName
    nhanVienThu

    sdtDongTien
    sdtNhacHan
    tinhTrangHanThe
    ghiChu

    updatedAt
    createdAt
  }
`;

// 2. QUERY TRA CỨU DANH SÁCH / TÌM KIẾM SỬ DỤNG FRAGMENT
export const GET_DANH_SACH_BHYT = gql`
  query GetDanhSachBHYT {
    traCuuBHYT {
      ...KhachHangFields
    }
  }
  ${KHACH_HANG_FIELDS_FRAGMENT}
`;

// 3. MUTATION UPSERT ĐỒNG BỘ SỬ DỤNG FRAGMENT TRẢ VỀ
export const UPSERT_KHACH_HANG_BHYT = gql`
  mutation UpsertKhachHangBHYT(
    $maSoBhxh: String!
    $hoTen: String!
    $gioiTinh: Boolean
    $soDienThoai: String
    $ngaySinh: String
    $bhytTuNgay: String
    $bhytDenNgay: String
    $soTienBhyt: Int
    $bhxhTuNgay: String
    $bhxhDenNgay: String
    $nhacDongBhxh: String
    $soTienBhxh: Int
    $soThangBhxh: Int
    $mucThuNhapBhxh: Int
    $ngayBienLaiBhyt: String
    $ngayBienLaiBhxh: String
    $maSoTheBhyt: String
    $ngay5NamLienTuc: String
    $noiKcbBanDau: String
    $donViDong: String
    $theoDoiCoQuanBhxh: String
    $maHoGiaDinh: String
    $maToKhaiRieng: String
    $ghiChu: String
    $sdtDongTien: String
    $sdtNhacHan: String
    $tinhTrangHanThe: String
  ) {
    upsertKhachHangBHYT(
      input: {
        maSoBhxh: $maSoBhxh
        hoTen: $hoTen
        gioiTinh: $gioiTinh
        soDienThoai: $soDienThoai
        ngaySinh: $ngaySinh
        bhytTuNgay: $bhytTuNgay
        bhytDenNgay: $bhytDenNgay
        soTienBhyt: $soTienBhyt
        bhxhTuNgay: $bhxhTuNgay
        bhxhDenNgay: $bhxhDenNgay
        nhacDongBhxh: $nhacDongBhxh
        soTienBhxh: $soTienBhxh
        soThangBhxh: $soThangBhxh
        mucThuNhapBhxh: $mucThuNhapBhxh
        ngayBienLaiBhyt: $ngayBienLaiBhyt
        ngayBienLaiBhxh: $ngayBienLaiBhxh
        maSoTheBhyt: $maSoTheBhyt
        ngay5NamLienTuc: $ngay5NamLienTuc
        noiKcbBanDau: $noiKcbBanDau
        donViDong: $donViDong
        theoDoiCoQuanBhxh: $theoDoiCoQuanBhxh
        maHoGiaDinh: $maHoGiaDinh
        maToKhaiRieng: $maToKhaiRieng
        ghiChu: $ghiChu
        sdtDongTien: $sdtDongTien
        sdtNhacHan: $sdtNhacHan
        tinhTrangHanThe: $tinhTrangHanThe
      }
    ) {
      khachHang {
        ...KhachHangFields
      }
    }
  }
  ${KHACH_HANG_FIELDS_FRAGMENT}
`;

// 4. MUTATION UPDATE CHỦ ĐỘNG SỬA BẰNG TAY SỬ DỤNG FRAGMENT
export const UPDATE_KHACH_HANG_BHYT = gql`
  mutation UpdateKhachHangBHYT(
    $id: ID!
    $hoTen: String
    $gioiTinh: Boolean
    $soDienThoai: String
    $ngaySinh: String
    $bhytTuNgay: String
    $bhytDenNgay: String
    $soTienBhyt: Int
    $bhxhTuNgay: String
    $bhxhDenNgay: String
    $nhacDongBhxh: String
    $soTienBhxh: Int
    $soThangBhxh: Int
    $mucThuNhapBhxh: Int
    $ngayBienLaiBhyt: String
    $ngayBienLaiBhxh: String
    $maSoTheBhyt: String
    $ngay5NamLienTuc: String
    $noiKcbBanDau: String
    $donViDong: String
    $theoDoiCoQuanBhxh: String
    $maHoGiaDinh: String
    $maToKhaiRieng: String
    $ghiChu: String
    $sdtDongTien: String
    $sdtNhacHan: String
    $tinhTrangHanThe: String
  ) {
    updateKhachHangBHYT(
      input: {
        id: $id
        hoTen: $hoTen
        gioiTinh: $gioiTinh
        soDienThoai: $soDienThoai
        ngaySinh: $ngaySinh
        bhytTuNgay: $bhytTuNgay
        bhytDenNgay: $bhytDenNgay
        soTienBhyt: $soTienBhyt
        bhxhTuNgay: $bhxhTuNgay
        bhxhDenNgay: $bhxhDenNgay
        nhacDongBhxh: $nhacDongBhxh
        soTienBhxh: $soTienBhxh
        soThangBhxh: $soThangBhxh
        mucThuNhapBhxh: $mucThuNhapBhxh
        ngayBienLaiBhyt: $ngayBienLaiBhyt
        ngayBienLaiBhxh: $ngayBienLaiBhxh
        maSoTheBhyt: $maSoTheBhyt
        ngay5NamLienTuc: $ngay5NamLienTuc
        noiKcbBanDau: $noiKcbBanDau
        donViDong: $donViDong
        theoDoiCoQuanBhxh: $theoDoiCoQuanBhxh
        maHoGiaDinh: $maHoGiaDinh
        maToKhaiRieng: $maToKhaiRieng
        ghiChu: $ghiChu
        sdtDongTien: $sdtDongTien
        sdtNhacHan: $sdtNhacHan
        tinhTrangHanThe: $tinhTrangHanThe
      }
    ) {
      khachHang {
        ...KhachHangFields
      }
    }
  }
  ${KHACH_HANG_FIELDS_FRAGMENT}
`;
