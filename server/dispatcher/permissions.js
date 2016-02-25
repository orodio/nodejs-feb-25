import { Just, Nope } from "../__lib__/maybe"
import handlers       from "../__handlers__"

const cans = handlers.reduce((acc, handler) => {
  if (handler.type == null) return acc
  if (handler.can == null)  return acc

  return { ...acc, [handler.type]:handler.can }
}, {})

export default async function (payload, { type, current_user_uuid = null }) {
  try {
    if (cans[type] == null) return new Nope(400, `(permissions) No handler present for type: [${ type }]`, payload)
    if (cans[type] == "CURRENT_USER" && current_user_uuid == null) return new Nope(401, `(permissions) You need to be signed in to do that`, payload)
    return new Just(payload)

  } catch (err) {
    return new Nope(500, `(permissions) handling the permissions failed`, payload, err)
  }
}
