import { insertDocument, insertIntention } from "expand/chatbot/module";
import { Product } from "models/product";
import { ProductService } from "services/product";
import { container } from "tsyringe";
import {
  EntitySubscriberInterface,
  EventSubscriber as TypeormEventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";
import { productToDocument } from "utils/data";

@TypeormEventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  listenTo() {
    return Product;
  }
  async afterUpdate(event: UpdateEvent<Product>): Promise<void> {
    const id = event?.entity?.id;
    const service = container.resolve(ProductService);
    const _product = await service.get({
      where: { id },
      relations: ["categories.parent.parent", "brand"],
    });
    if (id && _product) {
      const document = productToDocument(_product);
      try {
        await insertDocument([document], "PRODUCT");
        if (_product?.title) {
          await insertIntention([_product.title], "PRODUCT");
        }
      } catch {

      }

      if (_product.title) await insertIntention([_product.title], "PRODUCT");
    }
  }

  async afterInsert(event: InsertEvent<Product>): Promise<void> {
    const id = event.entityId;
    if (id) {
      const service = container.resolve(ProductService);
      const _product = await service.get({
        where: { id: String(id) },
        relations: ["categories.parent.parent", "brand"],
      });
      if (_product) {
        const document = productToDocument(_product);
        await insertDocument([document], "PRODUCT");
        if (_product.title) await insertIntention([_product.title], "PRODUCT");
      }
    }
  }
}
