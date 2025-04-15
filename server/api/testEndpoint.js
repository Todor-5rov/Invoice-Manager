// Create me an endpoint hello world + name that reads from the body of the request

export default defineEventHandler(async (event) => {
  // const body = await readBody(event)
  // console.log(body)
  return `Hello World`
})
