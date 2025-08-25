export default function () {
  `
  CREATE INDEX idx_brand_name ON public.brand USING GIN (fn_text_to_char_array(name));
  CREATE INDEX idx_category_name ON public.category USING GIN (fn_text_to_char_array(name));
  CREATE INDEX idx_store_name ON public.store USING GIN (fn_text_to_char_array(name));
  CREATE INDEX idx_product_title ON public.product USING GIN (fn_text_to_char_array(title));
  CREATE INDEX idx_varaint_title ON public.variant USING GIN (fn_text_to_char_array(title));
  CREATE INDEX idx_user_id ON public.user USING GIN (fn_text_to_char_array(id));
  CREATE INDEX idx_user_username ON public.user USING GIN (fn_text_to_char_array(username));
  CREATE INDEX idx_user_name ON public.user USING GIN (fn_text_to_char_array(name));
  CREATE INDEX idx_user_nickname ON public.user USING GIN (fn_text_to_char_array(nickname));
  CREATE INDEX idx_user_phone ON public.user USING GIN (fn_text_to_char_array(phone));
  CREATE INDEX idx_order_id ON public.order USING GIN (fn_text_to_char_array(id));
  CREATE INDEX idx_order_display ON public.order USING GIN (fn_text_to_char_array(display));
  CREATE INDEX idx_line_item_id ON public.line_item USING GIN (fn_text_to_char_array(id));
  CREATE INDEX idx_line_item_product_title ON public.line_item USING GIN (fn_text_to_char_array(product_title));
  CREATE INDEX idx_line_item_variant_title ON public.line_item USING GIN (fn_text_to_char_array(variant_title));
  `;
}
