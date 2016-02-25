import { STRING }     from "facts"
import { Just, Nope } from "../__lib__/maybe"
import $$$            from "../__lib__/redis"

const delta = -1

export const type = "COUNTER_DEC"

export const shape = {
  counter_uuid: STRING,
}

export const save = async (payload, { counter_uuid }) => {
  try {
    await $$$.pipeline()
      .incrby(`COUNTER|${ counter_uuid }|COUNT`, delta)
      .exec()

    return new Just(payload)

  } catch (err) {
    return new Nope(500, "Inernal Error: [counter_dec.save]", payload, err)
  }
}
