import { Just, Nope } from "../__lib__/maybe"
import handlers       from "../__handlers__"

const saves = handlers.reduce((acc, handler) => {
  if (handler.type == null) return acc
  if (handler.save == null) return acc

  return { ...acc, [handler.type]:handler.save }
}, {})

export default async function (payload, { type }) {
  try {
    if (saves[type] == null) return new Nope(400, `(handle) No handler preesent for type: [${ type }]`, payload)
    return await saves[type](payload, payload)

  } catch (err) {
    return new Nope(500, `(handle) handling the save failed`, payload, err)
  }
}
