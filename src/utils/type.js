import { Message } from "iview";
const errorType = (n) => {
  var typeStr = Object.prototype.toString.call(n);  
  var typeName = '';  
  switch (typeStr){  
      case '[object String]':  
          typeName = 'string';
          if (n.indexOf('{') > -1) {
            n =  JSON.parse(n)
            for (let i in n) {
                Message.error(n[i]);
            }
          } else {
            Message.error(n);
          }
          break;  
      case '[object Number]':
          typeName = 'number';  
          break;  
      case '[object Boolean]':
          typeName = 'boolean';  
          break;  
      case '[object Undefined]':
          typeName = 'undefined';  
          break;  

      case '[object Object]':
          typeName = 'object';
          for (let i in n) {
            Message.error(n[i]);
          }
          break;  
      case '[object Array]':  
          typeName = 'array';  
          break;  
      case '[object Null]':  
          typeName = 'null';  
          break;  
      case '[object RegExp]':  
          typeName = 'RegExp';  
          break;  

      case '[object Symbol]':  
          typeName = 'symbol';  
          break;  
      case '[object JSON]':  
          typeName = 'json';
          break;  
      case '[object Math]':  
          typeName = 'math';  
          break;  

      default:  
          typeName = 'object';  
  }
//   return typeName;
}
export default errorType