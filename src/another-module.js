import _ from 'lodash';

const a = 1;
const b = { c:3 };
let g = { a, ...b };
console.log('the g: ', g)
export default g;