module.exports = (err, req, res, next) => {
  console.log(err)
  let status = err.status || 500;
  let msg = err.msg || 'Internal Server Error'
  if(err.code == 11000) {
    res.status(400).json({msg: 'duplicate detected'})
  }
  else {
    res.status(status).json({ msg })
  }
}