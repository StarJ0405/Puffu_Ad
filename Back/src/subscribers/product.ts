import { insertDocument, insertIntention } from "expand/chatbot/module";
import { Product } from "models/product";
import { ProductService } from "services/product";
import { container } from "tsyringe";
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  listenTo() {
    return Product;
  }
  async afterUpdate(event: UpdateEvent<Product>): Promise<void> {
    const id = event?.entity?.id;
    const service = container.resolve(ProductService);
    const product = await service.get({ where: { id } });
    if (id && product) {
      const document = await this._productToDocument(product);
      await insertDocument(document, "PRODUCT");
      if (product.title) await insertIntention([product.title], "PRODUCT");
    }
  }
  async _productToDocument(product: Product) {
    return [
      {
        source_id: product.id,
        pageContent: {
          product_name: product.title,
          price: `${product.price}원`,
          product_id: product.id,
        },
        metadata: {
          price: product.price,
        },
      },
    ];
  }
  async afterInsert(event: InsertEvent<Product>): Promise<void> {
    const id = event.entityId;
    if (id) {
      const service = container.resolve(ProductService);
      const product = await service.get({ where: { id: String(id) } });
      if (product) {
        const document = await this._productToDocument(product);
        await insertDocument(document, "PRODUCT");
        if (product.title) await insertIntention([product.title], "PRODUCT");
      }
    }
  }
}
