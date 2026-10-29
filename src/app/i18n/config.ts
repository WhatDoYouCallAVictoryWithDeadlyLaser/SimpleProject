import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Khai báo từ điển Anh - Việt
const resources = {
  vi: {
    translation: {
      home: "Trang chủ",
      cart: "Giỏ hàng",
      about: "Giới thiệu",
      darkMode: "Chế độ tối",
      lightMode: "Chế độ sáng",
      manageProducts: "Quản Lý Sản Phẩm",
      addNewProduct: "+ Thêm sản phẩm mới",
      edit: "Sửa",
      delete: "Xóa",
      price: "Giá",
      quantity: "Số lượng",
      category: "Danh mục",
      saleDate: "Ngày bán",
      confirmDelete: "Bạn có chắc muốn xóa sản phẩm này?",
      noProducts: "Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!",
      loading: "Đang tải dữ liệu từ server..."
    }
  },
  en: {
    translation: {
      home: "Home",
      cart: "Cart",
      about: "About",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      manageProducts: "Product Management",
      addNewProduct: "+ Add New Product",
      edit: "Edit",
      delete: "Delete",
      price: "Price",
      quantity: "Quantity",
      category: "Category",
      saleDate: "Sale Date",
      confirmDelete: "Are you sure you want to delete this product?",
      noProducts: "No products available. Please add a new one!",
      loading: "Loading data from server..."
    }
  }
};

// 2. Lấy ngôn ngữ đã lưu từ localStorage (nếu có)
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'vi';
  }
  return 'vi';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // React đã tự bảo vệ XSS
  }
});

export default i18n;