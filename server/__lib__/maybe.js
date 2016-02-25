export function Just (a) {
  this.status = 200
  this.a  = a
}

export function Nope (status, msg, payload, trace) {
  console.log(`\n-o-o-o-o-o-\n\nNope: ${ status } - ${ msg }\n`)
  if (payload) console.log(payload)
  if (trace)   console.log(`\n---\n`)
  if (trace)   console.error(trace)
  console.log(`\n\n-o-o-o-o-o-\n\n`)

  this.status = status
  this.a  = msg
}

export const isJust = v => v instanceof Just
export const isNope = v => v instanceof Nope

export const _return = (value) => {
  if (isJust(value) || isNope(value)) return value
  return new Just(value)
}

export const bind = async function (maybe, ...fns) {
  try {
    maybe = _return(maybe)
    if (isNope(maybe) || !fns.length) return maybe
    const [ head, ...tail ] = fns
    const next = await head(maybe.a, maybe.a)

    return bind(next, ...tail)

  } catch (err) {
    return new Nope(500, `Internal Error, [bind] ${ fns.length } unbound`, maybe.a, err)
  }
}
