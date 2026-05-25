import 'dotenv/config'
import { app } from './app.js'
import { config } from './config/env.js'
import { logger } from './config/logger.js'

const port = config.PORT

app.listen(port, () => {
  logger.info({ port }, 'Inventory backend started')
})
