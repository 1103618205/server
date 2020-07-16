import combineRoutes from 'koa-combine-routers'
const modulesFile = require.context('./modules', true, /\.js$/)
const modules = modulesFile.keys().reduce((item, path) => {
  const value = modulesFile(path)
  item.push(value.default)
  return item
}, [])
export default combineRoutes(
  modules
)
