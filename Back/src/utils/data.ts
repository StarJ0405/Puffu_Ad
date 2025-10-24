import { Category } from "models/category";
import { Event } from "models/event";
import { Order } from "models/order";
import { Product } from "models/product";
import { Variant } from "models/variant";
export function orderToDocument(order: Order): InsertDocument {
  let status;
  switch (order.status) {
    case "awaiting":
      status = "입금 대기중";
      break;
    case "pending":
      status = "상품 준비중";
      break;
    case "fulfilled":
      status = "배송준비";
      break;
    case "shipping":
      status = "배송중";
      break;
    case "complete":
      status = "배송완료";
      break;
    case "cancel":
      status = "주문취소";
      break;
  }
  return {
    source_id: order.id,
    pageContent: {
      order_id: order.id,
      display: order.display,
      status,
      user_id: order.user_id,
      user_name: order.user?.name,
      address: order.address
        ? `(${order.address.postal_code} ${order.address.address1} ${order.address.address2})`
        : undefined,
      shipping_method: order.shipping_method
        ? {
            name: order.shipping_method.name,
            delivery_fee: order.shipping_method?.amount,
            coupons: (order?.shipping_method?.coupons || [])?.map((coupon) => ({
              name: coupon.name,
              value: coupon.value,
              calculation: coupon.calc,
            })),
            tracking_number: order.shipping_method.tracking_number,
            shipped_at: order.shipping_method.shipped_at,
          }
        : undefined,
      items: (order.items || []).map((item) => ({
        item_id: item.id,
        variant_id: item.variant_id,
        title: item.title,
        unit_price: item.unit_price,
        discounted_price: item.discount_price,
        quantity: item.quantity,
        final_total: item.total_final,
        coupons: (item?.coupons || [])?.map((coupon) => ({
          name: coupon.name,
          value: coupon.value,
          calculation: coupon.calc,
        })),
        refunds: (item.refunds || [])?.map((refund) => ({
          refund_id: refund.id,
          quantity: refund.quantity,
        })),
        exchanges: (item.exchanges || []).map((exchange) => ({
          exchange_id: exchange.id,
          quantity: exchange.quantity,
          swaps: exchange.swaps?.map((swap) => ({
            variant_id: swap.variant_id,
            quantity: swap.quantity,
            title: swap.title,
          })),
        })),
      })),
      coupons: (order?.coupons || [])?.map((coupon) => ({
        name: coupon.name,
        value: coupon.value,
        calculation: coupon.calc,
      })),
    },
    metadata: {
      order_id: order.id,
      display: order.display,
      status,
      user_id: order.user_id,
      user_name: order.user?.name,
      total: order.total,
      total_payment: order.total_final,
      total_discount:
        order.total_final - order.total - (order.shipping_method?.amount || 0),
      address: order.address
        ? `(${order.address.postal_code} ${order.address.address1} ${order.address.address2})`
        : undefined,
      shipping_method: order.shipping_method
        ? {
            name: order.shipping_method.name,
            delivery_fee: order.shipping_method?.amount,
            coupons: (order?.shipping_method?.coupons || [])?.map((coupon) => ({
              name: coupon.name,
              value: coupon.value,
              calculation: coupon.calc,
            })),
            tracking_number: order.shipping_method.tracking_number,
            shipped_at: order.shipping_method.shipped_at,
          }
        : undefined,
      items: (order.items || []).map((item) => ({
        item_id: item.id,
        variant_id: item.variant_id,
        title: item.title,
        unit_price: item.unit_price,
        discounted_price: item.discount_price,
        quantity: item.quantity,
        final_total: item.total_final,
        coupons: (item?.coupons || [])?.map((coupon) => ({
          name: coupon.name,
          value: coupon.value,
          calculation: coupon.calc,
        })),
        refunds: (item.refunds || [])?.map((refund) => ({
          refund_id: refund.id,
          quantity: refund.quantity,
        })),
        exchanges: (item.exchanges || []).map((exchange) => ({
          exchange_id: exchange.id,
          quantity: exchange.quantity,
          swaps: exchange.swaps?.map((swap) => ({
            variant_id: swap.variant_id,
            quantity: swap.quantity,
            title: swap.title,
          })),
        })),
      })),
      coupons: (order?.coupons || [])?.map((coupon) => ({
        name: coupon.name,
        value: coupon.value,
        calculation: coupon.calc,
      })),
    },
  };
}

export function productToDocument(product: Product): InsertDocument {
  const getCategoryNameWithParent = (
    category: Category
  ): string | undefined => {
    if (category.parent)
      return `${getCategoryNameWithParent(category.parent)} > ${category.name}`;
    return category.name;
  };
  const categories = (product?.categories || []).map((category) =>
    getCategoryNameWithParent(category)
  );
  let type = "일반 상품";
  switch (product.product_type) {
    case "is_set":
      type = "세트 상품";
      break;
    case "random_box":
      type = "랜덤 박스";
      break;
  }
  return {
    source_id: product.id,
    pageContent: {
      product_id: product.id,
      product_name: product.title,
      categories,
      tags: product.tags,
      type,
      brand_name: product.brand?.name,
    },
    metadata: {
      product_id: product.id,
      product_name: product.title,
      price: product.price,
      categories,
      tags: product.tags,
      type,
      warehousing: product.warehousing,
      buyable: product.buyable,
      visible: product.visible,
      brand_name: product.brand?.name,
    },
  };
}
export function varaintToDocuemnt(variant: Variant): InsertDocument {
  return {
    source_id: variant.id,
    pageContent: {
      variant_id: variant.id,
      variant_name: variant.title,
      product_id: variant.product?.id,
      product_name: variant.product?.title,
    },
    metadata: {
      variant_id: variant.id,
      variant_name: variant.title,
      product_id: variant.product?.id,
      product_name: variant.product?.title,
      price: variant.price,
      buyable: variant.buyable,
      visible: variant.visible,
    },
  };
}

export function eventToDocument(event: Event): InsertDocument {
  const discounts = event.discounts?.map((discount) => {
    const products =
      discount.products
        ?.map((product) => {
          if (product.product) return productToDocument(product.product);
          return undefined;
        })
        .filter(Boolean) || [];
    const variants =
      discount.variants
        ?.map((variant) => {
          if (variant.variant) return varaintToDocuemnt(variant.variant);
          return undefined;
        })
        .filter(Boolean) || [];
    return {
      products,
      variants,
      value: discount.value,
    };
  });
  const bundles = event.bundles?.map((bundle) => {
    const products =
      bundle.products
        ?.map((product) => {
          if (product.product) return productToDocument(product.product);
          return undefined;
        })
        .filter(Boolean) || [];
    const variants =
      bundle.variants
        ?.map((variant) => {
          if (variant.variant) return varaintToDocuemnt(variant.variant);
          return undefined;
        })
        .filter(Boolean) || [];
    return {
      products,
      variants,
      N: bundle.N,
      M: bundle.M,
    };
  });
  return {
    source_id: event.id,
    pageContent: {
      event_id: event.id,
      event_name: event.title,
      starts_at: event.starts_at,
      ends_at: event.ends_at,
      discounts: discounts?.map((discount) => ({
        value: discount.value,
        products: discount.products.map((product) => product?.pageContent),
        variants: discount.variants.map((variant) => variant?.pageContent),
      })),
      bundles: bundles?.map((bundle) => ({
        N: bundle.N,
        M: bundle.M,
        products: bundle.products.map((product) => product?.pageContent),
        variants: bundle.variants.map((product) => product?.pageContent),
      })),
    },

    metadata: {
      event_id: event.id,
      event_name: event.title,
      starts_at: event.starts_at,
      ends_at: event.ends_at,
      discounts: discounts?.map((discount) => ({
        value: discount.value,
        products: discount.products.map((product) => product?.metadata),
        variants: discount.variants.map((variant) => variant?.metadata),
      })),
      bundles: bundles?.map((bundle) => ({
        N: bundle.N,
        M: bundle.M,
        products: bundle.products.map((product) => product?.metadata),
        variants: bundle.variants.map((product) => product?.metadata),
      })),
    },
  };
}
