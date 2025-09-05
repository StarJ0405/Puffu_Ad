import { Chat } from "models/chat";
import { ChatroomService } from "services/chatroom";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  const { targets } = req.parsedQuery;
  const service = container.resolve(ChatroomService);
  if (!targets || targets?.length === 0) {
    const content = await service.getAdminChat(user.id);

    return res.json({ content });
  }
  return res.status(404).send("Cannot GET /users/me/chatroom");
};

export const SOCKET: SocketHandler = async (socket, io, url, data) => {
  const { room_id, user_id, message, type } = data;

  const service = container.resolve(ChatroomService);
  const chat = await service.createChat(room_id, user_id, message, type);
  service.update(
    { id: room_id },
    {
      updated_at: () => "CURRENT_TIMESTAMP",
    }
  );
  io.sockets.emit(`admin_chatrooms`);
  return io.sockets.emit(`/${room_id}/chats`, {
    chat,
  });
};
