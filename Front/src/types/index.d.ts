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
  padding?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  margin?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  border?: string | number;
  borderTop?: string | number;
  borderRight?: string | number;
  borderBottom?: string | number;
  borderLeft?: string | number;
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
  adult?: boolean;
  role: "member" | "developer" | "admin" | "member";
  point: number;
  accounts?: AccountLinkData[];
}
interface StoreDataFrame {
  name: string;
  currency_unit: string;
  adult: boolean;
  thumbnail?: string;
  logo?:any;
  description?: string;
  metadata?: Record<string, unknown> | null;
  index?: number;
  subdomain?:string | null;
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
