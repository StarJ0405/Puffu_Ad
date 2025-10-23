import { AppDataSource } from "data-source";

export async function query(question: string) {
  const events = await AppDataSource.manager.query(`
    SELECT title FROM public.event
      WHERE start_date <= NOW() AND end_date > NOW()
  `);
  const discounts = await AppDataSource.manager.query(`
    SELECT title FROM public.discount
	    WHERE starts_at <= NOW() AND ends_at> NOW()
  `);

  const _event =
    events.length > 0
      ? `진행중인 이벤트는 [${events
          .map((event: any) => `'${event.title}'`)
          .join(",")}]이 있으며,`
      : "진행중인 이벤트는 없습니다.";
  const _discount =
    discounts.length > 0
      ? `할인은 ${discounts
          .map((discount: any) => `'${discount.title}'`)
          .join(",")}입니다.`
      : "진행중인 할인이 없습니다.";
  return `${_event}\n${_discount}`;
}
