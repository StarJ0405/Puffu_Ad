import { insertDocument, insertIntention } from "expand/chatbot/module";
import { EventService } from "services/event";
import { OrderService } from "services/order";
import { ProductService } from "services/product";
import { container } from "tsyringe";
import {
  eventToDocument,
  orderToDocument,
  productToDocument,
} from "utils/data";

export const GET: ApiHandler = async (req, res) => {
  let { intent } = req.parsedQuery;
  if (!intent) return res.json(500);
  intent = Array.isArray(intent)
    ? intent.map((intent) => String(intent).toUpperCase())
    : [String(intent).toUpperCase()];
  await Promise.all(
    intent.map(async (intent: string) => {
      switch (intent) {
        case "PRODUCT": {
          const service = container.resolve(ProductService);
          const products = await service.getList({
            relations: ["categories.parent.parent", "brand"],
          });
          await insertDocument(
            products.map((product) => productToDocument(product)),
            intent
          );
          await insertIntention(
            products
              .map((product) => product.title || "")
              .filter((f) => f !== ""),
            intent
          );
          break;
        }
        case "EVENT": {
          const service = container.resolve(EventService);
          const events = await service.getList({
            relations: [
              "discounts.products.product",
              "discounts.variants.variant.product",
              "bundles.products.product",
              "bundles.variants.variant.product",
            ],
          });
          await insertDocument(
            events.map((event) => eventToDocument(event)),
            intent
          );
          await insertIntention(
            events.map((event) => event.title || "").filter((f) => f !== ""),
            intent
          );
          break;
        }
        case "ORDER": {
          const service = container.resolve(OrderService);
          const orders = await service.getList({
            relations: [
              "user",
              "address",
              "shipping_method.coupons",
              "items.coupons",
              "items.refunds",
              "items.exchanges",
              "coupons",
            ],
          });
          await insertDocument(
            orders.map((order) => orderToDocument(order)),
            intent
          );
          await insertIntention(
            orders.map((order) => order.display || "").filter((f) => f !== ""),
            intent
          );

          break;
        }
      }
    })
  );

  return res.json({ message: "success" });
};
