
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const talib = require('talib');
console.log("TALib Version: " + talib.version);
