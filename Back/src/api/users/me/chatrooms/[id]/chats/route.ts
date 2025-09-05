import { ChatroomService } from "services/chatroom";
import { container } from "tsyringe";

export const GET: ApiHandler = async (req, res) => {
  // const user = req.user;
  const { id } = req.params;
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;

  const service = container.resolve(ChatroomService);
  if (pageSize) {
    const page = await service.getChatPageable(
      id,
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      { select, order, relations, where }
    );
    return res.json(page);
  } else {
    const content = await service.getChatList(id, {
      select,
      order,
      relations,
      where,
    });
    return res.json({ content });
  }
};
