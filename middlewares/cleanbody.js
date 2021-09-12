import sanitize from "mongo-sanitize"

export const cleanbody = (req, res, next) => {
  try {
    req.body = sanitize(req.body)
    next();
  } catch (error) {
    console.log('clean body error')
    return res.json({
      error: true,
      message: 'sanitisation error'
    })
  }
}