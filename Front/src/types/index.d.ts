interface Window {
  NESTPAY?: {
    welcome: () => void;
    pay: (opts: {
      payMethod: string;
      trxId: string;
      openType?: "layer" | "redirect" | "popup";
      onApprove?: (resp: any) => void;
    }) => void;
  };
  _babelPolyfill?: any;
}

interface ExcelReadableColumn {
  attr: string;
  code: string;
}
interface ExcelWritableColumn {
  text: string;
  wpx?: number;
  Cell?: ({ cell, row, index }) => any;
  code?: string;
  style?: {
    common?: any;
    col?: any;
    header?: any;
  };
}
interface ExcelSheet {
  name?: text;
  list?: any[];
  empty?: [];
  header?: ExcelWritableColumn[];
}

interface Pageable {
  content: any[];
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  last: boolean;
  NumberOfTotalElements: number;
  NumberOfElements: number;
}

interface ComponentProps<T extends HTMLElement>
  extends React.CSSProperties,
    React.HTMLAttributes<T> {
  Ref?: React.Ref<T> | undefined;
}

interface DirectionalStyleInterface {
  padding?: React.CSSProperties["padding"];
  paddingTop?: React.CSSProperties["paddingTop"];
  paddingRight?: React.CSSProperties["paddingRight"];
  paddingBottom?: React.CSSProperties["paddingBottom"];
  paddingLeft?: React.CSSProperties["paddingLeft"];
  margin?: React.CSSProperties["margin"];
  marginTop?: React.CSSProperties["marginTop"];
  marginRight?: React.CSSProperties["marginRight"];
  marginBottom?: React.CSSProperties["marginBottom"];
  marginLeft?: React.CSSProperties["marginLeft"];
  border?: React.CSSProperties["border"];
  borderTop?: React.CSSProperties["borderTop"];
  borderRight?: React.CSSProperties["borderRight"];
  borderBottom?: React.CSSProperties["borderBottom"];
  borderLeft?: React.CSSProperties["borderLeft"];
  overflow?: React.CSSProperties["overflow"];
  overflowX?: React.CSSProperties["overflowX"];
  overflowY?: React.CSSProperties["overflowY"];
}

type OSType = "ios" | "android" | "windows" | "macos" | "linux" | "unknown";

type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

// 데이터 선언용
interface BaseEntity {
  id: string;
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at: string | Date | null;
}
interface UserDataFrame {
  username: string;
  nickname?: string;
  password?: string;
  phone: string;
  thumbnail?: string;
  name: string;
  birthday: Date;
  metadata?: Record<string, unknown> | null;
}
interface UserData extends BaseEntity, UserDataFrame {
  adult: boolean;
  role: "member" | "developer" | "admin" | "member";
  point: number;
  accounts?: AccountLinkData[];
  adult_mode: boolean;
}
interface StoreDataFrame {
  name: string;
  currency_unit: string;
  adult: boolean;
  thumbnail?: string;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b50027b689a2d429d8377b4aa31ed8429eb26e03
  logo?:any;
  description?: string;
  metadata?: Record<string, unknown> | null;
  index?: number;
  subdomain?:string | null;
<<<<<<< HEAD
=======
  logo?: any;
  description?: string;
  metadata?: Record<string, unknown> | null;
  index?: number;
  subdomain?: string | null;
>>>>>>> f720ef148bdd49eca0b44dc727c41f21888a60dc
=======
>>>>>>> b50027b689a2d429d8377b4aa31ed8429eb26e03
}
interface StoreData extends BaseEntity, StoreDataFrame {
  index: number;
  currency_unit: string;
  methods?: ShippingMethodData[];
}

interface BrandDataFrame {
  name: string;
  thumbnail?: string;
  description?: string;
  metadata?: Record<string, unknown> | null;
}
interface BrandData extends BaseEntity, BrandDataFrame {
  methods?: ShippingMethodData[];
}

interface CategoryDataFrame {
  store_id: string;
  parent_id?: string | null;
  name: string;
  thumbnail?: string;
  metadata?: Record<string, unknown> | null;
  index: number;
}
interface CategoryData extends BaseEntity, CategoryDataFrame {
  parent?: CategoryData;
  children?: CategoryData[];
}

interface ProductDataFrame {
  store_id: string;
  brand_id: string;
  category_id: string;
  title: string;
  thumbnail?: string;
  description?: string;
  detail?: string;
  price?: number;
  tax_rate?: number;
  visible?: boolean;
  buyable?: boolean;
  adult?: boolean;
  tags?: string[];
  metadata?: Record<string, unknown> | null;
  variants?: VariantDataFrame[];
  options?: OptionDataFrame[];
  brand_mode?: boolean;
}
interface ProductData extends BaseEntity, ProductDataFrame {
  store: StoreData;
  brand: BrandData;
  category: CategoryData;
  variants: VariantData[];
  options: OptionData[];
  discount_price: number;
  discount_rate: number;
  price: number;
  brand_mode: boolean;
  wishlists?: WishData[];
  wish?: WishData;
  wishes?: number;
}

interface VariantDataFrame {
  product_id?: string;
  title?: string;
  thumbnail?: string;
  extra_price: number;
  stack: number;
  visible: boolean;
  buyable: boolean;
  metadata?: Record<string, unknown> | null;
  values?: OptionValueDataFrame[];
}

interface VariantData extends BaseEntity, VariantDataFrame {
  product_id: string;
  price: number;
  discount_price: number;
  discount_rate: number;
  product: ProductData;
  values: OptionValueData[];
}

interface OptionDataFrame {
  product_id?: String;
  title: string;
  metadata?: Record<string, unknown> | null;
  values?: OptionValueDataFrame[];
}

interface OptionData extends BaseEntity, OptionDataFrame {
  product_id: string;
  product: ProductData;
  values: OptionValueData[];
}

interface OptionValueDataFrame {
  option_id?: string;
  variant_id?: string;
  value: string;
  metadata?: Record<string, unknown> | null;
  variant?: VariantDataFrame;
  option?: OptionDataFrame;
}
interface OptionValueData extends BaseEntity, OptionValueDataFrame {
  option_id: string;
  variant_id: string;
  variant: VariantData;
  option: OptionData;
}

interface LineItemData extends BaseEntity {
  cart_id?: string;
  cart?: CartData;
  order_id?: string;
  variant_id: string;
  variant: VariantData;
  brand_id?: string;
  brand?: BrandData;
  quantity: number;
  extra_quantity: number;
  total_quantity: number;
  title?: string;
  product_title?: string;
  variant_title?: string;
  description?: string;
  thumbnail?: string;
  unit_price?: number;
  tax_rate?: number;
  discount_price?: number;
  total?: number;
  total_discount?: number;
  total_tax?: number;
  currency_unit?: string;
  metadata?: Record<string, unknown> | null;
}

interface CartData extends BaseEntity {
  user_id: string;
  user?: UserData;
  store_id: string;
  store: StoreData;
  type?: string;
  items: LineItemData[];
  metadata?: Record<string, unknown> | null;
}

interface ShippingMethodDataFrame {
  store_id?: string;
  brand_id?: string;
  order_id?: string;
  name: string;
  amount: number;
  min: number;
  max: number;
  description?: string;
  metadata?: Record<string, unknown> | null;
  tracking_number?: string;
  type: "default" | "refund" | "exchange";
}
interface ShippingMethodData extends BaseEntity, ShippingMethodDataFrame {}

interface AddressDataFrame {
  name: string;
  phone: string;
  address1: string;
  address2: string;
  postal_code: string;
  message?: string;
  default: boolean;
  metadata?: Record<string, unknown> | null;
}
interface AddressData extends BaseEntity, AddressDataFrame {
  user_id?: string;
  order_id?: string;
  message: string;
}

interface OrderData extends BaseEntity {
  display: string;
  user_id: string;
  user?: UserData;
  store_id: string;
  store?: StoreData;
  address_id: string;
  address?: AddressData;
  shipping_methods?: ShippingMethodData[];
  status: "pending" | "fulfilled" | "shipping" | "complete" | "cancel";
  total: number;
  total_tax: number;
  total_discounted: number;
  total_refund: number;
  captured_at: string | Date;
  payment_data?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  items: LineItemData[];
}

interface AccountLinkData extends BaseEntity {
  user_id: string;
  user?: UserData;
  type: string;
  name: string;
  uuid: string;
  metadata?: Record<string, unknown> | null;
}

interface Recommend {
  keyword: string;
  popular: number;
  created_at: Date | string;
}

interface BannerDataFrame {
  name: string;
  store_id: string;
  thumbnail: Record<string, string>;
  to?: string;
  starts_at?: Date | string | null;
  ends_at?: Date | string | null;
  metadata?: Record<string, unknown> | null;
  visible?: boolean;
  adult?: boolean;
}

interface BannerData extends BaseEntity, BannerDataFrame {
  adult: boolean;
  visible: boolean;
}

interface EventDataFrame {
  title: string;
  store_id: string;
  starts_at: Date | string;
  ends_at: Date | string;
  discounts?: DiscountDataFrame[];
  bundles?: BundleDataFrame[];
}
interface DiscountDataFrame {
  name: string;
  value: number;
  products: { id: stirng }[];
  variants: { id: stirng }[];
}
interface BundleDataFrame {
  name: string;
  N: number;
  M: number;
  products: { id: stirng }[];
  variants: { id: stirng }[];
}

interface WishData extends BaseEntity {
  user_id: string;
  user?: UserData;
  product_id: string;
  product?: ProductData;
}

interface NoticeDataFrame {
  title: string;
  store_id: string;
  type: string;
  detail?: string;
  starts_at?: Date | string | null;
  ends_at?: Date | string | null;
  adult?: boolean;
  visible?: boolean;
  metadata?: Record<string, unknown> | null;
}

interface NoticeData extends BaseEntity, NoticeDataFrame {
  adult: boolean;
  visible: boolean;
}

interface ChatroomData extends BaseEntity {
  title: string;
  users?: ChatroomUserData[];
  chats?: ChatData[];
  metadata?: Record<string, unknown> | null;
  unread?: number;
}

interface ChatData extends BaseEntity {
  message: string;
  type: "message" | "image" | "link" | "file";
  room_id: string;
  room?: ChatroomData;
  user_id: string;
  user?: UserData;
  metadata?: Record<string, unknown> | null;
}
interface ChatroomUserData {
  user?: UserData;
  user_id: string;
  room_id: string;
  room?: ChatroomData;
  last_read: Date | string;
}
