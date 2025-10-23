export default function () {
  `
  -- ALTER TABLE document_chunks ALTER COLUMN embedding_vector TYPE VECTOR(768) USING embedding_vector::VECTOR(768);
  CREATE EXTENSION IF NOT EXISTS vector;
  CREATE Table IF NOT EXISTS document_chunks (
    id SERIAL PRIMARY KEY,
    content TEXT,
    source_id character varying,
    embedding_vector vector(768),
    intent character varying
  );
  CREATE UNIQUE INDEX IF NOT EXISTS document_chunks_soruce_id_intent_unique ON document_chunks (source_id, intent);
  CREATE TABLE IF NOT EXISTS intention (
    id SERIAL PRIMARY KEY,
    keyword character varying,
    intent character varying
  );
  CREATE UNIQUE INDEX IF NOT EXISTS intention_keyword_intent_unique ON intention (keyword, intent);
  CREATE INDEX IF NOT EXISTS document_chunks_embedding_vector_idx ON document_chunks USING ivfflat (embedding_vector vector_cosine_ops) WITH (lists = 100);
  CREATE OR REPLACE FUNCTION fn_text_to_char_array(p_text TEXT)
        RETURNS TEXT[]
        LANGUAGE sql
        IMMUTABLE
        AS $$
          SELECT string_to_array(LOWER(REPLACE(p_text, ' ', '')), NULL);
        $$;
  CREATE INDEX IF NOT EXISTS idx_brand_name ON public.brand USING GIN (fn_text_to_char_array(name));
  CREATE INDEX IF NOT EXISTS idx_category_name ON public.category USING GIN (fn_text_to_char_array(name));
  CREATE INDEX IF NOT EXISTS idx_store_name ON public.store USING GIN (fn_text_to_char_array(name));
  CREATE INDEX IF NOT EXISTS idx_product_title ON public.product USING GIN (fn_text_to_char_array(title));
  CREATE INDEX IF NOT EXISTS idx_varaint_title ON public.variant USING GIN (fn_text_to_char_array(title));
  CREATE INDEX IF NOT EXISTS idx_user_id ON public.user USING GIN (fn_text_to_char_array(id));
  CREATE INDEX IF NOT EXISTS idx_user_username ON public.user USING GIN (fn_text_to_char_array(username));
  CREATE INDEX IF NOT EXISTS idx_user_name ON public.user USING GIN (fn_text_to_char_array(name));
  CREATE INDEX IF NOT EXISTS idx_user_nickname ON public.user USING GIN (fn_text_to_char_array(nickname));
  CREATE INDEX IF NOT EXISTS idx_user_phone ON public.user USING GIN (fn_text_to_char_array(phone));
  CREATE INDEX IF NOT EXISTS idx_order_id ON public.order USING GIN (fn_text_to_char_array(id));
  CREATE INDEX IF NOT EXISTS idx_order_display ON public.order USING GIN (fn_text_to_char_array(display));
  CREATE INDEX IF NOT EXISTS idx_line_item_id ON public.line_item USING GIN (fn_text_to_char_array(id));
  CREATE INDEX IF NOT EXISTS idx_line_item_product_title ON public.line_item USING GIN (fn_text_to_char_array(product_title));
  CREATE INDEX IF NOT EXISTS idx_line_item_variant_title ON public.line_item USING GIN (fn_text_to_char_array(variant_title));
  CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON public.keywords USING GIN (fn_text_to_char_array(keyword));
  CREATE INDEX IF NOT EXISTS idx_banner_name ON public.banner USING GIN (fn_text_to_char_array(name));
  CREATE INDEX IF NOT EXISTS idx_event_title ON public.event USING GIN (fn_text_to_char_array(title));
  CREATE INDEX IF NOT EXISTS idx_notice_title ON public.notice USING GIN (fn_text_to_char_array(title));
  CREATE INDEX IF NOT EXISTS idx_log_name ON public.log USING GIN (fn_text_to_char_array(name));
  CREATE INDEX IF NOT EXISTS idx_log_type ON public.log USING GIN (fn_text_to_char_array(type));
  CREATE INDEX IF NOT EXISTS idx_qa_title ON public.qa USING GIN (fn_text_to_char_array(title));
  -- CREATE INDEX IF NOT EXISTS idx_qa_type ON public.qa USING GIN (fn_text_to_char_array(type));
  CREATE INDEX IF NOT EXISTS idx_qa_content ON public.qa USING GIN (fn_text_to_char_array(content));
  CREATE INDEX IF NOT EXISTS idx_user_email ON public.user USING GIN (fn_text_to_char_array(email));
  CREATE INDEX IF NOT EXISTS idx_chatroom_title ON public.chatroom USING GIN (fn_text_to_char_array(title));
  CREATE INDEX IF NOT EXISTS idx_group_name ON public.group USING GIN (fn_text_to_char_array(name));
  CREATE INDEX IF NOT EXISTS idx_coupon_id ON public.coupon USING GIN (fn_text_to_char_array(id));
  CREATE INDEX IF NOT EXISTS idx_coupon_name ON public.coupon USING GIN (fn_text_to_char_array(name));
  CREATE SEQUENCE review_sequence START 1;
  `;
}
