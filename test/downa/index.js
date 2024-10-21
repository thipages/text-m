import {downaRender} from '../../src/index.js'
import md1 from './md.js'
import md2 from './md2.js'
const res  =  [
    downaRender(md1),
    downaRender(md2)
]
export default res
console.log(res)