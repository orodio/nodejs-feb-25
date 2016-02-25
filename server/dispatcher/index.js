import { bind, Nope } from "../__lib__/maybe"
import validate       from "./validate"
import permissions    from "./permissions"
import persist        from "./persist"
import handle         from "./handle"

export default async function (payload) {
  if (payload == null) return new Nope(400, `(dispatcher) empty payload`, payload)
  try {
    return await bind(
      payload,
      validate,
      // permissions,
      persist,
      handle
    )

  } catch (err) {
    return new Nope(500, `(dispatcher) failed to dispatch`, payload, err)
  }
}
