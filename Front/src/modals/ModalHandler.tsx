import ConfirmModal from "@/modals/confirm/ConfirmModal";
import ContextMenuModal from "@/modals/context/ContextMenuModal";
import ToastModal from "@/modals/toast/ToastModal";
import NiceModal from "@ebay/nice-modal-react";
import BrandModal from "./admin/brand/BrandModal";
import CategoriesModal from "./admin/category/CategoriesModal";
import CategoryList from "./admin/category/CategoryListModal";
import CategoryModal from "./admin/category/CategoryModal";
import LoadingModal from "./admin/LoadingModal";
import OrderDetailModal from "./admin/order/OrderDetailModal";
import ProductModal from "./admin/product/ProductModal";
import VariantListModal from "./admin/product/VariantListModal";
import VariantModal from "./admin/product/VariantModal";
import ShippingMethodDetailModal from "./admin/shipping_method/ShippingMethodDetailModal";
import ShippingMethodListModal from "./admin/shipping_method/ShippingMethodListModal";
import StoreModal from "./admin/store/StoreModal";
import OrderListModal from "./admin/user/OrderListModal";
import UserModal from "./admin/user/UserModal";
import InputModal from "./input/InputModal";
import ListModal from "./list/ListModal";
import AddressListModal from "./main/address/AddressListModal";
import AddressModal from "./main/address/AddressModal";
import PostalCodeModal from "./main/address/PostaCodelModal";
import OptionChangeModal from "./main/product/OptionChangeModal";
import PurchaseModal from "./main/product/PurchaseModal";
import TableModal from "./table/TableModal";

function ModalHandler() {
  NiceModal.register("toast", ToastModal);
  NiceModal.register("confirm", ConfirmModal);
  NiceModal.register("table", TableModal);
  NiceModal.register("list", ListModal);
  NiceModal.register("contextMenu", ContextMenuModal);
  NiceModal.register("input", InputModal);
  NiceModal.register("loading", LoadingModal);
  // main
  NiceModal.register("address", AddressModal);
  NiceModal.register("addressList", AddressListModal);
  NiceModal.register("purchase", PurchaseModal);
  NiceModal.register("postalcode", PostalCodeModal);
  NiceModal.register("optionChange", OptionChangeModal);
  // admin
  NiceModal.register("orderDetail", OrderDetailModal);
  NiceModal.register("orderList", OrderListModal);
  NiceModal.register("userDetail", UserModal);
  NiceModal.register("productDetail", ProductModal);
  NiceModal.register("variantList", VariantListModal);
  NiceModal.register("variantDetail", VariantModal);
  NiceModal.register("storeDetail", StoreModal);
  NiceModal.register("brandDetail", BrandModal);
  NiceModal.register("categoryList", CategoryList);
  NiceModal.register("categories", CategoriesModal);
  NiceModal.register("categoryDetail", CategoryModal);
  NiceModal.register("shippingMethodList", ShippingMethodListModal);
  NiceModal.register("shippingMethodDetail", ShippingMethodDetailModal);
  return <></>;
}

export default ModalHandler;
