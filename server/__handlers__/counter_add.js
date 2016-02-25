import { STRING }     from "facts"
import { Just, Nope } from "../__lib__/maybe"
import $$$            from "../__lib__/redis"

export const type = "COUNTER_ADD"

export const shape = {
  counter_uuid : STRING,
  name         : STRING,
}

export const save = async function (payload, { counter_uuid, name }) {
  try {
    await $$$.pipeline()
      .sadd(`COUNTERS`, counter_uuid)
      .set(`COUNTER|${ counter_uuid }`, JSON.stringify({
        uuid:counter_uuid,
        name,
      }))
      .set(`COUNTER|${ counter_uuid }|COUNT`, 0)
      .exec()

  } catch (err) {
    return new Nope(500, "Internal Error: [counter_add]", payload, err)
  }
}
