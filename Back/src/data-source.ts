import _ from "lodash";
import * as path from "path";
import { container } from "tsyringe";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DataSource,
  DeepPartial,
  DeleteDateColumn,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  ILike,
  IsNull,
  Not,
  ObjectLiteral,
  ObjectType,
  PrimaryColumn,
  Raw,
  Repository,
  SaveOptions,
  TreeRepository,
  UpdateDateColumn,
  BaseEntity as _BaseEntity,
  getMetadataArgsStorage,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { generateEntityId } from "utils/functions";
export const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as any) || "postgres", // 'as any'는 타입스크립트 오류 방지용
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "mydatabase",
  synchronize: process.env.SYNCHRONIZE === "true", // env 변수는 문자열이므로 'true' 비교
  logging: process.env.LOGGING === "true" ? ["query", "error"] : false, // 쿼리 로그 활성화
  entities: [path.join(__dirname, "models/**/*.{js,ts}")],
  migrations: [path.join(__dirname, "migration/**/*.{js,ts}")],
  subscribers: [path.join(__dirname, "subscribers/**/*.{js,ts}")],
  migrationsRun: true,
});
export const dataSourceSymbol = Symbol("dataSource");
container.register("dataSource", {
  useFactory: () => AppDataSource.manager,
});
export const initializeDataSource = async () => {
  try {
    await AppDataSource.initialize();
    getMetadataArgsStorage().tables.map((table) => table.target);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected readonly repo: Repository<T>;
  constructor(
    protected readonly manager: EntityManager,
    enttiy: ObjectType<T>
  ) {
    this.repo = this.manager.getRepository(enttiy);
  }

  public getManager(): EntityManager {
    return this.manager;
  }
  async query(query: string, parameters?: any[]) {
    return await this.repo.query(query, parameters);
  }
  builder(alias: string) {
    return this.repo.createQueryBuilder(alias);
  }
  async save(data: DeepPartial<T>) {
    return await this.repo.save(data);
  }
  async saves(
    entities: DeepPartial<T>[],
    options: SaveOptions & { reload?: false }
  ): Promise<DeepPartial<T>[]> {
    return this.repo.save(entities, options);
  }
  async create(data: DeepPartial<T>): Promise<T> {
    return await this.repo.save(this.repo.create(data));
  }
  async creates(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.repo.save(this.repo.create(data));
  }
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repo.find(options);
  }
  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repo.findOne(options);
  }
  async count(options?: FindManyOptions<T>) {
    return await this.repo.count(options);
  }
  async exists(options?: FindManyOptions<T>): Promise<boolean> {
    return await this.repo.exists(options);
  }

  async findPaging(
    pageData: PageData,
    options?: FindOneOptions<T>
  ): Promise<Pageable<T>> {
    const { pageSize, pageNumber = 0 } = pageData;
    const content = await this.repo.find({
      ...options,
      take: pageSize,
      skip: pageNumber * pageSize,
    });
    const NumberOfTotalElements = await this.repo.count(options);
    const NumberOfElements = content.length;
    const totalPages =
      pageSize > 0 ? Math.ceil(NumberOfTotalElements / pageSize) : 0;
    const last = pageNumber === totalPages - 1;

    return {
      content,
      pageSize,
      pageNumber,
      NumberOfTotalElements,
      NumberOfElements,
      totalPages,
      last,
    };
  }
  async findLimit(
    limitData: LimitData,
    options?: FindOneOptions<T>
  ): Promise<Limitable<T>> {
    const { limit, offset = 0 } = limitData;
    const content = await this.repo.find({
      ...options,
      take: limit,
      skip: offset,
    });
    const NumberOfTotalElements = await this.repo.count(options);
    const NumberOfElements = content.length;
    const last = offset + NumberOfElements === NumberOfTotalElements;
    return {
      content,
      limit,
      offset,
      NumberOfTotalElements,
      NumberOfElements,
      last,
    };
  }
  async update(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    data: QueryDeepPartialEntity<T>
  ): Promise<number> {
    const update = await this.repo.update(where, data);
    return update.affected || 0;
  }

  async delete(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    soft = true
  ): Promise<number> {
    let affected = 0;
    if (soft) {
      affected = (await this.repo.softDelete(where)).affected || 0;
    } else {
      affected = (await this.repo.delete(where)).affected || 0;
    }
    return affected;
  }
  async restore(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[]
  ): Promise<number> {
    const restore = await this.repo.restore(where);
    return restore.affected || 0;
  }
}

export abstract class BaseTreeRepository<T extends ObjectLiteral> {
  protected readonly repo: TreeRepository<T>;

  constructor(
    protected readonly manager: EntityManager,
    enttiy: ObjectType<T>
  ) {
    this.repo = this.manager.getTreeRepository(enttiy);
  }

  public getManager(): EntityManager {
    return this.manager;
  }
  async query(query: string, parameters?: any[]) {
    return await this.repo.query(query, parameters);
  }
  builder(alias: string) {
    return this.repo.createQueryBuilder(alias);
  }
  async save(data: DeepPartial<T>) {
    return await this.repo.save(data);
  }
  async create(data: DeepPartial<T>): Promise<T> {
    return await this.repo.save(this.repo.create(data));
  }
  async creates(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.repo.save(this.repo.create(data));
  }
  async findAll(options?: FindManyOptions<T> & TreeOptions): Promise<T[]> {
    const tree = options?.tree;
    delete options?.tree;
    let result = await this.repo.find(options);
    switch (tree) {
      case "ancestors":
        result = await Promise.all(
          result.map(async (entity: T) => {
            return await this.repo.findAncestorsTree(entity, {
              relations: options?.relations,
            } as any);
          })
        );
        break;
      case "descendants":
        result = await Promise.all(
          result.map(async (entity: T) => {
            return await this.repo.findDescendantsTree(entity, {
              relations: options?.relations,
            } as any);
          })
        );
        break;
    }
    return result;
  }
  async findOne(options: FindOneOptions<T> & TreeOptions): Promise<T | null> {
    const tree = options?.tree;
    delete options?.tree;
    let result = await this.repo.findOne(options);
    if (result)
      switch (tree) {
        case "ancestors":
          return await this.repo.findAncestorsTree(result, {
            relations: options?.relations,
          } as any);

        case "descendants":
          return await this.repo.findDescendantsTree(result, {
            relations: options?.relations,
          } as any);
      }
    return result;
  }
  async count(options?: FindManyOptions<T>) {
    return await this.repo.count(options);
  }
  async exists(options?: FindManyOptions<T>): Promise<boolean> {
    return await this.repo.exists(options);
  }

  async findPaging(
    pageData: PageData,
    options?: FindOneOptions<T> & TreeOptions
  ): Promise<Pageable<T>> {
    const { pageSize, pageNumber = 0 } = pageData;
    const tree = options?.tree;
    delete options?.tree;
    let content = await this.repo.find({
      ...options,
      take: pageSize,
      skip: pageNumber * pageSize,
    });
    switch (tree) {
      case "ancestors":
        content = await Promise.all(
          content.map(async (entity: T) => {
            return await this.repo.findAncestorsTree(entity, {
              relations: options?.relations,
            } as any);
          })
        );
        break;
      case "descendants":
        content = await Promise.all(
          content.map(async (entity: T) => {
            return await this.repo.findDescendantsTree(entity, {
              relations: options?.relations,
            } as any);
          })
        );
        break;
    }

    const NumberOfTotalElements = await this.repo.count(options);
    const NumberOfElements = content.length;
    const totalPages =
      pageSize > 0 ? Math.ceil(NumberOfTotalElements / pageSize) : 0;
    const last = pageNumber === totalPages - 1;

    return {
      content,
      pageSize,
      pageNumber,
      NumberOfTotalElements,
      NumberOfElements,
      totalPages,
      last,
    };
  }
  async findLimit(
    limitData: LimitData,
    options?: FindOneOptions<T> & TreeOptions
  ): Promise<Limitable<T>> {
    const { limit, offset = 0 } = limitData;
    const tree = options?.tree;
    delete options?.tree;
    let content = await this.repo.find({
      ...options,
      take: limit,
      skip: offset,
    });
    switch (tree) {
      case "ancestors":
        content = await Promise.all(
          content.map(async (entity: T) => {
            return await this.repo.findAncestorsTree(entity, {
              relations: options?.relations,
            } as any);
          })
        );
        break;
      case "descendants":
        content = await Promise.all(
          content.map(async (entity: T) => {
            return await this.repo.findDescendantsTree(entity, {
              relations: options?.relations,
            } as any);
          })
        );
        break;
    }

    const NumberOfTotalElements = await this.repo.count(options);
    const NumberOfElements = content.length;
    const last = offset + NumberOfElements === NumberOfTotalElements;
    return {
      content,
      limit,
      offset,
      NumberOfTotalElements,
      NumberOfElements,
      last,
    };
  }
  async update(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    data: QueryDeepPartialEntity<T>
  ): Promise<number> {
    const update = await this.repo.update(where, data);
    return update.affected || 0;
  }

  async delete(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    soft = true
  ): Promise<number> {
    let affected = 0;
    if (soft) {
      affected = (await this.repo.softDelete(where)).affected || 0;
    } else {
      affected = (await this.repo.delete(where)).affected || 0;
    }
    return affected;
  }
  async restore(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[]
  ): Promise<number> {
    const restore = await this.repo.restore(where);
    return restore.affected || 0;
  }
}

export abstract class BaseEntity extends _BaseEntity {
  constructor() {
    super();
  }
  @PrimaryColumn()
  id!: string;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
    nullable: false,
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
    nullable: false,
  })
  updated_at!: Date;

  @DeleteDateColumn({
    type: "timestamp with time zone",
    default: null,
    onUpdate: "CURRENT_TIMESTAMP",
    nullable: true,
  })
  deleted_at?: Date;

  @BeforeInsert()
  protected BeforeInsert(): void {
    this.id = generateEntityId(this.id);
  }
}

export abstract class BaseTreeEntity extends BaseEntity {
  constructor() {
    super();
  }
  @Column({ type: "character varying", nullable: true })
  parent_id?: string;

  abstract parent?: BaseTreeEntity;

  abstract children?: BaseTreeEntity[];

  @Column({ type: "integer", default: 0, nullable: false })
  index?: number;
}

function parseWhere(where: any) {
  if (where) {
    Object.keys(where).forEach((key) => {
      if (where[key] === null) {
        where[key] = IsNull();
      }
    });
  }
  return where;
}
export abstract class BaseService<
  T extends BaseEntity,
  R extends BaseRepository<T>
> {
  protected readonly repository: R;
  protected readonly manager;
  protected constructor(repository: R) {
    this.repository = repository;
    this.manager = repository.getManager();
  }
  protected Search(
    where: any | any[],
    keyword: string[] | string,
    q: string,
    deppSearch = false
  ) {
    const Search = (q: string) =>
      deppSearch
        ? Raw(
            (alias) =>
              `fn_text_to_char_array(${alias}) @> fn_text_to_char_array('${q}')`
          )
        : ILike(`%${q}%`);
    if (Array.isArray(keyword)) {
      return keyword
        .map((_keyword) => {
          const _where = Array.isArray(where) ? where : [where];

          if (_keyword.includes(".")) {
            const split = _keyword.split(".");
            const obj = split.reduceRight((acc, now, index) => {
              if (index === split.length - 1) return { [now]: Search(q) };
              return { [now]: acc };
            }, {} as any);
            return _where.map((wh) => {
              return _.merge({ ...(wh || {}) }, obj);
            });
          } else
            return _where.map((wh) => {
              return _.merge({ ...(wh || {}) }, { [_keyword]: Search(q) });
            });
        })
        .flat();
    } else {
      if (Array.isArray(where)) {
        if (keyword.includes(".")) {
          const split = keyword.split(".");
          const obj = split.reduceRight((acc, now, index) => {
            if (index === split.length - 1) return { [now]: Search(q) };
            return { [now]: acc };
          }, {} as any);
          return where.map((wh) => _.merge(wh || {}, obj));
        } else
          return where.map((wh) => _.merge(wh || {}, { [keyword]: Search(q) }));
      } else {
        if (keyword.includes(".")) {
          const split = keyword.split(".");
          const obj = split.reduceRight((acc, now, index) => {
            if (index === split.length - 1) return { [now]: Search(q) };
            return { [now]: acc };
          }, {} as any);
          return _.merge(where || {}, obj);
        } else return _.merge(where || {}, { [keyword]: Search(q) });
      }
    }
  }

  async create(data: DeepPartial<T>): Promise<T> {
    return await this.repository.create(data);
  }
  async creates(data: DeepPartial<T>, amount: number): Promise<T[]> {
    if (amount <= 0) throw Error("amount must be more than 0");
    return await this.repository.creates(
      Array.from({ length: amount }).map(() => ({ ...data }))
    );
  }
  async getList(options?: FindManyOptions<T>): Promise<T[]> {
    if (options?.where) {
      options.where = parseWhere(options.where);
    }
    if (options?.relations && !Array.isArray(options.relations)) {
      options.relations = [options.relations as any];
    }
    if (options?.select && !Array.isArray(options.select)) {
      options.select = [options.select as any];
    }
    return await this.repository.findAll(options);
  }
  async getPageable(pageData: PageData, options: FindOneOptions<T>) {
    if (options?.where) {
      options.where = parseWhere(options.where);
    }
    if (options.relations && !Array.isArray(options.relations)) {
      options.relations = [options.relations as any];
    }
    if (options?.select && !Array.isArray(options.select)) {
      options.select = [options.select as any];
    }
    return await this.repository.findPaging(pageData, options);
  }

  async get(options: FindOneOptions<T>): Promise<T | null> {
    if (options?.where) {
      options.where = parseWhere(options.where);
    }
    if (options.relations && !Array.isArray(options.relations)) {
      options.relations = [options.relations as any];
    }
    if (options?.select && !Array.isArray(options.select)) {
      options.select = [options.select as any];
    }
    return await this.repository.findOne(options);
  }
  async getById(
    id: string,
    options?: {
      relations?: FindOptionsRelations<T> | FindOptionsRelationByString;
      select?: FindOptionsSelect<T> | FindOptionsSelectByString<T>;
      withDeleted?: boolean;
    }
  ): Promise<T | null> {
    if (options?.relations && !Array.isArray(options.relations)) {
      options.relations = [options.relations as any];
    }
    if (options?.select && !Array.isArray(options.select)) {
      options.select = [options.select as any];
    }
    return await this.repository.findOne({
      where: { id: id },
      ...options,
    } as any);
  }
  async getCount(options?: FindOneOptions<T>): Promise<number> {
    return await this.repository.count(options);
  }
  async isExists(options?: FindManyOptions<T>) {
    return await this.repository.exists(options);
  }
  async update(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    data: QueryDeepPartialEntity<T>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<T>> {
    const affected = await this.repository.update(where, data);
    let result: T[] = [];
    if (returnEnttiy) {
      result = await this.repository.findAll({ where });
    }
    return {
      affected: affected,
      result,
    };
  }
  async delete(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    soft?: boolean
  ): Promise<number> {
    return await this.repository.delete(where, soft);
  }
  async restore(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    returnEnttiy?: boolean
  ): Promise<RestoreResult<T>> {
    const affected = await this.repository.restore(where);
    let result: T[] = [];
    if (returnEnttiy) {
      result = await this.repository.findAll({ where });
    }
    return {
      affected: affected,
      result,
    };
  }
  async withTransaction<T>(
    action: (transactionalService: this) => Promise<T>
  ): Promise<T> {
    return this.manager.transaction(async (transactionalEntityManager) => {
      const TransactionalRepositoryClass = this.repository.constructor as new (
        manager: EntityManager
      ) => R;
      const transactionalRepository = new TransactionalRepositoryClass(
        transactionalEntityManager
      );
      const TransactionalServiceClass = this.constructor as new (
        repo: R
      ) => this;
      const transactionalService = new TransactionalServiceClass(
        transactionalRepository
      );
      const result = await action(transactionalService);
      return result;
    });
  }
}

export abstract class BaseTreeService<
  T extends BaseTreeEntity,
  R extends BaseTreeRepository<T>
> {
  protected readonly repository: R;
  protected readonly manager;
  protected constructor(repository: R) {
    this.repository = repository;
    this.manager = repository.getManager();
  }
  protected Search(
    where: any | any[],
    keyword: string[] | string,
    q: string,
    deppSearch = false
  ) {
    const Search = (q: string) =>
      deppSearch
        ? Raw(
            (alias) =>
              `fn_text_to_char_array(${alias}) @> fn_text_to_char_array('${q}')`
          )
        : ILike(`%${q}%`);
    if (Array.isArray(keyword)) {
      return keyword
        .map((_keyword) => {
          const _where = Array.isArray(where) ? where : [where];
          return _where.map((wh) => {
            return _.merge({ ...(wh || {}) }, { [_keyword]: Search(q) });
          });
        })
        .flat();
    } else {
      if (Array.isArray(where)) {
        return where.map((wh) => _.merge(wh || {}, { [keyword]: Search(q) }));
      } else {
        return _.merge(where || {}, { [keyword]: Search(q) });
      }
    }
  }

  async create(data: DeepPartial<T>): Promise<T> {
    if (typeof data.index === "undefined") {
      data.index = await this.getCount({
        where: {
          parent_id: data.parent_id || null,
        },
      } as any);
    } else {
      await this.repository
        .builder("e")
        .update()
        .set({ index: () => `index + 1` } as any)
        .where(
          data.parent_id
            ? `parent_id = '${data.parent_id}'`
            : "parent_id IS NULL"
        )
        .andWhere(`index >= ${data.index}`)
        .execute();
    }
    const _data: any = data;
    if (!_data.parent && _data.parent_id) {
      _data.parent = await this.repository.findOne({
        where: { id: _data.parent_id },
        tree: "ancestors",
      } as any);
    }
    return await this.repository.create(_data);
  }
  async creates(data: DeepPartial<T>, amount: number): Promise<T[]> {
    if (amount <= 0) throw Error("amount must be more than 0");

    if (typeof data.index === "undefined") {
      data.index = await this.getCount({
        where: {
          parent_id: data.parent_id || null,
        },
      } as any);
    } else {
      await this.repository
        .builder("e")
        .update()
        .set({ index: () => `index + ${amount}` } as any)
        .where(
          data.parent_id
            ? `parent_id = '${data.parent_id}'`
            : "parent_id IS NULL"
        )
        .andWhere(`index >= ${data.index}`)
        .execute();
    }
    const _data: any = data;
    if (!_data.parent && _data.parent_id) {
      _data.parent = await this.repository.findOne({
        where: { id: _data.parent_id },
        tree: "ancestors",
      } as any);
    }
    return await this.repository.creates(
      Array.from({ length: amount }).map((_, _index) => ({
        ..._data,
        index: Number(_data.index) + _index,
      }))
    );
  }
  async getList(options?: FindManyOptions<T> & TreeOptions): Promise<T[]> {
    if (options?.where) {
      options.where = parseWhere(options.where);
    }
    if (options?.relations && !Array.isArray(options.relations)) {
      options.relations = [options.relations as any];
    }
    if (options?.select && !Array.isArray(options.select)) {
      options.select = [options.select as any];
    }
    return await this.repository.findAll(options);
  }

  async getPageable(
    pageData: PageData,
    options: FindOneOptions<T> & TreeOptions
  ) {
    if (options?.where) {
      options.where = parseWhere(options.where);
    }
    if (options?.relations && !Array.isArray(options.relations)) {
      options.relations = [options.relations as any];
    }
    if (options?.select && !Array.isArray(options.select)) {
      options.select = [options.select as any];
    }
    return await this.repository.findPaging(pageData, options);
  }
  async get(options: FindOneOptions<T> & TreeOptions): Promise<T | null> {
    if (options?.where) {
      options.where = parseWhere(options.where);
    }
    if (options?.relations && !Array.isArray(options.relations)) {
      options.relations = [options.relations as any];
    }
    if (options?.select && !Array.isArray(options.select)) {
      options.select = [options.select as any];
    }
    return await this.repository.findOne(options);
  }
  async getById(
    id: string,
    options?: TreeOptions & {
      relations?: FindOptionsRelations<T> | FindOptionsRelationByString;
      select?: FindOptionsSelect<T> | FindOptionsSelectByString<T>;
      withDeleted?: boolean;
    }
  ): Promise<T | null> {
    if (options?.relations && !Array.isArray(options.relations)) {
      options.relations = [options.relations as any];
    }
    if (options?.select && !Array.isArray(options.select)) {
      options.select = [options.select as any];
    }
    return await this.repository.findOne({
      where: { id: id },
      ...options,
    } as any);
  }
  async getCount(options?: FindOneOptions<T>): Promise<number> {
    return await this.repository.count(options);
  }
  async isExists(options?: FindManyOptions<T>) {
    return await this.repository.exists(options);
  }
  async update(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    data: QueryDeepPartialEntity<T>,
    returnEnttiy?: boolean
  ): Promise<UpdateResult<T>> {
    const _data: any = data;
    if (typeof _data.index === "undefined") {
      // _data.index = await this.getCount({
      //   where: {
      //     parent_id: _data.parent_id || null,
      //   },
      // } as any);
    } else {
      const preEntities = await this.repository.findAll({
        where: where,
        select: ["index", "parent_id", "id"],
      });
      await Promise.all(
        preEntities.map(async (preEntity) => {
          const preindex = preEntity?.index || 0;
          if (
            typeof _data.parent_id === "undefined" ||
            preEntity.parent_id === _data.parent_id
          ) {
            _data.parent_id = preEntity.parent_id;
            if (preindex > _data.index) {
              await this.repository
                .builder("e")
                .update()
                .set({ index: () => `index - 1` } as any)
                .where(
                  _data.parent_id
                    ? `parent_id = '${_data.parent_id}'`
                    : "parent_id IS NULL"
                )
                .andWhere(`index <= ${_data.index}`)
                .andWhere(`index > ${preindex}`)
                .execute();
            } else if (preindex < _data.index) {
              await this.repository
                .builder("e")
                .update()
                .set({ index: () => `index + 1` } as any)
                .where(
                  _data.parent_id
                    ? `parent_id = '${_data.parent_id}'`
                    : "parent_id IS NULL"
                )
                .andWhere(`index >= ${_data.index}`)
                .andWhere(`index < ${preindex}`)
                .execute();
            }
          } else {
            await this.repository
              .builder("e")
              .update()
              .set({ index: () => `index - 1` } as any)
              .where(
                preEntity.parent_id
                  ? `parent_id = '${preEntity.parent_id}'`
                  : "parent_id IS NULL"
              )
              .andWhere(`index > ${preEntity.index}`)
              .execute();
            await this.repository
              .builder("e")
              .update()
              .set({ index: () => `index + 1` } as any)
              .where(
                _data.parent_id
                  ? `parent_id = '${_data.parent_id}'`
                  : "parent_id IS NULL"
              )
              .andWhere(`index >= ${_data.index}`)
              .execute();
            await this.repository
              .builder("e")
              .update()
              .set({
                mpath: () =>
                  `replace(mpath,'${preEntity.parent_id}','${_data.parent_id}')`,
              } as any)
              .where(`mpath like '%${preEntity.id}%'`)
              .execute();
          }
        })
      );
    }
    if (!_data.parent && _data.parent_id) {
      _data.parent = await this.repository.findOne({
        where: { id: _data.parent_id },
        tree: "ancestors",
      } as any);
    }
    const affected = await this.repository.update(where, _data);
    let result: T[] = [];
    if (returnEnttiy) {
      result = await this.repository.findAll({ where });
    }
    return {
      affected: affected,
      result,
    };
  }
  async delete(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    soft: boolean = true
  ): Promise<number> {
    const entities = await this.repository.findAll({
      where: where,
    });
    await Promise.all(
      entities.map(async (entity) => {
        if (entity) {
          if (soft) {
            await this.repository
              .builder("e")
              .update()
              .set({
                deleted_at: () => `NOW()`,
              } as any)
              .where(`mpath like '%${entity.id}%'`)
              .andWhere(`id != '${entity.id}'`)
              .execute();
          } else {
            await this.repository
              .builder("e")
              .update()
              .set({ parent_id: () => "null" } as any)
              .where(`mpath like '%${entity.id}%'`)
              .andWhere(`id != '${entity.id}'`)
              .execute();
            await this.repository
              .builder("e")
              .delete()
              .where(`mpath like '%${entity.id}%'`)
              .andWhere(`id != '${entity.id}'`)
              .execute();
          }
          await this.repository
            .builder("e")
            .update()
            .set({ index: () => `index - 1` } as any)
            .where(
              entity.parent_id
                ? `parent_id = '${entity.parent_id}'`
                : "parent_id IS NULL"
            )
            .andWhere(`index > ${entity.index}`)
            .execute();
        }
      })
    );

    return await this.repository.delete(where, soft);
  }
  async restore(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    returnEnttiy?: boolean
  ): Promise<RestoreResult<T>> {
    const entities = await this.repository.findAll({
      where: { ...where, deleted_at: Not(IsNull()) },
      withDeleted: true,
    } as any);
    await Promise.all(
      entities.map(async (entity) => {
        await this.repository
          .builder("e")
          .update()
          .set({ index: () => `index + 1` } as any)
          .where(`parent_id = '${entity.parent_id}'`)
          .andWhere(`index >= ${entity.index}`)
          .andWhere(`id != ${entity.id}`)
          .execute();
      })
    );
    const affected = await this.repository.restore(where);
    let result: T[] = [];
    if (returnEnttiy) {
      result = await this.repository.findAll({ where });
    }
    return {
      affected: affected,
      result,
    };
  }
  async withTransaction<T>(
    action: (transactionalService: this) => Promise<T>
  ): Promise<T> {
    return this.manager.transaction(async (transactionalEntityManager) => {
      const TransactionalRepositoryClass = this.repository.constructor as new (
        manager: EntityManager
      ) => R;
      const transactionalRepository = new TransactionalRepositoryClass(
        transactionalEntityManager
      );
      const TransactionalServiceClass = this.constructor as new (
        repo: R
      ) => this;
      const transactionalService = new TransactionalServiceClass(
        transactionalRepository
      );
      const result = await action(transactionalService);
      return result;
    });
  }
}
