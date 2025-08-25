import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkPartition20250717192100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. 트리거 함수 정의 (PL/pgSQL)
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION create_link_partition()
            RETURNS TRIGGER AS $$
            DECLARE
                partition_name TEXT;
                start_date TEXT;
                end_date TEXT;
            BEGIN
                partition_name := 'link_' || to_char(NEW."created_at", 'YYYYMM');
                start_date := to_char(date_trunc('month', NEW."created_at"), 'YYYY-MM-DD HH24:MI:SS');
                end_date := to_char(date_trunc('month', NEW."created_at") + INTERVAL '1 month', 'YYYY-MM-DD HH24:MI:SS');
                IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = partition_name) THEN
                    EXECUTE 'CREATE TABLE ' || quote_ident(partition_name) || ' PARTITION OF link ' ||
                            'FOR VALUES FROM (''' || start_date || ''') TO (''' || end_date || ''');';
                    -- 여기에 파티션별 인덱스 생성 로직도 추가 가능
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    // 2. 트리거 생성
    await queryRunner.query(`
            CREATE TRIGGER link_partition_trigger
            BEFORE INSERT ON link
            FOR EACH ROW EXECUTE FUNCTION create_link_partition();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS link_partition_trigger ON link;`
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS create_link_partition();`);
  }
}
