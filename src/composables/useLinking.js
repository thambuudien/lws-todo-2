/**
 * @description Composable function để chứa các hàm xử lý liên kết ngoài
 * @returns {{ openLinkSsm: Function }}
 */
export function useExternalLinks() {
  /**
   * 🛠️ Mở link tra cứu trên hệ thống SSM VNPOST
   * @param {object} customer - Đối tượng khách hàng chứa thông tin cần tra cứu.
   */
  const openLinkSsm = (customer, isBHXH) => {
    const codeBhx = customer.maSoBhxh || "";
    const fullName = encodeURIComponent(customer.hoTen || "");
    const birthDate = customer.ngaySinh
      ? encodeURIComponent(customer.ngaySinh)
      : "";

    let url = "";
    if (isBHXH) {
      url = `https://ssm.vnpost.vn/qldv/tra-cuu/thong-tin-bhxh?maSoBHXH=${codeBhx}&hoTen=${fullName}&ngaySinhDt=${birthDate}`;
    } else {
      url = `https://ssm.vnpost.vn/qldv/tra-cuu/tra-cuu-thong-tin-the?maSoBHXH=${codeBhx}&hoTen=${fullName}&ngaySinhDt=${birthDate}`;
    }
    window.open(url, "_blank");
  };

  return {
    openLinkSsm,
  };
}
