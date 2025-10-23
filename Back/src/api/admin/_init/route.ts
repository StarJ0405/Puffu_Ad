import { insertDocument, insertIntention } from "expand/chatbot/module";
import { ProductService } from "services/product";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  let { intent } = req.parsedQuery;
  if (!intent) return res.json(500);
  intent = String(intent).toUpperCase();
  switch (intent) {
    case "PRODUCT": {
      const service = container.resolve(ProductService);
      const products = await service.getList();
      await insertDocument(
        products.map((product) => ({
          source_id: product.id,
          pageContent: {
            product_name: product.title,
            price: `${product.price}원`,
            product_id: product.id,
          },
          metadata: {
            price: product.price,
          },
        })),
        intent
      );
      await insertIntention(
        products.map((product) => product.title || "").filter((f) => f !== ""),
        intent
      );
      break;
    }
  }

  return res.json({ message: "success" });
};
