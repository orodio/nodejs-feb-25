import { shape }      from "facts"
import { Just, Nope } from "../__lib__/maybe"
import handlers       from "../__handlers__"

const shapes = handlers.reduce((acc, handler) => {
  if (handler.type  == null) return acc
  if (handler.shape == null) return acc

  return { ...acc, [handler.type]:handler.shape }
}, {})

export default async function (payload, { type }) {
  try {
    if (shapes[type] == null)          return new Nope(400, `(validate) No handler present for type: [${ type }]`, payload)
    if (!shape(payload, shapes[type])) return new Nope(400, `(validate) Invalid payload shape for type: [${ type }]`, payload)

    return new Just(payload)
  } catch (err) {
    return new Nope(500, `(validate) Something went wrong while trying to validate the payload for type: [${ type }]`, payload, err)
  }
}
