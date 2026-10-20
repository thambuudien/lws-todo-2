import moment from "moment";

/**
 * @description Composable function để chứa các hàm xử lý liên kết ngoài
 */
export function useLinking() {
  /**
   * 🛠️ Mở link tra cứu trên cổng BẢO HIỂM XÃ HỘI VIỆT NAM (VSS)
   * @param {object} customer - Đối tượng khách hàng chứa thông tin cần tra cứu.
   */
  const openLinkVss = (customer) => {
    const codeBhy = customer.maSoBhxh || "";
    const fullName = encodeURIComponent(customer.hoTen || "");

    let birthDate = "";
    if (customer.ngaySinh) {
      birthDate = encodeURIComponent(
        moment(customer.ngaySinh, "YYYY-MM-DD").format("DD/MM/YYYY")
      );
    }

    const url = `https://baohiemxahoi.gov.vn/tracuu/Pages/tra-cuu-thoi-han-su-dung-the-bhyt.aspx?mathe=${codeBhy}&hoten=${fullName}&ngaysinh=${birthDate}`;
    window.open(url, "_blank");
  };

  /**
   * 🛠️ Mở link tra cứu trên hệ thống SSM VNPOST
   * @param {object} customer - Đối tượng khách hàng chứa thông tin cần tra cứu.
   */
  const openLinkSsm = (customer) => {
    const codeBhxh = customer.maSoBhxh || "";
    const fullName = encodeURIComponent(customer.hoTen || "");
    const birthDate = customer.ngaySinh
      ? encodeURIComponent(customer.ngaySinh)
      : "";

    // Lưu ý: URL này là giả định dựa trên các tham số, cần được xác nhận lại nếu có URL chính thức
    const url = `https://ssm.vnpost.vn/host/ssm/public/process/search?ma_the=${codeBhxh}&ho_ten=${fullName}&ngay_sinh=${birthDate}`;
    window.open(url, "_blank");
  };

  return {
    openLinkVss,
    openLinkSsm,
  };
}
