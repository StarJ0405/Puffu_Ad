import { Notice } from "models/notice";
import { NoticeService } from "services/notice";
import { container } from "tsyringe";

export const POST: ApiHandler = async (req, res) => {
  const {
    title,
    store_id,
    detail,
    type,
    starts_at,
    ends_at,
    adult,
    visible,
    metadata,
    _amount = 1,
    _return_data = false,
  } = req.body;

  const service: NoticeService = container.resolve(NoticeService);
  try {
    let result: Notice[] = [];
    const _data = {
      title,
      store_id,
      detail,
      type,
      starts_at,
      ends_at,
      adult,
      visible,
      metadata,
    };
    if (_amount === 1) {
      result = [await service.create(_data)];
    } else {
      result = await service.creates(_data, _amount);
    }
    return res.json(
      _return_data ? { content: result } : { message: "success" }
    );
  } catch (err: any) {
    return res.status(500).json({ error: err?.message, status: 500 });
  }
};

export const GET: ApiHandler = async (req, res) => {
  let {
    pageSize,
    pageNumber = 0,
    relations,
    order,
    select,
    ...where
  } = req.parsedQuery;
  const service: NoticeService = container.resolve(NoticeService);
  if (pageSize) {
    const page = await service.getPageable(
      {
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
      },
      { select, order, relations, where }
    );
    return res.json(page);
  } else {
    const content = await service.getList({ select, order, relations, where });
    return res.json({ content });
  }
};
