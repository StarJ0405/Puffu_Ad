import { ChatroomService } from "services/chatroom";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  const user = req.user;
  const { pageSize, pageNumber = 0, q, room_id } = req.parsedQuery;
  const service: ChatroomService = container.resolve(ChatroomService);

  if (room_id) await service.updateUserRead(user.id, room_id);

  return res.json(
    await service.getMyChatrooms(user.id, { pageSize, pageNumber }, q)
  );
};
