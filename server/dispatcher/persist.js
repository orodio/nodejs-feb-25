import $$$            from "../__lib__/redis"
import { Just, Nope } from "../__lib__/maybe"

export default async function (payload) {
  try {
    await $$$
      .lpush(`EVENTS|ALL`, JSON.stringify(payload))

    return new Just(payload)

  } catch (err) {
    return new Nope(500, `(persist) Pushing to event queue failed`, payload, err)
  }
}
