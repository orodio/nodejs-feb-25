# An experiment in using monad like structures with promises

## James Hunter
 - Twitter: [@cccc00](http://twitter.com/cccc00)
 - Github: [orodio](http://github.com/orodio)
 - This repo: [bit.ly/maybejs](http://bit.ly/maybejs)





# Idea came from: `Maybe a` in haskell

```haskell
data Maybe a = Just a | Nothing deriving (Eq, Ord)
```



# Similar concept in production at
- [Versioning](http://sitepoint.com/versioning)




# Our custom Maybe

```javascript
function Just(value) {
  this.value = value
  this.status = 200
}

function Nope(status, value) {
  this.value = value
  this.status = 200
}
```





# bind
```haskell
>>= :: m a -> (a -> m b) -> m b
```




# Our bind
```javascript
function bind (maybe, fn) {
  if (maybe instanceof Nope) return maybe
  return fn(maybe.value)
}
```




# Bind in use
```javascript
function f (x) {
  if (x === 0) return new Nope(500, "Zero is icky")
  return new Just(x * x)
}

function g (x) {
  if (x === 0) return new Nope(500, "Zero is icky")
  return new Just(x + x)
}

function h (x) {
  if (x === 9) return new Nope(500, "Really a 9")
  return new Just(x - 4)
}

bind(g(4), f) // Just { status:200, value:64 }
              // Just 64

const m1 = bind(new Just(2), g) // Just { status:200, value:4 }
                                // Just 4

const m2 = bind(m1, g)   // Just 8
const m3 = bind(m2, h)   // Just 4
const m4 = bind(m3, h)   // Just 0
const m5 = bind(m4, g)   // Nope "Zero is icky"
const m6 = bind(m5, h)   // Nope "Zero is icky"
const m7 = bind(m6, f)   // Nope "Zero is icky"
```





# Our bind can take more than one function
```javascript

const m1 = new Just(2)
const m2 = bind(m1, g, g, h, h, g, h, f) // Nope "Zero is icky"
```




# If the first thing we pass our bind isnt already a `maybe` we make it one
```javascript
const bind(5, g, f) // Just 100
```





# What if instead of a number our value was an event?
```javascript
function hasType (event) {
  if (event.type == null) return new Nope(400, "Invalid Event, No type")
  return new Just(event)
}

const allowedTypes = new Set(["COUNTER_ADD", "COUNTER_INC", "COUNTER_DEC"])

function allowedType (event) {
  if (allowedTypes.has(event.type)) return new Just(event)
  return new Nope(400, "Invalid Event, Type was not in the allowed type whitelist")
}

function validateEvent (event) {
  return bind(event, hasType, allowedType)
}

const good_event = {
  type: "COUNTER_ADD",
  counter_uuid: "asdf1234",
  name: "bob",
}

validateEvent(good_event) // Just event

const bad_event = {
  type: "ZOMG_HACKZ",
  shhh: "maybe they wont notice",
}

validateEvent(bad_event) // Nope "Invalid Event, Type was not in the allowed type whitelist"
```





# Used in an express router
```javascript
const handleEvent = event => bind(event, maybeValidate, maybeAuthorize, maybePersist, maybeSuccess)

app.post(`/actions`, (req, res) => {
  const { status, value } = handleEvent(req.body)
  res.status(status).send(value)
})
```





# What about you know async stuff? Wasnt this talk about promises?
```javascript
async function maybePersist (event) {
  await redis.lpush(`EVENTS|ALL`, JSON.stringify(event))
  return new Just(event)
}

async function handleEvent (event) {
  return bind(event, /* ..., */ maybePersist)
}

app.post(`/actions`, (req, res) => {
  handleEvent(req.body)
    .then(({ status, value }) => res.status(status).send(value) )
})
```




# What about the errors?

The actual implementation of Nope takes some other things

```javascript
export function Nope (status, value, event, trace) {
  console.log(`Nope: ${ status } - ${ value }\n`)
  if (event) console.log(event)
  if (trace) console.error(trace)

  this.status = status
  this.value  = value
}

async function maybePersist (event) {
  try {
    await redis.lpush(`EVENTS|ALL`, JSON.stringify(event))
    return new Just(event)
  } catch (err) {
    return new Nope(500, `Problems Saving Event`, event, err)
  }
}
```


> Time for a completely contrived demo


# Takeaway
- Everything was standard composition until we added in the promises
- Other languages have amazing things
- The implementation of the core concept of this talk comes in at 37 lines



