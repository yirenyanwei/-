/*
* @Author: haoyanwei
* @Date:   2022-12-14 18:45:51
* @Last Modified by:   haoyanwei
* @Last Modified time: 2022-12-14 19:11:51
*/

/**
给定一个扁平数组，数组内每个对象的id属性是唯一的。每个对象具有pid属性，pid属性为0表示为根节点（根节点只有一个），其它表示自己的父节点id。
编写一段程序，输入为给定的扁平数组，输出要求为一个树结构，为其中每个对象增加children数组属性（里面存放child对象）。


解法有很多种，性能最优的方案最佳。可以不用处理输入输出，专注实现核心逻辑即可

给定输入：
[
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 1},
  {id: 4, name: '部门4', pid: 3},
  {id: 5, name: '部门5', pid: 4},
]

给定输出：
{
  "id": 1,
  "name": "部门1",
  "pid": 0,
  "children": [
      {
          "id": 2,
          "name": "部门2",
          "pid": 1,
          "children": []
      },
      {
          "id": 3,
          "name": "部门3",
          "pid": 1,
          "children": [
              // 省略
          ]
      }
  ]
}
**/
function toTree(arrs){
	let map = {}
	for(let item of arrs){
		map[item.id] = item
	}
	let root = null
	for(let item of arrs){
		let pid = item.pid
		if(pid == 0){
			root = item
		}
		let parent = map[pid]
		if(!parent){
			continue
		}
		parent.children = parent.children || []
		parent.children.push(item)
	}
	return root
}
var arrs = [
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 1},
  {id: 4, name: '部门4', pid: 3},
  {id: 5, name: '部门5', pid: 4},
]
console.log(toTree(arrs))