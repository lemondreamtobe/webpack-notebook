// show.ts
// 操作 DOM 元素，把 content 显示到网页上
// 通过 ES6 模块规范导出 show 函数
// 给 show 函数增加类型检查 
export function show(content: string) {
  window.document.getElementById('app').innerText = 'Hello,' + content;
}
