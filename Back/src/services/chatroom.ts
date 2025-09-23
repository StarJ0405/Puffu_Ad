import { BaseService } from "data-source";
import { Chat, ChatType } from "models/chat";
import { Chatroom } from "models/chatroom";
import { UserRole } from "models/user";
import { ChatroomUserRepository } from "repositories/chat";
import { ChatroomRepository } from "repositories/chatroom";
import { ChatRepository } from "repositories/chatroom-user";
import { UserRepository } from "repositories/user";

import { inject, injectable } from "tsyringe";
import { FindManyOptions, In, LessThanOrEqual } from "typeorm";

@injectable()
export class ChatroomService extends BaseService<Chatroom, ChatroomRepository> {
  constructor(
    @inject(ChatroomRepository)
    chatroomRepository: ChatroomRepository,
    @inject(ChatroomUserRepository)
    protected chatroomUserRepository: ChatroomUserRepository,
    @inject(ChatRepository)
    protected chatRepository: ChatRepository,
    @inject(UserRepository)
    protected userRepository: UserRepository
  ) {
    super(chatroomRepository);
  }
  async getAdminChat(user_id: string, open: boolean): Promise<Chatroom | null> {
    const admin = await this.userRepository.findOne({
      where: { role: UserRole.ADMIN },
    });
    if (!admin) throw new Error("admin 계정이 없습니다.");
    if (admin.id === user_id)
      throw new Error("어드민은 관리자 채팅을 열 수 없습니다.");
    const rooms = await this.repository.findAll({
      where: {
        users: {
          user_id: In([user_id, admin.id]),
        },
      },
      relations: ["users"],
    });

    let room: any = rooms.find((f) => f.users?.length === 2);
    if (!room) {
      room = await this.repository.create({
        title: "",
      });
      room.unread = 0;
      const chat = await this.chatRepository.create({
        message: "안녕하세요!\n무엇을 도와드릴까요? 🙋‍♀️",
        type: ChatType.MESSAGE,
        room_id: room.id,
        user_id: admin.id,
      });
      await this.chatroomUserRepository.create({
        room_id: room.id,
        user_id: user_id,
        last_read: new Date(),
      });
      await this.chatroomUserRepository.create({
        room_id: room.id,
        user_id: admin.id,
        last_read: new Date(),
      });
      // users: [{ id: user_id }, { id: admin_id }],
    } else {
      if (open) await this.updateUserRead(user_id, room.id);
      room = await this.repository.findOne({
        where: {
          id: room.id,
        },
        relations: ["users"],
      });
      const unread = await this.chatRepository
        .builder("ch")
        .innerJoinAndSelect("chatroom_user", "cu", "ch.room_id = cu.room_id")
        .where("ch.created_at > cu.last_read")
        .andWhere("cu.user_id = :user_id", {
          user_id,
        })
        .select("ch.room_id", "id")
        .addSelect("count(*)", "unread")
        .andWhere(`ch.room_id = :room_id`, { room_id: room.id })
        .groupBy("ch.room_id")
        .getRawOne();
      room.unread = Number(unread?.unread || 0);
    }

    return room;
  }
  async getChatList(room_id: string, options?: FindManyOptions<Chat>) {
    let _options = options || {};

    let where = options?.where;
    if (!where) where = {};

    where = Array.isArray(where) ? where : [where];
    where = where.map((w) => {
      w.room_id = room_id;
      if (w.created_at) w.created_at = LessThanOrEqual(w.created_at);
      return w;
    });
    _options.where = where;
    _options.order = {
      created_at: "desc",
    };

    return await this.chatRepository.findAll(_options);
  }

  async getChatPageable(
    room_id: string,
    page: PageData,
    options?: FindManyOptions<Chat>
  ) {
    let _options = options || {};

    let where = options?.where;
    if (!where) where = {};

    where = Array.isArray(where) ? where : [where];
    where = where.map((w) => {
      w.room_id = room_id;
      if (w.created_at) w.created_at = LessThanOrEqual(w.created_at);
      return w;
    });
    _options.where = where;
    if (_options.relations)
      _options.relations = Array.isArray(_options.relations)
        ? _options.relations
        : ([_options.relations] as any);
    _options.order = {
      created_at: "desc",
    };
    return await this.chatRepository.findPaging(page, _options);
  }

  async createChat(
    room_id: string,
    user_id: string,
    message: string,
    type: string
  ) {
    const types = Object.values(ChatType);
    let _type: ChatType = ChatType.MESSAGE;
    if (types.includes(type as ChatType)) _type = type as ChatType;
    const chat = await this.chatRepository.create({
      room_id,
      user_id,
      message,
      type: _type,
    });
    if (chat) {
      await this.updateUserRead(user_id, room_id);
    }
    return await this.chatRepository.findOne({
      where: {
        id: chat.id,
      },
      relations: ["user"],
    });
  }
  async updateUserRead(user_id: string, room_id: string): Promise<void> {
    await this.chatroomUserRepository.update(
      {
        user_id,
        room_id,
      },
      {
        last_read: () => "CURRENT_TIMESTAMP",
      }
    );
  }
  async getMyChatrooms(user_id: string, pageData?: PageData, q?: string) {
    let builder = this.repository
      .builder("r")
      .leftJoinAndSelect("r.users", "u")
      .leftJoinAndSelect("u.user", "user")
      .where(
        "r.id in (SELECT r.id FROM public.chatroom r LEFT JOIN public.chatroom_user u ON u.room_id = r.id WHERE u.user_id = :user_id)",
        { user_id }
      )
      .orderBy("r.updated_at", "DESC");
    if (q) {
      builder.where(
        `r.id in (${this.repository
          .builder("r")
          .leftJoinAndSelect("r.users", "u")
          .leftJoinAndSelect("u.user", "user")
          .select("r.id")
          .where(
            "(user.id like :q OR user.username like :q OR user.name like :q OR r.title like :q)",
            { q: `%${q}%` }
          )
          .getQuery()})`,
        { q: `%${q}%` }
      );
    }

    const unreadBuilder = this.chatRepository
      .builder("ch")
      .innerJoinAndSelect("chatroom_user", "cu", "ch.room_id = cu.room_id")
      .where("ch.created_at > cu.last_read")
      .andWhere("cu.user_id = :user_id", {
        user_id,
      })
      .select("ch.room_id", "id")
      .addSelect("count(*)", "unread");
    // console.log(unreads.getRawMany())
    if (pageData?.pageSize && pageData.pageSize > 0) {
      const count = builder.clone();

      let content = await builder
        .skip((pageData.pageNumber || 0) * pageData.pageSize)
        .take(pageData.pageSize)
        .getMany();
      const unreads = await unreadBuilder
        .andWhere(
          `ch.room_id in (${content.map((room) => `'${room.id}'`).join(",")})`
        )
        .groupBy("ch.room_id")
        .getRawMany();
      content = content.map((room: any) => {
        room.unread = Number(
          unreads.find((f) => f.id === room.id)?.unread || 0
        );
        return room;
      });

      const NumberOfTotalElements = await count.getCount();
      const NumberOfElements = content.length;
      const totalPages = Math.ceil(NumberOfTotalElements / pageData.pageSize);
      const last = pageData.pageNumber === totalPages - 1;
      return {
        content,
        NumberOfTotalElements,
        NumberOfElements,
        totalPages,
        last,
      };
    }
    let content = await builder.getMany();
    const unreads = await unreadBuilder
      .andWhere(
        `ch.room_id in (${content.map((room) => `'${room.id}'`).join(",")})`
      )
      .groupBy("ch.room_id")
      .getRawMany();
    content = content.map((room: any) => {
      room.unread = Number(unreads.find((f) => f.id === room.id)?.unread || 0);
      return room;
    });
    return { content };
  }
}
