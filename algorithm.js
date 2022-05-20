/*
* @Author: yanwei
* @Date:   2020-07-08 17:22:19
* @Last Modified by:   haoyanwei
* @Last Modified time: 2022-05-20 18:53:24
//一些小算法
*/

/**
 * @param {number[][]} triangle
 * @return {number}
 120
给定一个三角形，找出自顶向下的最小路径和。每一步只能移动到下一行中相邻的结点上。
相邻的结点 在这里指的是 下标 与 上一层结点下标 相同或者等于 上一层结点下标 + 1 的两个结点。
 */
 /**
 自定向下
  [2],
  [3,4],
  [6,5,7],
  [4,1,8,3]
状态定义：dp[i][j]表示包含第i行第j列元素的最小路径和
状态分析
初始化：
dp[0][0]=triangle[0][0]
常规：
triangle[i][j]一定会经过triangle[i-1][j]或者triangle[i-1][j-1],
所以状态dp[i][j]一定等于dp[i-1][j]或者dp[i-1][j-1]的最小值+triangle[i][j]
特殊：
triangle[i][0]没有左上角 只能从triangle[i-1][j]经过
triangle[i][row[0].length]没有上面 只能从triangle[i-1][j-1]经过
转换方程：dp[i][j]=min(dp[i-1][j],dp[i-1][j-1])+triangle[i][j]
 **/
var minimumTotal = function(triangle) {
	let dp = []
	for(let row = 0; row<triangle.length; row++){
		dp[row] = []
		for(let col = 0; col<triangle[row].length; col++){
			if(row == 0 && col == 0) {
				dp[row][col] = triangle[0][0]
			}else if(col == 0) {
				dp[row][col] = triangle[row][col]+dp[row-1][col]
			}else if(col == triangle[row].length-1) {
				dp[row][col] = triangle[row][col]+dp[row-1][col-1]
			}else {
				dp[row][col] = triangle[row][col]+Math.min(dp[row-1][col-1], dp[row-1][col])
			}
		}
	}
	let res = dp[dp.length-1][0]
	for(let i = 0; i<dp[dp.length-1].length; i++){
		res = Math.min(res, dp[dp.length-1][i])
	}
	return res
};

var minimumTotal2 = function(triangle){
	//自下向上 dp[i][j]=min(dp[i+1][j],dp[i+1][j+1])+triangle[i][j]
	let dp = []
	for(let row = triangle.length-1; row>=0; row--){
		dp[row] = []
		for(let col = 0; col<triangle[row].length; col++) {
			if(row == triangle.length-1) {
				dp[row][col] = triangle[row][col]
			}else {
				dp[row][col] = triangle[row][col]+Math.min(dp[row+1][col], dp[row+1][col+1])
			}
		}
	}
	return dp[0][0]
}

let triangle = [
  [2],
  [3,4],
  [6,5,7],
  [4,1,8,3]]
console.log('minimumTotal--', minimumTotal(triangle))
console.log('minimumTotal2--', minimumTotal2(triangle))

/**
121. 买卖股票的最佳时机
给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。
如果你最多只允许完成一笔交易（即买入和卖出一支股票一次），设计一个算法来计算你所能获取的最大利润。
注意：你不能在买入股票前卖出股票。
示例 1:

输入: [7,1,5,3,6,4]
输出: 5
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
**/
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
	//思路1暴力法 第一天买入时算出卖出时最大利润 第二天买入遍历最大利润 O(n2)
	//思路2 滑动窗口法 [2,5,1,3] O(n)
	let minValue = prices[0]
	let maxGain = 0
	for(let i = 1; i<prices.length; i++){
		if(prices[i]<minValue){
			//寻找新的起始点
			minValue = prices[i]
		}else {
			maxGain = Math.max(maxGain, prices[i]-minValue)
		}
	}
	return maxGain
};
let prices = [2,5,1,3]
console.log('maxProfit==', maxProfit(prices))

/**
122. 买卖股票的最佳时机 II
给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。
设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。
注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
示例 1:

输入: [7,1,5,3,6,4]
输出: 7
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
     随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6-3 = 3 。
**/

/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit2_1 = function(prices) {
    //暴力法 我们只需要计算与所有可能的交易组合相对应的利润，并找出它们中的最大利润。 时间复杂度O(n的n次方)
    let cal = function(s){
    	if(s>=prices.length) {
    		return 0//结束条件
    	}
    	//计算从s开始的最大收益
    	let max = 0
    	for(let start = s; start<prices.length; start ++){
    		let maxP = 0
    		for(let i = start+1; i<prices.length; i++){
    			if(prices[i]>prices[start]) {
    				let profit = prices[i]-prices[start] + cal(i+1)
    				maxP = Math.max(profit, maxP)
    			}
    		}
    		max = Math.max(max, maxP)
    	}
    	return max
    }
    return cal(0)
};
console.log('maxProfit2_1--', maxProfit2_1([7,1,5,3,6,4]))

var maxProfit2_2 = function(prices) {
	//取巧 所有的上升线段都计算进去
	let profit = 0
	for(let i = 1; i<prices.length; i++){
		if(prices[i]-prices[i-1]>0){
			profit += prices[i]-prices[i-1]
		}
	}
	return profit
}

console.log('maxProfit2_2--', maxProfit2_2([7,1,5,3,6,4]))


/**
123. 买卖股票的最佳时机 III
给定一个数组，它的第 i 个元素是一支给定的股票在第 i 天的价格。
设计一个算法来计算你所能获取的最大利润。你最多可以完成 两笔 交易。
注意: 你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
示例 1:

输入: [3,3,5,0,0,3,1,4]
输出: 6
解释: 在第 4 天（股票价格 = 0）的时候买入，在第 6 天（股票价格 = 3）的时候卖出，这笔交易所能获得利润 = 3-0 = 3 。
     随后，在第 7 天（股票价格 = 1）的时候买入，在第 8 天 （股票价格 = 4）的时候卖出，这笔交易所能获得利润 = 4-1 = 3 。
**/
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit3_1 = function(prices) {
	//1 穷举法 便利两次买卖  O(n的4次方)
	let state = [1,0,1,0]
	let max = 0
	//起始位置 次数 买入点 当前值
	let cal = function(s, time, idx, value) {
		if(s>=prices.length){
			max = Math.max(max, value)
			return;
		}
		if(time>=state.length){
			max = Math.max(max, value)
			return;
		}
		let st = state[time]
		for(let i = s; i<prices.length; i++) {
			if(st == 0){
				cal(i+1, time+1, i, value)
			}else if(prices[i]>prices[idx]) {
				cal(i+1, time+1, i, value + prices[i]-prices[idx])
			}
		}
	}
	cal(0, 0, 0, 0)
	return max
};
console.log('maxProfit3_1--', maxProfit3_1([3,3,5,0,0,3,1,4]))

/**
状态转移方程
https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/solution/yi-ge-tong-yong-fang-fa-tuan-mie-6-dao-gu-piao-wen/
i代表天数  k代表次数，每买一次算一次   状态1表示持有
dp[i][k][0] = max(dp[i-1][k][0], dp[i-1][k][1] + prices[i])
              max(   选择 rest  ,           选择 sell      )
解释：今天我没有持有股票，有两种可能：
要么是我昨天就没有持有，然后今天选择 rest，所以我今天还是没有持有；
要么是我昨天持有股票，但是今天我 sell 了，所以我今天没有持有股票了。

dp[i][k][1] = max(dp[i-1][k][1], dp[i-1][k-1][0] - prices[i])
              max(   选择 rest  ,           选择 buy         )

解释：今天我持有着股票，有两种可能：
要么我昨天就持有着股票，然后今天选择 rest，所以我今天还持有着股票；
要么我昨天本没有持有，但今天我选择 buy，所以今天我就持有股票了。
**/
var maxProfit3_2 = function(prices) {
	if(prices.length<=0) {
		return 0
	}
	let dp = []
	let max_k = 2
	for(let i = 0; i<prices.length; i++) {
		dp[i] = []
		for(let k = 0; k<=max_k; k++) {
			dp[i][k] = []
			for(let j = 0; j<=1; j++) {
				dp[i][k][j] = 0
			}
		}
	}
	for(let i = 0; i<prices.length; i++) {
		for(let k = max_k; k>=1; k-- ) {
			if(i == 0) {
				dp[i][k][0] = 0
				dp[i][k][1] = -prices[i]
				continue;
			}
			dp[i][k][0] = Math.max(dp[i-1][k][0], dp[i-1][k][1]+prices[i])
			dp[i][k][1] = Math.max(dp[i-1][k][1], dp[i-1][k-1][0]-prices[i])
		}
	}
	return dp[prices.length-1][max_k][0]
}
console.log('maxProfit3_2--', maxProfit3_2([3,3,5,0,0,3,1,4]))
console.log('maxProfit3_2--', maxProfit3_2([1,2]))

/**
125. 验证回文串
给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。
说明：本题中，我们将空字符串定义为有效的回文串。

示例 1:
输入: "A man, a plan, a canal: Panama"
输出: true
**/
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
	//是使用双指针。初始时，左右指针分别指向 \textit{sgood}sgood 的两侧，随后我们不断地将这两个指针相向移动，每次移动一步，并判断这两个指针指向的字符是否相同。当这两个指针相遇时，就说明 \textit{sgood}sgood 时回文串。
	let sgood = ''
	for(let i = 0; i<s.length; i++) {
		let c = s.charCodeAt(i)
		if ((c>=48 && c<=57)||(c>=65 && c<=90)||(c>=97 && c<=122)) {
			sgood = sgood+s[i].toLowerCase()
		}
	}
	let b = 0, e = sgood.length-1;
	console.log(sgood)
	while(e>=b) {
		if(sgood[b]!=sgood[e]) {
			return false
		}
		b++
		e--
	}
	return true
};
console.log('isPalindrome--', isPalindrome("ab_a"))


/**
127. 单词接龙
给定两个单词（beginWord 和 endWord）和一个字典，找到从 beginWord 到 endWord 的最短转换序列的长度。转换需遵循如下规则：

每次转换只能改变一个字母。
转换过程中的中间单词必须是字典中的单词。
说明:
如果不存在这样的转换序列，返回 0。
所有单词具有相同的长度。
所有单词只由小写字母组成。
字典中不存在重复的单词。
你可以假设 beginWord 和 endWord 是非空的，且二者不相同。
示例 1:
输入:
beginWord = "hit",
endWord = "cog",
wordList = ["hot","dot","dog","lot","log","cog"]
输出: 5

解释: 一个最短转换序列是 "hit" -> "hot" -> "dot" -> "dog" -> "cog",
     返回它的长度 5。

思路
1、生成所有单词键值对(通用状态到单词)  对给定的 wordList 做预处理，找出所有的通用状态。将通用状态记录在字典中，键是通用状态，值是所有具有通用状态的单词。
2、广度优先遍历
例如，在广搜时我们需要访问 Dug 的所有邻接点，我们可以先生成 Dug 的所有通用状态：
Dug => *ug
Dug => D*g
Dug => Du*
第二个变换 D*g 可以同时映射到 Dog 或者 Dig，因为他们都有相同的通用状态。拥有相同的通用状态意味着两个单词只相差一个字母，他们的节点是相连的。

**/
/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function(beginWord, endWord, wordList) {
	//1生成通用的键值对
	let allComboDict = {}
	for(let i = 0; i<wordList.length; i++) {
		let world = wordList[i]
		let len = world.length
		for(let j = 0; j<len; j++) {
			let key = world.substring(0, j)+'*'+world.substring(j+1, len)
			let arr = allComboDict[key] || []
			arr.push(world)
			allComboDict[key] = arr
		}
	}
	//广度优先遍历 BFS 队列
	let Q = [{key: beginWord, value: 1}]
	//去重的监测
	let visited = {[beginWord]: true}
	while(Q.length>0) {
		let node = Q.shift()//取第一个元素
		let world = node.key
		let level = node.value
		let len = world.length
		for(let i = 0; i<len; i++) {
			let key = world.substring(0, i)+'*'+world.substring(i+1, len)
			let children = allComboDict[key] || []
			for(let j = 0; j<children.length; j++) {
				let child = children[j]
				if( child == endWord ) {
					return level + 1
				}
				if(!visited[child]) {
					visited[child] = true
					Q.push({key: child, value: level+1})
				}
			}
		}
	}
	return 0
};

var ladderLength2 = function(beginWord, endWord, wordList) {
	let containEnd = false
	for(let i = 0; i<wordList.length; i++) {
		let word = wordList[i]
		if(endWord == word) {
			containEnd = true
			break
		}
	}
	if(!containEnd) {
		return 0
	}
	//双向搜索法，速度更快
	let allComboDict = {}
	for(let i = 0; i<wordList.length; i++) {
		let world = wordList[i]
		let len = world.length
		for(let j = 0; j<len; j++) {
			let key = world.substring(0, j)+'*'+world.substring(j+1, len)
			let arr = allComboDict[key] || []
			arr.push(world)
			allComboDict[key] = arr
		}
	}
	//广度优先遍历 BFS 队列
	let Qbegan = [{key: beginWord, value: 1}]
	let Qend = [{key: endWord, value: 1}]
	//去重的监测
	let visitedBegin = {[beginWord]: 1}
	let visitedEnd = {[endWord]: 1}

	let visitNode = function(Q, visited, visitedOther) {
		let node = Q.shift()//取第一个元素
		let world = node.key
		let level = node.value
		let len = world.length
		let str = ''
		for(let i = 0; i<len; i++) {
			let key = world.substring(0, i)+'*'+world.substring(i+1, len)
			let children = allComboDict[key] || []
			for(let j = 0; j<children.length; j++) {
				let child = children[j]
				str += child
				str += ','
				if( visitedOther[child] ) {
					return level + visitedOther[child]
				}
				if(!visited[child]) {
					visited[child] = level+1
					Q.push({key: child, value: level+1})
				}
			}
		}
		return -1
	}
	while(Qbegan.length>0 && Qend.length>0) {
		let lv = visitNode(Qbegan, visitedBegin, visitedEnd)
		if(lv>-1) {
			return lv
		}
		lv = visitNode(Qend, visitedEnd, visitedBegin)
		if(lv>-1) {
			return lv
		}
	}
	return 0

}
let beginWord = "hit"
let endWord = "cog"
let wordList = ["hot","dot","dog","lot","log","cog"]
// let wordList = ["hot","dot","dog","lot","log"]
console.log('ladderLength', ladderLength2(beginWord, endWord, wordList))


/**
128. 最长连续序列
给定一个未排序的整数数组，找出最长连续序列的长度。
要求算法的时间复杂度为 O(n)。

示例:
输入: [100, 4, 200, 1, 3, 2]
输出: 4
解释: 最长连续序列是 [1, 2, 3, 4]。它的长度为 4。
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
	//思路 生成字典，然后遍历每一个值，存在就遍历+1的值
	let dic = {}
	for(let i = 0; i<nums.length; i++){
		dic[nums[i]] = true
	}
	let maxLen = 0
	if(nums.length>0) {
		maxLen = 1
	}
	for(let x in dic){
		x = parseInt(x)
		if(!dic[x-1]) {
			let curLen = 1
			let num = x
			while(dic[num+1]) {
				curLen ++
				num ++
			}
			maxLen = Math.max(maxLen, curLen)
		}
	}
	return maxLen
};
let nums = [100, 4, 200, 1, 3, 2]
console.log('longestConsecutive = ', longestConsecutive(nums))


//树节点定义
function TreeNode(val) {
	this.val = val;
	this.left = this.right = null;
}
/**
129. 求根到叶子节点数字之和
给定一个二叉树，它的每个结点都存放一个 0-9 的数字，每条从根到叶子节点的路径都代表一个数字。

例如，从根到叶子节点路径 1->2->3 代表数字 123。
计算从根到叶子节点生成的所有数字之和。
说明: 叶子节点是指没有子节点的节点。

示例 1:
输入: [1,2,3]
    1
   / \
  2   3
输出: 25
解释:
从根到叶子节点路径 1->2 代表数字 12.
从根到叶子节点路径 1->3 代表数字 13.
因此，数字总和 = 12 + 13 = 25.
**/

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumNumbers = function(root) {
	//先续遍历二叉树
	function helper(node, value) {
		if(!node) {
			return 0
		}
		value = value*10+node.val
		if(!node.left && !node.right) {
			return value
		}
		return helper(node.left, value)+helper(node.right, value)
	}

	return helper(root, 0)
};
let n1 = new TreeNode(1);
let n2 = new TreeNode(2);
let n3 = new TreeNode(3);
n1.left = n2;
n1.right = n3;
console.log('sumNumbers = ', sumNumbers(n1))


/**
130. 被围绕的区域
给定一个二维的矩阵，包含 'X' 和 'O'（字母 O）。

找到所有被 'X' 围绕的区域，并将这些区域里所有的 'O' 用 'X' 填充。

示例:

X X X X
X O O X
X X O X
X O X X
运行你的函数后，矩阵变为：

X X X X
X X X X
X X X X
X O X X
解释:

被围绕的区间不会存在于边界上，换句话说，任何边界上的 'O' 都不会被填充为 'X'。 任何不在边界上，或不与边界上的 'O' 相连的 'O' 最终都会被填充为 'X'。如果两个元素在水平或垂直方向相邻，则称它们是“相连”的。
**/
/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function(board) {
	let m = board.length
	if(m<=0){
		return
	}
	let n = board[0].length
	function dfs(i, j) {
		//深度优先遍历，用迭代方式
		if(i<0 || i>=m || j<0 || j>=n || board[i][j]=='X' || board[i][j]=='#'){
			//边界条件，#代表访问过了
			return;
		}
		board[i][j] = '#'
		//上下左右遍历
		dfs(i-1, j)
		dfs(i+1, j)
		dfs(i, j-1)
		dfs(i, j+1)
	}
	function bfs(i, j){
		//广度优先遍历，用队列实现
		let Q = [{row:i, col:j}]
		while(Q.length>0) {
			let cell = Q.shift()
			let row = cell.row
			let col = cell.col
			if(board[row][col] == 'O'){
				board[row][col] = '#'
				//上下左右
				if(row-1>=0) {
					Q.push({row: row-1, col: col})
				}
				if(row+1<m) {
					Q.push({row: row+1, col: col})
				}
				if(col-1>=0) {
					Q.push({row: row, col: col-1})
				}
				if(col+1<n) {
					Q.push({row: row, col: col+1})
				}
			}
		}
	}
	for(let i = 0; i<m; i++){
		for(let j = 0; j<n; j++){
			let isJudge = i==0 || i==m-1 || j==0 || j==n-1
			if(isJudge && board[i][j]=='O'){
				bfs(i, j)
			}
		}
	}
	for(let i = 0; i<m; i++){
		for(let j = 0; j<n; j++){
			let value = board[i][j]
			if(value == 'O') {
				board[i][j] = 'X'
			}else if(value == '#'){
				board[i][j] = 'O'
			}
		}
	}
};
let board = [
	['X', 'X', 'X', 'X',],
	['X', 'O', 'O', 'X',],
	['X', 'X', 'O', 'X',],
	['X', 'O', 'X', 'X',],
]
solve(board)
console.log(board)

/**
131. 分割回文串
给定一个字符串 s，将 s 分割成一些子串，使每个子串都是回文串。

返回 s 所有可能的分割方案。

示例:

输入: "aab"
输出:
[
  ["aa","b"],
  ["a","a","b"]
]
**/
/**
 * @param {string} s
 * @return {string[][]}
 */
var partition = function(s) {
	let res = []//结果
	let temp = []//单个结果
	function isPtn (str) {
		//判断回文串
		let s = 0
		let e = str.length-1
		while(s<e) {
			if(str[s]!=str[e]){
				return false
			}
			s++
			e--
		}
		return true;
	}
	//回溯法
	function backTrack(str) {
		if(str == '') {
			let _temp = []
			for(let i = 0; i<temp.length; i++){
				_temp.push(temp[i])
			}
			res.push(_temp)
			return
		}
		for(let i = 0; i<str.length; i++){
			let strLeft = str.substring(0, i+1)
			let strRight = str.substring(i+1, str.length)
			if(isPtn(strLeft)) {
				temp.push(strLeft)
				backTrack(strRight)
				temp.pop(strLeft)
			}
		}
	}
	backTrack(s)
	return res
};
var s = 'aab'
console.log('partition--', partition(s))

/**
132. 分割回文串 II
给定一个字符串 s，将 s 分割成一些子串，使每个子串都是回文串。

返回符合要求的最少分割次数。

示例:

输入: "aab"
输出: 1
解释: 进行一次分割就可将 s 分割成 ["aa","b"] 这样两个回文子串。
**/
/**
 * @param {string} s
 * @return {number}
 */
var minCut = function(s) {
	let res = 0//结果
	let temp = []//单个结果
	let time = 0
	let nowTime = 0
	function isPtn (str) {
		//判断回文串
		let s = 0
		let e = str.length-1
		while(s<e) {
			if(str[s]!=str[e]){
				return false
			}
			s++
			e--
		}
		return true;
	}
	if(isPtn(s)){
		return res
	}
	//回溯法
	function backTrack(str) {
		if(str == '') {
			res = nowTime-1
			return true
		}
		if(nowTime>time){
			return false
		}
		for(let i = 0; i<str.length; i++){
			let strLeft = str.substring(0, i+1)
			let strRight = str.substring(i+1, str.length)
			if(isPtn(strLeft)) {
				nowTime+=1
				temp.push(strLeft)
				backTrack(strRight)
				temp.pop(strLeft)
				nowTime-=1
			}
			if(res>0){
				return true
			}
		}
	}
	for(let i = 1; i<s.length; i++) {
		time = i
		if(backTrack(s)){
			return res
		}
	}
	return res
};
/**
接下来枚举可能分割的位置：即如果 s[0:i] 本身不是一个回文串，就尝试分割，枚举分割的边界 j。
如果 s[j + 1, i] 不是回文串，尝试下一个分割边界。
如果 s[j + 1, i] 是回文串，则 dp[i] 就是在 dp[j] 的基础上多一个分割。
于是枚举 j 所有可能的位置，取所有 dp[j] 中最小的再加 1 ，就是 dp[i]
**/
var minCut2 = function(s) {
	//非递归方式，动态规划  
	//dp[i] = min([dp[j] + 1 for j in range(i) if s[j + 1, i] 是回文])   
	function isPtn (str, b, e) {
		//判断回文串
		while(b<e) {
			if(str[b]!=str[e]){
				return false
			}
			b++
			e--
		}
		return true;
	}
	let len = s.length
	if(len<2) {
		return 0
	}
	let dp = []//第i个位置的子串需要切割的次数
	for(let i = 0; i<len; i++) {
		dp[i] = i
	}
	for(let i = 0; i<len; i++){
		if(isPtn(s, 0, i)) {
			dp[i] = 0
		}
		for(let j = 0; j<i; j++) {
			if(isPtn(s, j+1, i)){
				dp[i] = Math.min(dp[i], dp[j]+1)
			}
		}
	}
	return dp[len-1]
}
var minCut3 = function(s) {
	//minCut2 的优化版 让查找回文串是线性的做到O(n)
	let len = s.length
	let isPtn =[]//二维数组，记录从x到y的串是不是回文串
	function initPtn () {
		//判断回文串 用动态规划方式列举出全部
		for(let right = 0; right<len; right++){
			isPtn[right] = []
			for(let left =0; left<=right; left++) {
				if(s[left]==s[right] && (right-left<=2 || isPtn[left+1][right-1])){
					isPtn[left][right] = true
				}
			}
		}
	}
	initPtn()
	
	if(len<2) {
		return 0
	}
	let dp = []//第i个位置的子串需要切割的次数
	for(let i = 0; i<len; i++) {
		dp[i] = i
	}
	for(let i = 0; i<len; i++){
		if(isPtn[0][i]) {
			dp[i] = 0
		}
		for(let j = 0; j<i; j++) {
			if(isPtn[j+1][i]){
				dp[i] = Math.min(dp[i], dp[j]+1)
			}
		}
	}
	return dp[len-1]
}
s = "aab"
console.log('minCut--', minCut3(s))

/**
给你无向 连通 图中一个节点的引用，请你返回该图的 深拷贝（克隆）。

图中的每个节点都包含它的值 val（int） 和其邻居的列表（list[Node]）。

class Node {
    public int val;
    public List<Node> neighbors;
}
 

测试用例格式：
简单起见，每个节点的值都和它的索引相同。例如，第一个节点值为 1（val = 1），第二个节点值为 2（val = 2），以此类推。该图在测试用例中使用邻接列表表示。
邻接列表 是用于表示有限图的无序列表的集合。每个列表都描述了图中节点的邻居集。
给定节点将始终是图中的第一个节点（值为 1）。你必须将 给定节点的拷贝 作为对克隆图的引用返回。
输入：adjList = [[2,4],[1,3],[2,4],[1,3]]
输出：[[2,4],[1,3],[2,4],[1,3]]
解释：
图中有 4 个节点。
节点 1 的值是 1，它有两个邻居：节点 2 和 4 。
节点 2 的值是 2，它有两个邻居：节点 1 和 3 。
节点 3 的值是 3，它有两个邻居：节点 2 和 4 。
节点 4 的值是 4，它有两个邻居：节点 1 和 3 。
**/
/**
 * // Definition for a Node.
 * function Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */
function Node(val, neighbors) {
	this.val = val === undefined ? 0 : val;
 	this.neighbors = neighbors === undefined ? [] : neighbors;
}
/**
 * @param {Node} node
 * @return {Node}
 */
var cloneGraph = function(node) {
    //图的遍历 深度优先(回溯)
    if(!node) {
    	return null
    }
    let looked = {}//已经遍历过的
    function dfs(n){
    	if(!n) {
    		return
    	}
    	let val = n.val
    	let neighbors = n.neighbors
    	if(looked[val]){
    		return looked[val]
    	}
    	let clone = new Node(val)
    	looked[val] = clone
    	for(let i = 0; i<neighbors.length; i++){
    		clone.neighbors.push(dfs(neighbors[i]))
    	}
    	return clone
    }
    return dfs(node)
};
var cloneGraph2 = function(node) {
    //图的遍历 广度优先(队列)
    if(!node) {
    	return null
    }
    let looked = {}//已经遍历过的
    let Q = [node]
    let clone = new Node(node.val)
    looked[node.val] = clone
    while(Q.length>0) {
    	let n = Q.shift()
    	let neighbors = n.neighbors
    	for(let i = 0; i<neighbors.length; i++) {
    		let neighbor = neighbors[i]
    		if(!looked[neighbor.val]){
    			looked[neighbor.val] = new Node(neighbor.val)
    			Q.push(neighbor)
    		}
    		looked[n.val].neighbors.push(looked[neighbor.val])
    	}
    }
    return clone
};
var node = new Node(1)
let node2 = new Node(2)
let node3 = new Node(3)
let node4 = new Node(4)
node.neighbors.push(node2)
node.neighbors.push(node4)

node2.neighbors.push(node3)
node2.neighbors.push(node)

node3.neighbors.push(node2)
node3.neighbors.push(node4)

node4.neighbors.push(node3)
node4.neighbors.push(node)
let clone = cloneGraph2(node)
function printNode(node) {
	//打印图
	let looked = {}
	function pt(n) {
		let val = n.val
		if(looked[val]){
			return
		}
		console.log('val--', val)
		let neighbors = n.neighbors
		for(let i = 0; i<neighbors.length; i++){
			console.log('neighbors--', neighbors[i].val)
		}
		looked[val] = true
		for(let i = 0; i<neighbors.length; i++){
			pt(neighbors[i])
		}
	}
	pt(node)
}
printNode(clone)

/**
134. 加油站
在一条环路上有 N 个加油站，其中第 i 个加油站有汽油 gas[i] 升。
你有一辆油箱容量无限的的汽车，从第 i 个加油站开往第 i+1 个加油站需要消耗汽油 cost[i] 升。你从其中的一个加油站出发，开始时油箱为空。
如果你可以绕环路行驶一周，则返回出发时加油站的编号，否则返回 -1。
说明: 
如果题目有解，该答案即为唯一答案。
输入数组均为非空数组，且长度相同。
输入数组中的元素均为非负数。

示例 1:
输入: 
gas  = [1,2,3,4,5]
cost = [3,4,5,1,2]

输出: 3

解释:
从 3 号加油站(索引为 3 处)出发，可获得 4 升汽油。此时油箱有 = 0 + 4 = 4 升汽油
开往 4 号加油站，此时油箱有 4 - 1 + 5 = 8 升汽油
开往 0 号加油站，此时油箱有 8 - 2 + 1 = 7 升汽油
开往 1 号加油站，此时油箱有 7 - 3 + 2 = 6 升汽油
开往 2 号加油站，此时油箱有 6 - 4 + 3 = 5 升汽油
开往 3 号加油站，你需要消耗 5 升汽油，正好足够你返回到 3 号加油站。
因此，3 可为起始索引。
**/
/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function(gas, cost) {
	//想一个时间复杂度未O(N)的方式来解决
	//1、总的汽油>总的消耗 2、当前油箱汽油>消耗
	let len = gas.length
	let total_gas = 0
	let curr_gas = 0
	let start = 0
	for(let i = 0; i<len; i++) {
		total_gas+=gas[i]-cost[i]
		curr_gas+=gas[i]-cost[i]
		if(curr_gas<0) {
			start = i+1
			curr_gas = 0
		}
	}
	return total_gas>=0?start:-1
};
let gas  = [1,2,3,4,5]
let cost = [3,4,5,1,2]
console.log('canCompleteCircuit--', canCompleteCircuit(gas, cost))

/**
135. 分发糖果
老师想给孩子们分发糖果，有 N 个孩子站成了一条直线，老师会根据每个孩子的表现，预先给他们评分。

你需要按照以下要求，帮助老师给这些孩子分发糖果：

每个孩子至少分配到 1 个糖果。
相邻的孩子中，评分高的孩子必须获得更多的糖果。
那么这样下来，老师至少需要准备多少颗糖果呢？

示例 1:

输入: [1,0,2]
输出: 5
解释: 你可以分别给这三个孩子分发 2、1、2 颗糖果。
示例 2:

输入: [1,2,2]
输出: 4
解释: 你可以分别给这三个孩子分发 1、2、1 颗糖果。
     第三个孩子只得到 1 颗糖果，这已满足上述两个条件。
**/
/**
 * @param {number[]} ratings
 * @return {number}
 */
var candy = function(ratings) {
	if(ratings.length<=0) {
		return 0
	}
	let candys = []
	for(let i = 0; i<ratings.length; i++) {
		candys[i] = 1
	}
	//监测左边的
	for(let i = 1; i<ratings.length; i++) {
		if(ratings[i]>ratings[i-1]) {
			candys[i] = candys[i-1]+1
		}
	}
	//监测右侧的
	let sum = candys[ratings.length-1]
	for(let i = ratings.length-2; i>=0; i--) {
		if(ratings[i]>ratings[i+1]) {
			candys[i] = Math.max(candys[i], candys[i+1]+1)
		}
		sum += candys[i]
	}
	return sum
};
console.log('candy--', candy([1, 2, 2]))


/**
136. 只出现一次的数字
给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

说明：
你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？

示例 1:

输入: [2,2,1]
输出: 1

示例 2:
输入: [4,1,2,1,2]
输出: 4
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
	//用异或实现 异或解法：异或运算满足交换律，a^b^a=a^a^b=b,因此ans相当于nums[0]^nums[1]^nums[2]^nums[3]^nums[4]..... 然后再根据交换律把相等的合并到一块儿进行异或（结果为0），
	// 然后再与只出现过一次的元素进行异或，这样最后的结果就是，只出现过一次的元素（0^任意值=任意值）
	let ans = nums[0]
	if(nums.length>0) {
		for(let i = 1; i<nums.length; i++) {
			ans = ans^nums[i]
		}
	}
	return ans
};
console.log('singleNumber--', singleNumber([4,1,2,1,2]))

/**
137. 只出现一次的数字 II
给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现了三次。找出那个只出现了一次的元素。

说明：
你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？

示例 1:
输入: [2,2,3,2]
输出: 3
示例 2:

输入: [0,1,0,1,0,1,99]
输出: 99
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
	//思路，对各位上相加，然后%3
	let counts = []
	for(let i = 0; i<32; i++) {
		counts[i] = 0
		for(let j = 0; j<nums.length; j++) {
			counts[i] += nums[j]>>i&1
		}
	}
	//各位%3
	let res = 0
	for(let i = 0; i<32; i++) {
		counts[i] = counts[i]%3
		res += counts[i]<<i
	}
	return res

};
console.log('singleNumber2--', singleNumber([2,2,3,2]))
console.log('singleNumber2--', singleNumber([0,1,0,1,0,1,99]))

/**
138. 复制带随机指针的链表
给定一个链表，每个节点包含一个额外增加的随机指针，该指针可以指向链表中的任何节点或空节点。
要求返回这个链表的 深拷贝。 

我们用一个由 n 个节点组成的链表来表示输入/输出中的链表。每个节点用一个 [val, random_index] 表示：
val：一个表示 Node.val 的整数。
random_index：随机指针指向的节点索引（范围从 0 到 n-1）；如果不指向任何节点，则为  null 。

输入：head = [[3,null],[3,0],[3,null]]
输出：[[3,null],[3,0],[3,null]]

**/
/**
 * // Definition for a Node.
 * function Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */
function NodeR(val, next, random) {
   this.val = val;
   this.next = next;
   this.random = random;
};
/**
 * @param {Node} head
 * @return {Node}
 */
var copyRandomList = function(head) {
    //思路 遍历用字典放访问过得方式js不好实现,所以换中方式
    //遍历原来的链表并拷贝每一个节点，将拷贝节点放在原来节点的旁边，创造出一个旧节点和新节点交错的链表。
    //迭代这个新旧节点交错的链表，并用旧节点的 random 指针去更新对应新节点的 random 指针。比方说， B 的 random 指针指向 A ，意味着 B' 的 random 指针指向 A' 。
    let Node = NodeR
    //每一个节点后创建节点
    if(!head) return null;
    let node = head
    while(node){
    	let newNode = new Node(node.val)
    	newNode.next = node.next
    	node.next = newNode
    	node = newNode.next
    }
    //建立random
    node = head
    while(node){
    	node.next.random = node.random&&node.random.next||null
    	node = node.next.next
    }
    //分离连个链表
    let newHead = head.next
    node = head
    let newNode = newHead
    while(node) {
    	node.next = newNode.next
    	newNode.next = node.next&&node.next.next||null

    	node = node.next
    	newNode = newNode.next
    }
    return newHead
};
let nR1 = new NodeR(3)
let nR2 = new NodeR(2)
let nR3 = new NodeR(1)
nR1.next = nR2
nR1.random = null
nR2.next = nR3
nR2.random = nR1
let nR = copyRandomList(nR1)
console.log("copyRandomList--")
while(nR) {
	console.log(nR.val)
	nR = nR.next
}

/**
139. 单词拆分
给定一个非空字符串 s 和一个包含非空单词列表的字典 wordDict，判定 s 是否可以被空格拆分为一个或多个在字典中出现的单词。

说明：

拆分时可以重复使用字典中的单词。
你可以假设字典中没有重复的单词。
示例 1：

输入: s = "leetcode", wordDict = ["leet", "code"]
输出: true
解释: 返回 true 因为 "leetcode" 可以被拆分成 "leet code"。
**/
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
	//回溯 但是会超时。。。时间复杂度O(n!)
	let dict = {}
	for(let i = 0; i<wordDict.length; i++) {
		dict[wordDict[i]] = true
	}
	let len = s.length
	let isFind = false
	let backTrack = function(start){
		if(isFind){
			return
		}
		if(start==len) {
			isFind = true
		}
		for(let i = start+1; i<=len; i++) {
			if(isFind){
				return
			}
			let str = s.substring(start, i)
			if(dict[str]) {
				backTrack(i)
			}
		}
	}
	backTrack(0)
	return isFind
};
var wordBreak1 = function(s, wordDict) {
	//动态规划 时间复杂度O(n2)
	let dict = {}
	for(let i = 0; i<wordDict.length; i++) {
		dict[wordDict[i]] = true
	}
	let len = s.length
	let res = []
	res[0] = true
	for(let i = 1; i<=len; i++) {//到第i个是否是合法的
		for(let j = 0; j<i; j++){
			if(res[j]&&dict[s.substring(j,i)]) {
				res[i] = true
				break
			}
		}
	}
	return res[len] || false
}
var s = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab",
wordDict = ["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa"]
// var s = "leetcode", wordDict = ["leet", "code"]
console.log('wordBreak--', wordBreak1(s, wordDict))

/**
140. 单词拆分 II
给定一个非空字符串 s 和一个包含非空单词列表的字典 wordDict，在字符串中增加空格来构建一个句子，使得句子中所有的单词都在词典中。返回所有这些可能的句子。

说明：

分隔时可以重复使用字典中的单词。
你可以假设字典中没有重复的单词。
示例 1：

输入:
s = "catsanddog"
wordDict = ["cat", "cats", "and", "sand", "dog"]
输出:
[
  "cats and dog",
  "cat sand dog"
]
**/
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {string[]}
 */
var wordBreak = function(s, wordDict) {
	//回溯 时间复杂度O(n!)  超时了。。。
	//解决方案 用map缓存一下
	let dict = {}
	for(let i = 0; i<wordDict.length; i++) {
		dict[wordDict[i]] = true
	}
	let len = s.length
	let map = {}//保存当前开始点所有的结果
	let backTrack = function(start){
		if(map[start]) {
			return map[start]
		}
		let res = []
		if(start==len) {
			res.push('')
			return res
		}
		for(let i = start+1; i<=len; i++) {
			let str = s.substring(start, i)
			if(dict[str]) {
				let left = backTrack(i)
				for(let j = 0; j<left.length; j++) {
					let ext = left[j] == ''?'': ' '
					res.push(str+ext+left[j])
				}
			}
		}
		map[start] = res
		return res
	}
	return backTrack(0)
};
var wordBreak2 = function(s, wordDict) {

}
var s = "catsanddog",wordDict = ["cat", "cats", "and", "sand", "dog"]
console.log('wordBreak--', wordBreak(s, wordDict))

/**
141. 环形链表
给定一个链表，判断链表中是否有环。
为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。

示例 1：

输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点。
**/
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
function ListNode(val) {
   this.val = val;
   this.next = null;
}

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    //双指针  或者 哈希表法 时间复杂度O(N)
    if(!head || !head.next) {
    	return false
    }
    let slow = head
    let fast = head.next
    while(slow!=fast) {
    	if(fast == null || fast.next == null) {
    		return false
    	}
    	slow = slow.next
    	fast = fast.next.next
    }
    return true
};
var listNode = new ListNode(1)
console.log('hasCycle--', hasCycle(listNode))

/**
142. 环形链表 II
给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。
说明：不允许修改给定的链表。

示例 1：

输入：head = [3,2,0,-4], pos = 1
输出：tail connects to node index 1
解释：链表中有一个环，其尾部连接到第二个节点。

思路
F 是环外总长  a是环内相遇点   b是环的长度-a
2*慢指针 = 快指针
2⋅distance(tortoise)=distance(hare)
2(F+a)=F+a+b+a
2F+2a=F+2a+b
F=b

**/
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var detectCycle = function(head) {
    //找相遇点
    let slow = head
    let fast = head
    let meet = null
    while(fast && fast.next) {
    	slow = slow.next
    	fast = fast.next.next
    	if(slow == fast) {
    		meet = slow
    		break
    	}
    }
    if(!meet) {
    	return null
    }
    //找初始环 
    let start = head
    while(start!=meet) {
    	start = start.next
    	meet = meet.next
    }
    return start
};
var listNode1 = new ListNode(3)
var listNode2 = new ListNode(2)
var listNode3 = new ListNode(0)
var listNode4 = new ListNode(-4)
listNode1.next = listNode2
listNode2.next = listNode3
listNode3.next = listNode4
listNode4.next = listNode2
console.log('detectCycle--', detectCycle(listNode1))

class Mahjong {
	constructor() {
		this._handCard = []
	}
	setHand(handCard) {
		this._handCard = handCard
	}
	getHuCards() {
		let cardDic = this.getCardCount(this._handCard)
		let res = []
		let temp = []
		for(let i = 0; i<this._handCard.length; i++) {
			temp.push(this._handCard[i])
		}
		for(let i = 1; i<=9; i++) {
			if(!cardDic[i] || cardDic[i]<4) {
				temp.push(i)
				if(this.checkHu(temp)) {
					res.push(i)
				}
				//删除i
				for(let j = temp.length-1; j>=0; j--) {
					if(temp[j] == i) {
						temp.splice(j, 1)
						break
					}
				}
			}
		}
		return res
	}
	checkHu(handCard) {
		//判胡
		handCard.sort(function(a, b){
			return a-b
		})
		let cardDic = this.getCardCount(handCard)
		for(let card in cardDic) {
			let count = cardDic[card]
			if(count>1) {
				card = parseInt(card)
				let leftCard = this.getExDui(handCard, card)
				if(this.checkThree(leftCard)) {
					return true
				}
			}
		}
		return false

	}
	checkThree(leftCard) {
		//检查是否都是三个的
		let cardCount = this.getCardCount(leftCard)
		let isFind = false
		function backTrack(start) {
			if(isFind) {
				return
			}
			if(start>9)
			{
				isFind = true
			}
			cardCount[start] = cardCount[start] || 0
			if(cardCount[start]<=0) {
				backTrack(start+1)
			}
			//判断三个
			if(cardCount[start]>=3){
				cardCount[start] = cardCount[start]-3
				backTrack(start)
				cardCount[start] = cardCount[start]+3
			}
			//判断成顺
			cardCount[start+1] = cardCount[start+1] || 0
			cardCount[start+2] = cardCount[start+2] || 0
			if(cardCount[start]>0 && cardCount[start+1]>0 && cardCount[start+2]>0) {
				cardCount[start] = cardCount[start]-1
				cardCount[start+1] = cardCount[start+1]-1
				cardCount[start+2] = cardCount[start+2]-1
				backTrack(start)
				cardCount[start] = cardCount[start]+1
				cardCount[start+1] = cardCount[start+1]+1
				cardCount[start+2] = cardCount[start+2]+1
			}
		}
		backTrack(1)
		return isFind
	}
	getExDui(handCard, card) {
		let count = 0
		let left = []
		for(let i = 0; i<handCard.length; i++) {
			if(count<2 && handCard[i] == card){
				count++
			}else{
				left.push(handCard[i])
			}
		}
		return left
	}
	getCardCount(handCard) {
		let dic = {}
		for(let i = 0; i<handCard.length; i++) {
			dic[handCard[i]] = (dic[handCard[i]] || 0) +1
		}
		return dic
	}
}
var mahjong = new Mahjong()
var handCard = [1, 1, 1, 1, 2, 2, 3, 3, 5, 6, 7, 8, 9]
// handCard = [1, 1, 1, 2, 2, 2, 5, 5, 5, 6, 6, 6, 9]
// handCard = [1, 1, 1, 2, 2, 2, 3, 3, 3, 5, 7, 7, 9]
var nowTime = new Date().getTime()
mahjong.setHand(handCard);
var huList = mahjong.getHuCards()
console.log('mahjong--', new Date().getTime()-nowTime, huList)

/**
143. 重排链表
给定一个单链表 L：L0→L1→…→Ln-1→Ln ，
将其重新排列后变为： L0→Ln→L1→Ln-1→L2→Ln-2→…

你不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。

示例 1:

给定链表 1->2->3->4, 重新排列为 1->4->2->3.
示例 2:

给定链表 1->2->3->4->5, 重新排列为 1->5->2->4->3.
通过次数34,696提交次数61,570
**/
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {void} Do not return anything, modify head in-place instead.
 */
var reorderList = function(head) {
    //找个数组存一下就行
    if(!head) {
    	return
    }
    let ptrs = []
    let ptr = head
    while(ptr) {
    	ptrs.push(ptr)
    	ptr = ptr.next
    }
    if(ptrs.length<=2) {
    	return
    }
    let i = 0, j = ptrs.length-1
    while(i<j) {
    	ptrs[i].next = ptrs[j]
    	i++
    	if(i==j){
    		break
    	}
    	ptrs[j].next = ptrs[i]
    	j--
    }
    ptrs[i].next = null
};

/**
144. 二叉树的前序遍历
给定一个二叉树，返回它的 前序 遍历。

 示例:
输入: [1,null,2,3]  
   1
    \
     2
    /
   3 

输出: [1,2,3]
进阶: 递归算法很简单，你可以通过迭代算法完成吗？
**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
	//从根节点开始，每次迭代弹出当前栈顶元素，并将其孩子节点压入栈中，先压右孩子再压左孩子。
	//在这个算法中，输出到最终结果的顺序按照 Top->Bottom 和 Left->Right，符合前序遍历的顺序。
	let res = []
	let stack = []//用栈去实现
	if(!root) {
		return []
	}
	stack.push(root)
	while(stack.length>0) {
		let node = stack.pop()
		res.push(node.val)
		//先加右节点
		if(node.right) stack.push(node.right)
		if(node.left) stack.push(node.left)
	}
	return res
};
var treeN1 = new TreeNode(1)
var treeN2 = new TreeNode(2)
var treeN3 = new TreeNode(3)
treeN1.left = treeN2
treeN1.right = treeN3
console.log('preorderTraversal:', preorderTraversal(treeN1))

/**
145. 二叉树的后序遍历
给定一个二叉树，返回它的 后序 遍历。

示例:

输入: [1,null,2,3]  
   1
    \
     2
    /
   3 

输出: [3,2,1]
进阶: 递归算法很简单，你可以通过迭代算法完成吗？
**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
	//用两个数组 栈去实现
	let res = []
	let stack = []//用栈去实现
	if(!root) {
		return []
	}
	stack.push(root)
	while(stack.length>0) {
		let node = stack.pop()
		res.splice(0, 0, node.val)//插入到第一个位置
		if(node.left) {
			stack.push(node.left)
		}
		if(node.right) {
			stack.push(node.right)
		}
	}
	return res
};
console.log('postorderTraversal:', postorderTraversal(treeN1))

/**
146. LRU缓存机制
运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制。它应该支持以下操作： 获取数据 get 和 写入数据 put 。
获取数据 get(key) - 如果关键字 (key) 存在于缓存中，则获取关键字的值（总是正数），否则返回 -1。
写入数据 put(key, value) - 如果关键字已经存在，则变更其数据值；如果关键字不存在，则插入该组「关键字/值」。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。

进阶:
你是否可以在 O(1) 时间复杂度内完成这两种操作？

示例:

LRUCache cache = new LRUCache( 2  缓存容量  );

cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // 返回  1
cache.put(3, 3);    // 该操作会使得关键字 2 作废
cache.get(2);       // 返回 -1 (未找到)
cache.put(4, 4);    // 该操作会使得关键字 1 作废
cache.get(1);       // 返回 -1 (未找到)
cache.get(3);       // 返回  3
cache.get(4);       // 返回  4

["LRUCache","put","put","put","put","get","get"]
[[2],[2,1],[1,1],[2,3],[4,1],[1],[2]]
[null,null,null,null,null,-1,3]
**/
let DLinkedNode = function(key,value) {
	this.key = key
	this.value = value
	this.prev = null
	this.next = null
}
/**new DL
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
	//方法一：哈希表(key,value指向链表元素) + 双向链表(保存键值)
	this.map = {}
	this.capacity = capacity
	this.size = 0
	this.head = new DLinkedNode()
	this.tail = new DLinkedNode()
	this.head.next = this.tail
	this.tail.prev = this.head
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
	let node = this.map[key]
	if(node) {
		//移到尾部
		let prev = node.prev
		prev.next = node.next
		node.next.prev = prev

		prev = this.tail.prev
		prev.next = node
		node.prev = prev
		node.next = this.tail
		this.tail.prev = node
		return node.value
	}else {
		return -1
	}
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
	let node = this.map[key]
	if(node) {
		node.value = value
		//移动到尾部（也算是一步操作）
		let prev = node.prev
		prev.next = node.next
		node.next.prev = prev

		prev = this.tail.prev
		prev.next = node
		node.prev = prev
		node.next = this.tail
		this.tail.prev = node
		return
	}
	//判断容量
	if(this.size<this.capacity) {
		this.size++
	}else {
		//删除第一个
		let next = this.head.next
		this.head.next = next.next
		next.next.prev = this.head
		next.next = null
		next.prev = null
		delete this.map[next.key]
	}
	//插入到尾部
	node = new DLinkedNode(key, value)
	let prev = this.tail.prev
	prev.next = node
	node.prev = prev
	node.next = this.tail
	this.tail.prev = node
	this.map[key] = node
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
console.log('LRUCache--')
var cache = new LRUCache(2)
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1));       // 返回  1
cache.put(3, 3);    // 该操作会使得关键字 2 作废
console.log(cache.get(2));       // 返回 -1 (未找到)
cache.put(4, 4);    // 该操作会使得关键字 1 作废
console.log(cache.get(1));       // 返回 -1 (未找到)
console.log(cache.get(3));       // 返回  3
console.log(cache.get(4));       // 返回  4
/**
147. 对链表进行插入排序
对链表进行插入排序。
插入排序的动画演示如上。从第一个元素开始，该链表可以被认为已经部分排序（用黑色表示）。
每次迭代时，从输入数据中移除一个元素（用红色表示），并原地将其插入到已排好序的链表中。

插入排序算法：
插入排序是迭代的，每次只移动一个元素，直到所有元素可以形成一个有序的输出列表。
每次迭代中，插入排序只从输入数据中移除一个待排序的元素，找到它在序列中适当的位置，并将其插入。
重复直到所有输入数据插入完为止。

示例 1：

输入: 4->2->1->3
输出: 1->2->3->4
示例 2：

输入: -1->5->3->4->0
输出: -1->0->3->4->5
**/
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var insertionSortList = function(head) {
	//链表排序
	if(head == null){
		return null
	}
	let newNode = head
	let ptr = head.next
	newNode.next = null
	while(ptr != null) {
		let next = ptr.next
		//找到合适的位置
		let begin = newNode
		if(ptr.val <= newNode.val) {
			//头
			ptr.next = newNode
			newNode = ptr
		}else{
			while(begin) {
				let pNext = begin.next
				if(pNext == null) {
					//尾
					begin.next = ptr
					ptr.next = null
					break
				}else if(ptr.val>=begin.val && ptr.val <=pNext.val){
					//插入
					begin.next = ptr
					ptr.next = pNext
					break
				}
				begin = begin.next
			}
		}
		ptr = next
	}
	return newNode
};
var lN1 = new ListNode(4)
var lN2 = new ListNode(2)
var lN3 = new ListNode(1)
var lN4 = new ListNode(3)
lN1.next = lN2
lN2.next = lN3
lN3.next = lN4
// var lN = insertionSortList(lN1)
// console.log('insertionSortList--')
// while(lN) {
// 	console.log(lN.val)
// 	lN = lN.next
// }

/**
148. 排序链表
在 O(n log n) 时间复杂度和常数级空间复杂度下，对链表进行排序。

示例 1:

输入: 4->2->1->3
输出: 1->2->3->4
示例 2:

输入: -1->5->3->4->0
输出: -1->0->3->4->5
**/
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var sortList = function(head) {
	//归并排序 思路，拆分、排序、合并
	if(!head || !head.next) {
		return head
	}
	//快慢法找中间节点然后拆分
	let slow = head
	let fast = head.next
	while(fast&&fast.next) {
		slow = slow.next
		fast = fast.next.next
	}
	let temp = slow.next
	slow.next = null
	//合并
	let left = sortList(head)
	let right = sortList(temp)
	let ln = new ListNode(0)
	let res = ln
	while(left&&right) {
		if(left.val<right.val) {
			res.next = left
			left = left.next
		}else {
			res.next = right
			right = right.next
		}
		res = res.next
	}
	res.next = left!=null?left:right
	return ln.next
};
console.log('sortList--')
var lN = sortList(lN1)
while(lN) {
	console.log(lN.val)
	lN = lN.next
}

/**
149. 直线上最多的点数
给定一个二维平面，平面上有 n 个点，求最多有多少个点在同一条直线上。

示例 1:

输入: [[1,1],[2,2],[3,3]]
输出: 3
解释:
^
|
|        o
|     o
|  o  
+------------->
0  1  2  3  4
示例 2:

输入: [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]
输出: 4
解释:
^
|
|  o
|     o        o
|        o
|  o        o
+------------------->
0  1  2  3  4  5  6

转换成 x = slope *y + c 表示为：
slope = (x1-x2)/(y1-y2)
**/
/**
 * @param {number[][]} points
 * @return {number}
 */
var maxPoints = function(points) {
	//用穷举法解决，用map保存slope线的点数  思路：0..n 遍历两两点组成的线，求slope 
	//时间复杂度 = n-1 + n-2...+1 = O(n2)
	if(points.length<=0) {
		return 0
	}
	function buildScope(x, y){
		function getGCD(p,q) {
			if(q == 0) {
				return p
			}
			let r = p%q
			return getGCD(q, r)
		}
		let gcd = getGCD(x, y)
		return x/gcd+'_'+y/gcd
	}
	let max_count = 1
	for(let i = 0; i<points.length-1; i++) {
		let count = 1//相同的点
		let max_count_i = 0//在同一条线上的点
		let map = {}
		let x1 = points[i][0]
		let y1 = points[i][1]
		let hor = 0
		for(let j = i+1; j<points.length; j++) {
			let x2 = points[j][0]
			let y2 = points[j][1]
			if(x1 == x2 && y1 == y2) {
				count++
				continue
			}else if(y1 == y2) {
				hor++
				max_count_i = Math.max(max_count_i, hor)
				continue
			}
			let slope = 0
			// 求因子方式不精确
			// if(y1!=y2) {
			// 	slope = (x1-x2)/(y1-y2)
			// }
			//改为用最大公约数
			slope = buildScope(x1-x2, y1-y2)
			if(map[slope]) {
				map[slope]++
				max_count_i = Math.max(max_count_i, map[slope])
			}else {
				map[slope] = 1
				max_count_i = Math.max(max_count_i, 1)
			}
		}
		max_count = Math.max(max_count, max_count_i+count)
	}
	return max_count
};
// let points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]
// let points = [[1,1],[2,2],[3,3]]
// let points = [[0,0],[0,0]]
// let points = [[2,3],[3,3],[-5,3]]
// let points = [[0,0],[94911150,94911151],[94911151,94911152]]
let points = [[15,12],[9,10],[-16,3],[-15,15],[11,-10],[-5,20],[-3,-15],[-11,-8],[-8,-3],[3,6],[15,-14],[-16,-18],[-6,-8],[14,9],[-1,-7],[-1,-2],[3,11],[6,20],[10,-7],[0,14],[19,-18],[-10,-15],[-17,-1],[8,7],[20,-18],[-4,-9],[-9,16],[10,14],[-14,-15],[-2,-10],[-18,9],[7,-5],[-12,11],[-17,-6],[5,-17],[-2,-20],[15,-2],[-5,-16],[1,-20],[19,-12],[-14,-1],[18,10],[1,-20],[-15,19],[-18,13],[13,-3],[-16,-17],[1,0],[20,-18],[7,19],[1,-6],[-7,-11],[7,1],[-15,12],[-1,7],[-3,-13],[-11,2],[-17,-5],[-12,-14],[15,-3],[15,-11],[7,3],[19,7],[-15,19],[10,-14],[-14,5],[0,-1],[-12,-4],[4,18],[7,-3],[-5,-3],[1,-11],[1,-1],[2,16],[6,-6],[-17,9],[14,3],[-13,8],[-9,14],[-5,-1],[-18,-17],[9,-10],[19,19],[16,7],[3,7],[-18,-12],[-11,12],[-15,20],[-3,4],[-18,1],[13,17],[-16,-15],[-9,-9],[15,8],[19,-9],[9,-17]]
// let points = [[1,1], [2,1], [3, 1], [5, 5]]
console.log('maxPoints:', maxPoints(points))


/**
150. 逆波兰表达式求值
根据 逆波兰表示法，求表达式的值。
有效的运算符包括 +, -, *, / 。每个运算对象可以是整数，也可以是另一个逆波兰表达式。

说明：
整数除法只保留整数部分。
给定逆波兰表达式总是有效的。换句话说，表达式总会得出有效数值且不存在除数为 0 的情况。

示例 1：

输入: ["2", "1", "+", "3", "*"]
输出: 9
解释: 该算式转化为常见的中缀算术表达式为：((2 + 1) * 3) = 9

示例 2：
输入: ["4", "13", "5", "/", "+"]
输出: 6
解释: 该算式转化为常见的中缀算术表达式为：(4 + (13 / 5)) = 6

示例 3：
输入: ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]
输出: 22
解释: 
该算式转化为常见的中缀算术表达式为：
  ((10 * (6 / ((9 + 3) * -11))) + 17) + 5
= ((10 * (6 / (12 * -11))) + 17) + 5
= ((10 * (6 / -132)) + 17) + 5
= ((10 * 0) + 17) + 5
= (0 + 17) + 5
= 17 + 5
= 22
 
逆波兰表达式：
逆波兰表达式是一种后缀表达式，所谓后缀就是指算符写在后面。
平常使用的算式则是一种中缀表达式，如 ( 1 + 2 ) * ( 3 + 4 ) 。
该算式的逆波兰表达式写法为 ( ( 1 2 + ) ( 3 4 + ) * ) 。

逆波兰表达式主要有以下两个优点：
去掉括号后表达式无歧义，上式即便写成 1 2 + 3 4 + * 也可以依据次序计算出正确结果。
适合用栈操作运算：遇到数字则入栈；遇到算符则取出栈顶两个数字进行计算，并将结果压入栈中。
**/
/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function(tokens) {
	//适合用栈操作运算：遇到数字则入栈；遇到算符则取出栈顶两个数字进行计算，并将结果压入栈中。
	function isOperator(char) {
		if(char == '+' || char == '-' || char == '*' || char == '/') {
			return true
		}
		return false
	}
	function operatorRes(a,b,c) {
		if(c=='+') {
			return a+b
		}else if(c=='-') {
			return a-b
		}else if (c=='*') {
			return a*b
		}else if(c=='/') {
			return parseInt(a/b)
		}
		return 0

	}
	let stack = []
	for(let i = 0; i<tokens.length; i++) {
		let c = tokens[i]
		if(isOperator(c)) {
			let b = stack.pop() 
			let a = stack.pop()
			stack.push(operatorRes(a, b, c))
			console.log(a, b, c)
		}else{
			stack.push(parseInt(c))
		}
	}
	return stack[0] || 0
};
// var tokens = ["2", "1", "+", "3", "*"]
// var tokens = ["4", "13", "5", "/", "+"]
var tokens = ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]
console.log('evalRPN:', evalRPN(tokens))
/**
151. 翻转字符串里的单词
给定一个字符串，逐个翻转字符串中的每个单词。

示例 1：
输入: "the sky is blue"
输出: "blue is sky the"
示例 2：

输入: "  hello world!  "
输出: "world! hello"
解释: 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
示例 3：

输入: "a good   example"
输出: "example good a"
解释: 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。

说明：
无空格字符构成一个单词。
输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。

进阶：
请选用 C 语言的用户尝试使用 O(1) 额外空间复杂度的原地解法。
**/
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
	return s.trim().split(/\s+/).reverse().join(' ')
};
var s = "  hello world!  "
console.log('reverseWords:', reverseWords(s))

/**
152. 乘积最大子数组
给你一个整数数组 nums ，请你找出数组中乘积最大的连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

示例 1:
输入: [2,3,-2,4]
输出: 6
解释: 子数组 [2,3] 有最大乘积 6。

示例 2:
输入: [-2,0,-1]
输出: 0
解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
	let max = -Number.MAX_VALUE, imax = 1, imin = 1;
    for(let i=0; i<nums.length; i++){
        if(nums[i] < 0){ 
          let tmp = imax;
          imax = imin;
          imin = tmp;
        }
        imax = Math.max(imax*nums[i], nums[i]);
        imin = Math.min(imin*nums[i], nums[i]);
        
        max = Math.max(max, imax);
    }
    return max;
};
// nums = [2,3,-2,4]
// nums = [-2,0,-1]
// nums = [-3,-1,-1]
// nums = [-2]
nums = [-2,3,-4]
console.log('maxProduct:', maxProduct(nums))

/**
153. 寻找旋转排序数组中的最小值
假设按照升序排序的数组在预先未知的某个点上进行了旋转。

( 例如，数组 [0,1,2,4,5,6,7] 可能变为 [4,5,6,7,0,1,2] )。

请找出其中最小的元素。
你可以假设数组中不存在重复元素。

示例 1:

输入: [3,4,5,1,2]
输出: 1
示例 2:

输入: [4,5,6,7,0,1,2]
输出: 0
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
	//应为有序所以考虑二分查找 时间发咋读O(log(n)),空间复杂度O(1)
	let binarySearch = function (start, end) {
		if(nums[start]<=nums[end]) {
			return nums[start]
		}
		let mid = Math.floor((start+end)/2)
		if(nums[mid]>nums[mid+1]) {
			return nums[mid+1]
		}
		if(nums[mid-1]>nums[mid]) {
			return nums[mid]
		}
		if(nums[mid]>nums[0]) {
			start = mid+1
		}else {
			end = mid-1
		}
		return binarySearch(start, end)
	}
	return binarySearch(0, nums.length-1)
};
// nums = [4,5,6,7,0,1,2]
nums = [3,4,5,1,2]
nums = [1]
console.log('findMin:', findMin(nums))
/**
154. 寻找旋转排序数组中的最小值 II
假设按照升序排序的数组在预先未知的某个点上进行了旋转。
( 例如，数组 [0,1,2,4,5,6,7] 可能变为 [4,5,6,7,0,1,2] )。
请找出其中最小的元素。
注意数组中可能存在重复的元素。

示例 1：

输入: [1,3,5]
输出: 1
示例 2：

输入: [2,2,2,0,1]
输出: 0
说明：

这道题是 寻找旋转排序数组中的最小值 的延伸题目。
允许重复会影响算法的时间复杂度吗？会如何影响，为什么？
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
	//应为有序所以考虑二分查找 时间发咋读O(log(n)),空间复杂度O(1)
	let binarySearch = function (start, end) {
		if(start >= end) {
			return nums[start]
		}
		if(nums[start]<nums[end]) {
			return nums[start]
		}
		let mid = Math.floor((start+end)/2)
		if(nums[mid]>nums[end]) {
			start = mid+1
		}else if(nums[mid]<nums[end]) {
			end = mid
		}else {
			//去除重复值
			end = end-1
		}
		return binarySearch(start, end)
	}
	return binarySearch(0, nums.length-1)
};
nums = [2,2,2,0,1,2]
nums = [2,2,2,0,1]
console.log('findMin:', findMin(nums))

/**
155. 最小栈
设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。

push(x) —— 将元素 x 推入栈中。
pop() —— 删除栈顶的元素。
top() —— 获取栈顶元素。
getMin() —— 检索栈中的最小元素。
 

示例:

输入：
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

输出：
[null,null,null,null,-3,null,0,-2]

解释：
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.getMin();   --> 返回 -2.
**/
/**
 * initialize your data structure here.
 */
var MinStack = function() {
	this.stack = []
	this.minStack = []//辅助队列，记录当前的最小值
};

/** 
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function(x) {
	this.stack.push(x)
	if(this.minStack.length<=0) {
		this.minStack.push(x)
	}else {
		this.minStack.push(Math.min(this.minStack[this.minStack.length-1], x))
	}
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
	this.minStack.pop()
	this.stack.pop()
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
	return this.stack[this.stack.length-1]
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
	return this.minStack[this.minStack.length-1]
};

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(x)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
var minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log('minStack:', minStack.getMin());//   --> 返回 -3.
minStack.pop();
console.log('minStack:', minStack.top());//      --> 返回 0.
console.log('minStack:', minStack.getMin());//   --> 返回 -2.

/**
160. 相交链表
编写一个程序，找到两个单链表相交的起始节点。

输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3
输出：Reference of the node with value = 8
输入解释：相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,0,1,8,4,5]。在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。

注意：
如果两个链表没有交点，返回 null.
在返回结果后，两个链表仍须保持原有的结构。
可假定整个链表结构中没有循环。
程序尽量满足 O(n) 时间复杂度，且仅用 O(1) 内存。

双指针法
创建两个指针 pA 和 pB，分别初始化为链表 A 和 B 的头结点。然后让它们向后逐结点遍历。
当 pApA 到达链表的尾部时，将它重定位到链表 B 的头结点 (你没看错，就是链表 B); 类似的，当 pB 到达链表的尾部时，将它重定位到链表 A 的头结点。
若在某一时刻 pA 和 pB 相遇，则 pA/pB 为相交结点。

**/
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
    //时间复杂度O(m+n) 空间复杂度O(1)
    let pA = headA
    let pB = headB
    while(pA!=pB) {
    	pA == null?(pA = headB):(pA = pA.next)
    	pB == null?(pB = headA):(pB = pB.next)
    }
    return pA
};
let lA = new ListNode(1)
let lB = new ListNode(2)
let lC = new ListNode(3)
lA.next = lC
lB.next = lC
let resL = getIntersectionNode(lA, lB)
console.log('getIntersectionNode:', resL)

/**
162. 寻找峰值
峰值元素是指其值大于左右相邻值的元素。

给定一个输入数组 nums，其中 nums[i] ≠ nums[i+1]，找到峰值元素并返回其索引。

数组可能包含多个峰值，在这种情况下，返回任何一个峰值所在位置即可。

你可以假设 nums[-1] = nums[n] = -∞。

示例 1:

输入: nums = [1,2,3,1]
输出: 2
解释: 3 是峰值元素，你的函数应该返回其索引 2。
示例 2:

输入: nums = [1,2,1,3,5,6,4]
输出: 1 或 5 
解释: 你的函数可以返回索引 1，其峰值元素为 2；
     或者返回索引 5， 其峰值元素为 6。
说明:

你的解法应该是 O(logN) 时间复杂度的。
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var findPeakElement = function(nums) {
	//看到logN 应该用二分法
	let binarySearch = function(left, right) {
		if(left == right) {
			return left
		}
		let mid = Math.floor((left+right)/2)
		if(nums[mid]>nums[mid+1]) {
			return binarySearch(left, mid)
		}else {
			return binarySearch(mid+1, right)
		}
	}
	return binarySearch(0, nums.length-1)
};
nums = [1,2,1,3,5,6,4]
console.log('findPeakElement:', findPeakElement(nums))

/**
164. 最大间距
给定一个无序的数组，找出数组在排序之后，相邻元素之间最大的差值。
如果数组元素个数小于 2，则返回 0。

示例 1:

输入: [3,6,9,1]
输出: 3
解释: 排序后的数组是 [1,3,6,9], 其中相邻元素 (3,6) 和 (6,9) 之间都存在最大差值 3。
示例 2:

输入: [10]
输出: 0
解释: 数组元素个数小于 2，因此返回 0。
说明:

你可以假设数组中所有元素都是非负整数，且数值在 32 位有符号整数范围内。
请尝试在线性时间复杂度和空间复杂度的条件下解决此问题。
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var maximumGap = function(nums) {
	//比较简单的时间复杂度<O(n2)的有归并排序，快速排序，快速排序
	if(nums.length<2) {
		return 0
	}
	let quickSort = function(l,r) {
		if(l<r) {
			let i = l, j = r, x = nums[l]
			while(i<j) {
				//从右边找<x的值
				while(i<j && nums[j]>=x) {
					j--
				}
				if(i<j) {
					nums[i++] = nums[j]
				}
				//从左边找>x的值
				while(i<j&&nums[i]<x) {
					i++
				}
				if(i<j){
					nums[j--] = nums[i]
				}
			}
			nums[i] = x//i是有序的
			quickSort(l, i-1)
			quickSort(i+1, r)
		}
	}
	quickSort(0, nums.length-1)
	
	let minGap = 0
	for(let i = 1; i<nums.length; i++) {
		minGap = Math.max(minGap, nums[i]-nums[i-1])
	}
	return minGap
};
nums = [3,6,9,1]
console.log('maximumGap:', maximumGap(nums))

/**
165. 比较版本号
比较两个版本号 version1 和 version2。
如果 version1 > version2 返回 1，如果 version1 < version2 返回 -1， 除此之外返回 0。

你可以假设版本字符串非空，并且只包含数字和 . 字符。

 . 字符不代表小数点，而是用于分隔数字序列。

例如，2.5 不是“两个半”，也不是“差一半到三”，而是第二版中的第五个小版本。

你可以假设版本号的每一级的默认修订版号为 0。例如，版本号 3.4 的第一级（大版本）和第二级（小版本）修订号分别为 3 和 4。其第三级和第四级修订号均为 0。
 

示例 1:

输入: version1 = "0.1", version2 = "1.1"
输出: -1
示例 2:

输入: version1 = "1.0.1", version2 = "1"
输出: 1
示例 3:

输入: version1 = "7.5.2.4", version2 = "7.5.3"
输出: -1
示例 4：

输入：version1 = "1.01", version2 = "1.001"
输出：0
解释：忽略前导零，“01” 和 “001” 表示相同的数字 “1”。
示例 5：

输入：version1 = "1.0", version2 = "1.0.0"
输出：0
解释：version1 没有第三级修订号，这意味着它的第三级修订号默认为 “0”。
 

提示：
版本字符串由以点 （.） 分隔的数字字符串组成。这个数字字符串可能有前导零。
版本字符串不以点开始或结束，并且其中不会有两个连续的点。
**/
/**
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 */
var compareVersion = function(version1, version2) {
	let vers1 = version1.split('.')
	let vers2 = version2.split('.')
	let len = Math.max(vers1.length, vers2.length)
	for(let i = 0; i<len; i++) {
		let v1 = parseInt(vers1[i] || 0)
		let v2 = parseInt(vers2[i] || 0)
		if(v1>v2) {
			return 1
		}else if (v1<v2) {
			return -1
		}
	}
	return 0
};
let version1 = "7.5.2.4", version2 = "7.5.3"
console.log('compareVersion:', compareVersion(version1, version2))

/**
166. 分数到小数
给定两个整数，分别表示分数的分子 numerator 和分母 denominator，以字符串形式返回小数。

如果小数部分为循环小数，则将循环的部分括在括号内。

示例 1:

输入: numerator = 1, denominator = 2
输出: "0.5"
示例 2:

输入: numerator = 2, denominator = 1
输出: "2"
示例 3:

输入: numerator = 2, denominator = 3
输出: "0.(6)"

**/
/**
 * @param {number} numerator
 * @param {number} denominator
 * @return {string}
 */
var fractionToDecimal = function(numerator, denominator) {
	//判断正负 判断整除
	if(numerator == 0 || denominator == 0) {
		return '0'
	}
	let res = ''
	let i1 = numerator>=0?1:0
	let i2 = denominator>=0?1:0
	if(i1^i2) {
		res = res+'-'
	}
	let r = numerator/denominator
	res = res+(r>0&&r<1?0:Math.abs(parseInt(r)))
	numerator = Math.abs(numerator)
	denominator = Math.abs(denominator)
	let remainder = numerator%denominator
	if(remainder == 0) {
		return res.toString()
	}
	res+='.'
	let map = {}//存取字符串对应的下标
	while(remainder>0) {
		if(map[remainder]) {
			//找到重复的
			let idx = map[remainder]
			res = res.substring(0, idx)+'('+res[idx]+res.substring(idx+1, res.length)+')'
			break
		}
		map[remainder] = res.length
		remainder = remainder*10
		r = remainder/denominator
		res+= parseInt(r<1?0:r)
		remainder = remainder%denominator
	}
	return res
};
console.log('fractionToDecimal:', fractionToDecimal(-50, 8))

/**
167. 两数之和 II - 输入有序数组
给定一个已按照升序排列 的有序数组，找到两个数使得它们相加之和等于目标数。

函数应该返回这两个下标值 index1 和 index2，其中 index1 必须小于 index2。

说明:

返回的下标值（index1 和 index2）不是从零开始的。
你可以假设每个输入只对应唯一的答案，而且你不可以重复使用相同的元素。
示例:

输入: numbers = [2, 7, 11, 15], target = 9
输出: [1,2]
解释: 2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。
**/
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
	let map = {}
	for(let i = 0; i<numbers.length; i++) {
		let num = numbers[i]
		map[num] = map[num] ||[]
		map[num].push(i+1)
	}
	let res = []
	for(let i = 0; i<numbers.length; i++) {
		let num = numbers[i]
		let dis = target-num
		if(num == dis && map[num]){
			res.push(map[num][0])
			res.push(map[num][1])
			break
		}else if(num != dis&&map[num] && map[dis]){
			res.push(map[num][0])
			res.push(map[dis][0])
			break
		}
	}
	return res
};
/**
方法二：双指针
初始时两个指针分别指向第一个元素位置和最后一个元素的位置。每次计算两个指针指向的两个元素之和，并和目标值比较。
	如果两个元素之和等于目标值，则发现了唯一解。
	如果两个元素之和小于目标值，则将左侧指针右移一位。
	如果两个元素之和大于目标值，则将右侧指针左移一位。
	移动指针之后，重复上述操作，直到找到答案。
原理：在O(n2)的基础上排查，实现复杂度为O（n）
https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/solution/yi-zhang-tu-gao-su-ni-on-de-shuang-zhi-zhen-jie-fa/
**/
var twoSum2 = function(numbers, target) {
	let left = 0
	let right = numbers.length-1
	while(left<right) {
		if(numbers[left]+numbers[right]>target){
			right--
		}else if(numbers[left]+numbers[right]<target) {
			left++
		}else {
			let res = [left+1, right+1]
			return res
		}
	}
};

console.log('twoSum2:', twoSum2([5,25,75], 100))

/**
168. Excel表列名称
给定一个正整数，返回它在 Excel 表中相对应的列名称。

例如，

    1 -> A
    2 -> B
    3 -> C
    ...
    26 -> Z
    27 -> AA
    28 -> AB 
    ...
示例 1:

输入: 1
输出: "A"
示例 2:

输入: 28
输出: "AB"
示例 3:

输入: 701
输出: "ZY"
**/
/**
 * @param {number} n
 * @return {string}
 */
var convertToTitle = function(n) {
	//26的倍数
	let res = ''
	while(n>0) {
		let shang = parseInt(n/26)
		let yu = n%26
		if(yu==0) {//整除
			shang = shang-1
			yu = 26
		}
		res = String.fromCharCode(yu+64)+res
		n = shang
	}
	return res
};
console.log('convertToTitle:', convertToTitle(1234))

/**
169. 多数元素
给定一个大小为 n 的数组，找到其中的多数元素。多数元素是指在数组中出现次数大于 ⌊ n/2 ⌋ 的元素。
你可以假设数组是非空的，并且给定的数组总是存在多数元素。

示例 1:

输入: [3,2,3]
输出: 3
示例 2:
输入: [2,2,1,1,1,2,2]
输出: 2

方法
1、字典
2、排序
3、Boyer-Moore 投票算法
思路
如果我们把众数记为 +1+1，把其他数记为 -1−1，将它们全部加起来，显然和大于 0，从结果本身我们可以看出众数比其他数多。
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
	//时间复杂度O(n), 空间复杂度O（1）
	let candidate = 0
	let count = 0
	for(let i = 0; i<nums.length; i++) {
		if(count == 0) {
			candidate = nums[i]
		}
		count += nums[i] == candidate?1:-1
	}
	return candidate
};
nums = [3,2,3]
nums = [2,2,1,1,1,2,2]
console.log('majorityElement:', majorityElement(nums))
/**
171. Excel表列序号
给定一个Excel表格中的列名称，返回其相应的列序号。

例如，

    A -> 1
    B -> 2
    C -> 3
    ...
    Z -> 26
    AA -> 27
    AB -> 28 
    ...
示例 1:

输入: "A"
输出: 1
示例 2:

输入: "AB"
输出: 28
示例 3:

输入: "ZY"
输出: 701
**/
/**
 * @param {string} s
 * @return {number}
 */
var titleToNumber = function(s) {
	//跟168题目对应
	let res = 0
	for(let i = 0; i<s.length; i++) {
		res = res*26
		res += (s.charCodeAt(i)-64)
	}
	return res
};
console.log('titleToNumber:', titleToNumber("A"))

/**
172. 阶乘后的零
给定一个整数 n，返回 n! 结果尾数中零的数量。

示例 1:

输入: 3
输出: 0
解释: 3! = 6, 尾数中没有零。
示例 2:

输入: 5
输出: 1
解释: 5! = 120, 尾数中有 1 个零.
说明: 你算法的时间复杂度应为 O(log n) 。

思路：
为了确定最后有多少个零，我们应该看有多少对 22 和 55 的因子
而在阶乘的数中，2的个数是大于5的个数的
因此题目分析为找5的个数
**/
/**
 * @param {number} n
 * @return {number}
 */
var trailingZeroes = function(n) {
	//时间复杂度以5为底n的对数 O（logn）
	let zeroCount = 0
	while(n>0) {
		n = parseInt(n/5)
		zeroCount+=n
	}
	return zeroCount
};
console.log('trailingZeroes:', trailingZeroes(12345))

/**
173. 二叉搜索树迭代器
实现一个二叉搜索树迭代器。你将使用二叉搜索树的根节点初始化迭代器。
调用 next() 将返回二叉搜索树中的下一个最小的数。

示例：
BSTIterator iterator = new BSTIterator(root);
iterator.next();    // 返回 3
iterator.next();    // 返回 7
iterator.hasNext(); // 返回 true
iterator.next();    // 返回 9
iterator.hasNext(); // 返回 true
iterator.next();    // 返回 15
iterator.hasNext(); // 返回 true
iterator.next();    // 返回 20
iterator.hasNext(); // 返回 false

提示：
next() 和 hasNext() 操作的时间复杂度是 O(1)，并使用 O(h) 内存，其中 h 是树的高度。
你可以假设 next() 调用总是有效的，也就是说，当调用 next() 时，BST 中至少存在一个下一个最小的数。

思路
二叉搜索树的一个重要的特性是是二叉搜索树的中序序列是升序序列；因此，中序遍历是该解决方案的核心。

用栈模拟遍历过程

复杂度分析

时间复杂度：
	hasNext()：若栈中还有元素，则返回 true，反之返回 false。所以这是一个 O(1)O(1) 的操作。
	next()：包含了两个主要步骤。一个是从栈中弹出一个元素，它是下一个最小的元素。这是一个 O(1) 的操作。
	然而，随后我们要调用帮助函数 _inorder_left ，它需要递归的，将左节点添加到栈上，是线性时间的操作，最坏的情况下为 O(N)。
	但是我们只对含有右节点的节点进行调用，它也不会总是处理 N 个节点。只有当我们有一个倾斜的树，才会有 N 个节点。
	因此该操作的平均时间复杂度仍然是 O(1)，符合问题中所要求的。
空间复杂度：O(h)O(h)，使用了一个栈来模拟递归。

**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 */
var BSTIterator = function(root) {
	this.stack = []
	this._leftInOrder(root)
};

BSTIterator.prototype._leftInOrder = function(root) {
	//加入左节点
	while(root) {
		this.stack.push(root)
		root = root.left
	}
}

/**
 * @return the next smallest number
 * @return {number}
 */
BSTIterator.prototype.next = function() {
	let root = this.stack.pop()
	if(root.right) {
		this._leftInOrder(root.right)
	}
	return root.val
};

/**
 * @return whether we have a next smallest number
 * @return {boolean}
 */
BSTIterator.prototype.hasNext = function() {
	return this.stack.length>0
};

/**
 * Your BSTIterator object will be instantiated and called as such:
 * var obj = new BSTIterator(root)
 * var param_1 = obj.next()
 * var param_2 = obj.hasNext()
 */

 /**
 174. 地下城游戏
一些恶魔抓住了公主（P）并将她关在了地下城的右下角。地下城是由 M x N 个房间组成的二维网格。我们英勇的骑士（K）最初被安置在左上角的房间里，他必须穿过地下城并通过对抗恶魔来拯救公主。
骑士的初始健康点数为一个正整数。如果他的健康点数在某一时刻降至 0 或以下，他会立即死亡。
有些房间由恶魔守卫，因此骑士在进入这些房间时会失去健康点数（若房间里的值为负整数，则表示骑士将损失健康点数）；其他房间要么是空的（房间里的值为 0），要么包含增加骑士健康点数的魔法球（若房间里的值为正整数，则表示骑士将增加健康点数）。
为了尽快到达公主，骑士决定每次只向右或向下移动一步。

编写一个函数来计算确保骑士能够拯救到公主所需的最低初始健康点数。
例如，考虑到如下布局的地下城，如果骑士遵循最佳路径 右 -> 右 -> 下 -> 下，则骑士的初始健康点数至少为 7。
-2 (K)	-3	 3
-5	    -10	 1
10	    30	 -5 (P)
 
说明:
骑士的健康点数没有上限。
任何房间都可能对骑士的健康点数造成威胁，也可能增加骑士的健康点数，包括骑士进入的左上角房间以及公主被监禁的右下角房间。

思路：反向推到
于是我们考虑从右下往左上进行动态规划。令 dp[i][j]表示从坐标 (i,j) 到终点所需的最小初始值。换句话说，当我们到达坐标 (i,j)时，如果此时我们的路径和不小于 dp[i][j]我们就能到达终点。
这样一来，我们就无需担心路径和的问题，只需要关注最小初始值。对于 dp[i][j]，我们只要关心 dp[i][j+1]和 dp[i+1][j]的最小值 minn。记当前格子的值为 dungeon(i,j)，那么在坐标 (i,j) 的初始值只要达到minn−dungeon(i,j) 即可。
同时，初始值还必须大于等于 11。这样我们就可以得到状态转移方程：
dp[i][j]=max(min(dp[i+1][j],dp[i][j+1])−dungeon(i,j),1)

最终答案即为 dp[0][0]。

 **/
 /**
 * @param {number[][]} dungeon
 * @return {number}
 */
var calculateMinimumHP = function(dungeon) {
	let m = dungeon.length//row
	let n = dungeon[0].length//col
	let dp = [[]]
	//最后一个值得右，下 方的值设为1
	dp[m] = []
	dp[m-1] = []
	dp[m][n-1] = 1
	dp[m-1][n] = 1
	for(let i = m-1; i>=0; i--) {
		dp[i] = dp[i] || []
		for(j = n-1; j>=0; j--) {
			let min = Math.min(dp[i+1][j]||Number.MAX_VALUE, dp[i][j+1]||Number.MAX_VALUE)
			let max = Math.max(min-dungeon[i][j], 1)
			dp[i][j] = max
		}
	}
	return dp[0][0]
};
let dungeon = 
[[-2,-3,3],
[-5,-10,1],
[10,30,-5],]
console.log('calculateMinimumHP:', calculateMinimumHP(dungeon))
/**
179. 最大数
给定一组非负整数，重新排列它们的顺序使之组成一个最大的整数。

示例 1:

输入: [10,2]
输出: 210
示例 2:

输入: [3,30,34,5,9]
输出: 9534330
说明: 输出结果可能非常大，所以你需要返回一个字符串而不是整数。

**/
/**
 * @param {number[]} nums
 * @return {string}
 */
var largestNumber = function(nums) {
	//自定义排序  比较方法重写  （快速排序、归并排序）
	nums.sort(function(a, b) {
		return a.toString()+b.toString()>b.toString()+a.toString()?-1:1
	})
	let res = nums.join('')
	if(res[0] == '0') {
		return '0'
	}
	return res
};
console.log('largestNumber:', largestNumber([0, 0]))

/**
187. 重复的DNA序列
所有 DNA 都由一系列缩写为 A，C，G 和 T 的核苷酸组成，例如：“ACGAATTCCG”。在研究 DNA 时，识别 DNA 中的重复序列有时会对研究非常有帮助。

编写一个函数来查找目标子串，目标子串的长度为 10，且在 DNA 字符串 s 中出现次数超过一次。

示例：
输入：s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"
输出：["AAAAACCCCC", "CCCCCAAAAA"]

方法 1、map的方式
方法2
Rabin-Karp：使用旋转哈希实现常数时间窗口切片
把键转换成数值的形式，数值的比较比字符串要快(js只支持字符串的键，所以提升不大)
**/
/**
 * @param {string} s
 * @return {string[]}
 */
var findRepeatedDnaSequences = function(s) {
	//2 时间复杂度O(n-l) 空间复杂度O(n-l)
	let len = 10
	if(s.length<10) {
		return []
	}
	let n = 4
	let nL = Math.pow(n, 10)
	let c_map = {A: 0, C:1, G: 2, T: 3}
	let nums = []
	let map = {}
	let h = 0 //key
	let res = []
	for(let i = 0; i<=s.length-len; i++) {
		if(i == 0) {
			for(let j = 0; j<len; j++){
				h = h*4+c_map[s[j]]
			}
		}else {
			h = h*n-c_map[s[i-1]]*nL+c_map[s[i+len-1]]
		}
		if(map[h]==1) {
			res.push(s.substring(i, i+len))
		}
		map[h] = (map[h]||0) + 1
	}
	return res
};
console.log('findRepeatedDnaSequences:', findRepeatedDnaSequences("AAAAAAAAAAAA"))

/**
188. 买卖股票的最佳时机 IV
给定一个数组，它的第 i 个元素是一支给定的股票在第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你最多可以完成 k 笔交易。

注意: 你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。

示例 1:
输入: [2,4,1], k = 2
输出: 2
解释: 在第 1 天 (股票价格 = 2) 的时候买入，在第 2 天 (股票价格 = 4) 的时候卖出，这笔交易所能获得利润 = 4-2 = 2 。

示例 2:
输入: [3,2,6,5,0,3], k = 2
输出: 7
解释: 在第 2 天 (股票价格 = 2) 的时候买入，在第 3 天 (股票价格 = 6) 的时候卖出, 这笔交易所能获得利润 = 6-2 = 4 。
     随后，在第 5 天 (股票价格 = 0) 的时候买入，在第 6 天 (股票价格 = 3) 的时候卖出, 这笔交易所能获得利润 = 3-0 = 3 。
**/
/**
 * @param {number} k
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(k, prices) {
	//最笨的方法-回溯法 时间复杂度O(2的n次方)
	let maxProfit = 0
	let state = 0//0空闲 1持有
	let num = 0//次数
	let profit = 0//当前收益
	let day = 0//当前天数
	let backTrack = function(_state, _num, _profit, _day) {
		if(_day>=prices.length || _num>=k){
			//结束条件
			maxProfit = Math.max(maxProfit, _profit)
			return
		}
		if(_state == 0) {
			backTrack(1, _num, _profit-prices[_day], _day+1)//买入
		}else {
			backTrack(0, _num+1, _profit+prices[_day], _day+1)//卖出
		}
		backTrack(_state, _num, _profit, _day+1)//空闲
	}
	backTrack(state, num, profit, day)
	return maxProfit
};
/**
状态转移方程
dp[i][j][0] = max(dp[i - 1][j][0], dp[i - 1][j][1] + prices[i])
dp[i][j][1] = max(dp[i - 1][j][1], dp[i - 1][j - 1][0] - prices[i])
天数、次数、状态
**/
var maxProfit2 = function(k, prices) {
	//时间复杂度O(n*k) 空间复杂度O(n*k*2)
	let len = prices.length
	if(len<=1) {
		return 0
	}
	if(k<=0) {
		return 0
	}

	if (k >= len / 2) {
		let greedy = function(){
			//贪心算法，只要价格>0就卖出
			let res = 0
			for(let i = 1; i<len; i++) {
				if(prices[i]>prices[i-1]) {
					res+= (prices[i]-prices[i-1])
				}
			}
			return res
		}
        return greedy();
    }
	let s = 2
	let dp = []
	for(let i = 0; i<len; i++) {
		dp[i] = []
		for(let j = 0; j<k; j++) {
			dp[i][j] = []
		}
	}
	for(let i = 0; i<len; i++) {
		for(let j = 0; j<k; j++) {
			if(i == 0) {
				dp[i][j][0] = 0
				dp[i][j][1] = -prices[0]
			}else {
				if(j == 0) {
					//第 0 次交易  买入过一次，卖出过一次都算0次交易
					dp[i][j][1] = Math.max(dp[i - 1][j][1], -prices[i]);
				}else {
					dp[i][j][1] = Math.max(dp[i-1][j][1], dp[i-1][j-1][0]-prices[i])
				}
				dp[i][j][0] = Math.max(dp[i-1][j][0], dp[i-1][j][1]+prices[i])
			}
		}
	}
	return dp[len-1][k-1][0]

}
// console.log('maxProfit:', maxProfit2(2, [3,2,6,5,0,3]))
// console.log('maxProfit2:', maxProfit(2, [2,4,1]))
console.log('maxProfit:', maxProfit2(7, [48,12,60,93,97,42,25,64,17,56,85,93,9,48,52,42,58,85,81,84,69,36,1,54,23,15,72,15,11,94]))


/**
189. 旋转数组
给定一个数组，将数组中的元素向右移动 k 个位置，其中 k 是非负数。

示例 1:

输入: [1,2,3,4,5,6,7] 和 k = 3
输出: [5,6,7,1,2,3,4]
解释:
向右旋转 1 步: [7,1,2,3,4,5,6]
向右旋转 2 步: [6,7,1,2,3,4,5]
向右旋转 3 步: [5,6,7,1,2,3,4]
示例 2:

输入: [-1,-100,3,99] 和 k = 2
输出: [3,99,-1,-100]
解释: 
向右旋转 1 步: [99,-1,-100,3]
向右旋转 2 步: [3,99,-1,-100]
说明:

尽可能想出更多的解决方案，至少有三种不同的方法可以解决这个问题。
要求使用空间复杂度为 O(1) 的 原地 算法。

方法
方法 1：使用环状替换
如果我们直接把每一个数字放到它最后的位置，但这样的后果是遗失原来的元素。因此，我们需要把被替换的数字保存在变量 temptemp 里面。然后，我们将被替换数字（temptemp）放到它正确的位置，

方法2 翻转
这个方法基于这个事实：当我们旋转数组 k 次， k\%nk%n 个尾部元素会被移动到头部，剩下的元素会被向后移动。
在这个方法中，我们首先将所有元素反转。然后反转前 k 个元素，再反转后面 n-kn−k 个元素，就能得到想要的结果。
假设 n=7n=7 且 k=3k=3 。

原始数组                  : 1 2 3 4 5 6 7
反转所有数字后             : 7 6 5 4 3 2 1
反转前 k 个数字后          : 5 6 7 4 3 2 1
反转后 n-k 个数字后        : 5 6 7 1 2 3 4 --> 结果

**/
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
	//方法一、时间复杂度O(n),空间复杂度O(1)
	let len = nums.length
	k = k%len
	let count = 0
	for(let start = 0; count<len; start++) {
		let current = start
		let currNum = nums[current]
		do{
			let next = (current+k)%len
			let tempNum = nums[next]
			nums[next] = currNum
			current = next
			currNum = tempNum
			count++
		}while(start!=current)
	}
};
nums = [1,2,3,4,5,6,7]
rotate(nums, 3)
console.log('rotate:', nums)

/**
190. 颠倒二进制位
颠倒给定的 32 位无符号整数的二进制位。

示例 1：
输入: 00000010100101000001111010011100
输出: 00111001011110000010100101000000
解释: 输入的二进制串 00000010100101000001111010011100 表示无符号整数 43261596，
     因此返回 964176192，其二进制表示形式为 00111001011110000010100101000000。

示例 2：
输入：11111111111111111111111111111101
输出：10111111111111111111111111111111
解释：输入的二进制串 11111111111111111111111111111101 表示无符号整数 4294967293，
     因此返回 3221225471 其二进制表示形式为 10111111111111111111111111111111 。
 
提示：

请注意，在某些语言（如 Java）中，没有无符号整数类型。在这种情况下，输入和输出都将被指定为有符号整数类型，并且不应影响您的实现，因为无论整数是有符号的还是无符号的，其内部的二进制表示形式都是相同的。
在 Java 中，编译器使用二进制补码记法来表示有符号整数。因此，在上面的 示例 2 中，输入表示有符号整数 -3，输出表示有符号整数 -1073741825。
 
进阶:
如果多次调用这个函数，你将如何优化你的算法？
**/
/**
 * @param {number} n - a positive integer
 * @return {number} - a positive integer
 */
var reverseBits = function(n) {
    let res = 0
    for(let i =0; i<32; i++) {
    	res = (res*2)|(n>>i&1)
    }
    return res
};
console.log('reverseBits:', reverseBits(43261596))
console.log('reverseBits:', reverseBits(4294967293))
/**
191. 位1的个数
编写一个函数，输入是一个无符号整数，返回其二进制表达式中数字位数为 ‘1’ 的个数（也被称为汉明重量）。

示例 1：
输入：00000000000000000000000000001011
输出：3
解释：输入的二进制串 00000000000000000000000000001011 中，共有三位为 '1'。

示例 2：
输入：00000000000000000000000010000000
输出：1
解释：输入的二进制串 00000000000000000000000010000000 中，共有一位为 '1'。

示例 3：
输入：11111111111111111111111111111101
输出：31
解释：输入的二进制串 11111111111111111111111111111101 中，共有 31 位为 '1'。
 

提示：

请注意，在某些语言（如 Java）中，没有无符号整数类型。在这种情况下，输入和输出都将被指定为有符号整数类型，并且不应影响您的实现，因为无论整数是有符号的还是无符号的，其内部的二进制表示形式都是相同的。
在 Java 中，编译器使用二进制补码记法来表示有符号整数。因此，在上面的 示例 3 中，输入表示有符号整数 -3。
 

进阶:
如果多次调用这个函数，你将如何优化你的算法？
**/
/**
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function(n) {
    let num = 0
    for(let i = 0; i<32; i++) {
    	if((n>>i&1)==1){
    		num++
    	}
    }
    return num
};
console.log('hammingWeight:', hammingWeight(4294967293))

/**
198. 打家劫舍
你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。

示例 1：
输入：[1,2,3,1]
输出：4
解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
     偷窃到的最高金额 = 1 + 3 = 4 。

示例 2：
输入：[2,7,9,3,1]
输出：12
解释：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
     偷窃到的最高金额 = 2 + 9 + 1 = 12 。
 
提示：
0 <= nums.length <= 100
0 <= nums[i] <= 400

分析
偷窃第 k 间房屋，那么就不能偷窃第 k-1 间房屋，偷窃总金额为前 k-2 间房屋的最高总金额与第 k 间房屋的金额之和。
不偷窃第 k 间房屋，偷窃总金额为前 k-1 间房屋的最高总金额。
在两个选项中选择偷窃总金额较大的选项，该选项对应的偷窃总金额即为前 k 间房屋能偷窃到的最高总金额。

用 dp[i] 表示前 i 间房屋能偷窃到的最高总金额，那么就有如下的状态转移方程：
dp[i]=max(dp[i−2]+nums[i],dp[i−1])

边界条件为：
dp[0]=nums[0]
dp[1]=max(nums[0],nums[1])
只有一间房屋，则偷窃该房屋
只有两间房屋，选择其中金额较高的房屋进行偷窃
​	
最终的答案即为dp[n−1]，其中 nn 是数组的长度。

就两种思路，从前往后推导或从后往前推导
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
	//时间O(n) 空间O(1)
	let len = nums.length
	if(len<=0) {
		return 0
	}else if(len == 1) {
		return nums[0]
	}else if(len == 2) {
		return Math.max(nums[0], nums[1])
	}
	let dp = [nums[0], Math.max(nums[0], nums[1])]
	for(let i = 2; i<len; i++) {
		//当前家偷的话 跟  不偷的话
		dp[i] = Math.max(nums[i]+dp[i-2], dp[i-1])
	}
	return dp[len-1]
};
console.log('rob:', rob([1,2,3,1]))

/**
199. 二叉树的右视图
给定一棵二叉树，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

示例:
输入: [1,2,3,null,5,null,4]
输出: [1, 3, 4]
解释:

   1            <---
 /   \
2     3         <---
 \     \
  5     4       <---
**/

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function(root) {
	let res = []
	//先续遍历
	let backTrack = function(node, i) {
		if(!node) {
			return
		}
		res[i] = node.val
		backTrack(node.left, i+1)
		backTrack(node.right, i+1)
	}
	backTrack(root, 0)
	return res
};
let n_1 = new TreeNode(1)
let n_2 = new TreeNode(2)
let n_3 = new TreeNode(3)
let n_4 = new TreeNode(4)
let n_5 = new TreeNode(5)
n_1.left = n_2
n_1.right = n_3
n_2.right = n_5
n_3.right = n_4
console.log('rightSideView:', rightSideView(n_1))

/**
200. 岛屿数量
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
岛屿总是被水包围，并且每座岛屿只能由水平方向或竖直方向上相邻的陆地连接形成。
此外，你可以假设该网格的四条边均被水包围。

示例 1:

输入:
[
['1','1','1','1','0'],
['1','1','0','1','0'],
['1','1','0','0','0'],
['0','0','0','0','0']
]
输出: 1
示例 2:

输入:
[
['1','1','0','0','0'],
['1','1','0','0','0'],
['0','0','1','0','0'],
['0','0','0','1','1']
]
输出: 3

解释: 每座岛屿只能由水平和/或竖直方向上相邻的陆地连接而成。
我们可以将二维网格看成一个无向图，竖直或水平相邻的 11 之间有边相连。
为了求出岛屿的数量，我们可以扫描整个二维网格。如果一个位置为 11，则以其为起始节点开始进行深度优先搜索。在深度优先搜索的过程中，每个搜索到的 11 都会被重新标记为 00。
最终岛屿的数量就是我们进行深度优先搜索的次数。
**/
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {
	//深度优先遍历 时间复杂度O(M*N)
	if(grid.length<=0) {
		return 0
	}
	let row = grid.length
	let col = grid[0].length
	let dfs = function(i, j) {
		if(i<0 || j<0 || i>=row || j>=col || grid[i][j]=='0') {
			return
		}
		grid[i][j] = '0'
		dfs(i-1, j)
		dfs(i+1, j)
		dfs(i, j-1)
		dfs(i, j+1)
	}
	let landNum = 0
	for(let i = 0; i<grid.length; i++) {
		for(let j = 0; j<grid[0].length; j++) {
			if(grid[i][j] == '1') {
				landNum++
				dfs(i, j)
			}
		}
	}
	return landNum
};
let grid = [
['1','1','0','0','0'],
['1','1','0','0','0'],
['0','0','1','0','0'],
['0','0','0','1','1']
]
console.log('numIslands:', numIslands(grid))

/**
201. 数字范围按位与
给定范围 [m, n]，其中 0 <= m <= n <= 2147483647，返回此范围内所有数字的按位与（包含 m, n 两端点）。

示例 1: 

输入: [5,7]
输出: 4
示例 2:

输入: [0,1]
输出: 0
**/
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var rangeBitwiseAnd = function(m, n) {
	let res = m
	for(let i = m+1; i<=n; i++) {
		res = res&i
	}
	return res
};
var rangeBitwiseAnd2 = function(m, n) {
	//找公共前缀
	if(m == 0) {
		return 0
	}
	let n1 = parseInt(Math.log(m)/Math.log(2))
	let n2 = parseInt(Math.log(n)/Math.log(2))
	n1 = Math.min(n1, n2)
	return 1<<n1
};
var rangeBitwiseAnd3 = function(m, n) {
	let num = 0
	while(m<n) {
		m = m>>1
		n = n>>1
		num++
	}
	return m<<num
}
console.log('rangeBitwiseAnd:', rangeBitwiseAnd3(1, 2))

/**
202. 快乐数
编写一个算法来判断一个数 n 是不是快乐数。
「快乐数」定义为：对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和，然后重复这个过程直到这个数变为 1，也可能是 无限循环 但始终变不到 1。如果 可以变为  1，那么这个数就是快乐数。
如果 n 是快乐数就返回 True ；不是，则返回 False 。

示例：

输入：19
输出：true
解释：
12 + 92 = 82
82 + 22 = 68
62 + 82 = 100
12 + 02 + 02 = 1

思路
方法一、用map实现，发现相同值，则为循环的，发现1则为快乐值

方法二、快慢指针
**/
/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {
    let getNext = function(num) {
    	//下一个数字
    	let res = 0
    	while(num>0) {
    		res+=Math.pow(num%10, 2)
    		num = parseInt(num/10)
    	}
    	return res
    }
    let slow = n
    let fast = getNext(getNext(n))
    while(slow!=fast && fast!=1) {
    	slow = getNext(slow)
    	fast = getNext(fast)
    	fast = getNext(fast)
    }
    return fast == 1
};
console.log('isHappy:', isHappy(9))

/**
203. 移除链表元素
删除链表中等于给定值 val 的所有节点。

示例:

输入: 1->2->6->3->4->5->6, val = 6
输出: 1->2->3->4->5
**/
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function(head, val) {
	if(!head) {
		return null
	}
	while(head&&head.val == val){
		let next = head.next
		head.next = null
		head = next
	}
	if(!head) {
		return null
	}
	let node = head
	while(node && node.next) {
		if(node.next.val == val) {
			//删除node.next
			let next = node.next
			node.next = next.next
			next.next = null
		}else{
			node = node.next
		}
	}

	return head
};
/**
204. 计数质数
统计所有小于非负整数 n 的质数的数量。

示例:
输入: 10
输出: 4
解释: 小于 10 的质数一共有 4 个, 它们是 2, 3, 5, 7 。
**/
/**
 * @param {number} n
 * @return {number}
 */
var countPrimes = function(n) {
	//找质数的个数
	let isPrime = []
	for(let i = 0; i<n; i++) {
		isPrime[i] = true
	}
	for(let i = 2; i*i<n; i++) {//注意边界条件
		for(let j = i*i; j<n; j+=i) {//注意边界条件
			isPrime[j] = false
		}
	}
	let count = 0
	for(let i = 2; i<n; i++) {
		if(isPrime[i]) {
			count++
		}
	}
	return count
};
console.log('countPrimes:', countPrimes(10))
/**
205. 同构字符串
给定两个字符串 s 和 t，判断它们是否是同构的。
如果 s 中的字符可以被替换得到 t ，那么这两个字符串是同构的。
所有出现的字符都必须用另一个字符替换，同时保留字符的顺序。两个字符不能映射到同一个字符上，但字符可以映射自己本身。

示例 1:
输入: s = "egg", t = "add"
输出: true

示例 2:
输入: s = "foo", t = "bar"
输出: false

示例 3:
输入: s = "paper", t = "title"
输出: true
说明:
你可以假设 s 和 t 具有相同的长度。
**/
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isIsomorphic = function(s, t) {
    let len = s.length
    let getMap = function(str) {
    	let map = {}
    	for(let i = 0; i<str.length; i++) {
    		map[str[i]] = map[str[i]] || ''+'_'+i
    	}
    	return map
    }
    let map1 = getMap(s)
    let map2 = getMap(t)

    for(let i = 0; i<len; i++) {
    	if(map1[s[i]]!=map2[t[i]]) {
    		return false
    	}
    }
    return true
};
console.log('isIsomorphic:', isIsomorphic('egg', 'add'))
console.log('isIsomorphic:', isIsomorphic('egg', 'ada'))

/**
206. 反转链表
反转一个单链表。

示例:

输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
进阶:
你可以迭代或递归地反转链表。你能否用两种方法解决这道题？
**/
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList1 = function(head) {
	//用迭代实现
	if(!head) {
		return null
	}
	let node = null
	let backTrack = function(prew, now) {
		if(!now) {
			node = prew
			return
		}
		let next = now.next
		now.next = prew
		prew = now
		now = next
		backTrack(prew, now)
	}
	head.next = null
	return node
};
var reverseList = function(head) {
	if(head == null || head.next == null) {
		return head
	}
	let p = reverseList(head.next)
	head.next.next = head
	head.next = null
	return p
}

/**
207. 课程表
你这个学期必须选修 numCourse 门课程，记为 0 到 numCourse-1 。
在选修某些课程之前需要一些先修课程。 例如，想要学习课程 0 ，你需要先完成课程 1 ，我们用一个匹配来表示他们：[0,1]
给定课程总量以及它们的先决条件，请你判断是否可能完成所有课程的学习？
 
示例 1:
输入: 2, [[1,0]] 
输出: true
解释: 总共有 2 门课程。学习课程 1 之前，你需要完成课程 0。所以这是可能的。

示例 2:
输入: 2, [[1,0],[0,1]]
输出: false
解释: 总共有 2 门课程。学习课程 1 之前，你需要先完成​课程 0；并且学习课程 0 之前，你还应先完成课程 1。这是不可能的。

分析
	给定一个包含 n 个节点的有向图 G，我们给出它的节点编号的一种排列，如果满足：
对于图 G 中的任意一条有向边 (u, v)，u 在排列中都出现在 v 的前面。
那么称该排列是图 G 的「拓扑排序」。

思路
先生成所有的有向边edges

深度优先
我们将当前搜索的节点 uu 标记为「搜索中」，遍历该节点的每一个相邻节点 vv：

如果 vv 为「未搜索」，那么我们开始搜索 vv，待搜索完成回溯到 uu；
如果 vv 为「搜索中」，那么我们就找到了图中的一个环，因此是不存在拓扑排序的；
如果 vv 为「已完成」，那么说明 vv 已经在栈中了，而 uu 还不在栈中，因此 uu 无论何时入栈都不会影响到 (u, v)(u,v) 之前的拓扑关系，以及不用进行任何操作。
当 uu 的所有相邻节点都为「已完成」时，我们将 uu 放入栈中，并将其标记为「已完成」。

在整个深度优先搜索的过程结束后，如果我们没有找到图中的环，那么栈中存储这所有的 nn 个节点，从栈顶到栈底的顺序即为一种拓扑排序。


广度优先
在广度优先搜索的每一步中，我们取出队首的节点 uu：

我们将 uu 放入答案中；
我们移除 uu 的所有出边，也就是将 uu 的所有相邻节点的入度减少 11。如果某个相邻节点 vv 的入度变为 00，那么我们就将 vv 放入队列中。

在广度优先搜索的过程结束后。如果答案中包含了这 nn 个节点，那么我们就找到了一种拓扑排序，否则说明图中存在环，也就不存在拓扑排序了。
**/
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
	//深度遍历
	let edges = []//所有的边
	for(let i = 0; i<prerequisites.length; i++) {
		edges[prerequisites[i][1]] = edges[prerequisites[i][1]] || []
		edges[prerequisites[i][1]].push(prerequisites[i][0])//先完成后边才能做前边，后边优先级高
	}
	let visited = []
	let valid = true//合法，没有环
	let dfs = function(idx) {
		visited[idx] = 1
		let points = edges[idx]
		if(!points) {
			visited[idx] = 2
			return
		}
		for(let i = 0; i<points.length; i++) {
			if(!visited[points[i]]) {
				dfs(points[i])
				if(!valid) {
					return
				}
			}else if(visited[points[i]] == 1){
				valid = false
			}
		}
		visited[idx] = 2
	}
	for(let i = 0; i<numCourses; i++) {
		if(!visited[i]) {
			dfs(i)
		}
	}
	return valid
};
var canFinish2 = function(numCourses, prerequisites) {
	//广度优先（正向思路  比较常用）
	let edges = []//边
	let indeg = []//入向的数量
	for(let i = 0; i<prerequisites.length; i++) {
		edges[prerequisites[1]] = edges[prerequisites[1]] || []
		edges[prerequisites[1]].push(prerequisites[0])
		indeg[prerequisites[0]] = indeg[prerequisites[0]]?indeg[prerequisites[0]]+1:1
	}
	let visitedNum = 0//访问的节点数量
	let pop = []//队列
	for(let i = 0; i<numCourses; i++) {
		if(!indeg[i]) {
			pop.push(i)
		}
	}
	while(pop.length>0) {
		visitedNum++
		let u = pop.pop()
		let points = edges[u]||[]
		for(let i = 0; i<points.length; i++) {
			indeg[points[i]] = indeg[points[i]] - 1
			if(indeg[points[i]] == 0) {
				pop.push(points[i])
			}
		}
	}
	return visitedNum == numCourses
}
let prerequisites = [[1,0],[0,1]]
let numCourses = 2
prerequisites = [[1,0]]
console.log('canFinish:', canFinish2(numCourses, prerequisites))

/**
208. 实现 Trie (前缀树)
实现一个 Trie (前缀树)，包含 insert, search, 和 startsWith 这三个操作。

示例:

Trie trie = new Trie();

trie.insert("apple");
trie.search("apple");   // 返回 true
trie.search("app");     // 返回 false
trie.startsWith("app"); // 返回 true
trie.insert("app");   
trie.search("app");     // 返回 true
说明:

你可以假设所有的输入都是由小写字母 a-z 构成的。
保证所有输入均为非空字符串。

前缀树
应用
Trie (发音为 "try") 或前缀树是一种树数据结构，用于检索字符串数据集中的键。这一高效的数据结构有多种应用：
1. 自动补全
2. 拼写检查
3. IP 路由 (最长前缀匹配)
4. T9 (九宫格) 打字预测
5. 单词游戏

基本性质
1，根节点不包含字符，除根节点意外每个节点只包含一个字符。
2，从根节点到某一个节点，路径上经过的字符连接起来，为该节点对应的字符串。
3，每个节点的所有子节点包含的字符串不相同。
**/
class TrieNode{
	constructor() {
		this.links = []//子节点 数组
		this.isEnd = false//是否是终结点（能组成单词）
		this.R = 'a'.charCodeAt(0)
	}

	getKey(k) {
		return this.links[k.charCodeAt(0)-this.R]
	}
	putKey(k, node) {
		this.links[k.charCodeAt(0)-this.R] = node
	}

}
/**
 * Initialize your data structure here.
 */
var Trie = function() {
	this.root = new TrieNode()
};

/**
 * Inserts a word into the trie. 
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function(word) {
	let root = this.root
	for(let i = 0; i<word.length; i++) {
		let node = root.getKey(word[i])
		if(node){
			root = node
		}else {
			let n = new TrieNode()
			root.putKey(word[i], n)
			root = n
		}
	}
	root.isEnd = true
};

/**
 * Returns if the word is in the trie. 
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function(word) {
	let root = this.root
	for(let i = 0; i<word.length; i++) {
		let node = root.getKey(word[i])
		if(!node) {
			return false
		}
		root = node
	}
	return root.isEnd
};

/**
 * Returns if there is any word in the trie that starts with the given prefix. 
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function(prefix) {
	let root = this.root
	for(let i = 0; i<prefix.length; i++) {
		let node = root.getKey(prefix[i])
		if(!node) {
			return false
		}
		root = node
	}
	return true
};

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */

 var obj = new Trie()
 obj.insert('word')
 var param_2 = obj.search('word')
 var param_3 = obj.startsWith('wor')
 console.log('Trie:', param_2, param_3)

 /**
 209. 长度最小的子数组
给定一个含有 n 个正整数的数组和一个正整数 s ，找出该数组中满足其和 ≥ s 的长度最小的 连续 子数组，并返回其长度。如果不存在符合条件的子数组，返回 0。
 
示例：
输入：s = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的长度最小的子数组。

进阶：
如果你已经完成了 O(n) 时间复杂度的解法, 请尝试 O(n log n) 时间复杂度的解法。

方法：二分法 时间复杂度O(n*logn) 空间复杂度O(n)
适合都是正数的

方法：双指针法 时间复杂度O(n), 空间复杂度O(1)
 **/
 /**
 * @param {number} s
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function(s, nums) {
	if(nums.length<=0) {
		return 0
	}
	let sums = [nums[0]]
	for(let i = 1; i<nums.length; i++) {
		sums[i] = sums[i-1]+nums[i]
	}
	let lowerBound = function(target) {
		//>=target的最小值
		let l = 0, r = sums.length-1
		while(l<r) {
			let mid = parseInt((l+r)/2)
			if(sums[mid]<target) {
				l = mid+1
			}else {
				r = mid
			}
		}
		return sums[l]<target?-1:l
	}
	let ans = Number.MAX_VALUE
	for(let i = 0; i<sums.length; i++) {
		let target = s+sums[i]
		let bound = lowerBound(target)
		if(bound>=0) {
			ans = Math.min(ans, bound-i)
		}
	}
	return ans == Math.MAX_VALUE?0:ans;
};
var minSubArrayLen2 = function(s, nums) {
	//双指针法
	if(nums.length<=0) {
		return 0
	}
	let start = end = 0//记录开始，结束位置
	let sum = 0 //开始到结束的总和
	let res = Number.MAX_VALUE
	while(end<nums.length) {
		//end
		sum+=nums[end]
		while(sum>=s) {
			//start
			res = Math.min(res, end-start+1)
			sum-=nums[start]
			start++
		}
		end++
	}
	return res == Number.MAX_VALUE? 0: res
}
console.log('minSubArrayLen:', minSubArrayLen2(7, [2,3,1,2,4,3]))

/**
210. 课程表 II
现在你总共有 n 门课需要选，记为 0 到 n-1。
在选修某些课程之前需要一些先修课程。 例如，想要学习课程 0 ，你需要先完成课程 1 ，我们用一个匹配来表示他们: [0,1]
给定课程总量以及它们的先决条件，返回你为了学完所有课程所安排的学习顺序。
可能会有多个正确的顺序，你只要返回一种就可以了。如果不可能完成所有课程，返回一个空数组。

示例 1:
输入: 2, [[1,0]] 
输出: [0,1]
解释: 总共有 2 门课程。要学习课程 1，你需要先完成课程 0。因此，正确的课程顺序为 [0,1] 。

示例 2:
输入: 4, [[1,0],[2,0],[3,1],[3,2]]
输出: [0,1,2,3] or [0,2,1,3]
解释: 总共有 4 门课程。要学习课程 3，你应该先完成课程 1 和课程 2。并且课程 1 和课程 2 都应该排在课程 0 之后。
     因此，一个正确的课程顺序是 [0,1,2,3] 。另一个正确的排序是 [0,2,1,3] 。

说明:
输入的先决条件是由边缘列表表示的图形，而不是邻接矩阵。详情请参见图的表示法。
你可以假定输入的先决条件中没有重复的边。

提示:
这个问题相当于查找一个循环是否存在于有向图中。如果存在循环，则不存在拓扑排序，因此不可能选取所有课程进行学习。
通过 DFS 进行拓扑排序 - 一个关于Coursera的精彩视频教程（21分钟），介绍拓扑排序的基本概念。
拓扑排序也可以通过 BFS 完成。
**/
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
var findOrder = function(numCourses, prerequisites) {
	//广度优先遍历
	let edges = []//边
	let indeg = []//入向的数量
	for(let i = 0; i<prerequisites.length; i++) {
		let first = prerequisites[i][1]
		let second = prerequisites[i][0]
		edges[first] = edges[first] || []
		edges[first].push(second)
		indeg[second] = indeg[second] || 0
		indeg[second]++
	}
	//找到入向为0的初始点
	let popup = []
	for(let i = 0; i<numCourses; i++) {
		if(!indeg[i]) {
			popup.push(i)
		}
	}
	let visitedNum = 0
	let res = []
	while(popup.length>0) {
		let node = popup.pop()
		visitedNum++
		res.push(node)
		let nodes = edges[node] || []
		for(let i = 0; i<nodes.length; i++) {
			indeg[nodes[i]] = indeg[nodes[i]] - 1
			if(indeg[nodes[i]] == 0) {
				popup.push(nodes[i])
			}
		}
	}
	if(visitedNum == numCourses) {
		return res
	}
	return []
};

console.log('findOrder:', findOrder(4, [[1,0],[2,0],[3,1],[3,2]]))
console.log('findOrder:', findOrder(2, [[1,0]]))

/**
211. 添加与搜索单词 - 数据结构设计
如果数据结构中有任何与word匹配的字符串，则bool search（word）返回true，否则返回false。 单词可能包含点“。” 点可以与任何字母匹配的地方。
请你设计一个数据结构，支持 添加新单词 和 查找字符串是否与任何先前添加的字符串匹配 。
实现词典类 WordDictionary ：

WordDictionary() 初始化词典对象
void addWord(word) 将 word 添加到数据结构中，之后可以对它进行匹配
bool search(word) 如果数据结构中存在字符串与 word 匹配，则返回 true ；否则，返回  false 。word 中可能包含一些 '.' ，每个 . 都可以表示任何一个字母。

示例：

输入：
["WordDictionary","addWord","addWord","addWord","search","search","search","search"]
[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]
输出：
[null,null,null,null,false,true,true,true]

解释：
WordDictionary wordDictionary = new WordDictionary();
wordDictionary.addWord("bad");
wordDictionary.addWord("dad");
wordDictionary.addWord("mad");
wordDictionary.search("pad"); // return False
wordDictionary.search("bad"); // return True
wordDictionary.search(".ad"); // return True
wordDictionary.search("b.."); // return True
 

提示：

1 <= word.length <= 500
addWord 中的 word 由小写英文字母组成
search 中的 word 由 '.' 或小写英文字母组成
最调用多 50000 次 addWord 和 search

分析
用Trie前缀树实现，遇到通配符用递归去遍历
**/
/**
 * Initialize your data structure here.
 */
var WordDictionary = function() {
	this.next = []//26个范围
	this.isWord = false//是否组成单词

	this.R = 'a'.charCodeAt('0')
};

/**
 * Adds a word into the data structure. 
 * @param {string} word
 * @return {void}
 */
WordDictionary.prototype.addWord = function(word) {
	let node = this
	for(let i = 0; i<word.length; i++) {
		let idx = word[i].charCodeAt(0)-this.R
		if(node.next[idx]) {
			node = node.next[idx]
		}else {
			node.next[idx] = new WordDictionary()
			node = node.next[idx]
		}
	}
	node.isWord = true
};

/**
 * Returns if the word is in the data structure. A word could contain the dot character '.' to represent any one letter. 
 * @param {string} word
 * @return {boolean}
 */
WordDictionary.prototype.search = function(word) {
	let R = this.R
	let match = function(node, start) {
		if(start >= word.length) {
			return node.isWord
		}
		let c = word[start]
		if(c == '.') {
			for(let i = 0; i<26; i++) {
				if(node.next[i] && match(node.next[i], start+1)) {
					return true
				}
			}
			return false
		}else {
			let idx = word[start].charCodeAt(0)-R
			if(node.next[idx]){
				return match(node.next[idx], start+1)
			}else {
				return false
			}
		}
	}
	return match(this, 0)

};

/**
 * Your WordDictionary object will be instantiated and called as such:
 * var obj = new WordDictionary()
 * obj.addWord(word)
 * var param_2 = obj.search(word)
 */
console.log('WordDictionary:')
let wordDictionary = new WordDictionary();
wordDictionary.addWord("bad");
wordDictionary.addWord("dad");
wordDictionary.addWord("mad");
let res1;
res1 = wordDictionary.search("pad"); // return False
console.log(res1)
res1 = wordDictionary.search("bad"); // return True
console.log(res1)
res1 = wordDictionary.search(".ad"); // return True
console.log(res1)
res1 = wordDictionary.search("b.."); // return True
console.log(res1)

/**
212. 单词搜索 II
给定一个二维网格 board 和一个字典中的单词列表 words，找出所有同时在二维网格和字典中出现的单词。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母在一个单词中不允许被重复使用。

示例:

输入: 
words = ["oath","pea","eat","rain"] and board =
[
  ['o','a','a','n'],
  ['e','t','a','e'],
  ['i','h','k','r'],
  ['i','f','l','v']
]

输出: ["eat","oath"]
说明:
你可以假设所有输入都由小写字母 a-z 组成。

提示:

你需要优化回溯算法以通过更大数据量的测试。你能否早点停止回溯？
如果当前单词不存在于所有单词的前缀中，则可以立即停止回溯。什么样的数据结构可以有效地执行这样的操作？散列表是否可行？为什么？ 前缀树如何？如果你想学习如何实现一个基本的前缀树，请先查看这个问题： 实现Trie（前缀树）。

思路
把字典中的的单词放入前缀树
遍历网格中的单词，回溯查找是否在前缀树种
**/

/**
 * @param {character[][]} board
 * @param {string[]} words
 * @return {string[]}
 */
 class Trie212 {
 	constructor() {
 		this.next = {}
 		this.word = null
 	}
 	add(word) {
 		let node = this
 		for(let i = 0; i<word.length; i++) {
 			if(node.next[word[i]]) {
 				node = node.next[word[i]]
 			}else {
 				node.next[word[i]] = new Trie212()
 				node = node.next[word[i]]
 			}
 		}
 		node.word = word
 	}
 }
var findWords = function(board, words) {
	let res = []
	let trie = new Trie212()
	for(let i = 0; i<words.length; i++) {
		trie.add(words[i])
	}
	let backTrackSearch = function(row, col, node) {
		let c = board[row][col]
		let currNode = node.next[c]
		if(currNode.word) {
			res.push(currNode.word)
			currNode.word = null
		}
		board[row][col] = '#'
		let dir = [[0, -1], [0, 1], [-1, 0], [1, 0]]
		for(let i = 0; i<dir.length; i++) {
			let x = row+dir[i][0]
			let y = col+dir[i][1]
			if(x>=0&&x<board.length&&y>=0&&y<board[0].length) {
				if(currNode.next[board[x][y]]) {
					backTrackSearch(x, y, currNode)
				}
			}
		}
		board[row][col] = c

		if(Object.keys(currNode.next).length<=0) {
			//剪枝
			delete node.next[c]
		}
	}
	for(let i = 0; i<board.length; i++) {
		for(let j = 0; j<board[0].length; j++) {
			if(trie.next[board[i][j]]) {
				backTrackSearch(i,j,trie)
			}
		}
	}
	return res
};
var words = ["oath","pea","eat","rain"]
board =
[
  ['o','a','a','n'],
  ['e','t','a','e'],
  ['i','h','k','r'],
  ['i','f','l','v']
]
console.log('findWords:', findWords(board, words))

/**
213. 打家劫舍 II
你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。这个地方所有的房屋都围成一圈，这意味着第一个房屋和最后一个房屋是紧挨着的。同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
给定一个代表每个房屋存放金额的非负整数数组，计算你在不触动警报装置的情况下，能够偷窃到的最高金额。

示例 1:

输入: [2,3,2]
输出: 3
解释: 你不能先偷窃 1 号房屋（金额 = 2），然后偷窃 3 号房屋（金额 = 2）, 因为他们是相邻的。
示例 2:

输入: [1,2,3,1]
输出: 4
解释: 你可以先偷窃 1 号房屋（金额 = 1），然后偷窃 3 号房屋（金额 = 3）。
     偷窃到的最高金额 = 1 + 3 = 4 。

分析  198的变种
环状排列意味着第一个房子和最后一个房子中只能选择一个偷窃，因此可以把此环状排列房间问题约化为两个单排排列房间子问题：
在不偷窃第一个房子的情况下（即 nums[1:]），最大金额是p1
在不偷窃最后一个房子的情况下（即 nums[:n-1]），最大金额是p 2

**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
	let len = nums.length
	if(len<=0) {
		return 0
	}else if(len == 1) {
		return nums[0]
	}else if(len == 2) {
		return Math.max(nums[0], nums[1])
	}
	//大于2
	let res = 0
	//不偷最后一个
	let dp = [nums[0], Math.max(nums[0], nums[1])]
	for(let i = 2; i<len-1; i++){
		dp[i] = Math.max(dp[i-2]+nums[i], dp[i-1])
	}
	res = dp[len-2]
	//不偷第一个
	if(len==3) {
		res = Math.max(res, Math.max(nums[1], nums[2]))
	}else {
		dp = [0, nums[1], Math.max(nums[1], nums[2])]
		for(let i = 3; i<len; i++) {
			dp[i] = Math.max(dp[i-2]+nums[i], dp[i-1])
		}
		res = Math.max(res, dp[len-1])
	}
	return res
};
console.log('rob:', rob([2,3,2]))
console.log('rob:', rob([1,2,3,1]))

/**
214. 最短回文串
给定一个字符串 s，你可以通过在字符串前面添加字符将其转换为回文串。找到并返回可以用这种方式转换的最短回文串。

示例 1:
输入: "aacecaaa"
输出: "aaacecaaa"

示例 2:
输入: "abcd"
输出: "dcbabcd"

思路：
找中间字符作为起点，向左遍历是否为回文，
知道遍历到第0个
**/
/**
 * @param {string} s
 * @return {string}
 */
var shortestPalindrome = function(s) {
	let len = s.length
	if(len<=1) {
		return s
	}
	let checkPalindrome = function(idx) {
		//检查以idx为中点的字符串
		let ext = ''
		let ext2 = ''
		let left = idx-1
		let right = idx+1
		while(right<len) {
			if(left<0) {
				ext = s[right]+ext
			}else if(s[left]!=s[right]) {
				ext = null
				break
			}
			left--
			right++
		}
		if(idx+1<=len/2) {
			left = idx
			right = idx+1
			while(right<len) {
				if(left<0) {
					ext2 = s[right]+ext2
				}else if(s[left]!=s[right]) {
					ext2 = null
					break
				}
				left--
				right++
			}
		}else {
			ext2 = null
		}
		if(ext === null && ext2 === null ) {
			return ''
		}else if(ext !== null && ext2 !== null) {
			return (ext.length<ext2.length?ext+s: ext2+s)
		}else {
			return ext===null?ext2+s:ext+s
		}
	}
	let start = Math.floor(len/2)+len%2-1
	for(let i = start; i>=0; i--) {
		let res = checkPalindrome(i)
		if(res.length>0) {
			return res
		}
	}
};

var shortestPalindrome2 = function(s) {
	//方法二
	/**
	abbacd
	原s: abbacd, 长度记为 n
	逆r: dcabba, 长度记为 n

	判断 s[0,n) 和 r[0,n)
	abbacd != dcabba

	判断 s[0,n - 1) 和 r[1,n)
	abbac != cabba  

	判断 s[0,n - 2) 和 r[2,n)
	abba == abba  
	**/
	let len = s.length
	let r = s.split('').reverse().join('')
	let pos = 0
	for(let i = 0; i<len; i++) {
		if(s.substring(0, len-i) == r.substring(i, len)) {
			pos = i
			break
		}
	}
	return r.substring(0, pos)+s

}

console.log('shortestPalindrome:', shortestPalindrome2('aacecaaa'))
console.log('shortestPalindrome:', shortestPalindrome2('abcd'))
console.log('shortestPalindrome:', shortestPalindrome2('aba'))
console.log('shortestPalindrome:', shortestPalindrome2("abbacd"))//"dcabbacd"

/**
215. 数组中的第K个最大元素
在未排序的数组中找到第 k 个最大的元素。请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

示例 1:
输入: [3,2,1,5,6,4] 和 k = 2
输出: 5

示例 2:
输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
输出: 4
说明:

你可以假设 k 总是有效的，且 1 ≤ k ≤ 数组的长度。

方法一
快速排序
因此我们可以改进快速排序算法来解决这个问题：在分解的过程当中，我们会对子数组进行划分，如果划分得到的 q 正好就是我们需要的下标，就直接返回 a[q]；
否则，如果 q 比目标下标小，就递归右子区间，否则递归左子区间。这样就可以把原来递归两个区间变成只递归一个区间，提高了时间效率。
这就是「快速选择」算法。

我们知道快速排序的性能和「划分」出的子数组的长度密切相关。
直观地理解如果每次规模为 n 的问题我们都划分成 1 和 n - 1，每次递归的时候又向 n−1 的集合中递归，这种情况是最坏的，时间代价是 O(n ^ 2)。
我们可以引入随机化来加速这个过程，它的时间代价的期望是 O(n)，证明过程可以参考「《算法导论》9.2：期望为线性的选择算法」。

时间复杂度：O(n)，如上文所述，证明过程可以参考「《算法导论》9.2：期望为线性的选择算法」。
空间复杂度：O(logn)，递归使用栈空间的空间代价的期望为 O(logn)。
**/

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
	//找到第k大的数
	k = k-1
	let swap = function(l,r) {
		let temp = nums[l]
		nums[l] = nums[r]
		nums[r] = temp
	}
	let randomRange = function(l,r){
		let value = Math.floor(Math.random()*(r-l))+l
		swap(l, value)
		return value
	}
	let quickFind = function(l, r) {
		//从大到小排序
		randomRange(l, r)
		let i = l, j = r, x = nums[l]
		while(i<j) {
			//从右边找到>x的值
			while(i<j && nums[j]<=x) {
				j--
			}
			if(i<j) {
				nums[i++] = nums[j]
			}
			//从左边找到<x的值
			while(i<j && nums[i]>=x){
				i++
			}
			if(i<j) {
				nums[j--] = nums[i]
			}
		}
		nums[i] = x
		if(i == k) {
			return nums[i]
		}else if(k<i) {
			return quickFind(l, i-1)
		}else {
			return quickFind(i+1, r)
		}
	}
	return quickFind(0, nums.length-1)
};
class HeapSort {
 	constructor(arr) {
 		this.arr = arr
 	}
 	buildHeap() {
 		for(let i = parseInt(this.arr.length/2)-1; i>=0; i--){
 			////从第一个非叶子结点从下至上，从右至左调整结构
 			this.adjustHeap(i, this.arr.length)
 		}
 	}
 	sort() {
 		//排序
 		this.buildHeap()
 		for(let i = this.arr.length-1; i>=0; i--) {
 			this._swap(0, i)
 			this.adjustHeap(0, i)
 		}
 	}
 	adjustHeap(i, len) {
 		//重新调整堆 i为开始调整的节点 len为要调整的堆的长度
 		for(let k = 2*i+1; k<len; k = 2*k+1) {
 			//遍历子节点调整
 			if(k+1<len && this.arr[k+1]>this.arr[k]){
 				k++
 			}
 			if(this.arr[k]>this.arr[i]) {
 				this._swap(i, k)
 				i = k
 			}else{
 				break
 			}
 		}
 	}
 	findKthLargest(k) {
 		//找到第k大的数
 		this.buildHeap()
 		for(let i = this.arr.length-1; i>=this.arr.length-k+1; i--) {
 			this._swap(0, i)
 			this.adjustHeap(0, i)
 		}
 		return this.arr[0]
 	}
 	_swap(i, j) {
 		let temp = this.arr[i]
 		this.arr[i] = this.arr[j]
 		this.arr[j] = temp
 	}
 }
var findKthLargest2 = function(nums, k) {
	//堆排序 时间复杂度O(nlogn)
	let heapSort = new HeapSort(nums)
	return heapSort.findKthLargest(k)
};

console.log('findKthLargest:', findKthLargest([3,2,3,1,2,4,5,5,6], 4))
console.log('findKthLargest:', findKthLargest([3,2,1,5,6,4], 2))

/**
216. 组合总和 III
找出所有相加之和为 n 的 k 个数的组合。组合中只允许含有 1 - 9 的正整数，并且每种组合中不存在重复的数字。

说明：

所有数字都是正整数。
解集不能包含重复的组合。 
示例 1:

输入: k = 3, n = 7
输出: [[1,2,4]]
示例 2:

输入: k = 3, n = 9
输出: [[1,2,6], [1,3,5], [2,3,4]]
**/
/**
 * @param {number} k
 * @param {number} n
 * @return {number[][]}
 */
var combinationSum3 = function(k, n) {
	//用回溯法试一下
	let res = []
	let oneRes = []
	let backTrack = function(start, idx, sumNum) {
		//start从哪个位置开始，idx总共多少个数  sumNum 总和
		if(idx == k && sumNum == n) {
			let temp = []
			for(let i = 0; i<oneRes.length; i++) {
				temp.push(oneRes[i])
			}
			res.push(temp)
			return
		}
		if(start>9 || idx>k || sumNum>=n) {
			//剪枝
			return
		}
		for(let i = start; i<=9; i++) {
			oneRes.push(i)
			backTrack(i+1, idx+1, sumNum+i)
			oneRes.pop()
		}
	}
	backTrack(1, 0, 0)
	return res
};
console.log('combinationSum3:', combinationSum3(3, 9))
console.log('combinationSum3:', combinationSum3(3, 7))

/**
217. 存在重复元素
给定一个整数数组，判断是否存在重复元素。
如果任意一值在数组中出现至少两次，函数返回 true 。如果数组中每个元素都不相同，则返回 false 。

示例 1:

输入: [1,2,3,1]
输出: true
示例 2:

输入: [1,2,3,4]
输出: false
示例 3:

输入: [1,1,1,3,3,4,3,2,4,2]
输出: true

1、排序
2、字典
**/
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
	let map = {}
	for(let i = 0; i<nums.length; i++) {
		if(map[nums[i]]) {
			return true
		}
		map[nums[i]] = true
	}
	return false
};

/**
219. 存在重复元素 II
给定一个整数数组和一个整数 k，判断数组中是否存在两个不同的索引 i 和 j，使得 nums [i] = nums [j]，并且 i 和 j 的差的 绝对值 至多为 k。

示例 1:
输入: nums = [1,2,3,1], k = 3
输出: true

示例 2:
输入: nums = [1,0,1,1], k = 1
输出: true

示例 3:
输入: nums = [1,2,3,1,2,3], k = 2
输出: false
**/
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var containsNearbyDuplicate = function(nums, k) {
	//用字典实现
	let map = {}
	for(let i = 0; i<nums.length; i++) {
		let arr = map[nums[i]]
		if(arr) {
			if(i-arr[arr.length-1]<=k) {
				return true
			}
			arr.push(i)
		}else {
			map[nums[i]] = [i]
		}
	}
	return false
};
console.log('containsNearbyDuplicate:', containsNearbyDuplicate([1,0,1,1], 1))

/**
220. 存在重复元素 III
在整数数组 nums 中，是否存在两个下标 i 和 j，使得 nums [i] 和 nums [j] 的差的绝对值小于等于 t ，且满足 i 和 j 的差的绝对值也小于等于 ķ 。
如果存在则返回 true，不存在返回 false。

示例 1:

输入: nums = [1,2,3,1], k = 3, t = 0
输出: true
示例 2:

输入: nums = [1,0,1,1], k = 1, t = 2
输出: true
示例 3:

输入: nums = [1,5,9,1,5,9], k = 2, t = 3
输出: false
**/
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} t
 * @return {boolean}
 */
var containsNearbyAlmostDuplicate = function(nums, k, t) {
	//暴力法
	for(let i = 0; i<nums.length; i++) {
		for(let j = i+1; j<Math.min(i+k+1, nums.length); j++) {
			if(Math.abs(nums[i]-nums[j])<=t) {
				return true
			}
		}
	}
	return false
};
console.log('containsNearbyAlmostDuplicate:', containsNearbyAlmostDuplicate([1,0,1,1], 1, 2))
console.log('containsNearbyAlmostDuplicate:', containsNearbyAlmostDuplicate([1,5,9,1,5,9],2,3))

/**
221. 最大正方形
在一个由 0 和 1 组成的二维矩阵内，找到只包含 1 的最大正方形，并返回其面积。

示例:
输入: 
1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0
输出: 4
**/
/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalSquare = function(matrix) {
	//动态规划
	if(matrix.length<=0) {
		return 0
	}
	let dp = []//离当前位置最近的1的数量
	dp[0] = []
	dp[0][0] = parseInt(matrix[0][0])
	let res = dp[0][0]
	for(let i = 1; i<matrix.length; i++) {
		dp[i] = []
		if(matrix[i][0] == '1') {
			dp[i][0] = 1
			res = Math.max(res, dp[i][0])
		}else {
			dp[i][0] = 0
		}
	}
	for(let i = 1; i<matrix[0].length; i++) {
		if(matrix[0][i] == '1') {
			dp[0][i] = 1
			res = Math.max(res, dp[0][i])
		}else {
			dp[0][i] = 0
		}
	}
	for(let i = 1; i<matrix.length; i++) {
		for(let j = 1; j<matrix[0].length; j++) {
			if(matrix[i][j] == '0') {
				dp[i][j] = 0
			}else {
				dp[i][j] = Math.min(Math.min(dp[i-1][j], dp[i][j-1]), dp[i-1][j-1])+1
				res = Math.max(res, dp[i][j])
			}
		}
	}
	return res*res
};
let matrix = 
[
[1, 0, 1, 0, 0],
[1, 0, 1, 1, 1],
[1, 1, 1, 1, 1],
[1, 0, 0, 1, 0],
]
// console.log('maximalSquare:', maximalSquare(matrix))
console.log('maximalSquare:', maximalSquare([["1","1"],["1","1"]]))

/**
222. 完全二叉树的节点个数
给出一个完全二叉树，求出该树的节点个数。

说明：
完全二叉树的定义如下：在完全二叉树中，除了最底层节点可能没填满外，其余每层节点数都达到最大值，并且最下面一层的节点都集中在该层最左边的若干位置。若最底层为第 h 层，则该层包含 1~ 2h 个节点。

示例:
输入: 
    1
   / \
  2   3
 / \  /
4  5 6

输出: 6
**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var countNodes = function(root) {
	//广度优先遍历  时间O(N) 空间O(logN)
	if(root == null) {
		return 0
	}
	let pop = [root] //队列
	let num = 0
	while(pop.length>0) {
		let node = pop.shift()//取第一个   比较耗时
		num ++
		if(node.left) {
			pop.push(node.left)
		}
		if(node.right) {
			pop.push(node.right)
		}
	}
	return num
};
var countNodes2 = function(root) {
	return root == null? 0: 1+countNodes2(root.left)+countNodes2(root.right)
}

/**
223. 矩形面积
在二维平面上计算出两个由直线构成的矩形重叠后形成的总面积。

每个矩形由其左下顶点和右上顶点坐标表示，如图所示。

Rectangle Area

示例:

输入: -3, 0, 3, 4, 0, -1, 9, 2
输出: 45
**/
/**
 * @param {number} A
 * @param {number} B
 * @param {number} C
 * @param {number} D
 * @param {number} E
 * @param {number} F
 * @param {number} G
 * @param {number} H
 * @return {number}
 */
var computeArea = function(A, B, C, D, E, F, G, H) {
	//重叠面积
	let x = Math.min(C, G) - Math.max(A, E)
	let y = Math.min(D, H) - Math.max(B, F)
	let commonArea = 0
	if(x>0 && y>0) {
		commonArea = x*y
	}
	//两个图形面积之和-重叠面积
	return (C-A)*(D-B) + (G-E)*(H-F) - commonArea
};
console.log('computeArea:', computeArea(-3, 0, 3, 4, 0, -1, 9, 2))

/**
224. 基本计算器
实现一个基本的计算器来计算一个简单的字符串表达式的值。
字符串表达式可以包含左括号 ( ，右括号 )，加号 + ，减号 -，非负整数和空格  。

示例 1:
输入: "1 + 1"
输出: 2

示例 2:
输入: " 2-1 + 2 "
输出: 3

示例 3:
输入: "(1+(4+5+2)-3)+(6+8)"
输出: 23

说明：
你可以假设所给定的表达式都是有效的。
请不要使用内置的库函数 eval。
**/
/**
 * @param {string} s
 * @return {number}
 */
var calculate = function(s) {
	//用栈实现，先进后出 O(n)
	let stack = []
	let dealCal = function() {
		if(stack.length<=1) {
			return
		}
		let left = stack.pop()
		let sign = stack.pop()
		if(sign == ')') {
			stack.push(left)
			return
		}
		let right = stack.pop()
		if(sign == '+') {
			stack.push(parseInt(left)+parseInt(right))
		}else {
			stack.push(parseInt(left)-parseInt(right))
		}
		dealCal()
	}
	let str = ''
	for(let i = s.length-1; i>=0; i--) {
		if(s[i] != ' ') {
			if(s[i]>='0' && s[i]<='9') {
				str = s[i]+str
			}else {
				if(str!='') {
					stack.push(str)
					str = ''
				}
				if(s[i] == '('){
					dealCal()
				}else {
					stack.push(s[i])
				}
			}
		}
	}
	if(str!='') {
		stack.push(str)
	}
	dealCal()
	return stack[0]
};
console.log('calculate:', calculate(" 2-1 + 2 "))
console.log('calculate:', calculate("(1+(4+5+2)-3)+(6+8)"))
console.log('calculate:', calculate("1234"))

/**
225. 用队列实现栈
使用队列实现栈的下列操作：

push(x) -- 元素 x 入栈
pop() -- 移除栈顶元素
top() -- 获取栈顶元素
empty() -- 返回栈是否为空
注意:

你只能使用队列的基本操作-- 也就是 push to back, peek/pop from front, size, 和 is empty 这些操作是合法的。
你所使用的语言也许不支持队列。 你可以使用 list 或者 deque（双端队列）来模拟一个队列 , 只要是标准的队列操作即可。
你可以假设所有操作都是有效的（例如, 对一个空的栈不会调用 pop 或者 top 操作）。
**/
/**
 * Initialize your data structure here.
 */
var D_LinkedNode = function(value) {
	this.value = value
	this.prev = null
	this.next = null
}
var MyStack = function() {
	//用双向链表实现
	this.size = 0
	this.root = new D_LinkedNode(-1) //指向最后一个
};

/**
 * Push element x onto stack. 
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function(x) {
	let node = new D_LinkedNode(x)
	this.root.next = node
	node.prev = this.root
	this.root = node
	this.size++
};

/**
 * Removes the element on top of the stack and returns that element.
 * @return {number}
 */
MyStack.prototype.pop = function() {
	if(this.size == 0) {
		return null
	}
	let value = this.root.value
	let prev = this.root.prev
	this.root.prev = null
	prev.next = null
	this.root = prev
	this.size--
	return value
};

/**
 * Get the top element.
 * @return {number}
 */
MyStack.prototype.top = function() {
	if(this.size == 0) {
		return null
	}
	return this.root.value
};

/**
 * Returns whether the stack is empty.
 * @return {boolean}
 */
MyStack.prototype.empty = function() {
	return this.size<=0
};

/**
 * Your MyStack object will be instantiated and called as such:
 * var obj = new MyStack()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.empty()
 */
obj = new MyStack()
obj.push(123)
var param_2 = obj.pop()
var param_3 = obj.top()
var param_4 = obj.empty()
console.log('MyStack:', param_2, param_3, param_4)

/**
226. 翻转二叉树
翻转一棵二叉树。

示例：

输入：

     4
   /   \
  2     7
 / \   / \
1   3 6   9
输出：

     4
   /   \
  7     2
 / \   / \
9   6 3   1
备注:
这个问题是受到 Max Howell 的 原问题 启发的 ：

谷歌：我们90％的工程师使用您编写的软件(Homebrew)，但是您却无法在面试时在白板上写出翻转二叉树这道题，这太糟糕了。
**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
	//左右翻转 递归
	let invert = function(node) {
		if(!node) {
			return
		}
		let left = node.left
		let right = node.right
		if(left || right) {
			node.left = right
			node.right = left
		}
		invertTree(left)
		invertTree(right)
	}
	invert(root)
	return root
};

/**
227. 基本计算器 II
实现一个基本的计算器来计算一个简单的字符串表达式的值。
字符串表达式仅包含非负整数，+， - ，*，/ 四种运算符和空格  。 整数除法仅保留整数部分。

示例 1:
输入: "3+2*2"
输出: 7

示例 2:
输入: " 3/2 "
输出: 1

示例 3:
输入: " 3+5 / 2 "
输出: 5
说明：

你可以假设所给定的表达式都是有效的。
请不要使用内置的库函数 eval。

**/
/**
 * @param {string} s
 * @return {number}
 */
var calculate = function(s) {
	//先算括号再算乘除再算加减  时间复杂度O(N) 空间复杂度O(N)
	let isDigit = function(c) {
		if(c>='0' && c<='9') {
			return true
		}
		return false
	}
	let sumStack = function(stack) {
		let sum = 0
		for(let i = 0; i<stack.length; i++) {
			sum+=stack[i]
		}
		return sum
	}
	let helper = function() {
		//计算总的值
		let stack = []
		let num = 0 //记录当前数字
		let sign = '+' //记录当前符号
		while(s.length>0) {
			let c = s[0]
			s = s.substring(1)
			if(isDigit(c)) {
				num = num*10 + parseInt(c)
			}
			if(c == '(') {
				num = helper()
			}
			if(!isDigit(c)&&c!=' ' || s.length == 0){
				switch(sign){//处理前一个符号
					case '+':
						stack.push(num)
						break
					case '-':
						stack.push(-num)
						break
					case '*':
						stack.push(stack.pop()*num)
						break
					case '/':
						stack.push(parseInt(stack.pop()/num))
				}
				num = 0
				sign = c
			}
			if(c == ')'){
				break
			}
		}
		return sumStack(stack)
	}
	return helper()
};
console.log('calculate:', calculate('3 * (2-6 /(3 -7))'))

/**
292. Nim 游戏
你和你的朋友，两个人一起玩 Nim 游戏：
桌子上有一堆石头。
你们轮流进行自己的回合，你作为先手。
每一回合，轮到的人拿掉 1 - 3 块石头。
拿掉最后一块石头的人就是获胜者。
j假设你们每一步都是最优解。请编写一个函数，来判断你是否可以在给定石头数量为 n 的情况下赢得游戏。如果可以赢，返回 true；否则，返回 false 。 

示例 1：
输入：n = 4
输出：false 
解释：如果堆中有 4 块石头，那么你永远不会赢得比赛；
     因为无论你拿走 1 块、2 块 还是 3 块石头，最后一块石头总是会被你的朋友拿走。

示例 2：
输入：n = 1
输出：true

示例 3：
输入：n = 2
输出：true
 
提示：
1 <= n <= 231 - 1
**/
/**
 * @param {number} n
 * @return {boolean}
 */
var canWinNim = function(n) {
	return n%4!=0
};
/**
295. 数据流的中位数
中位数是有序列表中间的数。如果列表长度是偶数，中位数则是中间两个数的平均值。

例如，

[2,3,4] 的中位数是 3

[2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：

void addNum(int num) - 从数据流中添加一个整数到数据结构中。
double findMedian() - 返回目前所有元素的中位数。
示例：

addNum(1)
addNum(2)
findMedian() -> 1.5
addNum(3) 
findMedian() -> 2
进阶:

如果数据流中所有整数都在 0 到 100 范围内，你将如何优化你的算法？
如果数据流中 99% 的整数都在 0 到 100 范围内，你将如何优化你的算法？

方法1
插入排序
时间复杂度：O(n)O(n)+O(logn)≈O(n).
二分搜索需要花费 O(logn) 时间才能找到正确的插入位置。
插入可能需要花费 O(n) 的时间，因为必须在容器中移动元素为新元素腾出空间。
空间复杂度：O(n) 线性空间，用于在容器中保存输入。
**/
/**
 * initialize your data structure here.
 */
var MedianFinder = function() {
	this.data = []
};

MedianFinder.prototype.binarySearch = function(num) {
	let start = 0, end = this.data.length-1
	while(start<end) {
		let mid = parseInt((start+end)/2)
		if(this.data[mid]<num) {
			start = mid+1
		}else {
			end = mid
		}
	}
	return this.data[start]>=num?start:start+1
}
/** 
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function(num) {
	//二分查找，然后插入
	if(this.data.length<=0) {
		this.data.push(num)
	}else {
		let pos = this.binarySearch(num)
		this.data.splice(pos, 0, num);
	}
};

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function() {
	let len = this.data.length
	let mid = parseInt(len/2)
	if(len%2 == 0) {
		return (this.data[mid]+this.data[mid-1])/2
	}else {
		return this.data[mid]
	}
};

/**
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */
 var obj = new MedianFinder()
 obj.addNum(1)
 obj.addNum(2)
 obj.addNum(3)
 console.log('findMedian:', obj.findMedian())
 /**
 297. 二叉树的序列化与反序列化
序列化是将一个数据结构或者对象转换为连续的比特位的操作，进而可以将转换后的数据存储在一个文件或者内存中，同时也可以通过网络传输到另一个计算机环境，采取相反方式重构得到原数据。
请设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。

示例: 
你可以将以下二叉树：

    1
   / \
  2   3
     / \
    4   5

序列化为 "[1,2,3,null,null,4,5]"
提示: 这与 LeetCode 目前使用的方式一致，详情请参阅 LeetCode 序列化二叉树的格式。你并非必须采取这种方式，你也可以采用其他的方法解决这个问题。

说明: 不要使用类的成员 / 全局 / 静态变量来存储状态，你的序列化和反序列化算法应该是无状态的。
 **/
 /**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
    //广度遍历
    let res = ['[']
    if(!root) {
    	res.push(']')
    	return res.join('')
    }
    let pop = [root]
    while(pop.length>0) {
    	let node = pop.shift()
    	if(node){
    		res.push(node.val)
    		pop.push(node.left)
    		pop.push(node.right)
    	}else {
    		res.push('null')
    	}
    	res.push(',')
    }
    res[res.length-1] = ']'
    return res.join('')
};
/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    data = data.substring(1, data.length-1)
    if(!data) {
    	return null
    }
    let values = data.split(',')
    let createNode = function(value) {
    	if(value == 'null') {
    		return null
    	}else {
    		return new TreeNode(parseInt(value))
    	}
    }
    let root = createNode(values[0])
    let node = root
    let isLeft = true
    let pop = []
    for(let i = 1; i<values.length; i++) {
    	let curr = createNode(values[i])
    	if(isLeft) {
    		node.left = curr
    	}else{
    		node.right = curr
    	}
    	if(curr) {
    		pop.push(curr)
    	}
    	if(!isLeft) {
    		node = pop.shift()
    	}
    	isLeft = !isLeft

    }
    return root
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
 var tN1 = new TreeNode(0)
 var tN2 = new TreeNode(1)
 var tN3 = new TreeNode(2)
 var tN4 = new TreeNode(3)
 tN1.right = tN2
 tN2.right = tN3
 tN3.right = tN4
 var tNValues = serialize(tN1)
 console.log('serialize:', tNValues)
 var tNRoot = deserialize(tNValues)
 console.log('deserialize:', tNRoot, tNRoot.right.right.right)

 /**
 299. 猜数字游戏
你在和朋友一起玩 猜数字（Bulls and Cows）游戏，该游戏规则如下：

你写出一个秘密数字，并请朋友猜这个数字是多少。
朋友每猜测一次，你就会给他一个提示，告诉他的猜测数字中有多少位属于数字和确切位置都猜对了（称为“Bulls”, 公牛），有多少位属于数字猜对了但是位置不对（称为“Cows”, 奶牛）。
朋友根据提示继续猜，直到猜出秘密数字。
请写出一个根据秘密数字和朋友的猜测数返回提示的函数，返回字符串的格式为 xAyB ，x 和 y 都是数字，A 表示公牛，用 B 表示奶牛。

xA 表示有 x 位数字出现在秘密数字中，且位置都与秘密数字一致。
yB 表示有 y 位数字出现在秘密数字中，但位置与秘密数字不一致。
请注意秘密数字和朋友的猜测数都可能含有重复数字，每位数字只能统计一次。

 

示例 1:

输入: secret = "1807", guess = "7810"
输出: "1A3B"
解释: 1 公牛和 3 奶牛。公牛是 8，奶牛是 0, 1 和 7。
示例 2:

输入: secret = "1123", guess = "0111"
输出: "1A1B"
解释: 朋友猜测数中的第一个 1 是公牛，第二个或第三个 1 可被视为奶牛。
 

说明: 你可以假设秘密数字和朋友的猜测数都只包含数字，并且它们的长度永远相等。
 **/
 /**
 * @param {string} secret
 * @param {string} guess
 * @return {string}
 */
var getHint = function(secret, guess) {
	//1监测公牛
	let map = {}
	let numA = 0
	let leftStr = ''
	for(let i = 0; i<guess.length; i++) {
		if(!secret[i]) {
			break;
		}
		if(secret[i] == guess[i]) {
			numA++
		}else {
			map[secret[i]] = map[secret[i]] || 0
			map[secret[i]] = map[secret[i]]+1
			if(guess[i]) {
				leftStr = leftStr+guess[i]
			}
		}
	}
	//2监测母牛
	let numB = 0
	for(let i = 0; i<leftStr.length; i++) {
		if(map[leftStr[i]]) {
			map[leftStr[i]] = map[leftStr[i]]-1
			numB++
		}
	}
	return numA+"A"+numB+"B"
};
var getHint2 = function(secret, guess) {
	//一次遍历
	let numA = 0, numB = 0
	let cache = {}
	for(let i = 0; i<secret.length; i++) {
		let cs = secret[i]
		let cg = guess[i]
		if(cs == cg) {
			numA++
		}else {
			cache[cs] = cache[cs] || 0
			cache[cg] = cache[cg] || 0
			if(cache[cs]++<0) numB++
			if(cache[cg]-->0) numB++
		}
	}
	return numA+"A"+numB+"B"
}
console.log('getHint:', getHint2("1807", "7810"))
console.log('getHint:', getHint2("1123", "0111"))
/**
300. 最长上升子序列
给定一个无序的整数数组，找到其中最长上升子序列的长度。

示例:

输入: [10,9,2,5,3,7,101,18]
输出: 4 
解释: 最长的上升子序列是 [2,3,7,101]，它的长度是 4。
说明:

可能会有多种最长上升子序列的组合，你只需要输出对应的长度即可。
你算法的时间复杂度应该为 O(n2) 。
进阶: 你能将算法的时间复杂度降低到 O(n log n) 吗?
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
	//时间复杂度>O(N2)
	let len = nums.length
	if(len<=1) {
		return len
	}
	let max = 0
	let backTrack = function(idx, num) {
		if(idx>len-1) {
			max = Math.max(max, num)
			return
		}
		//find > now
		let find = false
		for(let i = idx+1; i<len; i++) {
			if(nums[i]>nums[idx]) {
				find = true
				backTrack(i, num+1)
			}
		}
		//没找到
		if(!find) {
			backTrack(len, num)
		}

	}
	for(let i = 0; i<len-1; i++) {
		backTrack(i, 1)
	}
	return max
};
var lengthOfLIS2 = function(nums) {
	//动态规划 O(N2)
	let len = nums.length
	if(len<=1) {
		return len
	}
	let maxLen = 1
	let dp = [1]//第i位最大连续个数
	for(let i = 1; i<len; i++) {
		let max = 0
		for(let j = 0; j<dp.length; j++) {
			if(nums[i]>nums[j]) {
				max = Math.max(max, dp[j])
			}
		}
		dp[i] = max+1
		maxLen = Math.max(maxLen, dp[i])
	}
	return maxLen
}
// console.log('lengthOfLIS:', lengthOfLIS([10,9,2,5,3,7,101,18]))
console.log('lengthOfLIS:', lengthOfLIS2([10,9,2,5,3,4]))
/**
301. 删除无效的括号
删除最小数量的无效括号，使得输入的字符串有效，返回所有可能的结果。

说明: 输入可能包含了除 ( 和 ) 以外的字符。

示例 1:

输入: "()())()"
输出: ["()()()", "(())()"]
示例 2:

输入: "(a)())()"
输出: ["(a)()()", "(a())()"]
示例 3:

输入: ")("
输出: [""]
**/
/**
 * @param {string} s
 * @return {string[]}
 */
var removeInvalidParentheses = function(s) {

};

/**
303. 区域和检索 - 数组不可变
给定一个整数数组  nums，求出数组从索引 i 到 j（i ≤ j）范围内元素的总和，包含 i、j 两点。
实现 NumArray 类：
NumArray(int[] nums) 使用数组 nums 初始化对象
int sumRange(int i, int j) 返回数组 nums 从索引 i 到 j（i ≤ j）范围内元素的总和，包含 i、j 两点（也就是 sum(nums[i], nums[i + 1], ... , nums[j])）

示例：

输入：
["NumArray", "sumRange", "sumRange", "sumRange"]
[[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]]
输出：
[null, 1, -1, -3]

解释：
NumArray numArray = new NumArray([-2, 0, 3, -5, 2, -1]);
numArray.sumRange(0, 2); // return 1 ((-2) + 0 + 3)
numArray.sumRange(2, 5); // return -1 (3 + (-5) + 2 + (-1)) 
numArray.sumRange(0, 5); // return -3 ((-2) + 0 + 3 + (-5) + 2 + (-1))

提示：
0 <= nums.length <= 104
-105 <= nums[i] <= 105
0 <= i <= j < nums.length
最多调用 104 次 sumRange 方法
**/
/**
 * @param {number[]} nums
 */
var NumArray = function(nums) {
	this.data = nums
};

/** 
 * @param {number} i 
 * @param {number} j
 * @return {number}
 */
NumArray.prototype.sumRange = function(i, j) {
	let sum = 0;
    for (let k = i; k <= j; k++) {
        sum += this.data[k];
    }
    return sum;
};

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * var param_1 = obj.sumRange(i,j)
 */

 /**
 304. 二维区域和检索 - 矩阵不可变
给定一个二维矩阵，计算其子矩形范围内元素的总和，该子矩阵的左上角为 (row1, col1) ，右下角为 (row2, col2)。

Range Sum Query 2D
上图子矩阵左上角 (row1, col1) = (2, 1) ，右下角(row2, col2) = (4, 3)，该子矩形内元素的总和为 8。

示例:

给定 matrix = [
  [3, 0, 1, 4, 2],
  [5, 6, 3, 2, 1],
  [1, 2, 0, 1, 5],
  [4, 1, 0, 1, 7],
  [1, 0, 3, 0, 5]
]

sumRegion(2, 1, 4, 3) -> 8
sumRegion(1, 1, 2, 2) -> 11
sumRegion(1, 2, 2, 4) -> 12
说明:

你可以假设矩阵不可变。
会多次调用 sumRegion 方法。
你可以假设 row1 ≤ row2 且 col1 ≤ col2。
 **/
 /**
 * @param {number[][]} matrix
 */
var NumMatrix = function(matrix) {
	//用缓存法 时间复杂度O(1) 空间复杂度O(m*n)
	let dp = this.dp = []//记录某一位置到远点的矩形和
	dp[0] = []
	if(matrix.length<=0 || matrix[0].length<=0) {
		return
	}
	//第一列
	for(let i = 0; i<=matrix.length; i++) {
		dp[i] = []
		dp[i][0] = 0
	}
	//第一行
	for(let i = 1; i<=matrix[0].length; i++) {
		dp[0][i] = 0
	}
	for(let i = 0; i<matrix.length; i++) {
		for(let j = 0; j<matrix[0].length; j++) {
			dp[i + 1][j + 1] = dp[i + 1][j] + dp[i][j + 1] + matrix[i][j] - dp[i][j];
		}
	}
};

/** 
 * @param {number} row1 
 * @param {number} col1 
 * @param {number} row2 
 * @param {number} col2
 * @return {number}
 */
NumMatrix.prototype.sumRegion = function(row1, col1, row2, col2) {
	let dp = this.dp
	if(dp.length<=0) {
		return 0
	}
	//面积 = r2c2-r2c1-r1c2+r1c1
	return dp[row2+1][col2+1]-dp[row2+1][col1]-dp[row1][col2+1]+dp[row1][col1]
};

/**
 * Your NumMatrix object will be instantiated and called as such:
 * var obj = new NumMatrix(matrix)
 * var param_1 = obj.sumRegion(row1,col1,row2,col2)
 */
matrix = [
  [3, 0, 1, 4, 2],
  [5, 6, 3, 2, 1],
  [1, 2, 0, 1, 5],
  [4, 1, 0, 1, 7],
  [1, 0, 3, 0, 5]
]
var obj = new NumMatrix(matrix)
console.log('sumRegion:', obj.sumRegion(2, 1, 4, 3))

/**
306. 累加数
累加数是一个字符串，组成它的数字可以形成累加序列。

一个有效的累加序列必须至少包含 3 个数。除了最开始的两个数以外，字符串中的其他数都等于它之前两个数相加的和。

给定一个只包含数字 '0'-'9' 的字符串，编写一个算法来判断给定输入是否是累加数。

说明: 累加序列里的数不会以 0 开头，所以不会出现 1, 2, 03 或者 1, 02, 3 的情况。

示例 1:

输入: "112358"
输出: true 
解释: 累加序列为: 1, 1, 2, 3, 5, 8 。1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8
示例 2:

输入: "199100199"
输出: true 
解释: 累加序列为: 1, 99, 100, 199。1 + 99 = 100, 99 + 100 = 199
进阶:
你如何处理一个溢出的过大的整数输入?
**/
/**
 * @param {string} num
 * @return {boolean}
 */
var isAdditiveNumber = function(num) {
	let res = []
	let find = false
	let len = num.length
	let backTrack = function(idx){
		if(find) {
			return
		}
		if(idx>=len && res.length>2) {
			find = true
			return
		}
		for(let i = idx+1; i<=len; i++) {
			if(find) {
				break
			}
			if(i-idx>16) {//越界
				break
			}
			let _num = num.substring(idx, i)
			_num = parseInt(_num)
			//判断累加数
			if(res.length>=2) {
				if(res[res.length-1]+res[res.length-2] == _num) {
					res.push(_num)
					backTrack(i)
					res.pop()
				}
			}else{
				res.push(_num)
				backTrack(i)
				res.pop()
			}
			//判断下一位为0
			if(num[idx] == '0') {
				break
			}
		}
	}
	backTrack(0)
	return find
};
console.log('isAdditiveNumber:', isAdditiveNumber("112358"))
console.log('isAdditiveNumber:', isAdditiveNumber("199100199"))
console.log('isAdditiveNumber:', isAdditiveNumber("101"))
console.log('isAdditiveNumber:', isAdditiveNumber("1023"))

/**
307. 区域和检索 - 数组可修改
给定一个整数数组  nums，求出数组从索引 i 到 j  (i ≤ j) 范围内元素的总和，包含 i,  j 两点。

update(i, val) 函数可以通过将下标为 i 的数值更新为 val，从而对数列进行修改。

示例:

Given nums = [1, 3, 5]

sumRange(0, 2) -> 9
update(1, 2)
sumRange(0, 2) -> 8
说明:

数组仅可以在 update 函数下进行修改。
你可以假设 update 函数与 sumRange 函数的调用次数是均匀分布的。

思路：线段树
	完全二叉树的元素个数为2n - 1 (n)是叶子节点的个数（对于线段树而言，不可能出现度数为1的节点。）, 
但是题解中使用的2n的数组，所以数组tree[0]为占位符，完全二叉树的root为tree[1], 所以i的孩子为 2i 和 2i + 1, i的父亲为 i / 2.
	如果直接用2n - 1的数存的话，i的孩子为2i + 1, 2i + 2, i的父亲为(i - 1) / 2
**/
/**
 * @param {number[]} nums
 */
var NumArray = function(nums) {
	//线段树 空间复杂度O(n)
	this.n = nums.length
	this.nums = nums
	this.tree = []
	this.buildTree()
};

NumArray.prototype.buildTree = function() {
	//后n个数
	let n = this.n
	for(let i = n, j = 0; i<2*n; i++, j++) {
		this.tree[i] = this.nums[j]
	}
	//前n-1个数
	for(let i = n-1; i>0; i--) {
		this.tree[i] = this.tree[2*i] + this.tree[2*i+1]
	}
	//0号位不用 
}

/** 
 * @param {number} i 
 * @param {number} val
 * @return {void}
 */
NumArray.prototype.update = function(i, val) {
	//父节点 i/2   时间复杂度O(logn)
	let pos = this.n+i
	this.tree[pos] = val
	//更新其父节点
	while(pos>0) {
		let left = pos
		let right = pos
		if(pos%2 == 0) {
			right = right+1
		}else {
			left = left-1
		}
		pos = parseInt(pos/2)
		this.tree[pos] = this.tree[left]+this.tree[right]
	}
};

/** 
 * @param {number} i 
 * @param {number} j
 * @return {number}
 */
NumArray.prototype.sumRange = function(i, j) {
	//时间复杂度O(logn)
	let l = i+this.n
	let r = j+this.n
	let sum = 0
	//左 2*i 右 2*i+1
	while(l<=r) {
		if(l%2 == 1) {
			sum+=this.tree[l]
			l++
		}
		if(r%2 == 0) {
			sum+=this.tree[r]
			r--
		}
		l = parseInt(l/2)
		r = parseInt(r/2)
	}
	return sum
};

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * obj.update(i,val)
 * var param_2 = obj.sumRange(i,j)
 */
 nums = [1, 3, 5]
 obj = new NumArray(nums)
 console.log('NumArray:', obj.sumRange(0, 2))
 obj.update(1, 2)
 console.log('NumArray:', obj.sumRange(0, 2))

 /**
 309. 最佳买卖股票时机含冷冻期
给定一个整数数组，其中第 i 个元素代表了第 i 天的股票价格 。​
设计一个算法计算出最大利润。在满足以下约束条件下，你可以尽可能地完成更多的交易（多次买卖一支股票）:

你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
卖出股票后，你无法在第二天买入股票 (即冷冻期为 1 天)。
示例:

输入: [1,2,3,0,2]
输出: 3 
解释: 对应的交易状态为: [买入, 卖出, 冷冻期, 买入, 卖出]
动态规划
我们目前持有一支股票，对应的「累计最大收益」记为 f[i][0]
我们目前不持有任何股票，并且处于冷冻期中，对应的「累计最大收益」记为 f[i][1]
我们目前不持有任何股票，并且不处于冷冻期中，对应的「累计最大收益」记为 f[i][2]
对于 f[i][0]f[i][0]，我们目前持有的这一支股票可以是在第 i-1i−1 天就已经持有的，对应的状态为 f[i-1][0]f[i−1][0]；或者是第 ii 天买入的，那么第 i-1i−1 天就不能持有股票并且不处于冷冻期中，对应的状态为 f[i-1][2]f[i−1][2] 加上买入股票的负收益 {\it prices}[i]prices[i]。因此状态转移方程为：
f[i][0]=max(f[i−1][0],f[i−1][2]−prices[i])

对于 f[i][1]f[i][1]，我们在第 ii 天结束之后处于冷冻期的原因是在当天卖出了股票，那么说明在第 i-1i−1 天时我们必须持有一支股票，对应的状态为 f[i-1][0]f[i−1][0] 加上卖出股票的正收益 {\it prices}[i]prices[i]。因此状态转移方程为：
f[i][1]=f[i−1][0]+prices[i]

对于 f[i][2]f[i][2]，我们在第 ii 天结束之后不持有任何股票并且不处于冷冻期，说明当天没有进行任何操作，即第 i-1i−1 天时不持有任何股票：如果处于冷冻期，对应的状态为 f[i-1][1]f[i−1][1]；如果不处于冷冻期，对应的状态为 f[i-1][2]f[i−1][2]。因此状态转移方程为：
f[i][2]=max(f[i−1][1],f[i−1][2])

这样我们就得到了所有的状态转移方程。如果一共有 nn 天，那么最终的答案即为：
max(f[n−1][0],f[n−1][1],f[n−1][2])

注意到如果在最后一天（第 n-1n−1 天）结束之后，手上仍然持有股票，那么显然是没有任何意义的。因此更加精确地，最终的答案实际上是 f[n-1][1]f[n−1][1] 和 f[n-1][2]f[n−1][2] 中的较大值，即：
max(f[n−1][1],f[n−1][2])
 **/
 /**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
	//边界处理
	let len = prices.length
	if(len<=0) {
		return 0
	}
	let f = []//结果二维数组 天数 状态
	f[0] = [-prices[0], 0, 0]//第0天
	for(let i = 1; i<len; i++) {
		//状态转移方程
		f[i] = []
		f[i][0] = Math.max(f[i-1][0], f[i-1][2]-prices[i])//持有
		f[i][1] = f[i-1][0]+prices[i]//不持有，冷冻期
		f[i][2] = Math.max(f[i-1][1],f[i-1][2])//不持有，非冷冻
	}
	return Math.max(f[len-1][1], f[len-1][2])
};
console.log('maxProfit:', maxProfit([1,2,3,0,2]))

/**
310. 最小高度树
对于一个具有树特征的无向图，我们可选择任何一个节点作为根。图因此可以成为树，在所有可能的树中，具有最小高度的树被称为最小高度树。给出这样的一个图，写出一个函数找到所有的最小高度树并返回他们的根节点。
格式
该图包含 n 个节点，标记为 0 到 n - 1。给定数字 n 和一个无向边 edges 列表（每一个边都是一对标签）。
你可以假设没有重复的边会出现在 edges 中。由于所有的边都是无向边， [0, 1]和 [1, 0] 是相同的，因此不会同时出现在 edges 里。

示例 1:
输入: n = 4, edges = [[1, 0], [1, 2], [1, 3]]

        0
        |
        1
       / \
      2   3 

输出: [1]

示例 2:
输入: n = 6, edges = [[0, 3], [1, 3], [2, 3], [4, 3], [5, 4]]

     0  1  2
      \ | /
        3
        |
        4
        |
        5 

输出: [3, 4]

说明:
 根据树的定义，树是一个无向图，其中任何两个顶点只通过一条路径连接。 换句话说，一个任何没有简单环路的连通图都是一棵树。
树的高度是指根节点和叶子节点之间最长向下路径上边的数量。

分析 BFS
首先，我们看了样例，发现这个树并不是二叉树，是多叉树。
然后，我们可能想到的解法是：根据题目的意思，就挨个节点遍历bfs，统计下每个节点的高度，然后用map存储起来，后面查询这个高度的集合里最小的就可以了。
但是这样会超时的。
于是我们看图（题目介绍里面的图）分析一下，发现，越是靠里面的节点越有可能是最小高度树。
所以，我们可以这样想，我们可以倒着来。
我们从边缘开始，先找到所有出度为1的节点，然后把所有出度为1的节点进队列，然后不断地bfs，最后找到的就是两边同时向中间靠近的节点，那么这个中间节点就相当于把整个距离二分了，那么它当然就是到两边距离最小的点啦，也就是到其他叶子节点最近的节点了。
然后，就可以写代码了。
**/
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number[]}
 */
var findMinHeightTrees = function(n, edges) {
	if(n == 1) {
        return [0]
    }
	let degree = []//出入度
	let map = {}//相邻的边
	for(let i = 0; i<edges.length; i++) {
		let edge = edges[i]
		let b1 = edge[0]
		let b2 = edge[1]
		degree[b1] = degree[b1] || 0
		degree[b1]++
		degree[b2] = degree[b2] || 0
		degree[b2]++
		map[b1] = map[b1] || []
		map[b1].push(b2)
		map[b2] = map[b2] || []
		map[b2].push(b1)
	}
	let queue = []
	//找度为1的
	for(let i = 0; i<degree.length; i++) {
		if(degree[i] == 1){
			queue.push(i)
		}
	}
	//不断找中间节点
	let res = []
	let nextQueue = []
	while(queue.length>0) {
		res = []
		nextQueue = []
		//找临边，减度
		let len = queue.length
		for(let i = 0; i<len; i++) {
			let b = queue.pop()
			res.push(b)
			let neighbors = map[b] || []
			for(let j = 0; j<neighbors.length; j++) {
				let neighbor = neighbors[j]
				degree[neighbor]--
				if(degree[neighbor] == 1) {
					nextQueue.push(neighbor)
				}
			}
		}
		queue = nextQueue
	}
	return res
};
console.log('findMinHeightTrees:', findMinHeightTrees(6, [[0, 3], [1, 3], [2, 3], [4, 3], [5, 4]]))

/**
312. 戳气球
有 n 个气球，编号为0 到 n-1，每个气球上都标有一个数字，这些数字存在数组 nums 中。
现在要求你戳破所有的气球。如果你戳破气球 i ，就可以获得 nums[left] * nums[i] * nums[right] 个硬币。 这里的 left 和 right 代表和 i 相邻的两个气球的序号。注意当你戳破了气球 i 后，气球 left 和气球 right 就变成了相邻的气球。
求所能获得硬币的最大数量。

说明:
你可以假设 nums[-1] = nums[n] = 1，但注意它们不是真实存在的所以并不能被戳破。
0 ≤ n ≤ 500, 0 ≤ nums[i] ≤ 100

示例:
输入: [3,1,5,8]
输出: 167 
解释: nums = [3,1,5,8] --> [3,5,8] -->   [3,8]   -->  [8]  --> []
     coins =  3*1*5      +  3*5*8    +  1*3*8      + 1*8*1   = 167

思路2 记忆化搜索
我们观察戳气球的操作，发现这会导致两个气球从不相邻变成相邻，使得后续操作难以处理。于是我们倒过来看这些操作，将全过程看作是每次添加一个气球

我们定义方法 solve，令solve(i,j) 表示将开区间 (i,j) 内的位置全部填满气球能够得到的最多硬币数。
由于是开区间，因此区间两端的气球的编号就是 i 和 j，对应着val[i] 和val[j]。

时间复杂度：O(n^3)，其中 n 是气球数量。区间数为 n^2，区间迭代复杂度为 O(n)，最终复杂度为 O(n^2 * n) = O(n^3)。

空间复杂度：O(n^2)，其中 nn 是气球数量。缓存大小为区间的个数。
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxCoins = function(nums) {
	//回溯法 时间复杂度O(N!)
	let copyArray = function(array, ext){
		let res = []
		for(let i = 0; i<array.length; i++) {
			if(i!=ext) {
				res.push(array[i])
			}
		}
		return res
	}
	let maxCoins = 0
	let backTrack = function(array, sum) {
		if(array.length<=0) {
			maxCoins = Math.max(maxCoins, sum)
			return
		}
		for(let i = 0; i<array.length; i++) {
			//戳破第i个
			let left = i==0?1:array[i-1]
			let right = i==array.length-1?1:array[i+1]
			backTrack(copyArray(array, i), sum+left*array[i]*right)
		}
	}
	backTrack(nums, 0)
	return maxCoins
};
var maxCoins2 = function(nums) {
	//优化版 缓存数据
	let n = nums.length
	let val = []
	for(let i = 0; i<n; i++) {
		val[i+1] = nums[i]
	}
	val[0] = val[n+1] = 1//边界处理
	let rec = []//区间i到j的硬币最大值
	for(let i = 0; i<n+2; i++) {
		rec[i] = []
		for(let j = 0; j<n+2; j++) {
			rec[i][j] = -1
		}
	}
	let solve = function(left, right) {
		//不包含边界
		if(left>=right-1) {
			return 0
		}
		if(rec[left][right]!=-1) {
			//缓存处理
			return rec[left][right]
		}
		for(let i = left+1; i<right; i++) {
			let sum = val[left]*val[i]*val[right]
			sum = sum + solve(left, i) + solve(i, right)
			rec[left][right] = Math.max(rec[left][right], sum)
		}
		return rec[left][right]
	}
	return solve(0, n+1)
}
console.log('maxCoins:', maxCoins2([3,1,5,8]))

/**
313. 超级丑数
编写一段程序来查找第 n 个超级丑数。
超级丑数是指其所有质因数都是长度为 k 的质数列表 primes 中的正整数。

示例:
输入: n = 12, primes = [2,7,13,19]
输出: 32 
解释: 给定长度为 4 的质数列表 primes = [2,7,13,19]，前 12 个超级丑数序列为：[1,2,4,7,8,13,14,16,19,26,28,32] 。
说明:

1 是任何给定 primes 的超级丑数。
 给定 primes 中的数字以升序排列。
0 < k ≤ 100, 0 < n ≤ 106, 0 < primes[i] < 1000 。
第 n 个超级丑数确保在 32 位有符整数范围内。

丑数就是质因数只包含 2, 3, 5 的正整数
**/
/**
class Ugly {
  public int[] nums = new int[1690];
  Ugly() {
    nums[0] = 1;
    int ugly, i2 = 0, i3 = 0, i5 = 0;

    for(int i = 1; i < 1690; ++i) {
      ugly = Math.min(Math.min(nums[i2] * 2, nums[i3] * 3), nums[i5] * 5);
      nums[i] = ugly;

      if (ugly == nums[i2] * 2) ++i2;
      if (ugly == nums[i3] * 3) ++i3;
      if (ugly == nums[i5] * 5) ++i5;
    }
  }
}

class Solution {
  public static Ugly u = new Ugly();
  public int nthUglyNumber(int n) {
    return u.nums[n - 1];
  }
}

class Ugly {
  public int[] nums = new int[1690];
  Ugly() {
    HashSet<Long> seen = new HashSet();
    PriorityQueue<Long> heap = new PriorityQueue<Long>();
    seen.add(1L);
    heap.add(1L);

    long currUgly, newUgly;
    int[] primes = new int[]{2, 3, 5};
    for(int i = 0; i < 1690; ++i) {
      currUgly = heap.poll();
      nums[i] = (int)currUgly;
      for(int j : primes) {
        newUgly = currUgly * j;
        if (!seen.contains(newUgly)) {
          seen.add(newUgly);
          heap.add(newUgly);
        }
      }
    }
  }
}

class Solution {
  public static Ugly u = new Ugly();
  public int nthUglyNumber(int n) {
    return u.nums[n - 1];
  }
}
**/
class SuperUgly {
	constructor(primes) {
		
	}
}
/**
 * @param {number} n
 * @param {number[]} primes
 * @return {number}
 */
var nthSuperUglyNumber = function(n, primes) {
	//时间复杂度 O(n*peimes.length)
	let nums = []//106
	nums[0] = 1
	let maxLen = Math.max(n, primes.length)
	for(let i = 1; i<maxLen; i++) {
		nums[i] = 0
	}

	let ugly
	let pLen = primes.length
	let iArray = []
	for(let i = 0; i<pLen; i++) {
		iArray[i] = 0
	}
	let getMinValue = function() {
		let min = Number.MAX_VALUE
		for(let i = 0; i<pLen; i++) {
			min = Math.min(primes[i]*nums[iArray[i]], min)
		}
		return min
	}
	for(let i = 1; i<n; i++) {
		ugly = getMinValue()
		nums[i] = ugly
		for(let i = 0; i<pLen; i++) {
			if(nums[iArray[i]]*primes[i] == ugly) {
				iArray[i]++
			}
		}
	}
	console.log(nums, iArray)
	return nums[n-1]
};
// console.log('nthSuperUglyNumber:', nthSuperUglyNumber(12, [2,7,13,19]))
console.log('nthSuperUglyNumber:', nthSuperUglyNumber(2, [2, 3, 5]))
/**
315. 计算右侧小于当前元素的个数
给定一个整数数组 nums，按要求返回一个新数组 counts。数组 counts 有该性质： counts[i] 的值是  nums[i] 右侧小于 nums[i] 的元素的数量。

示例：
输入：nums = [5,2,6,1]
输出：[2,1,1,0] 
解释：
5 的右侧有 2 个更小的元素 (2 和 1)
2 的右侧仅有 1 个更小的元素 (1)
6 的右侧有 1 个更小的元素 (1)
1 的右侧有 0 个更小的元素
 
提示：
0 <= nums.length <= 10^5
-10^4 <= nums[i] <= 10^4
**/
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var countSmaller = function(nums) {
	let index = []//保存下标
	let ans = []
	let temp = []
	let tempIdx = []
	let len = nums.length
	for(let i = 0; i<nums.length; i++) {
		index[i] = i
		ans[i] = 0
	}
	let merge = function (l, mid, r) {
		//合并两部分
		let i = l, j = mid+1, p = l
		while(i<=mid && j<=r) {
			if(nums[i]<=nums[j]) {
				//开始计数
				temp[p] = nums[i]
				tempIdx[p] = index[i]
				ans[index[i]] += (j-mid-1)
				i++
			}else {
				temp[p] = nums[j]
				tempIdx[p] = index[j]
				j++
			}
			p++
		}
		for(let idx = i; idx<=mid; idx++) {
			temp[p] = nums[idx]
			tempIdx[p] = index[idx]
			ans[index[idx]] += (j-mid-1)
			p++
		}
		for(let idx = j; idx<=r; idx++) {
			temp[p] = nums[idx]
			tempIdx[p] = index[idx]
			p++
		}
		//拷贝
		for(let i = l; i<=r; i++) {
			nums[i] = temp[i]
			index[i] = tempIdx[i]
		}
	}
	let mergeSort = function (l, r) {
		if(l>=r) {
			return
		}
		let mid = parseInt((l+r)/2)
		mergeSort(l, mid)
		mergeSort(mid+1, r)
		merge(l, mid, r)
	}
	mergeSort(0, len-1)
	return ans
};

// console.log('countSmaller:', countSmaller([5,2,6,1]))
console.log('countSmaller:', countSmaller([1, 2, 0]))

/**
剑指 Offer 51. 数组中的逆序对
在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数。

示例 1:
输入: [7,5,6,4]
输出: 5
 
限制：
0 <= 数组长度 <= 50000
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var reversePairs = function(nums) {
	//归并排序 时间复杂度O(nlogn) 空间O(n)
	let temp = []
	let mergeSort = function(l, r){
		if(l>=r) {
			return 0
		}
		let mid = parseInt((l+r)/2)
		let _count = mergeSort(l, mid) + mergeSort(mid+1, r)
		let i = l, j = mid+1, pos = l
		while(i<=mid && j<=r) {
			if(nums[i]<=nums[j]) {
				temp[pos] = nums[i]
				_count = _count + j-(mid+1)//贡献度
				pos++
				i++
			}else {
				temp[pos] = nums[j]
				pos++
				j++
			}
		}
		for(let k = i; k<=mid; k++){
			temp[pos++] = nums[k]
			_count = _count + j-(mid+1)//贡献度
		}
		for(let k = j; k<=r; k++) {
			temp[pos++] = nums[k]
		}
		//temp->nums
		for(let idx = l; idx<=r; idx++) {
			nums[idx] = temp[idx]
		}
		return _count
	}
	return mergeSort(0, nums.length-1)
};
// console.log('reversePairs:', reversePairs([7,5,6,4]))
console.log('reversePairs:', reversePairs([1,3,2,3,1]))

/**
316. 去除重复字母
给你一个字符串 s ，请你去除字符串中重复的字母，使得每个字母只出现一次。需保证 返回结果的字典序最小（要求不能打乱其他字符的相对位置）。
注意：该题与 1081 https://leetcode-cn.com/problems/smallest-subsequence-of-distinct-characters 相同

示例 1：
输入：s = "bcabc"
输出："abc"

示例 2：
输入：s = "cbacdcbc"
输出："acdb"
 
提示：
1 <= s.length <= 104
s 由小写英文字母组成
**/
/**
 * @param {string} s
 * @return {string}
 */
var removeDuplicateLetters = function(s) {
	//时间复杂度O(N) 空间O(N)
	let res = []
	let backTrack = function(str) {
		if(str.length<=0) {
			return
		}
		let counts = {}//统计个数
		for(let i = 0; i<str.length; i++) {
			counts[str[i]] = counts[str[i]] || 0
			counts[str[i]]++
		}
		let pos = 0
		for(let i = 0; i<str.length; i++) {
			if(str[i]<str[pos]){
				pos = i
			}
			if(--counts[str[i]] <= 0) {
				break
			}
		}
		res.push(str[pos])
		backTrack(str.substring(pos+1).replace(new RegExp(str[pos],"gm"), ''))
	}
	backTrack(s)
	return res.join('')
};
var removeDuplicateLetters2 = function(s) {
	//用栈实现 时间复杂度O(N)
	let stack = []//结果
	let seen = {}//已经处理过的
	let lastIdxs = {}//字符的下标
	for(let i = 0; i<s.length; i++) {
		lastIdxs[s[i]] = i//后边覆盖前边
	}
	for(let i = 0; i<s.length; i++) {
		let c = s[i]
		//没处理过这个字符
		if(!seen[c]) {
			//移除之前的元素
			// 判断条件 1、当前元素小于最后的元素 2、最后的元素在后边还有 3、stack不为空
			while(stack.length>0 && c<stack[stack.length-1] && lastIdxs[stack[stack.length-1]]>i) {
				seen[stack.pop()] = false
			}
			stack.push(c)
			seen[c] = true
		}
	}
	return stack.join('')
}
console.log('removeDuplicateLetters:', removeDuplicateLetters2("bddbccd"))

/**
318. 最大单词长度乘积
给定一个字符串数组 words，找到 length(word[i]) * length(word[j]) 的最大值，并且这两个单词不含有公共字母。你可以认为每个单词只包含小写字母。如果不存在这样的两个单词，返回 0。

示例 1:
输入: ["abcw","baz","foo","bar","xtfn","abcdef"]
输出: 16 
解释: 这两个单词为 "abcw", "xtfn"。

示例 2:
输入: ["a","ab","abc","d","cd","bcd","abcd"]
输出: 4 
解释: 这两个单词为 "ab", "cd"。

示例 3:
输入: ["a","aa","aaa","aaaa"]
输出: 0 
解释: 不存在这样的两个单词。

方案：位运算
时间复杂度：(N^2 + L)，其中 N 是单词数量，L 是所有单词的总长度。预计算处理所有单词的所有字母的复杂度为O(L)。单词两两比较的复杂度为O(N^2)。总复杂度为(N^2 + L)
空间复杂度：O(N)，存储 N 个元素的两个数组。
**/
/**
 * @param {string[]} words
 * @return {number}
 */
var maxProduct = function(words) {
	//位运算
	let masks = []//位掩码
	let lens = []//单词的长度
	let n = words.length
	let mask = 0
	let Abits = 'a'.charCodeAt(0)
	for(let i = 0; i<n; i++) {
		mask = 0
		for(let j = 0; j<words[i].length; j++) {
			mask |= (1<<(words[i].charCodeAt(j)-Abits))
		}
		masks[i] = mask
		lens[i] = words[i].length
	}
	let maxVal= 0
	for(let i = 0; i<n; i++) {
		for(let j = i+1; j<n; j++) {
			if((masks[i]&masks[j]) == 0) {
				maxVal = Math.max(lens[i]*lens[j], maxVal)
			}
		}
	}
	return maxVal
};
console.log('maxProduct:', maxProduct(["abcw","baz","foo","bar","xtfn","abcdef"]))
/**
319. 灯泡开关
初始时有 n 个灯泡关闭。
第 1 轮，你打开所有的灯泡。 第 2 轮，每两个灯泡你关闭一次。 第 3 轮，每三个灯泡切换一次开关（如果关闭则开启，如果开启则关闭）。
第 i 轮，每 i 个灯泡切换一次开关。 对于第 n 轮，你只切换最后一个灯泡的开关。
找出 n 轮后有多少个亮着的灯泡。

示例 1：
输入：n = 3
输出：1 
解释：
初始时, 灯泡状态 [关闭, 关闭, 关闭].
第一轮后, 灯泡状态 [开启, 开启, 开启].
第二轮后, 灯泡状态 [开启, 关闭, 开启].
第三轮后, 灯泡状态 [开启, 关闭, 关闭]. 

你应该返回 1，因为只有一个灯泡还亮着。

示例 2：
输入：n = 0
输出：0

示例 3：
输入：n = 1
输出：1 

提示：
0 <= n <= 10^9
**/
/**
 * @param {number} n
 * @return {number}
 */
var bulbSwitch = function(n) {
	let light = []
	let idx = 1
	let num = 0
	while(idx<=n) {
		for(let i = 0; i<n; i++) {
			if((i+1)%idx == 0) {
				light[i] = !light[i]
			}
			if(idx == n && light[i]) {
				num++
			}
		}
		idx++
	}
	return num
};
var bulbSwitch2 = function(n) {
	if(n==1)
        return 1;
    let result = 1;
    while(true) {
        if(result*result>n)
            break;
        result++;
    }
    return result-1;
}
console.log('bulbSwitch:', bulbSwitch2(3))

/**
321. 拼接最大数
给定长度分别为 m 和 n 的两个数组，其元素由 0-9 构成，表示两个自然数各位上的数字。现在从这两个数组中选出 k (k <= m + n) 个数字拼接成一个新的数，要求从同一个数组中取出的数字保持其在原数组中的相对顺序。
求满足该条件的最大数。结果返回一个表示该最大数的长度为 k 的数组。
说明: 请尽可能地优化你算法的时间和空间复杂度。

示例 1:
输入:
nums1 = [3, 4, 6, 5]
nums2 = [9, 1, 2, 5, 8, 3]
k = 5
输出:
[9, 8, 6, 5, 3]

示例 2:
输入:
nums1 = [6, 7]
nums2 = [6, 0, 4]
k = 5
输出:
[6, 7, 6, 0, 4]

示例 3:
输入:
nums1 = [3, 9]
nums2 = [8, 9]
k = 3
输出:
[9, 8, 9]

思路
假设nums1中有s的最大值，nums2中有k-s个最大值
然后把这k个值放到一块醉成最大值
**/
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k
 * @return {number[]}
 */
var maxNumber = function(nums1, nums2, k) {
	//时间复杂度O(k) 空间复杂度O(k)
	let n1 = nums1.length
	let n2 = nums2.length
	let maxRes = []
	let maxKSequence = function(nums, k) {
		//从nums中取长度为k的最大序列
		if(k>=nums.length) {
			return nums
		}
		let res = []
		let pop = nums.length-k
		for(let i = 0; i<nums.length; i++) {
			while(res.length>0 && nums[i]>res[res.length-1] && pop-->0){
				res.pop()
			}
			res.push(nums[i])
		}
		//取前k个
		res = res.slice(0, k)
		return res
	}
	let combineMax = function(arr1, arr2) {
		//合成最大序列
		let res = []
		let len1 = arr1.length
		let len2 = arr2.length
		let i = 0, j = 0
		while(i<len1&&j<len2) {
			if(arr1[i]>arr2[j]) {
				res.push(arr1[i++])
			}else if(arr2[j]>arr1[i]){
				res.push(arr2[j++])
			}else {
				//相等
				let m = i+1, n = j+1
				while(m<len1 && n<len2) {
					if(arr1[m]>arr2[n]) {
						res.push(arr1[i++])
						break
					}else if(arr1[m]<arr2[n]) {
						res.push(arr2[j++])
						break
					}
					m++
					n++
				}
				if(m>=len1) {
					res.push(arr2[j++])
				}else if(n>=len2) {
					res.push(arr1[i++])
				}
			}
		}
		while(i<len1) {
			res.push(arr1[i++])
		}
		while(j<len2) {
			res.push(arr2[j++])
		}
		return res
	}
	let compareMax = function(arr) {
		if(maxRes.length<=0) {
			maxRes = arr
			return
		}
		for(let i = 0; i<k; i++) {
			if(arr[i]>maxRes[i]) {
				maxRes = arr
				break
			}else if(maxRes[i]>arr[i]) {
				break
			}
		}
	}
	//假设num1中出s个值
	for(let s = Math.max(0, k-n2); s<=Math.min(k, n1); s++) {
		let arr1 = maxKSequence(nums1, s)
		let arr2 = maxKSequence(nums2, k-s)
		let arrOne = combineMax(arr1, arr2)
		compareMax(arrOne)
	}
	return maxRes
};
var nums1 = [3, 4, 6, 5]
var nums2 = [9, 1, 2, 5, 8, 3]
var k = 5
nums1 = [6,7]
nums2 = [6,0,4]
k = 5
nums1 = [2,5,6,4,4,0]
nums2 = [7,3,8,0,6,5,7,6,2]
k = 15
nums1 = [2,1,7,8,0,1,7,3,5,8,9,0,0,7,0,2,2,7,3,5,5]
nums2 = [2,6,2,0,1,0,5,4,5,5,3,3,3,4]
k = 35
console.log('maxNumber:', maxNumber(nums1, nums2, k))

/**
322. 零钱兑换
给定不同面额的硬币 coins 和一个总金额 amount。编写一个函数来计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1。
你可以认为每种硬币的数量是无限的。

示例 1：
输入：coins = [1, 2, 5], amount = 11
输出：3 
解释：11 = 5 + 5 + 1
示例 2：

输入：coins = [2], amount = 3
输出：-1
示例 3：

输入：coins = [1], amount = 0
输出：0
示例 4：

输入：coins = [1], amount = 1
输出：1
示例 5：

输入：coins = [1], amount = 2
输出：2

提示：
1 <= coins.length <= 12
1 <= coins[i] <= 231 - 1
0 <= amount <= 104

方法三：动态规划：自下而上 [通过]
算法
我们采用自下而上的方式进行思考。仍定义 F(i) 为组成金额 i 所需最少的硬币数量，假设在计算 F(i) 之前，我们已经计算出 F(0)-F(i-1) 的答案。 则 F(i) 对应的转移方程应为
https://leetcode-cn.com/problems/coin-change/solution/322-ling-qian-dui-huan-by-leetcode-solution/
**/
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
	//回溯法
	if(amount<=0) {
		return 0
	}
	let n = coins.length
	//回溯法
	let backTrack = function(coinIdx, nowAnount) {
		if(nowAnount==0) {
			return 0
		}
		if(coinIdx<n){
			let maxCount = parseInt(nowAnount/coins[coinIdx])
			let minNums = Number.MAX_VALUE
			for(let i = 0; i<=maxCount; i++) {
				let res = backTrack(coinIdx+1, nowAnount-i*coins[coinIdx])
				if(res!=-1) {
					minNums = Math.min(minNums, res)
				}
			}
			return minNums == Number.MAX_VALUE?-1:minNums
		}
		return -1
	}
	return backTrack(0, amount)
};
var coinChange2 = function(coins, amount) {
	//时间复杂度 O(Sn) 空间O(S)   S=amount n=coins.length
	let max = amount+1
	let dp = []//结果 需要多少枚
	for(let i = 1; i<=amount; i++) {
		dp[i] = max //最大数量不超过 max
	}
	dp[0] = 0
	for(let i = 1; i<=amount; i++) {
		//状态方程，遍历coins 取最小值
		for(let j = 0; j<coins.length; j++) {
			if(i-coins[j]>=0) {
				dp[i] = Math.min(dp[i], dp[i-coins[j]]+1)
			}
		}
	}
	return dp[amount]>amount?-1:dp[amount]
}
var coins = [1, 2, 5]
var amount = 11
// coins = [2]
// amount = 3
// coins = [1]
// amount = 2
// coins = [186,419,83,408]
// amount = 6249
console.log('coinChange:', coinChange2(coins, amount))

/**
324. 摆动排序 II
给定一个无序的数组 nums，将它重新排列成 nums[0] < nums[1] > nums[2] < nums[3]... 的顺序。

示例 1:
输入: nums = [1, 5, 1, 1, 6, 4]
输出: 一个可能的答案是 [1, 4, 1, 5, 1, 6]

示例 2:
输入: nums = [1, 3, 2, 2, 3, 1]
输出: 一个可能的答案是 [2, 3, 1, 3, 1, 2]
说明:
你可以假设所有输入都会得到有效的结果。

进阶:
你能用 O(n) 时间复杂度和 / 或原地 O(1) 额外空间来实现吗？
**/
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var wiggleSort = function(nums) {
	let midIdx = Math.ceil(nums.length/2) - 1
	let quickFind = function(l,r) {
		if(l<=r) {
			let i = l, j = r, x = nums[l]
			while(i<j) {
				//从右边找<x的值
				while(i<j && nums[j]>=x) {
					j--
				}
				if(i<j) {
					nums[i++] = nums[j]
				}
				//从左边找>x的值
				while(i<j&&nums[i]<x) {
					i++
				}
				if(i<j){
					nums[j--] = nums[i]
				}
			}
			nums[i] = x//i是有序的
			if(i == midIdx){
				return nums[i]
			}else if(midIdx<i) {
				return quickFind(l, i-1)
			}else {
				return quickFind(i+1, r)
			}
		}
	}
	let mid = quickFind(0, nums.length-1)//时间复杂度O(n)
	let swap = function(i, j){
		let temp = nums[i]
		nums[i] = nums[j]
		nums[j] = temp
	}
	let i = 0, j = 0, k = nums.length - 1;
	// 3-way-partition算法将中位数放在数组中部，同时将小于中位数的数放在左侧，大于中位数的数放在右侧
    while(j <= k){
        if(nums[j] > mid){
            swap(j, k);
            --k;
        }
        else if(nums[j] < mid){
            swap(j, i);
            ++i;
            ++j;
        }
        else{
            ++j;
        }
    }
    //混合
    let temp1 = nums.slice(0, midIdx+1)
    let temp2 = nums.slice(midIdx+1, nums.length)
    for(let i = 0; i<temp1.length; i++) {
    	nums[i*2] = temp1[temp1.length-1-i]
    }
    for(let i = 0; i<temp2.length; i++) {
    	nums[i*2+1] = temp2[temp2.length-1-i]
    }
};
nums = [1,5,1,1,6,4]
wiggleSort(nums)
console.log(nums)

/*
326. 3的幂
给定一个整数，写一个函数来判断它是否是 3 的幂次方。如果是，返回 true ；否则，返回 false 。
整数 n 是 3 的幂次方需满足：存在整数 x 使得 n == 3x

示例 1：
输入：n = 27
输出：true

示例 2：
输入：n = 0
输出：false

示例 3：
输入：n = 9
输出：true

示例 4：
输入：n = 45
输出：false

提示：
-231 <= n <= 231 - 1
*/
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function(n) {
	if(n == 1) {
		return true
	}
	if(n == 0) {
		return false
	}
	return isPowerOfThree(n/3)
};
console.log('isPowerOfThree:', isPowerOfThree(27))

/**
327. 区间和的个数
给定一个整数数组 nums，返回区间和在 [lower, upper] 之间的个数，包含 lower 和 upper。
区间和 S(i, j) 表示在 nums 中，位置从 i 到 j 的元素之和，包含 i 和 j (i ≤ j)。

说明:
最直观的算法复杂度是 O(n2) ，请在此基础上优化你的算法。

示例:

输入: nums = [-2,5,-1], lower = -2, upper = 2,
输出: 3 
解释: 3个区间分别是: [0,0], [2,2], [0,2]，它们表示的和分别为: -2, -1, 2。


方法：归并排序法
https://leetcode-cn.com/problems/count-of-range-sum/solution/qu-jian-he-de-ge-shu-by-leetcode-solution/
时间复杂度O(NlgN)
**/
/**
 * @param {number[]} nums
 * @param {number} lower
 * @param {number} upper
 * @return {number}
 */
var countRangeSum = function(nums, lower, upper) {
	//时间复杂度O(n!) 空间O(1)
	let sum = 0
	let num = 0
	for(let i = 0; i<nums.length; i++) {
		sum = 0//i-j之间的和
		for(let j = i; j<nums.length; j++) {
			sum+=nums[j]
			if(sum>=lower && sum<=upper) {
				num++
			}
		}
	}
	return num
};
var countRangeSum2 = function(nums, lower, upper) {
	//归并排序查找
	let sum = [0]
	let mergeSort = function(left,right) {
		if(left == right) {
			return 0
		}
		let mid = parseInt((left+right)/2)
		let n1 = mergeSort(left, mid)
		let n2 = mergeSort(mid+1, right)
		//计算数量
		let ret = n1+n2
		let i = left
		let l = mid+1
		let r = mid+1
		while(i<=mid) {
			while(l<=right&&sum[l]-sum[i]<lower){
				l++
			}
			while(r<=right&&sum[r]-sum[i]<=upper) {
				r++//找下一个，计算差值
			}
			console.log(l, r, i)
			ret+=(r-l)
			i++
		}
		//合并区间
		let temp = []
		let p1 = left, p2 = mid+1, p = 0
		while(p1<=mid || p2<=right) {
			if(p1>mid) {
				temp[p++] = sum[p2++]
			}else if(p2>right) {
				temp[p++] = sum[p1++]
			}else {
				if(sum[p1]<=sum[p2]) {
					temp[p++] = sum[p1++]
				}else {
					temp[p++] = sum[p2++]
				}
			}
		}
		for(let i = left; i<=right; i++) {
			sum[i] = temp[i-left]
		}
		return ret
	}
	let num = 0
	for(let i = 0; i<nums.length; i++) {
		num+=nums[i]
		sum.push(num)
	}
	return mergeSort(0, sum.length-1)
}
nums = [-2, 5, -1]
var lower = -2, upper = 2
// nums = [-1,1]
// lower = 0
// upper = 0
console.log('countRangeSum:', countRangeSum2(nums, lower, upper))
/**
328. 奇偶链表
给定一个单链表，把所有的奇数节点和偶数节点分别排在一起。请注意，这里的奇数节点和偶数节点指的是节点编号的奇偶性，而不是节点的值的奇偶性。
请尝试使用原地算法完成。你的算法的空间复杂度应为 O(1)，时间复杂度应为 O(nodes)，nodes 为节点总数。

示例 1:
输入: 1->2->3->4->5->NULL
输出: 1->3->5->2->4->NULL

示例 2:
输入: 2->1->3->5->6->4->7->NULL 
输出: 2->3->6->7->1->5->4->NULL

说明:
应当保持奇数节点和偶数节点的相对顺序。
链表的
第一个节点视为奇数节点，第二个节点视为偶数节点，以此类推。
**/
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var oddEvenList = function(head) {
	if(!head || !head.next) {
		return head
	}
    let rJ = head
    let rO = head.next
    let lJ = rJ, lO = rO
    let idx = 3
    let p = lO.next
    while(p){
    	if(idx%2 == 0) {
    		//偶数
    		lO.next = p
    		lO = lO.next
    	}else {
    		lJ.next = p
    		lJ = lJ.next
    	}
    	idx++
    	p = p.next
    }
    lJ.next = rO
    lO.next = null
    return rJ
};
var lN1 = new ListNode(1)
var lN2 = new ListNode(2)
var lN3 = new ListNode(3)
var lN4 = new ListNode(4)
var lN5 = new ListNode(5)
lN1.next = lN2
lN2.next = lN3
lN3.next = lN4
lN4.next = lN5
oddEvenList(lN1)
function printListNode(root) {
	let idx = 0
	while(root) {
		console.log(idx+':'+root.val)
		idx++
		root = root.next
	}
}
printListNode(lN1)

/**
329. 矩阵中的最长递增路径
给定一个整数矩阵，找出最长递增路径的长度。
对于每个单元格，你可以往上，下，左，右四个方向移动。 你不能在对角线方向上移动或移动到边界外（即不允许环绕）。

示例 1:
输入: nums = 
[
  [9,9,4],
  [6,6,8],
  [2,1,1]
] 
输出: 4 
解释: 最长递增路径为 [1, 2, 6, 9]。

示例 2:
输入: nums = 
[
  [3,4,5],
  [3,2,6],
  [2,2,1]
] 
输出: 4 
解释: 最长递增路径是 [3, 4, 5, 6]。注意不允许在对角线方向上移动。

方法一：记忆化深度优先搜索
将矩阵看成一个有向图，每个单元格对应图中的一个节点，如果相邻的两个单元格的值不相等，则在相邻的两个单元格之间存在一条从较小值指向较大值的有向边。问题转化成在有向图中寻找最长路径。
深度优先搜索是非常直观的方法。从一个单元格开始进行深度优先搜索，即可找到从该单元格开始的最长递增路径。对每个单元格分别进行深度优先搜索之后，即可得到矩阵中的最长递增路径的长度。

方法二：拓扑排序
根据方法一的分析，动态规划的状态定义和状态转移方程都很容易得到。方法一中使用的缓存矩阵 \text{memo}memo 即为状态值，状态转移方程如下：
	memo[i][j]=max{memo[x][y]}+1
其中 (x,y) 与 (i,j) 在矩阵中相邻，并且 matrix[x][y]>matrix[i][j]

**/
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var longestIncreasingPath = function(matrix) {
	//时间复杂度O(m*n)
	if(!matrix || matrix.length == 0 || matrix[0].length == 0) {
		return 0
	}
	let dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]
	let memo = []//记忆数组
	let rows = matrix.length
	let cols = matrix[0].length
	//深度优先遍历
	let dfs = function(row, col) {
		memo[row] = memo[row] || []
		memo[row][col] = memo[row][col] || 0
		if(memo[row][col] != 0) {
			return memo[row][col]
		}
		memo[row][col]++//到自身为1
		for(let i = 0; i<dirs.length; i++) {
			let dir = dirs[i]
			let newRow = row+dir[0]
			let newCol = col+dir[1]
			if(newRow>=0 && newRow<rows && newCol>=0 && newCol<cols && matrix[newRow][newCol]>matrix[row][col]) {
				memo[row][col] = Math.max(memo[row][col], dfs(newRow, newCol)+1)
			}
		}
		return memo[row][col]
	}
	let max = 0
	for(let i = 0; i<rows; i++) {
		for(let j = 0; j<cols; j++) {
			max = Math.max(max, dfs(i, j))
		}
	}
	return max
};

var longestIncreasingPath2 = function(matrix) {
	//时间复杂度O(m*n)
	//拓扑排序
	if(!matrix || matrix.length == 0 || matrix[0].length == 0) {
		return 0
	}
	let dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]
	let rows = matrix.length
	let cols = matrix[0].length
	//查找所有的出度
	let outDegrees = []
	for(let i = 0; i<rows; i++) {
		outDegrees[i] = []
		for(let j = 0; j<cols; j++) {
			outDegrees[i][j] = 0
			for(let d = 0; d<dirs.length; d++) {
				let dir = dirs[d]
				let newRow = i+dir[0]
				let newCol = j+dir[1]
				if(newRow>=0 && newRow<rows && newCol>=0 && newCol<cols && matrix[newRow][newCol]>matrix[i][j]) {
					outDegrees[i][j]++
				}
			}
		}
	}
	let queue = []
	//查找出度为0的
	for(let i = 0; i<rows; i++) {
		for(let j = 0; j<cols; j++) {
			if(outDegrees[i][j] == 0) {
				queue.push([i, j])
			}
		}
	}
	//遍历最长路径
	let count = 0
	while(queue.length>0) {
		count++
		let size = queue.length
		for(let i = 0; i<size; i++) {
			let cell = queue.shift() //删除有向图中的节点
			//减小入度
			for(let d = 0; d<dirs.length; d++) {
				let dir = dirs[d]
				let newRow = cell[0]+dir[0]
				let newCol = cell[1]+dir[1]
				if(newRow>=0 && newRow<rows && newCol>=0 && newCol<cols && matrix[newRow][newCol]<matrix[cell[0]][cell[1]]) {
					outDegrees[newRow][newCol]--
					if(outDegrees[newRow][newCol] == 0) {
						queue.push([newRow, newCol])
					}
				}
			}
		}
	}
	return count
}
nums = 
[
  [9,9,4],
  [6,6,8],
  [2,1,1]
]
console.log('longestIncreasingPath:', longestIncreasingPath2(nums))

/**
330. 按要求补齐数组
给定一个已排序的正整数数组 nums，和一个正整数 n 。从 [1, n] 区间内选取任意个数字补充到 nums 中，使得 [1, n] 区间内的任何数字都可以用 nums 中某几个数字的和来表示。请输出满足上述要求的最少需要补充的数字个数。

示例 1:
输入: nums = [1,3], n = 6
输出: 1 
解释:
根据 nums 里现有的组合 [1], [3], [1,3]，可以得出 1, 3, 4。
现在如果我们将 2 添加到 nums 中， 组合变为: [1], [2], [3], [1,3], [2,3], [1,2,3]。
其和可以表示数字 1, 2, 3, 4, 5, 6，能够覆盖 [1, 6] 区间里所有的数。
所以我们最少需要添加一个数字。

示例 2:
输入: nums = [1,5,10], n = 20
输出: 2
解释: 我们需要添加 [2, 4]。

示例 3:
输入: nums = [1,2,2], n = 5
输出: 0

下面是这个贪心算法的流程：

初始化区间 [1, miss) = [1, 1) = 空
每当 n 没有被覆盖
	若当前元素 nums[i] 小于等于 miss
		将范围扩展到 [1, miss + nums[i])
		将 i 增加 1
	否则
		将 miss 添加到数组，将范围扩展到 [1, miss + miss)
		增加数字的计数
返回增加数字的数目

复杂度分析
时间复杂度 : O(m+logn)。在每次迭代中，我们或者增加 i ，或者将 miss 加倍。 i增加的总数为 m， miss 加倍的总数为logn。
空间复杂度 : O(1)。 只需要三个变量：patches，i 和 miss。
**/
/**
 * @param {number[]} nums
 * @param {number} n
 * @return {number}
 */
var minPatches = function(nums, n) {
	let res = 0//个数
	let i = 0//遍历nums中第i个
	let miss = 1//是缺少的数字中最小的
	while(miss<=n) {
		if(i<nums.length && nums[i]<=miss) {
			miss+=nums[i]
			i++
		}else {
			miss+=miss
			res++
		}
	}
	return res
};
nums = [1,5,10]
n = 20
console.log('minPatches:', minPatches(nums, n))
/**
331. 验证二叉树的前序序列化
序列化二叉树的一种方法是使用前序遍历。当我们遇到一个非空节点时，我们可以记录下这个节点的值。如果它是一个空节点，我们可以使用一个标记值记录，例如 #。

     _9_
    /   \
   3     2
  / \   / \
 4   1  #  6
/ \ / \   / \
# # # #   # #
例如，上面的二叉树可以被序列化为字符串 "9,3,4,#,#,1,#,#,2,#,6,#,#"，其中 # 代表一个空节点。
给定一串以逗号分隔的序列，验证它是否是正确的二叉树的前序序列化。编写一个在不重构树的条件下的可行算法。
每个以逗号分隔的字符或为一个整数或为一个表示 null 指针的 '#' 。
你可以认为输入格式总是有效的，例如它永远不会包含两个连续的逗号，比如 "1,,3" 。

示例 1:
输入: "9,3,4,#,#,1,#,#,2,#,6,#,#"
输出: true

示例 2:
输入: "1,#"
输出: false

示例 3:
输入: "9,#,#,1"
输出: false

算法
初始化可用槽位：slots = 1。
根据逗号分隔前序序列化，将结果数组存储，随后遍历该数组：
	空节点和非空节点都消耗一个槽位：slots = slot - 1.
	如果当前的可用槽位是负数，那么这个前序序列化是非法的，返回 False。
	非空节点（node != '#'）新增两个可用槽位：slots = slots + 2.
如果所有的槽位都消耗完，那么这个前序序列化就是合法的：返回 slots == 0。
**/
/**
 * @param {string} preorder
 * @return {boolean}
 */
var isValidSerialization = function(preorder) {
	let res = preorder.split(',')
	let slots = 1
	for(let i = 0; i<res.length; i++) {
		slots -= 1
		if(slots<0) {
			return false
		}
		if(res[i]!='#') {
			slots+=2
		}
	}
	return slots==0
};
var preorder = "9,3,4,#,#,1,#,#,2,#,6,#,#"
// preorder = "1,#"
// preorder = "1"
// preorder = "1,#,#,#,#"
console.log('isValidSerialization:', isValidSerialization(preorder))
/**
332. 重新安排行程
给定一个机票的字符串二维数组 [from, to]，子数组中的两个成员分别表示飞机出发和降落的机场地点，对该行程进行重新规划排序。所有这些机票都属于一个从 JFK（肯尼迪国际机场）出发的先生，所以该行程必须从 JFK 开始。

提示：
如果存在多种有效的行程，请你按字符自然排序返回最小的行程组合。例如，行程 ["JFK", "LGA"] 与 ["JFK", "LGB"] 相比就更小，排序更靠前
所有的机场都用三个大写字母表示（机场代码）。
假定所有机票至少存在一种合理的行程。
所有的机票必须都用一次 且 只能用一次。
 
示例 1：
输入：[["MUC", "LHR"], ["JFK", "MUC"], ["SFO", "SJC"], ["LHR", "SFO"]]
输出：["JFK", "MUC", "LHR", "SFO", "SJC"]

示例 2：
输入：[["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]
输出：["JFK","ATL","JFK","SFO","ATL","SFO"]
解释：另一种有效的行程是 ["JFK","SFO","ATL","JFK","ATL","SFO"]。但是它自然排序更大更靠后。

思路
求解欧拉回路 / 欧拉通路
我们化简本题题意：给定一个 n 个点 m 条边的图，要求从指定的顶点出发，经过所有的边恰好一次（可以理解为给定起点的「一笔画」问题），使得路径的字典序最小。
这种「一笔画」问题与欧拉图或者半欧拉图有着紧密的联系，下面给出定义：
	通过图中所有边恰好一次且行遍所有顶点的通路称为欧拉通路。
	通过图中所有边恰好一次且行遍所有顶点的回路称为欧拉回路。
	具有欧拉回路的无向图称为欧拉图。
	具有欧拉通路但不具有欧拉回路的无向图称为半欧拉图。

如果没有保证至少存在一种合理的路径，我们需要判别这张图是否是欧拉图或者半欧拉图，具体地：
	对于无向图 G，G 是欧拉图当且仅当 G 是连通的且没有奇度顶点。
	对于无向图 G，G 是半欧拉图当且仅当 G 是连通的且 G 中恰有 2 个奇度顶点。
	对于有向图 G，G 是欧拉图当且仅当 G 的所有顶点属于同一个强连通分量且每个顶点的入度和出度相同。
	对于有向图 G，G 是半欧拉图当且仅当 G 的所有顶点属于同一个强连通分量且
		恰有一个顶点的出度与入度差为 1；
		恰有一个顶点的入度与出度差为 1；
		所有其他顶点的入度和出度相同。

https://leetcode-cn.com/problems/reconstruct-itinerary/solution/zhong-xin-an-pai-xing-cheng-by-leetcode-solution/
时间复杂度：(mlogm)，其中 mm 是边的数量。对于每一条边我们需要 O(logm) 地删除它，最终的答案序列长度为 m+1，而与 n 无关。
空间复杂度：O(m)，其中 m 是边的数量。我们需要存储每一条边

Hierholzer 算法过程：
选择任一顶点为起点，遍历所有相邻边。
深度搜索，访问相邻顶点。将经过的边都删除。
如果当前顶点没有相邻边，则将顶点入栈。
栈中的顶点倒序输出，就是从起点出发的欧拉回路。

**/
/**
 * @param {string[][]} tickets
 * @return {string[]}
 */
var findItinerary = function(tickets) {
	let binarySearch = function(array, value) {
		if(array.length<=0) {
			return 0
		}
		if(array[array.length-1]>value) {
			return array.length
		}
		//降序 查找第一个<value的下标
		let left = 0, right = array.length-1
		while(left<right){
			let mid = parseInt((left+right)/2)
			if(array[mid]>=value) {
				left = mid+1
			}else {
				right = mid
			}
		}
		return left
	}
	let insertSortArray = function(array, value){
		let pos = binarySearch(array, value)
		array.splice(pos, 0, value)
	}
	let map = {}
	//构建图
	for(let i = 0; i<tickets.length; i++) {
		let ticket = tickets[i]
		map[ticket[0]] = map[ticket[0]] || []
		insertSortArray(map[ticket[0]], ticket[1])
	}
	//遍历
	let res = []
	let dfs = function(curr) {
		while(map[curr] && map[curr].length>0) {
			let tmp = map[curr].pop()
			dfs(tmp)
		}
		res.push(curr)
	}
	dfs('JFK')
	res.reverse()
	return res
};
var findItinerary2 = function(tickets) {

}
var tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]
// tickets = [["JFK","KUL"],["JFK","NRT"],["NRT","JFK"]]
// tickets = [
// ["EZE","TIA"],
// ["EZE","HBA"],
// ["AXA","TIA"],
// ["JFK","AXA"],
// ["ANU","JFK"],
// ["ADL","ANU"],
// ["TIA","AUA"],
// ["ANU","AUA"],
// ["ADL","EZE"],
// ["ADL","EZE"],
// ["EZE","ADL"],
// ["AXA","EZE"],
// ["AUA","AXA"],
// ["JFK","AXA"],
// ["AXA","AUA"],
// ["AUA","ADL"],
// ["ANU","EZE"],
// ["TIA","ADL"],
// ["EZE","ANU"],
// ["AUA","ANU"]]
console.log('findItinerary:', findItinerary(tickets))
/**
334. 递增的三元子序列
给定一个未排序的数组，判断这个数组中是否存在长度为 3 的递增子序列。

数学表达式如下:
如果存在这样的 i, j, k,  且满足 0 ≤ i < j < k ≤ n-1，
使得 arr[i] < arr[j] < arr[k] ，返回 true ; 否则返回 false 。
说明: 要求算法的时间复杂度为 O(n)，空间复杂度为 O(1) 。

示例 1:
输入: [1,2,3,4,5]
输出: true

示例 2:
输入: [5,4,3,2,1]
输出: false

本题的思路非常的巧妙！
首先，新建两个变量 small 和 mid ，分别用来保存题目要我们求的长度为 3 的递增子序列的最小值和中间值。
接着，我们遍历数组，每遇到一个数字，我们将它和 small 和 mid 相比，若小于等于 small ，则替换 small；否则，若小于等于 mid，则替换 mid；否则，若大于 mid，则说明我们找到了长度为 3 的递增数组！
**/
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var increasingTriplet = function(nums) {
	if(nums.length<3) {
		return false
	}
	let small = Number.MAX_VALUE, mid = Number.MAX_VALUE
	for(let i = 0; i<nums.length; i++) {
		if(nums[i]<=small) {
			small = nums[i]
		}else if(nums[i]<=mid) {
			mid = nums[i]
		}else{
			return true
		}
	}
	return false
};
nums = [5,1,5,5,2,5,4]
console.log('increasingTriplet:', increasingTriplet(nums))
/**
335. 路径交叉
给定一个含有 n 个正数的数组 x。从点 (0,0) 开始，先向北移动 x[0] 米，然后向西移动 x[1] 米，向南移动 x[2] 米，向东移动 x[3] 米，持续移动。也就是说，每次移动后你的方位会发生逆时针变化。
编写一个 O(1) 空间复杂度的一趟扫描算法，判断你所经过的路径是否相交。

示例 1:
┌───┐
│   │
└───┼──>
    │

输入: [2,1,1,2]
输出: true 

示例 2:
┌──────┐
│      │
│
│
└────────────>
输入: [1,2,3,4]
输出: false 

示例 3:
┌───┐
│   │
└───┼>
输入: [1,1,1,1]
输出: true 
**/
/**
 * @param {number[]} x
 * @return {boolean}
 */
var isSelfCrossing = function(x) {

};

/**
336. 回文对
给定一组 互不相同 的单词， 找出所有不同 的索引对(i, j)，使得列表中的两个单词， words[i] + words[j] ，可拼接成回文串。

示例 1：
输入：["abcd","dcba","lls","s","sssll"]
输出：[[0,1],[1,0],[3,2],[2,4]] 
解释：可拼接成的回文串为 ["dcbaabcd","abcddcba","slls","llssssll"]

示例 2：
输入：["bat","tab","cat"]
输出：[[0,1],[1,0]] 
解释：可拼接成的回文串为 ["battab","tabbat"]
**/
/**
 * @param {string[]} words
 * @return {number[][]}
 */
var palindromePairs = function(words) {
	let isPallin = function(str) {
		//双指针法
		let l = 0, r = str.length-1
		while(l<r) {
			if(str[l]!=str[r]) {
				return false
			}
			l++
			r--
		}
		return true
	}
	let res = []
	for(let i = 0; i<words.length; i++) {
		for(let j = 0; j<words.length; j++) {
			if(i==j){
				continue
			}
			if(isPallin(words[i]+words[j])) {
				res.push([i, j])
			}
		}
	}
	return res
};
words = ["abcd","dcba","lls","s","sssll"]
words = ["a",""]
console.log('palindromePairs:', palindromePairs(words))
/**
337. 打家劫舍 III
在上次打劫完一条街道之后和一圈房屋后，小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，我们称之为“根”。 
除了“根”之外，每栋房子有且只有一个“父“房子与之相连。一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。 如果两个直接相连的房子在同一天晚上被打劫，房屋将自动报警。
计算在不触动警报的情况下，小偷一晚能够盗取的最高金额。

示例 1:
输入: [3,2,3,null,3,null,1]

     3
    / \
   2   3
    \   \ 
     3   1

输出: 7 
解释: 小偷一晚能够盗取的最高金额 = 3 + 3 + 1 = 7.

示例 2:
输入: [3,4,5,1,3,null,1]

     3
    / \
   4   5
  / \   \ 
 1   3   1

输出: 9
解释: 小偷一晚能够盗取的最高金额 = 4 + 5 = 9.


分析
我们可以用 f(o) 表示选择 o 节点的情况下，o 节点的子树上被选择的节点的最大权值和；g(o)表示不选择 o 节点的情况下，o 节点的子树上被选择的节点的最大权值和；l 和 r 代表 o 的左右孩子。

	当 o 被选中时，o 的左右孩子都不能被选中，故 o 被选中情况下子树上被选中点的最大权值和为 l 和 r 不被选中的最大权值和相加，即 f(o)=g(l)+g(r)。
	当 o 不被选中时，o 的左右孩子可以被选中，也可以不被选中。对于 o 的某个具体的孩子 x，它对 o 的贡献是 x 被选中和不被选中情况下权值和的较大值。故g(o)=max{f(l),g(l)}+max{f(r),g(r)}。
**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var rob = function(root) {
	//时间复杂度O(n) 空间复杂度O(n)
	let f = new Map(), g = new Map() //缓存
	let dfs = function(node){
		if(!node) {
			return
		}
		dfs(node.left)
		dfs(node.right)
		//选中
		f.set(node, node.val + (g.get(node.left) || 0)+(g.get(node.right)||0))
		//不选
		g.set(node, Math.max(f.get(node.left)||0, g.get(node.left)||0)+Math.max(f.get(node.right)||0, g.get(node.right)||0))
	}
	dfs(root)
	return Math.max(f.get(root)||0, g.get(root)||0)
};
var tN1 = new TreeNode(3)
var tN2 = new TreeNode(2)
var tN3 = new TreeNode(3)
var tN4 = new TreeNode(3)
var tN5 = new TreeNode(1)
tN1.left = tN2
tN1.right = tN3
tN2.right = tN4
tN3.right = tN5
console.log('rob:', rob(tN1))
/**
338. 比特位计数
给定一个非负整数 num。对于 0 ≤ i ≤ num 范围中的每个数字 i ，计算其二进制数中的 1 的数目并将它们作为数组返回。

示例 1:

输入: 2
输出: [0,1,1]
示例 2:

输入: 5
输出: [0,1,1,2,1,2]
进阶:

给出时间复杂度为O(n*sizeof(integer))的解答非常容易。但你可以在线性时间O(n)内用一趟扫描做到吗？
要求算法的空间复杂度为O(n)。
你能进一步完善解法吗？要求在C++或任何其他语言中不使用任何内置函数（如 C++ 中的 __builtin_popcount）来执行此操作。
tip:
在二进制表示中，数字 n 中最低位的 1 总是对应 n - 1n 中的 0 。因此，将 n 和 n−1 与运算总是能把 n 中最低位的 1 变成 0 ，并保持其他位不变。
**/
/**
 * @param {number} num
 * @return {number[]}
 */
var countBits = function(num) {
	let max = 32;
	let getCount = function(_num) {
		let count = 0;
		for(let i = 0; i<32; i++){
			let res = (_num>>i)&1;
			count+=res;
		}
		return count;
	}
	let getCount2 = function(_num) {
		//而是不断把数字最后一个 1 反转
		let count = 0;
		while(_num!=0) {
			count++;
			_num &= _num-1;
		}
		return count;
	}
	let res = []
	for(let i = 0; i<=num; i++) {
		res.push(getCount2(i));
	}
	return res;
};
console.log('countBits:', countBits(5))

/**
341. 扁平化嵌套列表迭代器
给你一个嵌套的整型列表。请你设计一个迭代器，使其能够遍历这个整型列表中的所有整数。
列表中的每一项或者为一个整数，或者是另一个列表。其中列表的元素也可能是整数或是其他列表。

示例 1:
输入: [[1,1],2,[1,1]]
输出: [1,1,2,1,1]
解释: 通过重复调用 next 直到 hasNext 返回 false，next 返回的元素的顺序应该是: [1,1,2,1,1]。
示例 2:

输入: [1,[4,[6]]]
输出: [1,4,6]
解释: 通过重复调用 next 直到 hasNext 返回 false，next 返回的元素的顺序应该是: [1,4,6]。
**/
/**
 * // This is the interface that allows for creating nested lists.
 * // You should not implement it, or speculate about its implementation
 * function NestedInteger() {
 *
 *     Return true if this NestedInteger holds a single integer, rather than a nested list.
 *     @return {boolean}
 *     this.isInteger = function() {
 *         ...
 *     };
 *
 *     Return the single integer that this NestedInteger holds, if it holds a single integer
 *     Return null if this NestedInteger holds a nested list
 *     @return {integer}
 *     this.getInteger = function() {
 *         ...
 *     };
 *
 *     Return the nested list that this NestedInteger holds, if it holds a nested list
 *     Return null if this NestedInteger holds a single integer
 *     @return {NestedInteger[]}
 *     this.getList = function() {
 *         ...
 *     };
 * };
 */
/**
 * @constructor
 * @param {NestedInteger[]} nestedList
 */
var NestedIterator = function(nestedList) {
    //转换成一个数组
    let res = []
    let getOne = function(list){
    	for(let i = 0; i<list.length; i++) {
    		if(list[i] instanceof Array) {
    			getOne(list[i]);
    		}else {
    			res.push(list[i])
    		}
    	}
    }
    getOne(nestedList)
    this._res = res
    this._idx = 0
    this._len = this._res.length
};


/**
 * @this NestedIterator
 * @returns {boolean}
 */
NestedIterator.prototype.hasNext = function() {
    return this._idx<this._len;
};

/**
 * @this NestedIterator
 * @returns {integer}
 */
NestedIterator.prototype.next = function() {
    return this._res[this._idx++];
};

/**
 * Your NestedIterator will be called like this:
 * var i = new NestedIterator(nestedList), a = [];
 * while (i.hasNext()) a.push(i.next());
*/
let nested = new NestedIterator([[1,1],2,[1,1]])
var res = []
while(nested.hasNext()) {
	res.push(nested.next())
}
console.log('NestedIterator:', res)
console.log(typeof(123))

/**
342. 4的幂
给定一个整数，写一个函数来判断它是否是 4 的幂次方。如果是，返回 true ；否则，返回 false 。
整数 n 是 4 的幂次方需满足：存在整数 x 使得 n == 4x

示例 1：

输入：n = 16
输出：true
示例 2：

输入：n = 5
输出：false
示例 3：

输入：n = 1
输出：true
 
提示：
-231 <= n <= 231 - 1

进阶：
你能不使用循环或者递归来完成本题吗？

解题思路
如果数字为 4 的幂 x = 4^ax=4 
a
 ，则 a = \log_4 x = \frac{1}{2}\log_2 xa=log 
4
​	
 x= 
2
1
​	
 log 
2
​	
 x 应为整数，那么我们检查 \log_2 xlog 
2
​	
 x 是否为偶数就能判断 x 是否为 4 的幂。
**/
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfFour = function(n) {
	return (n>0 && Math.log2(n) % 2 == 0)
};

console.log('isPowerOfFour:', isPowerOfFour(5))

/**
343. 整数拆分
给定一个正整数 n，将其拆分为至少两个正整数的和，并使这些整数的乘积最大化。 返回你可以获得的最大乘积。

示例 1:

输入: 2
输出: 1
解释: 2 = 1 + 1, 1 × 1 = 1。
示例 2:

输入: 10
输出: 36
解释: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36。
说明: 你可以假设 n 不小于 2 且不大于 58。

思路
创建数组 dp，其中 dp[i] 表示将正整数 i 拆分成至少两个正整数的和之后，这些正整数的最大乘积。特别地，0 不是正整数，1 是最小的正整数，0 和 1 都不能拆分，因此dp[0]=dp[1]=0。

当 i≥2 时，假设对正整数 i 拆分出的第一个正整数是 j（1≤j<i），则有以下两种方案：

将 i 拆分成 j 和 i−j 的和，且 i−j 不再拆分成多个正整数，此时的乘积是 j×(i−j)；

将 i 拆分成 j 和 i−j 的和，且 i−j 继续拆分成多个正整数，此时的乘积是j×dp[i−j]。
**/

/**
 * @param {number} n
 * @return {number}
 */
var integerBreak = function(n) {
	let dp = [0, 0]
	for(let i = 2; i<=n; i++) {
		let curMax = 0;
		for(let j = 1; j<i; j++) {
			curMax = Math.max(curMax, j*(i-j), j*dp[i-j])
		}
		dp[i] = curMax
	}
	return dp[n]
};
console.log('integerBreak:', integerBreak(10))
/**
344. 反转字符串
编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 char[] 的形式给出。
不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。
你可以假设数组中的所有字符都是 ASCII 码表中的可打印字符。

示例 1：
输入：["h","e","l","l","o"]
输出：["o","l","l","e","h"]

示例 2：
输入：["H","a","n","n","a","h"]
输出：["h","a","n","n","a","H"]

**/
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
	let temp = null
	let len = s.length;
	for(let i = 0; i<parseInt(len/2); i++) {
		temp = s[i]
		s[i] = s[len-i-1]
		s[len-i-1] = temp
	}
};
reverseString(["1","2","3","4"])

/**
345. 反转字符串中的元音字母
编写一个函数，以字符串作为输入，反转该字符串中的元音字母。

示例 1：
输入："hello"
输出："holle"

示例 2：
输入："leetcode"
输出："leotcede"
 
提示：
元音字母不包含字母 "y" 。
**/
/**
 * @param {string} s
 * @return {string}
 */
var reverseVowels = function(s) {
	let yMap = {a: true, e: true, i: true, o: true, u: true,
				A: true, E: true, I: true, O: true, U: true}
	let res = []
	let len = s.length
	let idxs = []
	for(let i = 0; i<s.length; i++) {
		res[i] = s[i]
		if(yMap[s[i]]) {
			idxs.push(i)
		}
	}
	len = idxs.length
	for(let i = 0; i<len; i++) {
		res[idxs[i]] = s[idxs[len-1-i]]
	}
	return res.join('')
};
console.log('reverseVowels:', reverseVowels("leetcode"))

/**
347. 前 K 个高频元素
给定一个非空的整数数组，返回其中出现频率前 k 高的元素。

示例 1:
输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]

示例 2:
输入: nums = [1], k = 1
输出: [1]
 
提示：
你可以假设给定的 k 总是合理的，且 1 ≤ k ≤ 数组中不相同的元素的个数。
你的算法的时间复杂度必须优于 O(n log n) , n 是数组的大小。
题目数据保证答案唯一，换句话说，数组中前 k 个高频元素的集合是唯一的。
你可以按任意顺序返回答案。

时间复杂度O(n*logn)
空间复杂度O(n)
**/
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
	//快速排序
	let numsMap = {}
	let temp = []
	for(let i = 0; i<nums.length; i++) {
		if(!numsMap[nums[i]]) {
			numsMap[nums[i]] = 0
			temp.push(nums[i])
		}
		numsMap[nums[i]]++
	}
	nums = temp
	let len = nums.length
	let quickFind = function(l, r){
		if(l<r) {
			let i = l, j = r, x = nums[l]
			while(i<j) {
				//从右边找<x的值
				while(i<j && numsMap[nums[j]]>=numsMap[x]) {
					j--
				}
				if(i<j) {
					nums[i++] = nums[j]
				}
				//从左边找>x的值
				while(i<j&&numsMap[nums[i]]<numsMap[x]) {
					i++
				}
				if(i<j){
					nums[j--] = nums[i]
				}
			}
			nums[i] = x//i是有序的
			if(len-i == k) {
				return i
			}else if(len-i<k){
				return quickFind(l, i-1)
			}else {
				return quickFind(i+1, r)
			}
			
		}
		return l
	}
	let idx = quickFind(0, nums.length-1)
	return nums.slice(idx, nums.length)
};
console.log('topKFrequent:', topKFrequent([1,1,1,2,2,3,3,3,3], 2))

/**
349. 两个数组的交集
给定两个数组，编写一个函数来计算它们的交集。

示例 1：
输入：nums1 = [1,2,2,1], nums2 = [2,2]
输出：[2]

示例 2：
输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出：[9,4]
 
说明：
输出结果中的每个元素一定是唯一的。
我们可以不考虑输出结果的顺序。
**/
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
	let nums1Map = {}
	for(let v of nums1) {
		nums1Map[v] = true
	}
	let resMap = {}
	let res = []
	for(let v of nums2) {
		if(nums1Map[v] && !resMap[v]) {
			resMap[v] = true
			res.push(v)
		}
	}
	return res
};
var nums1 = [4,9,5], nums2 = [9,4,9,8,4]
console.log('intersection:', intersection(nums1, nums2))

/**
350. 两个数组的交集 II
给定两个数组，编写一个函数来计算它们的交集。

示例 1：
输入：nums1 = [1,2,2,1], nums2 = [2,2]
输出：[2,2]

示例 2:
输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出：[4,9]

说明：
输出结果中每个元素出现的次数，应与元素在两个数组中出现次数的最小值一致。
我们可以不考虑输出结果的顺序。

进阶：
如果给定的数组已经排好序呢？你将如何优化你的算法？
如果 nums1 的大小比 nums2 小很多，哪种方法更优？
如果 nums2 的元素存储在磁盘上，内存是有限的，并且你不能一次加载所有的元素到内存中，你该怎么办？
**/
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
	let nums1Map = {}
	for(let v of nums1) {
		nums1Map[v] = nums1Map[v] || 0
		nums1Map[v]++
	}
	let res = []
	for(let v of nums2) {
		nums1Map[v] = nums1Map[v] || 0
		if(nums1Map[v]>0) {
			res.push(v)
			nums1Map[v]--
		}
	}
	return res
};
var nums1 = [1,2,2,1], nums2 = [2,2]
nums1 = [4,9,5], nums2 = [9,4,9,8,4]
console.log('intersect:', intersect(nums1, nums2))

/**
352. 将数据流变为多个不相交区间
给定一个非负整数的数据流输入 a1，a2，…，an，…，将到目前为止看到的数字总结为不相交的区间列表。

例如，假设数据流中的整数为 1，3，7，2，6，…，每次的总结为：
[1, 1]
[1, 1], [3, 3]
[1, 1], [3, 3], [7, 7]
[1, 3], [7, 7]
[1, 3], [6, 7]
 
进阶：
如果有很多合并，并且与数据流的大小相比，不相交区间的数量很小，该怎么办?

提示：
特别感谢 @yunhong 提供了本问题和其测试用例。
**/
/**
 * Initialize your data structure here.
 */
var SummaryRanges = function() {
	this.res = [] //数据集合
};

/** 
 * @param {number} val
 * @return {void}
 */
SummaryRanges.prototype.addNum = function(val) {
	//查找位置，插入
	let res = this.res
	let len = res.length
	if(res.length<=0) {
		res.push([val, val])
		return
	}
	//处理边界
	if(val<res[0][0]-1) {
		res.splice(0, 0, [val, val])
		return
	}else if(val<res[0][0]) {
		res[0][0] = val
		return
	}
	if(val>res[len-1][1]+1) {
		res.push([val, val])
		return
	}else if(val>res[len-1][1]) {
		res[len-1][1] = val
		return
	}

	//二分查找，查找最右边的 第一个值<val的
	let l = 0, r = res.length-1
	while(l<r) {
		let mid = parseInt((l+r+1)/2)
		if(res[mid][0]>val) {
			r = mid-1
		}else{
			l = mid
		}
	}
	//处理

	if(val>=res[l][0] && val<=res[l][1]) {
		//处于中间，不处理
		return;
	}else if(val>res[l][1]+1 && val<res[l+1][0]-1) {
		//插入中间
		res.splice(l+1, 0, [val, val])
		return;
	}else if(val == res[l][1]+1 && val == res[l+1][0]-1) {
		//合并两个区间
		let right = res[l+1][1]
		res.splice(l+1, 1)
		res[l][1] = right
		return
	}else if(val == res[l][1]+1) {
		//合并右
		res[l][1] = val
		return
	}else if(val == res[l+1][0]-1) {
		//合并左
		res[l+1][0] = val
		return
	}
};

/**
 * @return {number[][]}
 */
SummaryRanges.prototype.getIntervals = function() {
	return this.res
};

/**
 * Your SummaryRanges object will be instantiated and called as such:
 * var obj = new SummaryRanges()
 * obj.addNum(val)
 * var param_2 = obj.getIntervals()
 */
 var obj = new SummaryRanges()
 obj.addNum(1)
 obj.addNum(3)
 obj.addNum(7)
 obj.addNum(2)
 obj.addNum(6)
 var param_2 = obj.getIntervals()
 console.log('SummaryRanges:', param_2)

 /**
 354. 俄罗斯套娃信封问题
给定一些标记了宽度和高度的信封，宽度和高度以整数对形式 (w, h) 出现。当另一个信封的宽度和高度都比这个信封大的时候，这个信封就可以放进另一个信封里，如同俄罗斯套娃一样。
请计算最多能有多少个信封能组成一组“俄罗斯套娃”信封（即可以把一个信封放到另一个信封里面）。

说明:
不允许旋转信封。

示例:

输入: envelopes = [[5,4],[6,4],[6,7],[2,3]]
输出: 3 
解释: 最多信封的个数为 3, 组合为: [2,3] => [5,4] => [6,7]。

思路：
二分查找
时间复杂度O(n*logn)
空间复杂度O(n)
 **/
 /**
 * @param {number[][]} envelopes
 * @return {number}
 */
var maxEnvelopes = function(envelopes) {
	//元素排序 w升序，h降序
	envelopes.sort((a, b)=>{
		if(a[0]!=b[0]) {
			return a[0]-b[0]
		}
		return b[1]-a[1]
	})
	//取出h判断
	let temp = []
	for(let v of envelopes) {
		temp.push(v[1])
	}
	//遍历查找
	let binarySearch = function(arr, value){
		//二分查找插入的位置
		if(arr.length<=0) {
			return 0
		}else if(value<arr[0]) {
			return 0
		}
		let l = 0, r = arr.length-1
		while(l<r) {
			let mid = parseInt((l+r)/2)
			if(arr[mid] == value) {
				return mid
			}else if(arr[mid]<value) {
				l = mid+1
			}else {
				r = mid
			}
		}
		if(l == arr.length-1 && value>arr[l]) {
			l = l+1
		}
		return -l
	}
	let res = []
	let len = 0
	console.log(temp)
	for(let i = 0; i<temp.length; i++) {
		let p = binarySearch(res, temp[i])
		console.log(res, p)
		if(p<0){
			p = -p
		}
		res[p] = temp[i]//替换掉
		if(p == len) {
			len++
		}
	}
	console.log(res)
	return len
};
var envelopes = [[5,4],[6,4],[6,7],[2,3]]
envelopes = [[4,5],[4,6],[6,7],[2,3],[1,1]]
envelopes = [[30,50],[12,2],[3,4],[12,15]]
envelopes = [[1,3],[3,5],[6,7],[6,8],[8,4],[9,5]]
console.log('maxEnvelopes:', maxEnvelopes(envelopes))

/**
355. 设计推特
设计一个简化版的推特(Twitter)，可以让用户实现发送推文，关注/取消关注其他用户，能够看见关注人（包括自己）的最近十条推文。你的设计需要支持以下的几个功能：

postTweet(userId, tweetId): 创建一条新的推文
getNewsFeed(userId): 检索最近的十条推文。每个推文都必须是由此用户关注的人或者是用户自己发出的。推文必须按照时间顺序由最近的开始排序。
follow(followerId, followeeId): 关注一个用户
unfollow(followerId, followeeId): 取消关注一个用户
示例:

Twitter twitter = new Twitter();

// 用户1发送了一条新推文 (用户id = 1, 推文id = 5).
twitter.postTweet(1, 5);

// 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
twitter.getNewsFeed(1);

// 用户1关注了用户2.
twitter.follow(1, 2);

// 用户2发送了一个新推文 (推文id = 6).
twitter.postTweet(2, 6);

// 用户1的获取推文应当返回一个列表，其中包含两个推文，id分别为 -> [6, 5].
// 推文id6应当在推文id5之前，因为它是在5之后发送的.
twitter.getNewsFeed(1);

// 用户1取消关注了用户2.
twitter.unfollow(1, 2);

// 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
// 因为用户1已经不再关注用户2.
twitter.getNewsFeed(1);
**/
var MAX_LEN = 10
class TwitterUser {
	constructor(userId) {
		this.userId = userId;
		this.follows = {};//关注的用户
		this.contents = [];//发送的消息
	}
	postTweet(data) {
		if(this.contents.length>MAX_LEN) {
			this.contents.splice(0, 1)
		}
		this.contents.push(data)
	}
	follow(user) {
		this.follows[user.userId] = user
	}
	unfollow(uid) {
		delete this.follows[uid]
	}
}
class TwitterData {
	static _idx = 0
	constructor(tweetId, userId) {
		this.tweetId = tweetId
		this.order = TwitterData._idx++
		this.userId = userId
	}
}
/**
 * Initialize your data structure here.
 */
var Twitter = function() {
	this.users = {}
};

/**
 * Compose a new tweet. 
 * @param {number} userId 
 * @param {number} tweetId
 * @return {void}
 */
Twitter.prototype.postTweet = function(userId, tweetId) {
	let user = this.users[userId]
	if(!user) {
		user = new TwitterUser(userId)
		this.users[userId] = user
	}
	let data = new TwitterData(tweetId, userId)
	user.postTweet(data)
};

/**
 * Retrieve the 10 most recent tweet ids in the user's news feed. Each item in the news feed must be posted by users who the user followed or by the user herself. Tweets must be ordered from most recent to least recent. 
 * @param {number} userId
 * @return {number[]}
 */
Twitter.prototype.getNewsFeed = function(userId) {
	let user = this.users[userId]
	if(!user) {
		return []
	}
	let returnRes = function(arr) {
		let ans = []
		for(let data of ans) {
			ans.push(ans.tweetId)
		}
		return returnRes
	}
	let res = user.contents.slice(Math.max(0, user.contents.length-MAX_LEN))
	let follows = user.follows
	for(let uid in follows) {
		let oneUser = follows[uid]
		let oneContents = oneUser.contents
		//归并排序
		let ans = []
		let i = 0, j = 0
		while(i<res.length && j<oneContents.length) {
			if(res[i].order<oneContents[j].order) {
				ans.push(res[i])
				i++
			}else{
				ans.push(oneContents[j])
				j++
			}
		}
		if(i<res.length) {
			for(let k = i; k<res.length; k++){
				ans.push(res[k])
			}
		}
		if(j<oneContents.length) {
			for(let k = j; k<oneContents.length; k++){
				ans.push(oneContents[k])
			}
		}
		j = ans.length
		i = Math.max(0, j - MAX_LEN)
		res = ans.slice(i, j)
	}
	let temp = []
	for(let i = res.length-1; i>=0; i--) {
		temp.push(res[i].tweetId)
	}

	return temp
};

/**
 * Follower follows a followee. If the operation is invalid, it should be a no-op. 
 * @param {number} followerId 
 * @param {number} followeeId
 * @return {void}
 */
Twitter.prototype.follow = function(followerId, followeeId) {
	let user1 = this.users[followerId]
	if(!user1) {
		user1 = new TwitterUser(followerId)
		this.users[followerId] = user1
	}
	let user2 = this.users[followeeId]
	if(!user2) {
		user2 = new TwitterUser(followeeId)
		this.users[followeeId] = user2
	}
	if(followerId != followeeId) {
		user1.follow(user2)
	}
};

/**
 * Follower unfollows a followee. If the operation is invalid, it should be a no-op. 
 * @param {number} followerId 
 * @param {number} followeeId
 * @return {void}
 */
Twitter.prototype.unfollow = function(followerId, followeeId) {
	let user1 = this.users[followerId]
	if(!user1) {
		return
	}
	user1.unfollow(followeeId)
};

/**
 * Your Twitter object will be instantiated and called as such:
 * var obj = new Twitter()
 * obj.postTweet(userId,tweetId)
 * var param_2 = obj.getNewsFeed(userId)
 * obj.follow(followerId,followeeId)
 * obj.unfollow(followerId,followeeId)
 */
var twitter = new Twitter();

// 用户1发送了一条新推文 (用户id = 1, 推文id = 5).
twitter.postTweet(1, 5);

// 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
var feeds = twitter.getNewsFeed(1);
console.log('feeds:', feeds)

// 用户1关注了用户2.
twitter.follow(1, 2);

// 用户2发送了一个新推文 (推文id = 6).
twitter.postTweet(2, 6);

// 用户1的获取推文应当返回一个列表，其中包含两个推文，id分别为 -> [6, 5].
// 推文id6应当在推文id5之前，因为它是在5之后发送的.
feeds = twitter.getNewsFeed(1);
console.log('feeds:', feeds)

// 用户1取消关注了用户2.
twitter.unfollow(1, 2);

// 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
// 因为用户1已经不再关注用户2.
feeds = twitter.getNewsFeed(1);
console.log('feeds:', feeds)
/**
357. 计算各个位数不同的数字个数
给定一个非负整数 n，计算各位数字都不同的数字 x 的个数，其中 0 ≤ x < 10n 。

示例:

输入: 2
输出: 91 
解释: 答案应为除去 11,22,33,44,55,66,77,88,99 外，在 [0,100) 区间内的所有数字。
**/
/**
 * @param {number} n
 * @return {number}
 */
var countNumbersWithUniqueDigits = function(n) {
	let checkNoSame = function(value) {
		let temp = {}
		while(value>0) {
			let mod = value%10
			if(temp[mod]) {
				return false
			}
			temp[mod] = true
			value = parseInt(value/10)
		}
		return true
	}
	let num = 0;
	let end = Math.pow(10, n)
	for(let i = 0; i<end; i++) {
		if(checkNoSame(i)) {
			num++
		}
	}
	return num
};
var countNumbersWithUniqueDigits1 = function(n) {
	if(n == 0) return 1;
	n = Math.min(n, 10);
	let ans = 10, base = 9, sum = 9;
	for(let i = 1; i < n; ++i){
	    ans += sum *= base--;
	}
	return ans;
}
console.log('countNumbersWithUniqueDigits:', countNumbersWithUniqueDigits1(2))
/**
363. 矩形区域不超过 K 的最大数值和
给定一个非空二维矩阵 matrix 和一个整数 k，找到这个矩阵内部不大于 k 的最大矩形和。

示例:

输入: matrix = [[1,0,1],[0,-2,3]], k = 2
输出: 2 
解释: 矩形区域 [[0, 1], [-2, 3]] 的数值和是 2，且 2 是不超过 k 的最大数字（k = 2）。
说明：

矩阵内的矩形区域面积必须大于 0。
如果行数远大于列数，你将如何解答呢？
**/
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var maxSumSubmatrix = function(matrix, k) {
	//时间复杂度 O(m^2n^2) 空间复杂度 O(mn)
	//遍历
	let width = matrix[0].length
	let height = matrix.length
	let sx = 0, sy = 0
	let maxValue = -Number.MAX_VALUE
	let calSum = function(x, y) {
		//计算以x, y为顶点的矩形和的最大值
		let values = []//到某个顶点的坐标和
		for(let i = x; i<height; i++) {
			values[i-x] = []
			for(let j = y; j<width;j++) {
				let v1 = j>y?values[i-x][j-y-1]:0
				let v2 = i>x?values[i-x-1][j-y]:0
				let v3 = i>x&&j>y?values[i-x-1][j-y-1]:0
				values[i-x][j-y] = v1+v2-v3+matrix[i][j]
				if(values[i-x][j-y] <= k) {
					maxValue = Math.max(maxValue, values[i-x][j-y])
				}
				if(maxValue == k) {
					console.log(x, y, i, j)
					return true
				}
			}
		}
		return false
	}
	for(let i = 0; i<height; i++) {
		for(let j = 0; j<width; j++) {
			if(calSum(i, j)) {
				return maxValue
			}
		}
	}
	return maxValue
};
matrix = [[1,0,1],[0,-2,3]]
var k = 2
matrix = [[2,2,-1]]
k = 0
matrix = [[5,-4,-3,4],[-3,-4,4,5],[5,1,5,-4]]
k = 3
matrix = [[5,-4,-3,4],[-3,-4,4,5],[5,1,5,-4]]
k = 10
console.log('maxSumSubmatrix:', maxSumSubmatrix(matrix, k))

/**
365. 水壶问题
有两个容量分别为 x升 和 y升 的水壶以及无限多的水。请判断能否通过使用这两个水壶，从而可以得到恰好 z升 的水？

如果可以，最后请用以上水壶中的一或两个来盛放取得的 z升 水。

你允许：

装满任意一个水壶
清空任意一个水壶
从一个水壶向另外一个水壶倒水，直到装满或者倒空
示例 1: (From the famous "Die Hard" example)

输入: x = 3, y = 5, z = 4
输出: True
示例 2:

输入: x = 2, y = 6, z = 5
输出: False
（贝祖定理）：若a,b是整数,且gcd(a,b)=d，那么对于任意的整数x,y,ax+by都一定是d的倍数，特别地，一定存在整数x,y，使ax+by=d成立。
**/
/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {boolean}
 */
var canMeasureWater = function(x, y, z) {
	let gcd = function(x, y) {
        let remainder = x % y;
        while (remainder != 0) {
            x = y;
            y = remainder;
            remainder = x % y;
        }
        return y;
    }
	if (x + y < z) {
        return false;
    }
    if (x == 0 || y == 0) {
        return z == 0 || x + y == z;
    }
    return z % gcd(x, y) == 0;
};
console.log('canMeasureWater:', canMeasureWater(3, 5, 4))
/**
367. 有效的完全平方数
给定一个 正整数 num ，编写一个函数，如果 num 是一个完全平方数，则返回 true ，否则返回 false 。

进阶：不要 使用任何内置的库函数，如  sqrt 。

示例 1：

输入：num = 16
输出：true
示例 2：

输入：num = 14
输出：false

二分法
时间复杂度log(num/2)
空间复杂度O（1）
**/
/**
 * @param {number} num
 * @return {boolean}
 */
var isPerfectSquare = function(num) {
	if(num<=2){
		return true;
	}
	//二分查找2-num/2
	let left = 2, right = Math.floor(num/2)
	while(left<right) {
		let mid = Math.floor((left+right)/2)
		if(num == mid * mid){
			return true
		}
		if(mid*mid<num) {
			left = mid+1
		}else{
			right = mid-1
		}
	}
	return num == left*left
};
console.log('isPerfectSquare:', isPerfectSquare(16))

/**
368. 最大整除子集
给出一个由无重复的正整数组成的集合，找出其中最大的整除子集，子集中任意一对 (Si，Sj) 都要满足：Si % Sj = 0 或 Sj % Si = 0。

如果有多个目标子集，返回其中任何一个均可。

示例 1:

输入: [1,2,3]
输出: [1,2] (当然, [1,3] 也正确)
示例 2:

输入: [1,2,4,8]
输出: [1,2,4,8]
**/
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var largestDivisibleSubset = function(nums) {
	let isDivisible = function(arr, value){
		for(let i = 0; i<arr.length; i++) {
			if(arr[i]%value!=0 && value%arr[i]!=0) {
				return false
			}
		}
		return true
	}
	let maxLen = nums.length
	let res = []
	let temp = []
	let backTrack = function(idx){
		if(idx>=maxLen) {
			if(temp.length>res.length) {
				res = []
				for(let i = 0; i<temp.length; i++) {
					res.push(temp[i])
				}
			}
			return
		}
		//选择
		if(isDivisible(temp, nums[idx])) {
			temp.push(nums[idx])
			backTrack(idx+1)
			temp.pop()
		}
		//不选择
		backTrack(idx+1)
	}
	for(let i = 0; i<nums.length; i++) {
		backTrack(i)
	}
	return res
};
var largestDivisibleSubset2 = function(nums) {
	//方法2 思路：先排序，然后依次类推以nums[i]结尾的最大整除子集
	//时间复杂度O(n*n) 空间复杂度O(n*n)
	if(nums.length<=1) {
		return nums
	}
	// 1 由小到大排序
	nums.sort(function(a,b){
		return a-b
	})
	let DES = {} //以nums[i]结尾的最大整除子集
	let findLargestSubSet = function(idx){
		//以idx结尾的最大的子集
		let value = nums[idx]
		let res = []
		for(let i = idx-1; i>=0; i--) {
			let values = DES[nums[i]]
			if(value%nums[i]!=0 && nums[i]%value!=0) {
				continue
			}
			if(values && values.length>res.length) {
				res = values
			}
		}
		let temp = []
		for(let i = 0; i<res.length; i++) {
			temp.push(res[i])
		}
		return temp
	}
	DES[nums[0]] = [nums[0]]
	let result = DES[nums[0]]
	for(let i = 1; i<nums.length; i++) {
		let temp = findLargestSubSet(i)
		temp.push(nums[i])
		DES[nums[i]] = temp
		if(result.length<temp.length) {
			result = temp
		}
	}
	return result
}
nums = [5,9,18,54,108,540,90,180,360,720]
nums = [832,33,531,416,335,298,365,352,582,936,366,305,930,530,97,349,71,295,840,108,299,804,925,627,953,571,658,732,429,136,563,462,666,330,796,315,695,500,896,982,217,200,912,98,297,612,169,943,628,593,959,904,219,240,857,789,897,940,569,384,502,382,401,184,716,230,29,963,211,597,515,122,163,86,215,105,889,842,49,847,267,87,954,407,245,975,719,746,709,471,281,238,186,510,618,149,73,214,663,194,260,825,631,474,519,668,329,718,765,947,156,353,490,962,679,560,59,387,31,692,976,568,201,273,159,730,819,418,906,801,892,672,559,866,389,675,812,744,164,737,57,195,115,933,158,909,598,359,853,314,983,11,395,153,781,301,838,625,704,256,351,996,225,644,521,509,674,417,272,622,937,723,632,331,228,412,181,435,469,157,368,524,38,132,325,420,127,731,771,604,505,634,67,374,894,3,448,878,686,641,316,207,76,363,795,235,770,446,820,493,177,816,615,410,117,944,829,190,831,289,516,964,170,134,671,885,682,119,402,82,485,901,375,68,858,739,56,974,683,884,815,872,715,104,290,348,588,834,788,472,466,867,550,779,65,802,459,440,870,753,608,808,623,642,44,437,865,758,540,506,691,958,854,546,39,595,369,504,63,311,722,441,786,899,338,651,874,946,811,848,939,284,824,309,653,133,514,460,678,54,399,759,468,61,480,783,266,900,400,237,403,534,213,914,473,198,380,373,288,154,844,535,409,249,285,168,69,345,647,851,846,264,102,246,106,648,576,212,438,981,987,379,360,667,95,172,101,580,891,385,747,161,927,361,818,657,171,342,232,734,714,362,425,475,28,41,551,142,131,51,229,9,607,326,522,687,792,845,665,358,91,720,155,565,99,26,650,539,780,589,950,935,372,227,424,750,833,554,841,552,60,757,430,916,140,790,426,776,96,199,923,806,949,755,711,659,911,611,310,774,265,880,690,706,761,286,255,756,204,444,478,601,529,669,241,784,566,528,208,270,511,236,271,378,58,453,467,233,250,567,296,932,989,367,626,35,162,887,572,603,564,797,280,406,970,689,408,431,638,489,85,50,357,803,47,555,793,422,763,110,869,861,253,320,538,347,405,769,64,875,630,537,328,553,166,948,303,160,800,507,920,922,90,693,636,17,455,183,210,856,762,656,174,873,579,176,688,640,1,938,902,341,740,581,427,111,972,443,22,791,304,574,575,725,477,700,817,381,479,248,121,411,547,182,871,599,203,13,224,541,724,178,775,388,4,251,321,52,88,100,279,614,839,84,151,735,40,752,773,376,77,476,708,396,988,961,24,231,445,609,952,965,986,414,451,881,42,257,32,334,130,596,527,94,333,317,244,960,710,852,862,421,81,37,452,274,187,268,520,491,778,18,743,620,145,72,370,118,748,633,997,436,143,573,495,180,34]
console.log('largestDivisibleSubset:', largestDivisibleSubset2(nums))

/**
371. 两整数之和
不使用运算符 + 和 - ​​​​​​​，计算两整数 ​​​​​​​a 、b ​​​​​​​之和。

示例 1:

输入: a = 1, b = 2
输出: 3
示例 2:

输入: a = -2, b = 3
输出: 1
思路
二进制计算时，不考虑进位运算结果为 a^b
考虑进位，计算需要进位的大小：
0 & 0 = 不进位
1 & 0 = 不进位
0 & 1 = 不进位
1 & 1 = 进位
所以进位为：（a&b）<<1;
**/
/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var getSum = function(a, b) {
	while(b) {
		let tmp = a^b //没有进位
		b = (a&b)<<1 //进位
		a = tmp
	}
	return a;
};
console.log('getSum:', getSum(-2, 3))
/**
372. 超级次方
你的任务是计算 ab 对 1337 取模，a 是一个正整数，b 是一个非常大的正整数且会以数组形式给出。

示例 1：
输入：a = 2, b = [3]
输出：8

示例 2：
输入：a = 2, b = [1,0]
输出：1024

示例 3：
输入：a = 1, b = [4,3,3,8,5,2]
输出：1

示例 4：
输入：a = 2147483647, b = [2,0,0]
输出：1198
 
提示：
1 <= a <= 231 - 1
1 <= b.length <= 2000
0 <= b[i] <= 9
b 不含前导 0

思路
**/
/**
 * @param {number} a
 * @param {number[]} b
 * @return {number}
 */
 let base = 1337;
// 计算 a 的 k 次方然后与 base 求模的结果
let mypow = function(a, k) {
	//公式 (a * b) % k = (a % k)(b % k) % k
    // 对因子求模
    a %= base;
    let res = 1;
    for (let _ = 0; _ < k; _++) {
        // 这里有乘法，是潜在的溢出点
        res *= a;
        // 对乘法结果求模
        res %= base;
    }
    return res;
}
var superPow = function(a, b) {
	// a的[1,2,3]次方 = a的3次方*(a的[1,2]次方)的10次方
	if (b.length<=0) return 1;
    let last = b.pop();
    
    let part1 = mypow(a, last);
    let part2 = mypow(superPow(a, b), 10);
    // 每次乘法都要求模
    return (part1 * part2) % base;
};
console.log('superPow:', superPow(2, [1,0]))

/**
373. 查找和最小的K对数字
给定两个以升序排列的整形数组 nums1 和 nums2, 以及一个整数 k。
定义一对值 (u,v)，其中第一个元素来自 nums1，第二个元素来自 nums2。
找到和最小的 k 对数字 (u1,v1), (u2,v2) ... (uk,vk)。

示例 1:
输入: nums1 = [1,7,11], nums2 = [2,4,6], k = 3
输出: [1,2],[1,4],[1,6]
解释: 返回序列中的前 3 对数：
     [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]

示例 2:
输入: nums1 = [1,1,2], nums2 = [1,2,3], k = 2
输出: [1,1],[1,1]
解释: 返回序列中的前 2 对数：
     [1,1],[1,1],[1,2],[2,1],[1,2],[2,2],[1,3],[1,3],[2,3]

示例 3:
输入: nums1 = [1,2], nums2 = [3], k = 3 
输出: [1,3],[2,3]
解释: 也可能序列中所有的数对都被返回:[1,3],[2,3]
**/
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k
 * @return {number[][]}
 */
var kSmallestPairs = function(nums1, nums2, k) {
	//时间复杂度O(N1*N2) 空间复杂度O(N1*N2*3)
	let res = []
	for(let i = 0; i<nums1.length; i++) {
		for(let j = 0; j<nums2.length; j++) {
			let num = nums1[i]+nums2[j]
			res.push([num, nums1[i], nums2[j]])
		}
	}
	res.sort(function(a, b) {
		return a[0]-b[0]
	})
	let result = []
	k = Math.min(k, res.length)
	for(let i = 0; i<k; i++) {
		result.push([res[i][1], res[i][2]])
	}
	return result
};
var kSmallestPairs1 = function(nums1, nums2, k) {
	//直接找 N1个指针移动
	//时间复杂度O(k*N1), 空间复杂度O(N1)
	let points = []
	let result = []
	for(let j = 0; j<nums1.length; j++) {
		points.push(0)
	}
	let findMin = function() {
		let minId = 0
		let minValue = Number.MAX_VALUE
		for(let i = 0; i<points.length; i++) {
			if(points[i]>=nums2.length) {
				continue
			}
			let value = nums1[i]+nums2[points[i]]
			if(value<minValue) {
				minId = i
				minValue = value
			}
		}
		result.push([nums1[minId], nums2[points[minId]]])
		points[minId]++
	}
	k = Math.min(nums1.length*nums2.length, k)
	for(let i = 0; i<k; i++) {
		findMin()
	}
	return result
}
nums1 = [1,1,2], nums2 = [1,2,3], k = 2
nums1 = [1,7,11], nums2 = [2,4,6], k = 3
nums1 = [1,2,4,5,6], nums2 = [3,5,7,9], k = 20
console.log('kSmallestPairs:', kSmallestPairs1(nums1, nums2, k))

/**
374. 猜数字大小
猜数字游戏的规则如下：

每轮游戏，我都会从 1 到 n 随机选择一个数字。 请你猜选出的是哪个数字。
如果你猜错了，我会告诉你，你猜测的数字比我选出的数字是大了还是小了。
你可以通过调用一个预先定义好的接口 int guess(int num) 来获取猜测结果，返回值一共有 3 种可能的情况（-1，1 或 0）：

-1：我选出的数字比你猜的数字小 pick < num
1：我选出的数字比你猜的数字大 pick > num
0：我选出的数字和你猜的数字一样。恭喜！你猜对了！pick == num
返回我选出的数字。

示例 1：
输入：n = 10, pick = 6
输出：6

示例 2：
输入：n = 1, pick = 1
输出：1

示例 3：
输入：n = 2, pick = 1
输出：1

示例 4：
输入：n = 2, pick = 2
输出：2

提示：
1 <= n <= 231 - 1
1 <= pick <= n
**/
/** 
 * Forward declaration of guess API.
 * @param {number} num   your guess
 * @return 	            -1 if num is lower than the guess number
 *			             1 if num is higher than the guess number
 *                       otherwise return 0
 * var guess = function(num) {}
 */
var guess = function(num) {
	let res = 6
	return res>num?1:(num==res?0:-1)
}
/**
 * @param {number} n
 * @return {number}
 */
var guessNumber = function(n) {
	//时间复杂度logN
    //二分查找
    let left = 1, right = n;
    while(left<right) {
    	let mid = Math.floor((left+right)/2)
    	if(guess(mid) == 0) {
    		return mid
    	}else if(guess(mid)<0) {//结果比mid小
    		right = mid-1
    	}else{
    		left = mid+1
    	}
    }
    return left
};
console.log('guessNumber:', guessNumber(10))
/**
375. 猜数字大小 II
我们正在玩一个猜数游戏，游戏规则如下：
我从 1 到 n 之间选择一个数字，你来猜我选了哪个数字。
每次你猜错了，我都会告诉你，我选的数字比你的大了或者小了。
然而，当你猜了数字 x 并且猜错了的时候，你需要支付金额为 x 的现金。直到你猜到我选的数字，你才算赢得了这个游戏。

示例:
n = 10, 我选择了8.
第一轮: 你猜我选择的数字是5，我会告诉你，我的数字更大一些，然后你需要支付5块。
第二轮: 你猜是7，我告诉你，我的数字更大一些，你支付7块。
第三轮: 你猜是9，我告诉你，我的数字更小一些，你支付9块。
游戏结束。8 就是我选的数字。

你最终要支付 5 + 7 + 9 = 21 块钱。
给定 n ≥ 1，计算你至少需要拥有多少现金才能确保你能赢得这个游戏。

思路1 暴力法
首先，我们需要意识到我们在范围 (1, n)(1,n) 中猜数字的时候，需要考虑最坏情况下的代价。也就是说要算每次都猜错的情况下的总体最大开销。
在暴力算法中，我们首先在 (1, n)(1,n) 中任意挑选一个数字，假设它是个错误的猜测（最坏情况），我们需要用最小代价去猜到需要的数字。那么在一次尝试以后，答案要么在我们猜的数字的左边要么在右边，为了考虑最坏情况，我们需要考虑两者的较大值。因此，如果我们选择 ii 作为第一次尝试，总体最小代价是：
cost(1,n)=i+max(cost(1,i−1),cost(i+1,n))
思路2 dp法

**/
/**
 * @param {number} n
 * @return {number}
 */
var getMoneyAmount = function(n) {
	let calculate = function (low, height) {
		if(low>=height) {
			return 0
		}
		let minres = Number.MAX_VALUE
		for(let i = Math.floor((low+height)/2); i<=height; i++) {
			let res = i+Math.max(calculate(low, i-1), calculate(i+1, height))
			minres = Math.min(res, minres)
		}
		return minres
	}
	return calculate(1, n)
};
function getMoneyAmount2(n) {
    let dp = [];//new int[n + 1][n + 1];
    for(let i = 0; i<=n; i++) {
    	dp[i] = []
    	for(let j = 0; j<=n; j++) {
    		dp[i][j] = 0
    	}
    }
    for (let len = 2; len <= n; len++) {//长度
        for (let start = 1; start <= n - len + 1; start++) {//开始值
            let minres = Number.MAX_VALUE;
            for (let piv = start; piv < start + len - 1; piv++) {//当前值
                let res = piv + Math.max(dp[start][piv - 1], dp[piv + 1][start + len - 1]);
                minres = Math.min(res, minres);
            }
            dp[start][start + len - 1] = minres;//开始值到结束值
        }
    }
    return dp[1][n];
}
console.log('getMoneyAmount:', getMoneyAmount2(10))
/**
376. 摆动序列
如果连续数字之间的差严格地在正数和负数之间交替，则数字序列称为摆动序列。第一个差（如果存在的话）可能是正数或负数。少于两个元素的序列也是摆动序列。
例如， [1,7,4,9,2,5] 是一个摆动序列，因为差值 (6,-3,5,-7,3) 是正负交替出现的。相反, [1,4,7,2,5] 和 [1,7,4,5,5] 不是摆动序列，第一个序列是因为它的前两个差值都是正数，第二个序列是因为它的最后一个差值为零。
给定一个整数序列，返回作为摆动序列的最长子序列的长度。 通过从原始序列中删除一些（也可以不删除）元素来获得子序列，剩下的元素保持其原始顺序。

示例 1:
输入: [1,7,4,9,2,5]
输出: 6 
解释: 整个序列均为摆动序列。

示例 2:
输入: [1,17,5,10,13,15,10,5,16,8]
输出: 7
解释: 这个序列包含几个长度为 7 摆动序列，其中一个可为[1,17,10,13,10,16,8]。

示例 3:
输入: [1,2,3,4,5,6,7,8,9]
输出: 2
进阶:
你能否用 O(n) 时间复杂度完成此题?

思路1 动态规划
up[i] 表示以前 i 个元素中的某一个为结尾的最长的「上升摆动序列」的长度。
down[i] 表示以前 i 个元素中的某一个为结尾的最长的「下降摆动序列」的长度。
思路2 贪心算法
只需要统计该序列中「峰」与「谷」的数量即可（注意序列两端的数也是「峰」或「谷」），但需要注意处理相邻的相同元素。
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var wiggleMaxLength = function(nums) {
	//通用方法，超时
	if(nums.length<2) {
		return nums.length
	}
	let maxNum = 0
	let temp = []
	let backTrack = function(idx) {
		if(idx>=nums.length) {
			maxNum = Math.max(temp.length, maxNum)
			return
		}
		//两种可能，选择，不选择
		let select = false
		if(temp.length<2) {
			if(temp.length<1) {
				select = true
			}else if(temp[temp.length-1] != nums[idx]) {
				select = true
			}
		}else{
			let cha = temp[temp.length-2]-temp[temp.length-1]
			let cha2 = temp[temp.length-1]-nums[idx]
			if(cha*cha2<0) {
				select = true
			}
		}
		if(select) {
			temp.push(nums[idx])
			backTrack(idx+1)
			temp.pop()
		}
		backTrack(idx+1)
	}
	backTrack(0, 0, 0)
	return maxNum
};
var wiggleMaxLength2 = function(nums) {
	//优化的动态规划
	if(nums.length<2) {
		return nums.length
	}
	let up = 1, down = 1;
	for(let i = 1; i<nums.length; i++) {
		if(nums[i]-nums[i-1]>0) {
			//升
			up = down+1
		}else if(nums[i]-nums[i-1]<0) {
			down = up+1
		}
	}
	return Math.max(up, down)
}
var wiggleMaxLength3 = function(nums) {
	//贪心算法
	if(nums.length<2) {
		return nums.length
	}
	let prevdifft = nums[1]-nums[0]
	let res = prevdifft == 0?1:2
	for(let i = 2; i<nums.length; i++) {
		let difft = nums[i]-nums[i-1]
		if((difft>0&&prevdifft<=0) || (difft<0&&prevdifft>=0)) {
			res+=1
			prevdifft = difft
		}
	}
	return res
}
nums = [1,17,5,10,13,15,10,5,16,8]
nums = [1,2,3,4,5,6,7,8,9]
nums = [1,7,4,9,2,5]
nums = [0,0]
nums = [33,53,12,64,50,41,45,21,97,35,47,92,39,0,93,55,40,46,69,42,6,95,51,68,72,9,32,84,34,64,6,2,26,98,3,43,30,60,3,68,82,9,97,19,27,98,99,4,30,96,37,9,78,43,64,4,65,30,84,90,87,64,18,50,60,1,40,32,48,50,76,100,57,29,63,53,46,57,93,98,42,80,82,9,41,55,69,84,82,79,30,79,18,97,67,23,52,38,74,15]
console.log('wiggleMaxLength:', wiggleMaxLength3(nums))
/**
377. 组合总和 Ⅳ
给你一个由 不同 整数组成的数组 nums ，和一个目标整数 target 。请你从 nums 中找出并返回总和为 target 的元素组合的个数。
题目数据保证答案符合 32 位整数范围。
 
示例 1：
输入：nums = [1,2,3], target = 4
输出：7
解释：
所有可能的组合为：
(1, 1, 1, 1)
(1, 1, 2)
(1, 2, 1)
(1, 3)
(2, 1, 1)
(2, 2)
(3, 1)
请注意，顺序不同的序列被视作不同的组合。

示例 2：
输入：nums = [9], target = 3
输出：0
 
提示：
1 <= nums.length <= 200
1 <= nums[i] <= 1000
nums 中的所有元素 互不相同
1 <= target <= 1000
 

进阶：如果给定的数组中含有负数会发生什么？问题会产生何种变化？如果允许负数出现，需要向题目中添加哪些限制条件？
**/
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var combinationSum4_1 = function(nums, target) {
	let dealMap = {} //处理过的
	let results = []
	let temp = []
	let getNext = function(idx) {
		if(!dealMap[0]) {
			// return 0
		}
		return idx+1
	}
	let backTrack = function(idx, left){
		if(idx>=nums.length || left <= 0) {
			if(left == 0) {
				let _temp = []
				for(let i = 0; i<temp.length; i++) {
					_temp.push(temp[i])
				}
				results.push(_temp)
			}
			return
		}
		if(dealMap[idx]) {
			backTrack(getNext(idx), left)
		}else {
			dealMap[idx] = true
			let maxnum = Math.floor((left/nums[idx]))
			for(let i = 0; i<=maxnum; i++) {
				let need = 0
				for(let j = 0; j<i; j++) {
					temp.push(nums[idx])
					need += nums[idx]
				}
				backTrack(getNext(idx), left-need)
				for(let j = 0; j<i; j++) {
					temp.pop()
				}
			}
			dealMap[idx] = false
		}
	}
	backTrack(0, target)
	return results
};
//nums = [1,2,3], target = 4
var combinationSum4 = function(nums, target) {
	//背包问题 背包容量target 可以抽取的元素为nums
	//动态规划法 时间复杂度O(M*N)空间复杂度O(N)
	let dp = []
	for(let i = 0; i<=target; i++) {
		dp[i] = 0
	}
	dp[0] = 1
	for(let i = 1; i<=target; i++) {
		for(let j = 0; j<nums.length; j++) {
			if(nums[j]<=i && dp[i]+dp[i-nums[j]]<Number.MAX_VALUE) {//可以放入
				dp[i] += dp[i-nums[j]]
			}
		}
	}
	return dp[target]
}
nums = [1,2,3], target = 4
console.log('combinationSum4:', combinationSum4(nums, target))

/**
378. 有序矩阵中第 K 小的元素
给你一个 n x n 矩阵 matrix ，其中每行和每列元素均按升序排序，找到矩阵中第 k 小的元素。
请注意，它是 排序后 的第 k 小元素，而不是第 k 个 不同 的元素。

示例 1：
输入：matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
输出：13
解释：矩阵中的元素为 [1,5,9,10,11,12,13,13,15]，第 8 小元素是 13

示例 2：
输入：matrix = [[-5]], k = 1
输出：-5
 
提示：
n == matrix.length
n == matrix[i].length
1 <= n <= 300
-109 <= matrix[i][j] <= 109
题目数据 保证 matrix 中的所有行和列都按 非递减顺序 排列
1 <= k <= n2
**/
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(matrix, k) {
	let points = []
	let row = matrix.length
	let col = matrix[0].length
	for(let i = 0; i<row; i++) {
		points[i] = 0
	}
	let findMinValue = function() {
		//遍历法  时间复杂度O(row*k)
		let minIdx = 0 
		let minValue = Number.MAX_VALUE
		for(let i = 0; i<row; i++) {
			if(points[i]<col && matrix[i][points[i]]<minValue) {
				minIdx = i
				minValue = matrix[i][points[i]]
			}
		}
		let res = matrix[minIdx][points[minIdx]]
		points[minIdx]++
		return res
	}
	let res = 0
	for(let i = 0; i<k; i++) {
		res = findMinValue()
	}
	return res
};
matrix = [[1,5,9],[10,11,13],[12,13,15]]
k = 8
console.log('kthSmallest:', kthSmallest(matrix, k))

var exportAABB = function(str){
	// 多次输出不重叠的 AABB
	let res = []
	res[0] = []
	res[0].push(str[0])
	let idx = 0//数组下标
	for(let i = 1; i<str.length; i++) {
		if(str[i] == str[i-1]) {
			//重复
			idx++;
			
		}else {
			//不重复
			idx = 0;
		}
		res[idx] = res[idx] || []
		res[idx].push(str[i])
	}
	return res
}
console.log('exportAABB:', exportAABB('AABBBCCCC'))

/**
380. 常数时间插入、删除和获取随机元素
设计一个支持在平均 时间复杂度 O(1) 下，执行以下操作的数据结构。

insert(val)：当元素 val 不存在时，向集合中插入该项。
remove(val)：元素 val 存在时，从集合中移除该项。
getRandom：随机返回现有集合中的一项。每个元素应该有相同的概率被返回。
示例 :

// 初始化一个空的集合。
RandomizedSet randomSet = new RandomizedSet();

// 向集合中插入 1 。返回 true 表示 1 被成功地插入。
randomSet.insert(1);

// 返回 false ，表示集合中不存在 2 。
randomSet.remove(2);

// 向集合中插入 2 。返回 true 。集合现在包含 [1,2] 。
randomSet.insert(2);

// getRandom 应随机返回 1 或 2 。
randomSet.getRandom();

// 从集合中移除 1 ，返回 true 。集合现在包含 [2] 。
randomSet.remove(1);

// 2 已在集合中，所以返回 false 。
randomSet.insert(2);

// 由于 2 是集合中唯一的数字，getRandom 总是返回 2 。
randomSet.getRandom();

设计思路
数组 values  记录值
字典 idxMap 记录值得下标
删除的时候把values中要删除的值跟最后一个交换，删除最后一个即可
**/
/**
 * Initialize your data structure here.
 */
var RandomizedSet = function() {
	this.values = []
	this.idxMap = {}
};

/**
 * Inserts a value to the set. Returns true if the set did not already contain the specified element. 
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.insert = function(val) {
	let idx = this.idxMap[val]
	if(idx != null) {
		return false
	}
	this.idxMap[val] = this.values.length
	this.values.push(val)
	return true
};

/**
 * Removes a value from the set. Returns true if the set contained the specified element. 
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.remove = function(val) {
	let idx = this.idxMap[val]
	if(idx == null) {
		return false
	}
	let lastValue = this.values.pop()
	if(idx == this.values.length) {
		//最后一个
		delete this.idxMap[lastValue]
	}else {
		this.values[idx] = lastValue
		this.idxMap[lastValue] = idx
		delete this.idxMap[val]
	}

	return true
};

/**
 * Get a random element from the set.
 * @return {number}
 */
RandomizedSet.prototype.getRandom = function() {
	let idx = Math.floor(Math.random() * (this.values.length) );
	return this.values[idx]
};

/**
 * Your RandomizedSet object will be instantiated and called as such:
 * var obj = new RandomizedSet()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()
 */
let randomSet = new RandomizedSet();

// 向集合中插入 1 。返回 true 表示 1 被成功地插入。
res = randomSet.insert(1);
console.log(1, res)

// 返回 false ，表示集合中不存在 2 。
res = randomSet.insert(2);
console.log(2, res)

// 向集合中插入 2 。返回 true 。集合现在包含 [1,2] 。
res = randomSet.insert(3);
console.log(3, res)

// getRandom 应随机返回 1 或 2 。
res = randomSet.getRandom();
console.log(4, res)

// 从集合中移除 1 ，返回 true 。集合现在包含 [2] 。
res = randomSet.insert(4);
console.log(5, res)

// 2 已在集合中，所以返回 false 。
res = randomSet.remove(2);
console.log(6, res, randomSet.values, randomSet.idxMap)
res = randomSet.getRandom();
console.log(5, res)


/**
381. O(1) 时间插入、删除和获取随机元素 - 允许重复
设计一个支持在平均 时间复杂度 O(1) 下， 执行以下操作的数据结构。

注意: 允许出现重复元素。

insert(val)：向集合中插入元素 val。
remove(val)：当 val 存在时，从集合中移除一个 val。
getRandom：从现有集合中随机获取一个元素。每个元素被返回的概率应该与其在集合中的数量呈线性相关。
示例:

// 初始化一个空的集合。
RandomizedCollection collection = new RandomizedCollection();

// 向集合中插入 1 。返回 true 表示集合不包含 1 。
collection.insert(1);

// 向集合中插入另一个 1 。返回 false 表示集合包含 1 。集合现在包含 [1,1] 。
collection.insert(1);

// 向集合中插入 2 ，返回 true 。集合现在包含 [1,1,2] 。
collection.insert(2);

// getRandom 应当有 2/3 的概率返回 1 ，1/3 的概率返回 2 。
collection.getRandom();

// 从集合中删除 1 ，返回 true 。集合现在包含 [1,2] 。
collection.remove(1);

// getRandom 应有相同概率返回 1 和 2 。
collection.getRandom();

实现思路
用Map和Set来实现，Map中键为插入值，值为数组下标
用数组存放数组，删除的时候交换到最后一个删除
**/

/**
 * Initialize your data structure here.
 */
var RandomizedCollection = function() {
	this.idxs = {}
	this.values = []
};

/**
 * Inserts a value to the collection. Returns true if the collection did not already contain the specified element. 
 * @param {number} val
 * @return {boolean}
 */
RandomizedCollection.prototype.insert = function(val) {
	let set = this.idxs[val] || new Set()
	this.idxs[val] = set
	set.add(this.values.length)
	this.values[this.values.length] = val
	return set.size == 1
};

/**
 * Removes a value from the collection. Returns true if the collection contained the specified element. 
 * @param {number} val
 * @return {boolean}
 */
RandomizedCollection.prototype.remove = function(val) {
	let set = this.idxs[val]
	if(!set || set.size<=0) {
		return false
	}
	let i = null //需要删除的下标
	for(let idx of set) {
		if(!i) {
			i = idx
			break
		}
	}
	let lastIdx = this.values.length-1
	let lastValue = this.values[lastIdx]
	//交换删除数组
	this.values[i] = lastValue
	this.values.pop()
	//删除字典
	let lastSet = this.idxs[lastValue]
	lastSet.delete(lastIdx)
	if(lastValue !=val) {
		lastSet.add(i)
		set.delete(i)
	}

	return true
};

/**
 * Get a random element from the collection.
 * @return {number}
 */
RandomizedCollection.prototype.getRandom = function() {
	let idx = Math.floor(Math.random() * (this.values.length) );
	return this.values[idx]
};

/**
 * Your RandomizedCollection object will be instantiated and called as such:
 * var obj = new RandomizedCollection()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()

["RandomizedCollection","insert","insert","insert","insert","insert","remove","remove","remove","remove"]
[[],[4],[3],[4],[2],[4],[4],[3],[4],[4]]
[null,true,true,false,true,false,true,true,true,true]
 */
// 初始化一个空的集合。
let collection = new RandomizedCollection();

res = collection.insert(4);
console.log('1-', collection.values, res)

res = collection.insert(3);
console.log('2-', collection.values, res)

res = collection.insert(4);
console.log('3-', collection.values, res)

res = collection.insert(2);
console.log('4-', collection.values, res)

res = collection.insert(4);
console.log('5-', collection.values, res)

res = collection.remove(4);
console.log('6-', collection.values, res)
res = collection.remove(3);
console.log('7-', collection.values, res)
res = collection.remove(4);
console.log('8-', collection.values, res)
res = collection.remove(4);
console.log('9-', collection.values, res)

/**
382. 链表随机节点
给定一个单链表，随机选择链表的一个节点，并返回相应的节点值。保证每个节点被选的概率一样。

进阶:
如果链表十分大且长度未知，如何解决这个问题？你能否使用常数级空间复杂度实现？

示例:

// 初始化一个单链表 [1,2,3].
ListNode head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
Solution solution = new Solution(head);

// getRandom()方法应随机返回1,2,3中的一个，保证每个元素被返回的概率相等。
solution.getRandom();

解题思路
最近经常能看到面经中出现在大数据流中的随机抽样问题
即：当内存无法加载全部数据时，如何从包含未知大小的数据流中随机选取k个数据，并且要保证每个数据被抽取到的概率相等。
每个数的概率都相同

**/

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param head The linked list's head.
        Note that the head is guaranteed to be not null, so it contains at least one node.
 * @param {ListNode} head
 */
var Solution = function(head) {
	this.head = head
};

/**
 * Returns a random node's value.
 * @return {number}
 */
Solution.prototype.getRandom = function() {
	let count = 0
	let cur = this.head
	let res = 0
	while(cur) {
		count++
		let random = Math.floor(Math.random() * count)+1
		if(random == count){
			res = cur.val
		}
		cur = cur.next
	}
	return res
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(head)
 * var param_1 = obj.getRandom()
 */
var head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
var solution = new Solution(head);
console.log(solution.getRandom())

/**
383. 赎金信
给定一个赎金信 (ransom) 字符串和一个杂志(magazine)字符串，判断第一个字符串 ransom 能不能由第二个字符串 magazines 里面的字符构成。如果可以构成，返回 true ；否则返回 false。
(题目说明：为了不暴露赎金信字迹，要从杂志上搜索各个需要的字母，组成单词来表达意思。杂志字符串中的每个字符只能在赎金信字符串中使用一次。)

示例 1：
输入：ransomNote = "a", magazine = "b"
输出：false

示例 2：
输入：ransomNote = "aa", magazine = "ab"
输出：false

示例 3：
输入：ransomNote = "aa", magazine = "aab"
输出：true

提示：
你可以假设两个字符串均只含有小写字母。


**/

/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
var canConstruct = function(ransomNote, magazine) {
	let magazineMap = {}
	for(let i = 0; i<magazine.length; i++){
		let key = magazine.charAt(i)
		magazineMap[key] = magazineMap[key] || 0
		magazineMap[key]++
	}
	for(let i = 0; i<ransomNote.length; i++) {
		let key = ransomNote.charAt(i)
		if(!magazineMap[key]){
			return false
		}
		magazineMap[key]--
	}
	return true
};
var ransomNote = "aa", magazine = "aba"
console.log('canConstruct:', canConstruct(ransomNote, magazine))

/**
384. 打乱数组
给你一个整数数组 nums ，设计算法来打乱一个没有重复元素的数组。

实现 Solution class:
Solution(int[] nums) 使用整数数组 nums 初始化对象
int[] reset() 重设数组到它的初始状态并返回
int[] shuffle() 返回数组随机打乱后的结果
 
示例：

输入
["Solution", "shuffle", "reset", "shuffle"]
[[[1, 2, 3]], [], [], []]
输出
[null, [3, 1, 2], [1, 2, 3], [1, 3, 2]]

解释
Solution solution = new Solution([1, 2, 3]);
solution.shuffle();    // 打乱数组 [1,2,3] 并返回结果。任何 [1,2,3]的排列返回的概率应该相同。例如，返回 [3, 1, 2]
solution.reset();      // 重设数组到它的初始状态 [1, 2, 3] 。返回 [1, 2, 3]
solution.shuffle();    // 随机返回数组 [1, 2, 3] 打乱后的结果。例如，返回 [1, 3, 2]
 
提示：
1 <= nums.length <= 200
-106 <= nums[i] <= 10的6次方
nums 中的所有元素都是 唯一的
最多可以调用 5 * 10的4方 次 reset 和 shuffle

思路
Fisher-Yates 洗牌算法
在每次迭代中，生成一个范围在当前下标到数组末尾元素下标之间的随机整数。
接下来，将当前元素和随机选出的下标所指的元素互相交换，知道最后一个元素
**/
/**
 * @param {number[]} nums
 */
var Solution = function(nums) {
	this.array = nums
	this.origin = this.clone(nums)
};
//随机a~b之间的数，包含a，不包含b
Solution.prototype.randomRange = function(a, b) {
	return a+Math.floor(Math.random()*(b-a))
}
//拷贝数组
Solution.prototype.clone = function(arr){
	return arr.slice(0)
}

//交换
Solution.prototype.swap = function(a,b) {
	let temp = this.array[a]
	this.array[a] = this.array[b]
	this.array[b] = temp
}
/**
 * Resets the array to its original configuration and return it.
 * @return {number[]}
 */
Solution.prototype.reset = function() {
	this.array = this.origin
	this.origin = this.clone(this.array)
	return this.origin
};

/**
 * Returns a random shuffling of the array.
 * @return {number[]}
 */
Solution.prototype.shuffle = function() {
	for(let i = 0; i<this.origin.length; i++) {
		this.swap(i, this.randomRange(i, this.origin.length))
	}
	return this.array
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.reset()
 * var param_2 = obj.shuffle()
 */
solution = new Solution([1,2,3,4,5])
 console.log('Solution:', solution.shuffle(), solution.reset())

 /**
 385. 迷你语法分析器
给定一个用字符串表示的整数的嵌套列表，实现一个解析它的语法分析器。
列表中的每个元素只可能是整数或整数嵌套列表

提示：你可以假定这些字符串都是格式良好的：
字符串非空
字符串不包含空格
字符串只包含数字0-9、[、-、,、]

示例 1：
给定 s = "324",
你应该返回一个 NestedInteger 对象，其中只包含整数值 324。

示例 2：
给定 s = "[123,[456,[789]]]",
返回一个 NestedInteger 对象包含一个有两个元素的嵌套列表：
1. 一个 integer 包含值 123
2. 一个包含两个元素的嵌套列表：
    i.  一个 integer 包含值 456
    ii. 一个包含一个元素的嵌套列表
         a. 一个 integer 包含值 789
 **/
 /**
 * // This is the interface that allows for creating nested lists.
 * // You should not implement it, or speculate about its implementation
 * function NestedInteger() {
 *
 *     Return true if this NestedInteger holds a single integer, rather than a nested list.
 *     @return {boolean}
 *     this.isInteger = function() {
 *         ...
 *     };
 *
 *     Return the single integer that this NestedInteger holds, if it holds a single integer
 *     Return null if this NestedInteger holds a nested list
 *     @return {integer}
 *     this.getInteger = function() {
 *         ...
 *     };
 *
 *     Set this NestedInteger to hold a single integer equal to value.
 *     @return {void}
 *     this.setInteger = function(value) {
 *         ...
 *     };
 *
 *     Set this NestedInteger to hold a nested list and adds a nested integer elem to it.
 *     @return {void}
 *     this.add = function(elem) {
 *         ...
 *     };
 *
 *     Return the nested list that this NestedInteger holds, if it holds a nested list
 *     Return null if this NestedInteger holds a single integer
 *     @return {NestedInteger[]}
 *     this.getList = function() {
 *         ...
 *     };
 * };
 */
 /**
 s = "[123,[456,[789]]]",
 思路:用栈的形式
 **/
/**
 * @param {string} s
 * @return {NestedInteger}
 */
var deserialize = function(s) {
	let stack = []
	let num = ''
	let res = null
	for(let i = 0; i<s.length; i++) {
		let charCode = s.charCodeAt(i)
		let c = s.charAt(i)
		if(c == '-' || (charCode>=48 && charCode<=57)) {
			//数字
			num+=c
		}else{
			if(num && stack.length>0) {
				var item = new NestedInteger()
				item.setInteger(parseInt(num))
				stack[stack.length-1].add(item)
			}
			if(c == '['){
				var item = new NestedInteger()
				if(stack.length>0) {
					stack[stack.length-1].add(item)
				}
				stack.push(item)
			}else if(c == ']') {
				stack.pop()
			}
			if(!res) {
				if(stack.length>0) {
					res = stack[0]
				}
			}
			num = ''
		}
	}
	if(!res && num) {
		res = new NestedInteger()
		res.setInteger(parseInt(num))
	}
	return res
};
 s = "[123,[456,[789]]]"
// console.log('deserialize:', deserialize(s))

/**
386. 字典序排数
给定一个整数 n, 返回从 1 到 n 的字典顺序。

例如，
给定 n =1 3，返回 [1,10,11,12,13,2,3,4,5,6,7,8,9] 。
请尽可能的优化算法的时间复杂度和空间复杂度。 输入的数据 n 小于等于 5,000,000。

//递归实现
//用栈实现
    public List<Integer> lexicalOrder1(int n) {
        List<Integer> res = new ArrayList<>();
        Stack<Integer> stack = new Stack<>();
        for(int i = Math.min(n,9); i > 0; i--){
            stack.push(i);//保证数据的从小到大排序在进栈时从大到小进
        }
        while(!stack.isEmpty()){
            int x = stack.pop();
            res.add(x);
            for(int i = 9; i >=0; i--){
                if(x*10+i <= n){//保证数据的从小到大排序在进栈时从大到小进
                    stack.push(x*10+i);
                }
            }
        }
        return res;
    }
**/
/**
 * @param {number} n
 * @return {number[]}
 */
var lexicalOrder = function(n) {
	let res = []
	let backTrack = function(num) {
		if(num>n) {
			return
		}
		res.push(num)
		for(let i = 0; i<=9; i++) {
			backTrack(num*10+i)
		}
	}
	for(let i = 1; i<=9; i++) {
		backTrack(i)
	}
	return res
};
console.log('lexicalOrder:', lexicalOrder(200))

/**
387. 字符串中的第一个唯一字符
给定一个字符串，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 -1。

示例：
s = "leetcode"
返回 0

s = "loveleetcode"
返回 2
 

提示：你可以假定该字符串只包含小写字母。
**/
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function(s) {
	let map = {}
	for(let i = 0; i<s.length; i++) {
		let c = s.charAt(i)
		map[c] = map[c] || 0
		map[c]++
	}
	for(let i = 0; i<s.length; i++) {
		let c = s.charAt(i)
		if(map[c] == 1) {
			return i
		}
	}
	return -1;
};
s = "loveleetcode"
console.log('firstUniqChar:', firstUniqChar(s))

/**
388. 文件的最长绝对路径
假设文件系统如下图所示：
这里将 dir 作为根目录中的唯一目录。dir 包含两个子目录 subdir1 和 subdir2 。subdir1 包含文件 file1.ext 和子目录 subsubdir1；subdir2 包含子目录 subsubdir2，该子目录下包含文件 file2.ext 。
在文本格式中，如下所示(⟶表示制表符)：
dir
⟶ subdir1
⟶ ⟶ file1.ext
⟶ ⟶ subsubdir1
⟶ subdir2
⟶ ⟶ subsubdir2
⟶ ⟶ ⟶ file2.ext

如果是代码表示，上面的文件系统可以写为 "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext" 。'\n' 和 '\t' 分别是换行符和制表符。
文件系统中的每个文件和文件夹都有一个唯一的 绝对路径 ，即必须打开才能到达文件/目录所在位置的目录顺序，所有路径用 '/' 连接。上面例子中，指向 file2.ext 的绝对路径是 "dir/subdir2/subsubdir2/file2.ext" 。每个目录名由字母、数字和/或空格组成，每个文件名遵循 name.extension 的格式，其中名称和扩展名由字母、数字和/或空格组成。
给定一个以上述格式表示文件系统的字符串 input ，返回文件系统中 指向文件的最长绝对路径 的长度。 如果系统中没有文件，返回 0。

示例 1：
输入：input = "dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext"
输出：20
解释：只有一个文件，绝对路径为 "dir/subdir2/file.ext" ，路径长度 20
路径 "dir/subdir1" 不含任何文件

示例 2：
输入：input = "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext"
输出：32
解释：存在两个文件：
"dir/subdir1/file1.ext" ，路径长度 21
"dir/subdir2/subsubdir2/file2.ext" ，路径长度 32
返回 32 ，因为这是最长的路径

示例 3：
输入：input = "a"
输出：0
解释：不存在任何文件

示例 4：
输入：input = "file1.txt\nfile2.txt\nlongfile.txt"
输出：12
解释：根目录下有 3 个文件。
因为根目录中任何东西的绝对路径只是名称本身，所以答案是 "longfile.txt" ，路径长度为 12
 
提示：
1 <= input.length <= 104
input 可能包含小写或大写的英文字母，一个换行符 '\n'，一个指表符 '\t'，一个点 '.'，一个空格 ' '，和数字。
**/
/**
 * @param {string} input
 * @return {number}
 */
var lengthLongestPath = function(input) {
	let layers = []//第i层的文件夹的长度
	let maxLen = 0//最大长度
	let num = 0 //到\n之前累积的数量
	let k = 0//当前处理的层级数
	let isFile = false //是否是文件
	layers[0] = -1//第一个没有/
	for(let i = 0; i<input.length; i++) {
		let c = input.charAt(i)
		if(c == '\n'){
			layers[k+1] = layers[k]+num+1//1为多的/
			if(isFile) {
				maxLen = Math.max(maxLen, layers[k+1])
			}
			num = 0
			k = 0
			isFile = false
		}else if(c == '\t'){
			k++
		}else {
			if(c =='.') {
				isFile = true
			}
			num++
		}
	}
	if(isFile) {
		maxLen = Math.max(maxLen, layers[k]+num+1)
	}
	console.log(layers)
	return maxLen
};
var input = "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext"
console.log('lengthLongestPath:', lengthLongestPath(input))
/**
389. 找不同
给定两个字符串 s 和 t，它们只包含小写字母。
字符串 t 由字符串 s 随机重排，然后在随机位置添加一个字母。
请找出在 t 中被添加的字母。
 
示例 1：
输入：s = "abcd", t = "abcde"
输出："e"
解释：'e' 是那个被添加的字母。

示例 2：
输入：s = "", t = "y"
输出："y"

示例 3：
输入：s = "a", t = "aa"
输出："a"

示例 4：
输入：s = "ae", t = "aea"
输出："a"

提示：
0 <= s.length <= 1000
t.length == s.length + 1
s 和 t 只包含小写字母

思路：
1、求和
2、哈希表
3、位运算
如果将两个字符串拼接成一个字符串，则问题转换成求字符串中出现奇数次的字符
**/
/**
 * @param {string} s
 * @param {string} t
 * @return {character}
 */
var findTheDifference = function(s, t) {
	let res = 0
	for(let i = 0; i<s.length; i++) {
		res ^= s.charCodeAt(i)
	}
	for(let i = 0; i<t.length; i++) {
		res ^= t.charCodeAt(i)
	}
	return String.fromCharCode(res)
};
var s = "abcd", t = "abcde"
console.log('findTheDifference:', findTheDifference(s, t))
/**
390. 消除游戏
给定一个从1 到 n 排序的整数列表。
首先，从左到右，从第一个数字开始，每隔一个数字进行删除，直到列表的末尾。
第二步，在剩下的数字中，从右到左，从倒数第一个数字开始，每隔一个数字进行删除，直到列表开头。
我们不断重复这两步，从左到右和从右到左交替进行，直到只剩下一个数字。
返回长度为 n 的列表中，最后剩下的数字。

示例：

输入:
n = 9,
1 2 3 4 5 6 7 8 9
2 4 6 8
2 6
6

输出:
6

思路，递归
我们将递归过程分为两类，一类是从第一个开始删除，一类是从最后一个开始删除
从第一个开始删除时：
1 2 3 4 5 6 7 8 9 (第n层)
2 4 6 8 (第n-1层)
易得，indexN = indexN-1*2+1。
n层数据量无论是单数或双数都一样，如上，9是多余的，有没有9都不影响n-1层(2 4 6 8)到n层的下标映射

从最后一个开始删除时：
n层数据量为偶数时：
2 4 6 8 (第n层)
2 6 (第n-1层)
我们把n-1层的6与n层的8对其，n-1层的2与n层的6对其
8 6 4 2
6 2
会发现逆序的时，和第一类的下标换算是一致的
所以，我们可以推导出:
((lengthN - 1) - indexN) = ((lengthN-1 - 1) - indexN-1)2+1
indexN = indexN-1*2

n层数据量为奇数时：
2 4 6 8 10 (第n层)
4 8 (第n-1层)

发现和，从第一个开始删除时是一样的
所以，indexN = indexN-1*2+1
**/
/**
 * @param {number} n
 * @return {number}
 */
var lastRemaining = function(n) {
	let arr = []
	for(let i = 1; i<=n; i++) {
		arr.push(i)
	}
	n = arr
	let backTrack = function(isLeft) {
		if(n.length<=1) {
			return n
		}
		let res = []
		if(isLeft) {
			for(let i = 1; i<=n.length-1; i+=2) {
				res.push(n[i])
			}
		}else{
			for(let i = n.length-2; i>=0; i-=2) {
				res.push(n[i])
			}
			res.reverse()
		}
		return res
	}
	let isLeft = true
	while(n.length>1) {
		n = backTrack(isLeft)
		isLeft = !isLeft
	}
	return n[0]
};
var lastRemaining2 = function(n) {
	let second = function(n) {
		if(n == 1) {
			return 0
		}
		if(n%2 == 0) {
			return first(parseInt(n/2))*2
		}else{
			return first(parseInt(n/2))*2+1
		}
	}
	let first = function(n) {
		if(n == 1) {
			return 0
		}
		return second(parseInt(n/2))*2+1
	}
	return first(n)+1
}
console.log('lastRemaining:', lastRemaining2(9))

/**
391. 完美矩形

我们有 N 个与坐标轴对齐的矩形, 其中 N > 0, 判断它们是否能精确地覆盖一个矩形区域。
每个矩形用左下角的点和右上角的点的坐标来表示。例如， 一个单位正方形可以表示为 [1,1,2,2]。 ( 左下角的点的坐标为 (1, 1) 以及右上角的点的坐标为 (2, 2) )。
**/
/**
 * @param {number[][]} rectangles
 * @return {boolean}
 */
var isRectangleCover = function(rectangles) {

};
/**
392. 判断子序列
给定字符串 s 和 t ，判断 s 是否为 t 的子序列。
字符串的一个子序列是原始字符串删除一些（也可以不删除）字符而不改变剩余字符相对位置形成的新字符串。（例如，"ace"是"abcde"的一个子序列，而"aec"不是）。

进阶：
如果有大量输入的 S，称作 S1, S2, ... , Sk 其中 k >= 10亿，你需要依次检查它们是否为 T 的子序列。在这种情况下，你会怎样改变代码？

致谢：
特别感谢 @pbrother 添加此问题并且创建所有测试用例。

示例 1：
输入：s = "abc", t = "ahbgdc"
输出：true

示例 2：
输入：s = "axc", t = "ahbgdc"
输出：false

提示：
0 <= s.length <= 100
0 <= t.length <= 10^4
两个字符串都只由小写字符组成。
**/
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function(s, t) {
	if(s.length<=0) {
		return true
	}
	let ss = 0, st = 0
	while(ss<s.length && st<t.length) {
		let cs = s.charAt(ss)
		let ct = t.charAt(st)
		if(cs == ct) {
			ss++
		}
		st++
	}
	return ss>=s.length
};
s = "abc", t = "ahbgdc"
s = "axc", t = "ahbgdc"
console.log('isSubsequence:', isSubsequence(s, t))

/**
393. UTF-8 编码验证
UTF-8 中的一个字符可能的长度为 1 到 4 字节，遵循以下的规则：
对于 1 字节的字符，字节的第一位设为 0 ，后面 7 位为这个符号的 unicode 码。
对于 n 字节的字符 (n > 1)，第一个字节的前 n 位都设为1，第 n+1 位设为 0 ，后面字节的前两位一律设为 10 。剩下的没有提及的二进制位，全部为这个符号的 unicode 码。
这是 UTF-8 编码的工作方式：

   Char. number range  |        UTF-8 octet sequence
      (hexadecimal)    |              (binary)
   --------------------+---------------------------------------------
   0000 0000-0000 007F | 0xxxxxxx
   0000 0080-0000 07FF | 110xxxxx 10xxxxxx
   0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
   0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
给定一个表示数据的整数数组，返回它是否为有效的 utf-8 编码。

注意：
输入是整数数组。只有每个整数的 最低 8 个有效位 用来存储数据。这意味着每个整数只表示 1 字节的数据。

示例 1：
data = [197, 130, 1], 表示 8 位的序列: 11000101 10000010 00000001.
返回 true 。
这是有效的 utf-8 编码，为一个2字节字符，跟着一个1字节字符。

示例 2：
data = [235, 140, 4], 表示 8 位的序列: 11101011 10001100 00000100.
返回 false 。
前 3 位都是 1 ，第 4 位为 0 表示它是一个3字节字符。
下一个字节是开头为 10 的延续字节，这是正确的。
但第二个延续字节不以 10 开头，所以是不符合规则的。
**/
/**
 * @param {number[]} data
 * @return {boolean}
 */
var validUtf8 = function(data) {
	let idx = 0 //正在处理字符第几位
	let checkBinary = function(num) {
		if((num>>3) == 30) {
			return 4
		}else if((num>>4) == 14) {
			return 3
		}else if((num>>5) == 6) {
			return 2
		}else if((num>>7) == 0) {
			return 1
		}
		return -1
	}
	for(let i = 0; i<data.length; i++) {
		if(idx == 0) {
			//新的开端
			idx = checkBinary(data[i])
			console.log(data[i], idx)
			if(idx == -1) {
				return false
			}
		}else{
			if((data[i]>>6) != 2) {
				return false
			}
		}
		idx --
	}
	return idx == 0
};
data = [197, 130, 1]
data = [235, 140, 4]
data = [255]
data = [237]
console.log('validUtf8:', validUtf8(data))

/**
394. 字符串解码
给定一个经过编码的字符串，返回它解码后的字符串。
编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。
你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。
此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。
 
示例 1：
输入：s = "3[a]2[bc]"
输出："aaabcbc"

示例 2：
输入：s = "3[a2[c]]"
输出："accaccacc"

示例 3：
输入：s = "2[abc]3[cd]ef"
输出："abcabccdcdcdef"

示例 4：
输入：s = "abc3[cd]xyz"
输出："abccdcdcdxyz"

思路  
栈操作
1个或多个数字解析出来，进栈
做括号或字符，进栈
右括号，出栈
**/
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function(s) {
	let num = ''
	let stack = []
	let dealPop = function(){
		let str = ''
		let c = stack.pop()
		while(c != '[') {
			str = c+str
			c = stack.pop()
		}
		let repeat = stack.pop()
		let res = ''
		for(let i = 0; i<repeat; i++) {
			res+=str
		}
		stack.push(res)
	}
	for(let i = 0; i<s.length; i++) {
		let c = s.charAt(i)
		let code = s.charCodeAt(i)
		if(code>=48 && code<=57) {
			//数字
			num+=c
		}else if(c == ']'){
			dealPop()
		}else{
			if(c == '[') {
				stack.push(num)
				num = ''
			}
			stack.push(c)
		}
	}
	return stack.join('')
};
s = "abc3[cd]xyz"
s = "2[abc]3[cd]ef"
console.log('decodeString:', decodeString(s))

/**
395. 至少有 K 个重复字符的最长子串
给你一个字符串 s 和一个整数 k ，请你找出 s 中的最长子串， 要求该子串中的每一字符出现次数都不少于 k 。返回这一子串的长度。

示例 1：
输入：s = "aaabb", k = 3
输出：3
解释：最长子串为 "aaa" ，其中 'a' 重复了 3 次。

示例 2：
输入：s = "ababbc", k = 2
输出：5
解释：最长子串为 "ababb" ，其中 'a' 重复了 2 次， 'b' 重复了 3 次。
 
提示：
1 <= s.length <= 104
s 仅由小写英文字母组成
1 <= k <= 105
**/
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var longestSubstring = function(s, k) {
	//分治 
	//时间复杂度：O(N⋅∣Σ∣)，其中 N 为字符串的长度，Σ 为字符集，
	//空间复杂度：O(∣Σ∣平方）
	let dfs = function(str) {
		let sMap = {}
		for(let i = 0; i<str.length; i++) {
			let c = str.charAt(i)
			sMap[c] = sMap[c] || 0
			sMap[c]++
		}
		//找到<k的字符
		let c = ""
		for(let key in sMap) {
			if(sMap[key]<k) {
				c = key
				break
			}
		}
		if(!c) {
			//全部满足
			return str.length
		}
		let max = 0
		let arr = str.split(c)
		console.log(str, c, arr)
		for(let i = 0; i<arr.length; i++) {
			max = Math.max(max, dfs(arr[i]))
		}
		return max
	}
	return dfs(s)
};
// s = "ababbc", k = 2
// s = "aaabbb", k = 3
s = "ababacb", k = 3
console.log('longestSubstring:', longestSubstring(s, k))

/**
396. 旋转函数
给定一个长度为 n 的整数数组 A 。
假设 Bk 是数组 A 顺时针旋转 k 个位置后的数组，我们定义 A 的“旋转函数” F 为：
F(k) = 0 * Bk[0] + 1 * Bk[1] + ... + (n-1) * Bk[n-1]。
计算F(0), F(1), ..., F(n-1)中的最大值。

注意:
可以认为 n 的值小于 105。

示例:

A = [4, 3, 2, 6]

F(0) = (0 * 4) + (1 * 3) + (2 * 2) + (3 * 6) = 0 + 3 + 4 + 18 = 25
F(1) = (0 * 6) + (1 * 4) + (2 * 3) + (3 * 2) = 0 + 4 + 6 + 6 = 16
F(2) = (0 * 2) + (1 * 6) + (2 * 4) + (3 * 3) = 0 + 6 + 8 + 9 = 23
F(3) = (0 * 3) + (1 * 2) + (2 * 6) + (3 * 4) = 0 + 2 + 12 + 12 = 26

所以 F(0), F(1), F(2), F(3) 中的最大值是 F(3) = 26 。
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxRotateFunction = function(nums) {
	let n = nums.length
	let turnRight = function(k) {
		if(k == 0) {
			return 0
		}
		return n-k
	}
	let getFvalue = function(start) {
		let value = 0
		for(let i = 0; i<n; i++) {
			value+=i*nums[start]
			start+=1
			start = start%n
		}
		return value
	}
	let max = -Number.MAX_VALUE
	for(let i = 0; i<n; i++) {
		let start = turnRight(i)
		console.log(i, getFvalue(start))
		max = Math.max(max, getFvalue(start))
	}
	return max
};
nums = [4, 3, 2, 6]
nums = [-2147483648,-2147483648]
console.log('maxRotateFunction:', maxRotateFunction(nums))

/**
397. 整数替换
给定一个正整数 n ，你可以做如下操作：

如果 n 是偶数，则用 n / 2替换 n 。
如果 n 是奇数，则可以用 n + 1或n - 1替换 n 。
n 变为 1 所需的最小替换次数是多少？

示例 1：
输入：n = 8
输出：3
解释：8 -> 4 -> 2 -> 1

示例 2：
输入：n = 7
输出：4
解释：7 -> 8 -> 4 -> 2 -> 1
或 7 -> 6 -> 3 -> 2 -> 1

示例 3：
输入：n = 4
输出：2
 
提示：
1 <= n <= 231 - 1
**/
/**
 * @param {number} n
 * @return {number}
 */
var integerReplacement = function(n) {
	let ret = Number.MAX_VALUE
	let backTrack = function(num, times){
		if(num == 1) {
			ret = Math.min(ret, times)
			return
		}

		if(num%2 == 0) {
			backTrack(parseInt(num/2), times+1)
		}else {
			backTrack(num+1, times+1)
			backTrack(num-1, times+1)
		}
	}
	backTrack(n, 0)
	return ret
};
console.log('integerReplacement:', integerReplacement(4))

/**
398. 随机数索引
给定一个可能含有重复元素的整数数组，要求随机输出给定的数字的索引。 您可以假设给定的数字一定存在于数组中。

注意：
数组大小可能非常大。 使用太多额外空间的解决方案将不会通过测试。

示例:
int[] nums = new int[] {1,2,3,3,3};
Solution solution = new Solution(nums);

// pick(3) 应该返回索引 2,3 或者 4。每个索引的返回概率应该相等。
solution.pick(3);

// pick(1) 应该返回 0。因为只有nums[0]等于1。
solution.pick(1);

蓄水池抽样问题
**/
/**
 * @param {number[]} nums
 */
var Solution = function(nums) {
	this.nums = nums
};

/** 
 * @param {number} target
 * @return {number}
 */
Solution.prototype.pick = function(target) {
	let n = 0
	let idx = 0
	for(let i = 0; i<this.nums.length; i++) {
		if(this.nums[i] == target) {
			n++
			//随机
			if(parseInt(Math.random()*n+1) == n) {
				idx = i
			}
		}
	}
	return idx
};
/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.pick(target)
 */
 nums = [1,2,3,3,3]
obj = new Solution(nums)
param_1 = obj.pick(3)
console.log('Solution:', param_1)

/**
399. 除法求值
给你一个变量对数组 equations 和一个实数值数组 values 作为已知条件，其中 equations[i] = [Ai, Bi] 和 values[i] 共同表示等式 Ai / Bi = values[i] 。每个 Ai 或 Bi 是一个表示单个变量的字符串。
另有一些以数组 queries 表示的问题，其中 queries[j] = [Cj, Dj] 表示第 j 个问题，请你根据已知条件找出 Cj / Dj = ? 的结果作为答案。
返回 所有问题的答案 。如果存在某个无法确定的答案，则用 -1.0 替代这个答案。如果问题中出现了给定的已知条件中没有出现的字符串，也需要用 -1.0 替代这个答案。
注意：输入总是有效的。你可以假设除法运算中不会出现除数为 0 的情况，且不存在任何矛盾的结果。

示例 1：
输入：equations = [["a","b"],["b","c"]], values = [2.0,3.0], queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]
输出：[6.00000,0.50000,-1.00000,1.00000,-1.00000]
解释：
条件：a / b = 2.0, b / c = 3.0
问题：a / c = ?, b / a = ?, a / e = ?, a / a = ?, x / x = ?
结果：[6.0, 0.5, -1.0, 1.0, -1.0 ]

示例 2：
输入：equations = [["a","b"],["b","c"],["bc","cd"]], values = [1.5,2.5,5.0], queries = [["a","c"],["c","b"],["bc","cd"],["cd","bc"]]
输出：[3.75000,0.40000,5.00000,0.20000]

示例 3：
输入：equations = [["a","b"]], values = [0.5], queries = [["a","b"],["b","a"],["a","c"],["x","y"]]
输出：[0.50000,2.00000,-1.00000,-1.00000]

提示：
1 <= equations.length <= 20
equations[i].length == 2
1 <= Ai.length, Bi.length <= 5
values.length == equations.length
0.0 < values[i] <= 20.0
1 <= queries.length <= 20
queries[i].length == 2
1 <= Cj.length, Dj.length <= 5
Ai, Bi, Cj, Dj 由小写英文字母与数字组成

思路
方法：并查集
一边查询一边修改结点指向是并查集的特色。


**/

 class UnionFind {
 	parent;//父节点
 	weight;//权重值
 	constructor(n) {
 		this.parent = []
 		this.weight = []
 		for(let i = 0; i<n; i++) {
 			this.parent[i] = i
 			this.weight[i] = 1
 		}
 	}

 	union(x, y, value) {
 		//插入
 		let rootX = this.find(x)
 		let rootY = this.find(y)
 		if(rootX != rootY) {
 			//统一父节点
 			this.parent[rootX] = rootY
 			this.weight[rootX] = this.weight[y]*value/this.weight[x]
 		}
 	}

 	find(x) {
 		//查找 并且 路径压缩
 		if(x!=this.parent[x]) {
 			//非根节点
 			let origin = this.parent[x]
 			this.parent[x] = this.find(this.parent[x])
 			this.weight[x] *= this.weight[origin]
 		}
 		return this.parent[x]

 	}

 	isConnected(x, y){
 		let rootX = this.find(x)
 		let rootY = this.find(y)
 		if(rootX == rootY) {
 			return this.weight[x]/this.weight[y]
 		}
 		return -1.0
 	}

 }
 /**
 * @param {string[][]} equations
 * @param {number[]} values
 * @param {string[][]} queries
 * @return {number[]}
 */
var calcEquation = function(equations, values, queries) {
	let size = equations.length
	let union = new UnionFind(size*2)
	// 第 1 步：预处理，将变量的值与 id 进行映射，使得并查集的底层使用数组实现，方便编码
	let hashMap = {}
	let id = 0
	for(let i = 0; i<equations.length; i++) {
		let equation = equations[i]
		let var1 = equation[0]
		let var2 = equation[1]
		if(hashMap[var1]==null) {
			hashMap[var1] = id
			id++
		}
		if(hashMap[var2]==null) {
			hashMap[var2] = id
			id++
		}
		union.union(hashMap[var1], hashMap[var2], values[i])
	}
	// 第 2 步：做查询
	let res = []
	for(let i = 0; i<queries.length; i++) {
		let querie = queries[i]
		let var1 = querie[0]
		let var2 = querie[1]

		let id1 = hashMap[var1]
		let id2 = hashMap[var2]
		if(id1==null || id2==null){
			res.push(-1.0)
		}else {
			res.push(union.isConnected(id1, id2))
		}
	}
	return res
};
equations = [["a","b"],["b","c"]], values = [2.0,3.0], queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]
equations = [["a","b"],["b","c"],["bc","cd"]], values = [1.5,2.5,5.0], queries = [["a","c"],["c","b"],["bc","cd"],["cd","bc"]]
equations = [["a","b"]], values = [0.5], queries = [["a","b"],["b","a"],["a","c"],["x","y"]]
equations = [["x1","x2"],["x2","x3"],["x1","x4"],["x2","x5"]]
values = [3.0,0.5,3.4,5.6]
queries = [["x2","x4"],["x1","x5"],["x1","x3"],["x5","x5"],["x5","x1"],["x3","x4"],["x4","x3"],["x6","x6"],["x0","x0"]]
console.log('calcEquation:', calcEquation(equations, values, queries))

/**
400. 第 N 位数字
在无限的整数序列 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ...中找到第 n 位数字。
注意：n 是正数且在 32 位整数范围内（n < 231）。

示例 1：
输入：3
输出：3

示例 2：
输入：11
输出：0
解释：第 11 位数字在序列 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ... 里是 0 ，它是 10 的一部分。
// 思路
1~9
9 个数
9*1 总共的位数

10~99
90
90*2

100~999
900
900*3
**/
/**
 * @param {number} n
 * @return {number}
 */
var findNthDigit = function(n) {
	 // 首先判断target是几位数，用digits表示
	 let digits = 1//几位数
	 let base = 9 // 多少个数
	 while(n-digits*base>0) {
	 	n -= digits*base
	 	digits+=1
	 	base*=10
	 }
	 // 取得当前值 number
	 let number = 1
	 for(let i = 1; i<digits; i++) {
	 	number*=10
	 }
	let idx = n % digits  // 注意由于上面的计算，n现在表示digits位数的第n个数字
	number += parseInt(n/digits)
	if(idx == 0) {
		//整除
		number -= 1
		idx = digits
	}
	// 找到target中对应的数字 对应idx位 总共digits位
	for(let i = idx; i<digits; i++) {
		number = parseInt(number/10)
	}
	return number%10
};
console.log('findNthDigit:', findNthDigit(12))

/**
401. 二进制手表
二进制手表顶部有 4 个 LED 代表 小时（0-11），底部的 6 个 LED 代表 分钟（0-59）。

每个 LED 代表一个 0 或 1，最低位在右侧。

（图源：WikiMedia - Binary clock samui moon.jpg ，许可协议：Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) ）

例如，上面的二进制手表读取 “3:25”。

给定一个非负整数 n 代表当前 LED 亮着的数量，返回所有可能的时间。
**/
/**
 * @param {number} turnedOn
 * @return {string[]}
 */
var readBinaryWatch = function(turnedOn) {
	let binaryCount = function(n) {
		let res = 0
		while(n!=0) {
			n = n&(n-1)
			res++
		}
		return res
	}
	let ret = []
	//遍历 00:00~12:59 查看每个时间有多少个1
	for(let i = 0; i<12; i++) {
		for(let j = 0; j<60; j++) {
			if(binaryCount(i)+binaryCount(j) == turnedOn) {
				ret.push(i+':'+(j<10?'0'+j:j))
			}
		}
	}
	return ret
};
console.log('readBinaryWatch:', readBinaryWatch(2))

/**
402. 移掉K位数字
给定一个以字符串表示的非负整数 num，移除这个数中的 k 位数字，使得剩下的数字最小。

注意:
num 的长度小于 10002 且 ≥ k。
num 不会包含任何前导零。

示例 1 :
输入: num = "1432219", k = 3
输出: "1219"
解释: 移除掉三个数字 4, 3, 和 2 形成一个新的最小的数字 1219。

示例 2 :
输入: num = "10200", k = 1
输出: "200"
解释: 移掉首位的 1 剩下的数字为 200. 注意输出不能有任何前导零。

示例 3 :
输入: num = "10", k = 2
输出: "0"
解释: 从原数字移除所有的数字，剩余为空就是0。

方法2贪心+单调栈
因此，对于每个数字，如果该数字小于栈顶元素，我们就不断地弹出栈顶元素，直到
栈为空
或者新的栈顶元素不大于当前数字
或者我们已经删除了 kk 位数字
**/
/**
 * @param {string} num
 * @param {number} k
 * @return {string}
 */
var removeKdigits = function(num, k) {
	//保证升序排列
	let findDelIdx = function() {
		//查找删除的元素
		let idx = -1
		for(let i = 0; i<num.length-1; i++) {
			if(num[i]>num[i+1]) {
				idx = i
				break
			}
		}
		return idx == -1?num.length-1:idx
	}
	while(k>0) {
		let idx = findDelIdx()
		num = num.substr(0, idx)+num.substr(idx+1)
		k--
	}
	let start = num.length
	for(let i = 0; i<num.length; i++) {
		if(num[i] != '0') {
			start = i
			break
		}
	}
	console.log(num, start)
	num = num.substr(start)
	return num || "0"
};
var removeKdigits2 = function(num, k) {
	let stack = []
	for(let i = 0; i<num.length; i++) {
		while(stack.length>0 && stack[stack.length-1]>num[i] && k) {
			stack.pop()
			k--
		}
		stack.push(num[i])
	}
	for(; k>0; k--) {
		stack.pop()
	}
	let res = ''
	let isZero = true
	for(let i = 0; i<stack.length; i++) {
		if(stack[i] != '0') {
			isZero = false
		}
		if(!isZero) {
			res+=stack[i]
		}
	}
	return res == ''? '0':res
}
num = "1432219", k = 3
// num = "10", k = 2
// num = "10200", k = 1
// num = "1432219", k = 3
// num = "100", k = 1
console.log('removeKdigits:', removeKdigits2(num, k))
/**
403. 青蛙过河
一只青蛙想要过河。 假定河流被等分为若干个单元格，并且在每一个单元格内都有可能放有一块石子（也有可能没有）。 青蛙可以跳上石子，但是不可以跳入水中。
给你石子的位置列表 stones（用单元格序号 升序 表示）， 请判定青蛙能否成功过河（即能否在最后一步跳至最后一块石子上）。
开始时， 青蛙默认已站在第一块石子上，并可以假定它第一步只能跳跃一个单位（即只能从单元格 1 跳至单元格 2 ）。
如果青蛙上一步跳跃了 k 个单位，那么它接下来的跳跃距离只能选择为 k - 1、k 或 k + 1 个单位。 另请注意，青蛙只能向前方（终点的方向）跳跃。

示例 1：
输入：stones = [0,1,3,5,6,8,12,17]
输出：true
解释：青蛙可以成功过河，按照如下方案跳跃：跳 1 个单位到第 2 块石子, 然后跳 2 个单位到第 3 块石子, 接着 跳 2 个单位到第 4 块石子, 然后跳 3 个单位到第 6 块石子, 跳 4 个单位到第 7 块石子, 最后，跳 5 个单位到第 8 个石子（即最后一块石子）。

示例 2：
输入：stones = [0,1,2,3,4,8,9,11]
输出：false
解释：这是因为第 5 和第 6 个石子之间的间距太大，没有可选的方案供青蛙跳跃过去。
 
提示：
2 <= stones.length <= 2000
0 <= stones[i] <= 2的31 - 1
stones[0] == 0
**/
/**
 * @param {number[]} stones
 * @return {boolean}
 */
var canCross = function(stones) {
	let n = stones.length
	let values = [-1, 0, 1]
	let idxMap = {}
	for(let i = 0; i<n; i++) {
		idxMap[stones[i]] = i
	}
	let temp = [] //缓存结果 二维数组 当前下标、当前的跳跃值
	let findNext = function(idx, k) {
		let nextIdx = -1
		for(let j = idx+1; j<n; j++) {
			if(stones[idx]+k == stones[j]) {
				nextIdx = j
				break
			}else if(stones[idx]+k < stones[j]){
				break
			}
		}
		return nextIdx
	}
	let findNext2 = function(idx, k) {
		return idxMap[stones[idx]+k] || -1
	}
	let backTrack = function(idx, k) {
		temp[idx] = temp[idx] || []
		if(temp[idx][k]!=null) {
			return temp[idx][k] //缓存剪枝
		}
		if(idx == n-1) {
			temp[idx][k] = true
			return true
		}

		for(let i = 0; i<values.length; i++) {
			let value = k+values[i]
			if(value<=0){
				continue
			}
			let nextIdx = findNext2(idx, value)
			if(nextIdx<0) {
				continue
			}
			let res = backTrack(nextIdx, value)
			if(res) {
				temp[idx][k] = true
				return true
			}
		}
		temp[idx][k] = false
		return temp[idx][k]
	}
	return backTrack(0, 0)
};
var canCross2 = function(stones) {

}
stones = [0,1,3,5,6,8,12,17]
stones = [0,1,2,3,4,8,9,11]
// stones = [
// 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,598,599,600,601,602,603,604,605,606,607,608,609,610,611,612,613,614,615,616,617,618,619,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,716,717,718,719,720,721,722,723,724,725,726,727,728,729,730,731,732,733,734,735,736,737,738,739,740,741,742,743,744,745,746,747,748,749,750,751,752,753,754,755,756,757,758,759,760,761,762,763,764,765,766,767,768,769,770,771,772,773,774,775,776,777,778,779,780,781,782,783,784,785,786,787,788,789,790,791,792,793,794,795,796,797,798,799,800,801,802,803,804,805,806,807,808,809,810,811,812,813,814,815,816,817,818,819,820,821,822,823,824,825,826,827,828,829,830,831,832,833,834,835,836,837,838,839,840,841,842,843,844,845,846,847,848,849,850,851,852,853,854,855,856,857,858,859,860,861,862,863,864,865,866,867,868,869,870,871,872,873,874,875,876,877,878,879,880,881,882,883,884,885,886,887,888,889,890,891,892,893,894,895,896,897,898,899,900,901,902,903,904,905,906,907,908,909,910,911,912,913,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,929,930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949,950,951,952,953,954,955,956,957,958,959,960,961,962,963,964,965,966,967,968,969,970,971,972,973,974,975,976,977,978,979,980,981,982,983,984,985,986,987,988,989,990,991,992,993,994,995,996,997,998,99999999
// ]
console.log('canCross:', canCross(stones))
/**
404. 左叶子之和
计算给定二叉树的所有左叶子之和。

示例：

    3
   / \
  9  20
    /  \
   15   7

在这个二叉树中，有两个左叶子，分别是 9 和 15，所以返回 24
**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumOfLeftLeaves = function(root) {
	//先中后序遍历都可以
	let sum = 0
	let backTrack = function(node){
		if(!node) {
			return
		}
		let left = node.left
		if(left && !left.left && !left.right) {
			sum+=left.val
		}
		let right = node.right
		backTrack(left)
		backTrack(right)
	}
	backTrack(root)
	return sum
};

/**
405. 数字转换为十六进制数
给定一个整数，编写一个算法将这个数转换为十六进制数。对于负整数，我们通常使用 补码运算 方法。
注意:
十六进制中所有字母(a-f)都必须是小写。
十六进制字符串中不能包含多余的前导零。如果要转化的数为0，那么以单个字符'0'来表示；对于其他情况，十六进制字符串中的第一个字符将不会是0字符。 
给定的数确保在32位有符号整数范围内。
不能使用任何由库提供的将数字直接转换或格式化为十六进制的方法。
示例 1：
输入:
26
输出:
"1a"

示例 2：
输入:
-1
输出:
"ffffffff"
**/

/**
 * @param {number} num
 * @return {string}
 */
var toHex = function(num) {
	let hexMap = {0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'a',11:'b',12:'c',13:'d',14:'e',15:'f'}
	let res = ''
	let temp = ''
	for(let i = 0; i<32; i+=4) {
		let value = (num>>i)&15
		temp=hexMap[value]+temp
		if(value>0) {
			res = temp+res
			temp = ''
		}
	}
	return res||'0'
};
console.log('toHex:', toHex(12345))

/**
406. 根据身高重建队列
假设有打乱顺序的一群人站成一个队列，数组 people 表示队列中一些人的属性（不一定按顺序）。每个 people[i] = [hi, ki] 表示第 i 个人的身高为 hi ，前面 正好 有 ki 个身高大于或等于 hi 的人。
请你重新构造并返回输入数组 people 所表示的队列。返回的队列应该格式化为数组 queue ，其中 queue[j] = [hj, kj] 是队列中第 j 个人的属性（queue[0] 是排在队列前面的人）。

示例 1：
输入：people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
输出：[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
解释：
编号为 0 的人身高为 5 ，没有身高更高或者相同的人排在他前面。
编号为 1 的人身高为 7 ，没有身高更高或者相同的人排在他前面。
编号为 2 的人身高为 5 ，有 2 个身高更高或者相同的人排在他前面，即编号为 0 和 1 的人。
编号为 3 的人身高为 6 ，有 1 个身高更高或者相同的人排在他前面，即编号为 1 的人。
编号为 4 的人身高为 4 ，有 4 个身高更高或者相同的人排在他前面，即编号为 0、1、2、3 的人。
编号为 5 的人身高为 7 ，有 1 个身高更高或者相同的人排在他前面，即编号为 1 的人。
因此 [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]] 是重新构造后的队列。

示例 2：
输入：people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]
输出：[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]
 
提示：
1 <= people.length <= 2000
0 <= hi <= 106
0 <= ki < people.length
题目数据确保队列可以被重建

思路
如果我们在初始时建立一个包含 n 个位置的空队列，而我们每次将一个人放入队列中时，会将一个「空」位置变成「满」位置，那么当我们放入第 i 个人时，我们需要给他安排一个「空」位置，并且这个「空」位置前面恰好还有
ki个「空」位置，用来安排给后面身高更高的人。也就是说，第 i 个人的位置，就是队列中从左往右数第ki+1 个「空」位置。

时间复杂度
O（n的平方）
空间复杂度
O(logN) --排序所用空间
**/
/**
 * @param {number[][]} people
 * @return {number[][]}
 */
var reconstructQueue = function(people) {
	//排序，身高从低到高，ki从大到小(越靠前，人越少)
	people.sort(function(a, b){
		return a[0]<b[0] || (a[0]==b[0]&&a[1]>b[1])?-1:1
	})
	console.log(people)
	//插入
	let n = people.length
	let res = []
	for(let i = 0; i<n; i++) {
		let person = people[i]
		let space = person[1]+1
		for(let j = 0; j<n; j++) {
			if(!res[j]) {
				space-- //留出>=自己的个数
				if(!space) {
					res[j] = person
					break
				}
			}
		}
	}
	return res
};

people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]
people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
prople = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
console.log('reconstructQueue:', reconstructQueue(people))
/**
409. 最长回文串
给定一个包含大写字母和小写字母的字符串，找到通过这些字母构造成的最长的回文串。
在构造过程中，请注意区分大小写。比如 "Aa" 不能当做一个回文字符串。

注意:
假设字符串的长度不会超过 1010。

示例 1:
输入:
"abccccdd"

输出:
7

解释:
我们可以构造的最长的回文串是"dccaccd", 它的长度是 7。
**/
/**
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function(s) {
	let charMap = {}
	for(let i = 0; i<s.length; i++) {
		let c = s[i]
		charMap[c] = charMap[c] || 0
		charMap[c]++
	}
	let ret = 0
	let ext = 0
	for(let k in charMap) {
		let num = charMap[k]
		if(ext<=0 && num%2 == 1) {
			ext = 1
		}
		ret += parseInt(num/2)*2
	}
	return ret+ext
};
console.log('longestPalindrome:', longestPalindrome("abccccdd"))

/**
410. 分割数组的最大值
给定一个非负整数数组 nums 和一个整数 m ，你需要将这个数组分成 m 个非空的连续子数组。
设计一个算法使得这 m 个子数组各自和的最大值最小。
 
示例 1：
输入：nums = [7,2,5,10,8], m = 2
输出：18
解释：
一共有四种方法将 nums 分割为 2 个子数组。 其中最好的方式是将其分为 [7,2,5] 和 [10,8] 。
因为此时这两个子数组各自的和的最大值为18，在所有情况中最小。

示例 2：
输入：nums = [1,2,3,4,5], m = 2
输出：9

示例 3：
输入：nums = [1,4,4], m = 3
输出：4
 
提示：
1 <= nums.length <= 1000
0 <= nums[i] <= 106
1 <= m <= min(50, nums.length)

思路：
动态规划

**/
/**
 * @param {number[]} nums
 * @param {number} m
 * @return {number}
 */
var splitArray = function(nums, m) {
	//时间复杂度 O（N*N*M）  空间复杂度O（N*M）
	let n = nums.length
	let f = [] //二维数组，f[i][j]表示前i个值被分成连续的j断最小和
	for(let i = 0; i<=n; i++) {
		f[i] = []
		for(let j = 0; j<=m; j++) {
			f[i][j] = Number.MAX_VALUE
		}
	}
	let sub = [0]//前i个数的和
	for(let i = 0; i<n; i++) {
		sub[i+1]=sub[i]+nums[i]
	}
	console.log(sub)
	f[0][0] = 0
	for(let i = 1; i<=n; i++) {
		for(let j = 1; j<=Math.min(i, m); j++) {
			for(let k = 0; k<i; k++){//前k段分成j-1份  +  第k段 k+1~i
				f[i][j] = Math.min(f[i][j], Math.max(f[k][j-1], sub[i]-sub[k]))
			}
		}
	}
	return f[n][m]
};
console.log('splitArray:', splitArray([7,2,5,10,8], 2))

/**
412. Fizz Buzz
写一个程序，输出从 1 到 n 数字的字符串表示。

1. 如果 n 是3的倍数，输出“Fizz”；
2. 如果 n 是5的倍数，输出“Buzz”；
3.如果 n 同时是3和5的倍数，输出 “FizzBuzz”。

示例：
n = 15,
返回:
[
    "1",
    "2",
    "Fizz",
    "4",
    "Buzz",
    "Fizz",
    "7",
    "8",
    "Fizz",
    "Buzz",
    "11",
    "Fizz",
    "13",
    "14",
    "FizzBuzz"
]
**/
/**
 * @param {number} n
 * @return {string[]}
 */
var fizzBuzz = function(n) {
	let ret = []
	for(let i = 1; i<=n; i++) {
		if(i%15 == 0) {
			ret.push('FizzBuzz')
		}else if(i%5 == 0){
			ret.push('Buzz')
		}else if(i%3 == 0){
			ret.push('Fizz')
		}else {
			ret.push(i.toString())
		}
	}
	return ret
};
console.log('fizzBuzz:', fizzBuzz(15))
/**
413. 等差数列划分
如果一个数列至少有三个元素，并且任意两个相邻元素之差相同，则称该数列为等差数列。
例如，以下数列为等差数列:
1, 3, 5, 7, 9
7, 7, 7, 7
3, -1, -5, -9
以下数列不是等差数列。
1, 1, 2, 5, 7
数组 A 包含 N 个数，且索引从0开始。数组 A 的一个子数组划分为数组 (P, Q)，P 与 Q 是整数且满足 0<=P<Q<N 。
如果满足以下条件，则称子数组(P, Q)为等差数组：
元素 A[P], A[p + 1], ..., A[Q - 1], A[Q] 是等差的。并且 P + 1 < Q 。
函数要返回数组 A 中所有为等差数组的子数组个数。

示例:
A = [1, 2, 3, 4]
返回: 3, A 中有三个子等差数组: [1, 2, 3], [2, 3, 4] 以及自身 [1, 2, 3, 4]。

方法1
暴力法
遍历开始、结束元素
时间复杂度O(n方) 空间复杂度 O(1)

方法2 
递归法
{1,2,3}
num1 = 1
{1,2,3,4}
num2 = 1+2
{1,2,3,4,5}
num3 = 1+2+3
时间复杂度O（n）
空间O（1）
规律：每次增加  上一次增加num+1
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var numberOfArithmeticSlices = function(nums) {
	//只需要连续的3个或3个以上满足等差数列就可以
	//时间复杂度O(n方) 空间复杂度 O(1)
	let count = 0
	if(nums.length<3) {
		return count
	}
	let n = nums.length
	for(let s = 0; s<n-2; s++) {
		let d = nums[s+1]-nums[s]
		let e = s+2
		for(; e<n; e++) {
			if(nums[e]-nums[e-1]!=d) {
				break
			}
			count++
		}
	}
	return count
};
var numberOfArithmeticSlices2 = function(nums) {
	let num = 0
	let backTrack = function(i){
		// i当前监测数组右值
		if(i<2) {
			return 0
		}
		let ap = 0
		if(nums[i]-nums[i-1] == nums[i-1]-nums[i-2]) {
			// 等差数列
			ap = 1+backTrack(i-1)
			num += ap
		}else {
			backTrack(i-1)
		}
		return ap
	}
	backTrack(nums.length-1)
	return num
}
nums = [1, 2, 3, 4]
console.log('numberOfArithmeticSlices:', numberOfArithmeticSlices2(nums))

/**
414. 第三大的数
给你一个非空数组，返回此数组中 第三大的数 。如果不存在，则返回数组中最大的数。

示例 1：
输入：[3, 2, 1]
输出：1
解释：第三大的数是 1 。

示例 2：
输入：[1, 2]
输出：2
解释：第三大的数不存在, 所以返回最大的数 2 。

示例 3：
输入：[2, 2, 3, 1]
输出：1
解释：注意，要求返回第三大的数，是指在所有不同数字中排第三大的数。
此例中存在两个值为 2 的数，它们都排第二。在所有不同数字中排第三大的数为 1 。

提示：
1 <= nums.length <= 104
-231 <= nums[i] <= 231 - 1
 
进阶：你能设计一个时间复杂度 O(n) 的解决方案吗？
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var thirdMax = function(nums) {
	let one = -Number.MAX_VALUE
	let two = -Number.MAX_VALUE
	let three = -Number.MAX_VALUE
	for(let i = 0; i<nums.length; i++) {
		if(nums[i]==one || nums[i]==two || nums[i]==three){
			continue
		}
		if(nums[i]>one) {
			three = two
			two = one
			one = nums[i]
		}else if(nums[i]>two){
			three = two
			two = nums[i]
		}else if(nums[i]>three) {
			three = nums[i]
		}
	}
	return three == -Number.MAX_VALUE?one:three
};
nums = [2, 2, 3, 1]
console.log('thirdMax:', thirdMax(nums))

/**
415. 字符串相加
给定两个字符串形式的非负整数 num1 和num2 ，计算它们的和。

提示：
num1 和num2 的长度都小于 5100
num1 和num2 都只包含数字 0-9
num1 和num2 都不包含任何前导零
你不能使用任何內建 BigInteger 库， 也不能直接将输入的字符串转换为整数形式
**/
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function(num1, num2) {
	let i = num1.length-1
	let j = num2.length-1
	let add = 0 //进位
	let res = []
	while(i>=0 || j>=0 || add>0) {
		let a = i>=0?num1[i]-'0':0
		let b = j>=0?num2[j]-'0':0
		let ret = a+b+add
		add = parseInt(ret/10)
		res.push(ret%10)
		i--
		j--
	}
	return res.reverse().join('')
};
console.log('addStrings:', addStrings('999', '101'))

/**
416. 分割等和子集
给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

示例 1：
输入：nums = [1,5,11,5]
输出：true
解释：数组可以分割成 [1, 5, 5] 和 [11] 。

示例 2：
输入：nums = [1,2,3,5]
输出：false
解释：数组不能分割成两个元素和相等的子集。
 
提示：
1 <= nums.length <= 200
1 <= nums[i] <= 100

思路
动态规划，需要判断 取数组中的值能到和的一半就行

**/
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function(nums) {
	//时间复杂度O（n*target） 空间复杂度O（target）
	if(nums.length<2) {
		return false
	}
	let sum = 0
	let maxNum = 0
	for(let i = 0; i<nums.length; i++) {
		sum += nums[i]
		maxNum = Math.max(maxNum, nums[i])
	}
	if(sum%2!=0) {
		//奇数
		return false
	}
	let target = sum/2
	if(maxNum>target) {
		//最大值超过一半
		return false
	}
	let dp = []//是否能满足第dp[i]个值
	dp[0] = true
	for(let i = 0; i<nums.length; i++) {
		let num = nums[i]
		for(let j = target; j>=num; j--) {
			dp[j] = dp[j] || dp[j-num]
		}
	}
	return dp[target] || false
};
nums = [1,5,11,5]
nums = [1,2,3,5]
nums = [2,2,3,5]
console.log('canPartition:', canPartition(nums))
/**
417. 太平洋大西洋水流问题
给定一个 m x n 的非负整数矩阵来表示一片大陆上各个单元格的高度。“太平洋”处于大陆的左边界和上边界，而“大西洋”处于大陆的右边界和下边界。
规定水流只能按照上、下、左、右四个方向流动，且只能从高到低或者在同等高度上流动。
请找出那些水流既可以流动到“太平洋”，又能流动到“大西洋”的陆地单元的坐标。

提示：
输出坐标的顺序不重要
m 和 n 都小于150

示例：
给定下面的 5x5 矩阵:
  太平洋 ~   ~   ~   ~   ~ 
       ~  1   2   2   3  (5) *
       ~  3   2   3  (4) (4) *
       ~  2   4  (5)  3   1  *
       ~ (6) (7)  1   4   5  *
       ~ (5)  1   1   2   4  *
          *   *   *   *   * 大西洋

返回:
[[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] (上图中带括号的单元).

思路
广度优先从上下左右遍历
太平洋能到达的数组是ao能到达的位置标记1
大西洋能到达的数组是po能到达的位置标记1
最后检查都为1的位置

时间复杂度O（m*n）
空间复杂度O（m*n）
**/
/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
var pacificAtlantic = function(heights) {
	let res = [] //结果
	let m = heights.length
	if(m<=0) {
		return res
	}
	let n = heights[0].length
	let dir = [[-1,0], [1,0], [0,-1], [0, 1]]
	let ao = [] //太平洋
	let po = [] //大西洋
	let isIn = function(x, y) {
		return x>=0&&x<m && y>=0&&y<n
	}
	let bfs = function(arr, x, y) {
		arr[x] = arr[x] || []
		arr[x][y] = 1
		for(let i = 0; i<dir.length; i++) {
			let newX = x+dir[i][0]
			let newY = y+dir[i][1]
			if(!isIn(newX, newY)||heights[x][y]>heights[newX][newY]||(arr[newX]&&arr[newX][newY]==1)) {
				continue
			}
			bfs(arr, newX, newY)
		}
	}
	for(let i = 0; i<m; i++) {
		bfs(ao, i, 0)
		bfs(po, i, n-1)
	}
	for(let i = 0; i<n; i++) {
		bfs(ao, 0, i)
		bfs(po, m-1, i)
	}
	for(let i = 0; i<m; i++) {
		for(let j = 0; j<n; j++) {
			if(ao[i][j] == 1 && po[i][j] == 1) {
				res.push([i, j])
			}
		}
	}
	return res
};
var heights = [
	[1,2,2,3,4],
	[3,2,3,4,4],
	[2,4,5,3,1],
	[6,7,1,4,5],
	[5,1,1,2,4]
]
console.log('pacificAtlantic:', pacificAtlantic(heights))
/**
419. 甲板上的战舰
给定一个二维的甲板， 请计算其中有多少艘战舰。 战舰用 'X'表示，空位用 '.'表示。 你需要遵守以下规则：

给你一个有效的甲板，仅由战舰或者空位组成。
战舰只能水平或者垂直放置。换句话说,战舰只能由 1xN (1 行, N 列)组成，或者 Nx1 (N 行, 1 列)组成，其中N可以是任意大小。
两艘战舰之间至少有一个水平或垂直的空位分隔 - 即没有相邻的战舰。
示例 :

X..X
...X
...X
在上面的甲板中有2艘战舰。

无效样例 :

...X
XXXX
...X
你不会收到这样的无效甲板 - 因为战舰之间至少会有一个空位将它们分开。

进阶:

你可以用一次扫描算法，只使用O(1)额外空间，并且不修改甲板的值来解决这个问题吗？

思路
找战舰头部，如果战舰的上或左是X说明不是头部
**/
/**
 * @param {character[][]} board
 * @return {number}
 */
var countBattleships = function(board) {
	let res = 0
	for(let i = 0; i<board.length; i++) {
		for(let j = 0; j<board[0].length; j++) {
			if(board[i][j] != 'X') {
				continue
			}
			//左
			if(j>0&&board[i][j-1]=='X') {
				continue
			}
			//上
			if(i>0&&board[i-1][j]=='X') {
				continue
			}
			res++
		}
	}
	return res
};
board = [
	['X', '.', '.', 'X'],
	['.', '.', '.', 'X'],
	['.', '.', '.', 'X'],
]
console.log('countBattleships:', countBattleships(board))

/**
420. 强密码检验器
一个强密码应满足以下所有条件：

由至少6个，至多20个字符组成。
至少包含一个小写字母，一个大写字母，和一个数字。
同一字符不能连续出现三次 (比如 "...aaa..." 是不允许的, 但是 "...aa...a..." 是可以的)。
编写函数 strongPasswordChecker(s)，s 代表输入字符串，如果 s 已经符合强密码条件，则返回0；否则返回要将 s 修改为满足强密码条件的字符串所需要进行修改的最小步数。

插入、删除、替换任一字符都算作一次修改。
**/
/**
 * @param {string} password
 * @return {number}
 */
var strongPasswordChecker = function(password) {

};

/**
421. 数组中两个数的最大异或值
给你一个整数数组 nums ，返回 nums[i] XOR nums[j] 的最大运算结果，其中 0 ≤ i ≤ j < n 。
进阶：你可以在 O(n) 的时间解决这个问题吗？

示例 1：
输入：nums = [3,10,5,25,2,8]
输出：28
解释：最大运算结果是 5 XOR 25 = 28.

示例 2：
输入：nums = [0]
输出：0

示例 3：
输入：nums = [2,4]
输出：6

示例 4：
输入：nums = [8,10,2]
输出：10

示例 5：
输入：nums = [14,70,53,83,49,91,36,80,92,51,66,70]
输出：127

提示：
1 <= nums.length <= 2 * 104
0 <= nums[i] <= 231 - 1

思路
找出二进制最长的为
从左边最大为开始检测有没有异或为1的
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaximumXOR = function(nums) {
	//时间复杂度O（N*L） 空间复杂度O（L）
	let maxNum = 0
	for(let i = 0; i<nums.length; i++) {
		maxNum = Math.max(maxNum, nums[i])
	}
	let maxStr = maxNum.toString(2)
	let L = maxStr.length
	let max_xor = 0, cur_xor = 0
	//从最大位遍历
	for(let i = L-1; i>-1; i--) {
		max_xor <<=1 //增加一位
		cur_xor = max_xor|1 //假设最后一位是1

		let binaryMap = {}
		for(let x of nums) {
			binaryMap[x>>i] = true
		}
		//判断是否存在 num1^num2=cur_xor  即判断 cur_xor^num是否存在于binaryMap中
		for(let k in binaryMap) {
			if(binaryMap[cur_xor^parseInt(k)]) {
				max_xor = cur_xor
				break
			}
		}
	}
	return max_xor
};
nums = [3,10,5,25,2,8]
nums = [14,70,53,83,49,91,36,80,92,51,66,70]
console.log('findMaximumXOR:', findMaximumXOR(nums))
/**
423. 从英文中重建数字
给定一个非空字符串，其中包含字母顺序打乱的英文单词表示的数字0-9。按升序输出原始的数字。

注意:
输入只包含小写英文字母。
输入保证合法并可以转换为原始的数字，这意味着像 "abc" 或 "zerone" 的输入是不允许的。
输入字符串的长度小于 50,000。

示例 1:
输入: "owoztneoer"
输出: "012" (zeroonetwo)

示例 2:
输入: "fviefuro"
输出: "45" (fourfive)
**/
/**
 * @param {string} s
 * @return {string}
 */
var originalDigits = function(s) {
	// let nums = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
	let out = [0,0,0,0,0,0,0,0,0,0] //结果
	let charCount = {} //字符个数
	for(let i = 0; i<s.length; i++) {
		charCount[s[i]] = charCount[s[i]] || 0
		charCount[s[i]] ++
	}
	//独一无二的单词
	out[0] = charCount['z'] || 0
	out[2] = charCount['w']||0
	out[4] = charCount['u']||0
	out[6] = charCount['x']||0
	out[8] = charCount['g']||0
	//计算其他的
	out[1] = (charCount['o']||0)-out[0]-out[2]-out[4]
	out[3] = (charCount['r']||0)-out[0]-out[4]
	out[5] = (charCount['f']||0)-out[4]
	out[7] = (charCount['s']||0)-out[6]
	out[9] = (charCount['i']||0)-out[5]-out[6]-out[8]
	let res = []
	for(let i = 0; i<out.length; i++) {
		for(let j = 0; j<out[i]; j++) {
			res.push(i)
		}
	}
	return res.join('')
};
s = "owoztneoer"
console.log('originalDigits:', originalDigits(s))

/*
424. 替换后的最长重复字符
给你一个仅由大写英文字母组成的字符串，你可以将任意位置上的字符替换成另外的字符，总共可最多替换 k 次。在执行上述操作后，找到包含重复字母的最长子串的长度。
注意：字符串长度 和 k 不会超过 104。

示例 1：
输入：s = "ABAB", k = 2
输出：4
解释：用两个'A'替换为两个'B',反之亦然。

示例 2：
输入：s = "AABABBA", k = 1
输出：4
解释：
将中间的一个'A'替换为'B',字符串变为 "AABBBBA"。
子串 "BBBB" 有最长重复字母, 答案为 4。

思路
双指针法
控制字符串的头部和尾部，依次往后走
*/
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var characterReplacement = function(s, k) {
	let maxLen = 0
	let length = s.length
	let backTrack = function(start, end, step){
		if(end>=length) {
			if(step>0){
				return Math.min(length-(end-start), step)
			}
			return 0
		}
		if(s[end] == s[start]) {
			return 1+backTrack(start, end+1, step)
		}else if(step>0) {
			return 1+backTrack(start, end+1, step-1)
		}
		return 0
	}
	for(let i = 0; i<s.length; i++) {
		if(i>0 && s[i] == s[i-1]) {
			continue
		}
		let len = backTrack(i, i, k)
		maxLen = Math.max(maxLen, len)
	}
	return maxLen
};
var characterReplacement2 = function(s, k) {
	//双指针法 O(N) O(26)
	let left = 0, right = 0, maxLen = 0
	let charMap = {}
	for(let i = 0; i<s.length; i++) {
		charMap[s[i]] = charMap[s[i]] || 0
		charMap[s[i]] ++
		maxLen = Math.max(maxLen, charMap[s[i]])//维护区间内重复字符最多的长度
		if(right+1-left-maxLen>k) {
			//超过长度，左指针移动
			charMap[s[left]] --
			left++
		}
		right++
	}
	return right-left
}
s = "ABAB", k = 2
// s = "AABABBA", k = 1
// s = "ABBB", k = 2
s = "ABAA", k = 0
console.log('characterReplacement:', characterReplacement2(s, k))

/**
427. 建立四叉树
给你一个 n * n 矩阵 grid ，矩阵由若干 0 和 1 组成。请你用四叉树表示该矩阵 grid 。
你需要返回能表示矩阵的 四叉树 的根结点。
注意，当 isLeaf 为 False 时，你可以把 True 或者 False 赋值给节点，两种值都会被判题机制 接受 。
四叉树数据结构中，每个内部节点只有四个子节点。此外，每个节点都有两个属性：
val：储存叶子结点所代表的区域的值。1 对应 True，0 对应 False；
isLeaf: 当这个节点是一个叶子结点时为 True，如果它有 4 个子节点则为 False 。
class Node {
    public boolean val;
    public boolean isLeaf;
    public Node topLeft;
    public Node topRight;
    public Node bottomLeft;
    public Node bottomRight;
}
我们可以按以下步骤为二维区域构建四叉树：
如果当前网格的值相同（即，全为 0 或者全为 1），将 isLeaf 设为 True ，将 val 设为网格相应的值，并将四个子节点都设为 Null 然后停止。
如果当前网格的值不同，将 isLeaf 设为 False， 将 val 设为任意值，然后如下图所示，将当前网格划分为四个子网格。
使用适当的子网格递归每个子节点。
如果你想了解更多关于四叉树的内容，可以参考 wiki 。

四叉树格式：
输出为使用层序遍历后四叉树的序列化形式，其中 null 表示路径终止符，其下面不存在节点。
它与二叉树的序列化非常相似。唯一的区别是节点以列表形式表示 [isLeaf, val] 。
如果 isLeaf 或者 val 的值为 True ，则表示它在列表 [isLeaf, val] 中的值为 1 ；如果 isLeaf 或者 val 的值为 False ，则表示值为 0 。

示例 1：
输入：grid = [[0,1],[1,0]]
输出：[[0,1],[1,0],[1,1],[1,1],[1,0]]
解释：此示例的解释如下：
请注意，在下面四叉树的图示中，0 表示 false，1 表示 True 。

示例 2：
输入：grid = [[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0]]
输出：[[0,1],[1,1],[0,1],[1,1],[1,0],null,null,null,null,[1,0],[1,0],[1,1],[1,1]]
解释：网格中的所有值都不相同。我们将网格划分为四个子网格。
topLeft，bottomLeft 和 bottomRight 均具有相同的值。
topRight 具有不同的值，因此我们将其再分为 4 个子网格，这样每个子网格都具有相同的值。
解释如下图所示：

示例 3：
输入：grid = [[1,1],[1,1]]
输出：[[1,1]]

示例 4：
输入：grid = [[0]]
输出：[[1,0]]

示例 5：
输入：grid = [[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]]
输出：[[0,1],[1,1],[1,0],[1,0],[1,1]]
提示：

n == grid.length == grid[i].length
n == 2^x 其中 0 <= x <= 6
**/

/**
 * // Definition for a QuadTree node.
 * function Node(val,isLeaf,topLeft,topRight,bottomLeft,bottomRight) {
 *    this.val = val;
 *    this.isLeaf = isLeaf;
 *    this.topLeft = topLeft;
 *    this.topRight = topRight;
 *    this.bottomLeft = bottomLeft;
 *    this.bottomRight = bottomRight;
 * };
 */

/**
 * @param {number[][]} grid
 * @return {Node}
 思路

广度优先遍历
队列的形式，先进先出
 */
var construct = function(grid) {
	let queue = [] //队列
	let res = [] //结果
	let n = grid.length
	let checkAllSame = function(x,y,w) {
		let one = grid[x][y]
		for(let i = 0; i<w; i++) {
			for(let j = 0; j<w; j++) {
				if(grid[i+x][j+y]!=one) {
					return -1
				}
			}
		}
		return one
	}
    queue.push([0,0,n])
    while(queue.length>0) {
    	let one = queue.shift()
    	if(one == null) {
    		res.push(null)
    		continue
    	}
    	let x = one[0], y = one[1], w = one[2]
    	let state = checkAllSame(x, y, w)
    	res.push([state<0?0:1, state<0?1:state])//isLeaf, val
    	if(state<0){
    		//分成4块
    		queue.push([x,y,w/2])
    		queue.push([x,y+w/2,w/2])
    		queue.push([x+w/2,y,w/2])
    		queue.push([x+w/2,y+w/2,w/2])
    	}else if(w>1) {
    		//4块null
    		queue.push(null)
    		queue.push(null)
    		queue.push(null)
    		queue.push(null)
    	}
    	//检查queue是否都为空
    	let isNull = true
    	for(let i = 0; i<queue.length; i++){
    		if(queue[i]!==null) {
    			isNull = false
    			break
    		}
    	}
    	if(isNull) queue = []
    }
    return res
};
var construct2 = function(grid) {
	//深度优先
	let checkAllSame = function(x,y,w) {
		let one = grid[x][y]
		for(let i = 0; i<w; i++) {
			for(let j = 0; j<w; j++) {
				if(grid[i+x][j+y]!=one) {
					return -1
				}
			}
		}
		return one
	}
	let n = grid.length
	let backTrack = function(x,y,w) {
		if(w<1) {
			return null
		}
		let state = checkAllSame(x, y, w)
		let node = new Node(state<0?1:state, state<0?0:1)// val isLeaf
    	if(state<0){
    		//分成4块
    		node.topLeft = backTrack(x,y,w/2)
    		node.topRight = backTrack(x,y+w/2,w/2)
    		node.bottomLeft = backTrack(x+w/2,y,w/2)
    		node.bottomRight = backTrack(x+w/2,y+w/2,w/2)
    	}
    	return node
	}
	return backTrack(0, 0, n)
}
grid = [[1,1],[1,1]]
grid = [[0,0],[1,0]]
grid = [[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0],[1,1,1,1,0,0,0,0]]
grid = [[0,1],[1,0]]
console.log('construct:', construct(grid))

/**
429. N 叉树的层序遍历
难度中等
给定一个 N 叉树，返回其节点值的层序遍历。（即从左到右，逐层遍历）。
树的序列化输入是用层序遍历，每组子节点都由 null 值分隔（参见示例）。
 
示例 1：

输入：root = [1,null,3,2,4,null,5,6]
输出：[[1],[3,2,4],[5,6]]

示例 2：

输入：root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
输出：[[1],[2,3,4,5],[6,7,8,9,10],[11,12,13],[14]]

思路
用队列的形式
广度优先遍历
**/

/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
	//time O(n) space O  
    let queue = [root] // 当前层
    let queueNext = [] //下一层
    let res = [] //结果
    if(root) {
    	res.push([])
    }
    while(queue.length>0) {
    	let node = queue.shift()
    	if(node) {
    		res[res.length-1].push(node.val)
    		//加入子节点
    		let children = node.children
    		if(children) {
    			queueNext = queueNext.concat(children)
    		}
    	}

    	if(queue.length<=0) {
    		queue = queueNext
    		if(queue.length>0) {
    			res.push([])
    		}
    		queueNext = []
    	}
    }
    return res
};
function NNode(val,children) {
   this.val = val;
   this.children = children;
};
let nnode = new NNode(1)
let nnode2 = new NNode(3)
let nnode3 = new NNode(2)
let nnode4 = new NNode(4)
let nnode5 = new NNode(5)
let nnode6 = new NNode(6)
nnode.children = [nnode2, nnode3, nnode4]
nnode2.children = [nnode5, nnode6]
console.log('levelOrder:', levelOrder(nnode))

/**
430. 扁平化多级双向链表
多级双向链表中，除了指向下一个节点和前一个节点指针之外，它还有一个子链表指针，可能指向单独的双向链表。这些子列表也可能会有一个或多个自己的子项，依此类推，生成多级数据结构，如下面的示例所示。
给你位于列表第一级的头节点，请你扁平化列表，使所有结点出现在单级双链表中。

示例 1：
输入：head = [1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
输出：[1,2,3,7,8,11,12,9,10,4,5,6]
解释：
输入的多级列表如下图所示：
扁平化后的链表如下图：

示例 2：
输入：head = [1,2,null,3]
输出：[1,3,2]
解释：
输入的多级列表如下图所示：

  1---2---NULL
  |
  3---NULL

示例 3：
输入：head = []
输出：[]

如何表示测试用例中的多级链表？
以 示例 1 为例：

 1---2---3---4---5---6--NULL
         |
         7---8---9---10--NULL
             |
             11--12--NULL
序列化其中的每一级之后：
[1,2,3,4,5,6,null]
[7,8,9,10,null]
[11,12,null]
为了将每一级都序列化到一起，我们需要每一级中添加值为 null 的元素，以表示没有节点连接到上一级的上级节点。

[1,2,3,4,5,6,null]
[null,null,7,8,9,10,null]
[null,11,12,null]
合并所有序列化结果，并去除末尾的 null 。
[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]

提示：
节点数目不超过 1000
1 <= Node.val <= 10^5

思路
深度优先遍历
**/
/**
 * // Definition for a Node.
 * function Node(val,prev,next,child) {
 *    this.val = val;
 *    this.prev = prev;
 *    this.next = next;
 *    this.child = child;
 * };
 */

/**
 * @param {Node} head
 * @return {Node}
 */
var flatten = function(head) {
    let getEndNode = function(node){
    	let p = node
    	while(p.next) {
    		p = p.next
    	}
    	return p
    }
    let p = head
    while(p) {
    	let child = p.child
    	if(child) {
    		let start = child
    		let end = getEndNode(child)
    		//插入到p后边
    		p.child = null
    		let next = p.next
    		p.next = start
    		start.prev = p
    		end.next = next
    		if(next) {
    			next.prev = end
    		}
    	}
    	p = p.next
    }
    return head
};
function BPNode(val,prev,next,child) {
   this.val = val;
   this.prev = prev;
   this.next = next;
   this.child = child;
};
function testFlatten() {
	//[1,2,3,4,5,6,null,null,null,7,8,9,10,null,null,11,12]
	let bpn1 = new BPNode(1)
	let bpn2 = new BPNode(2)
	let bpn3 = new BPNode(3)
	let bpn4 = new BPNode(4)
	let bpn5 = new BPNode(5)
	let bpn6 = new BPNode(6)
	let bpn7 = new BPNode(7)
	let bpn8 = new BPNode(8)
	let bpn9 = new BPNode(9)
	let bpn10 = new BPNode(10)
	let bpn11 = new BPNode(11)
	let bpn12 = new BPNode(12)
	bpn1.next = bpn2
	bpn2.prev = bpn1
	bpn2.next = bpn3
	bpn3.prev = bpn2
	bpn3.next = bpn4
	bpn4.prev = bpn3
	bpn4.next = bpn5
	bpn5.prev = bpn4
	bpn5.next = bpn6
	bpn6.prev = bpn5

	bpn7.next = bpn8
	bpn8.prev = bpn7
	bpn8.next = bpn9
	bpn9.prev = bpn8
	bpn9.next = bpn10
	bpn10.prev = bpn9

	bpn11.next = bpn12
	bpn12.prev = bpn11

	bpn3.child = bpn7
	bpn8.child = bpn11

	let n = flatten(bpn1)
	let res = []
	while(n) {
		res.push([n.val, n.prev?n.prev.val:null, n.next?n.next.val:null, n.child == null])
		n = n.next
	}
	return res
}
console.log('flatten:', testFlatten())

/**
432. 全 O(1) 的数据结构
请你实现一个数据结构支持以下操作：
Inc(key) - 插入一个新的值为 1 的 key。或者使一个存在的 key 增加一，保证 key 不为空字符串。
Dec(key) - 如果这个 key 的值是 1，那么把他从数据结构中移除掉。否则使一个存在的 key 值减一。如果这个 key 不存在，这个函数不做任何事情。key 保证不为空字符串。
GetMaxKey() - 返回 key 中值最大的任意一个。如果没有元素存在，返回一个空字符串"" 。
GetMinKey() - 返回 key 中值最小的任意一个。如果没有元素存在，返回一个空字符串""。

挑战：
你能够以 O(1) 的时间复杂度实现所有操作吗？

实现思路
字典+双向链表
map1<key, num>
map2<num, linkNode>
linkNode为有序的双向链表，其中keys--记录所有值为num的key
**/

class DLNode {
	constructor(val) {
		this.val = val
		this.keys = new Set() //键的集合
		this.prev = null
		this.next = null
	}
}
/**
 * Initialize your data structure here.
 */
var AllOne = function() {
	this.map1 = {}// <key val>
	this.map2 = {}// <val DLNode>
	this.head = new DLNode(0) //从大到小的顺序
	this.tail = new DLNode(0)
	this.head.next = this.tail
	this.tail.prev = this.head
};

/**
 * Inserts a new key <Key> with value 1. Or increments an existing key by 1. 
 * @param {string} key
 * @return {void}
 */
AllOne.prototype.inc = function(key) {
	let val = this.map1[key]
	if(val) {
		//已存在对应的值
		this.map1[key] = val+1
		let oldNode = this.map2[val]
		oldNode.keys.delete(key)
		let prevNode = oldNode.prev

		let newNode = this.map2[val+1]
		if(newNode) {
			newNode.keys.add(key)
		}else {
			//创建新的node插入
			newNode = new DLNode(val+1)
			newNode.keys.add(key)
			this.map2[val+1] = newNode

			newNode.prev = prevNode
			newNode.next = oldNode
			prevNode.next = newNode
			oldNode.prev = newNode
		}
		//优化 如果oldNode的keys长度为0，删除改节点
		if(oldNode.keys.size<=0) {
			prevNode = oldNode.prev
			delete this.map2[val]
			prevNode.next = oldNode.next
			oldNode.next.prev = prevNode
		}
	}else{
		//不存在
		this.map1[key] = 1
		let node = this.map2[1]
		if(node) {
			node.keys.add(key)
		}else {
			// 不存在，创建node
			node = new DLNode(1)
			this.map2[1] = node
			node.keys.add(key)
			//插入到最后
			node.next = this.tail
			node.prev = this.tail.prev
			this.tail.prev.next = node
			this.tail.prev = node
		}
	}
};

/**
 * Decrements an existing key by 1. If Key's value is 1, remove it from the data structure. 
 * @param {string} key
 * @return {void}
 */
AllOne.prototype.dec = function(key) {
	let val = this.map1[key]
	if(val) {
		let oldNode = this.map2[val]
		oldNode.keys.delete(key)
		let nextNode = oldNode.next
		if(val == 1) {
			//删除key
			delete this.map1[key]
		}else {
			// val-1
			this.map1[key] = val-1
			let newNode = this.map2[val-1]
			if(newNode) {
				newNode.keys.add(key)
			}else {
				//创建新的node插入
				newNode = new DLNode(val-1)
				newNode.keys.add(key)
				this.map2[val-1] = newNode

				newNode.prev = oldNode
				newNode.next = nextNode
				nextNode.prev = newNode
				oldNode.next = newNode
			}

		}
		// 优化oldNode
		if(oldNode.keys.size<=0) {
			nextNode = oldNode.next
			delete this.map2[val]
			oldNode.prev.next = nextNode
			nextNode.prev = oldNode.prev
		}
	}
};

/**
 * Returns one of the keys with maximal value.
 * @return {string}
 */
AllOne.prototype.getMaxKey = function() {
	let maxNode = this.head.next
	if(maxNode.val == 0) {
		return ''
	}
	for(let i of maxNode.keys.keys()){
		return i
	}
};

/**
 * Returns one of the keys with Minimal value.
 * @return {string}
 */
AllOne.prototype.getMinKey = function() {
	let minNode = this.tail.prev
	if(minNode.val == 0) {
		return ''
	}
	for(let i of minNode.keys.keys()){
		return i
	}
};

/**
 * Your AllOne object will be instantiated and called as such:
 * var obj = new AllOne()
 * obj.inc(key)
 * obj.dec(key)
 * var param_3 = obj.getMaxKey()
 * var param_4 = obj.getMinKey()
 */
var obj = new AllOne()
// obj.inc('hello')
// obj.inc('hello')
var param_3 = obj.getMaxKey()
var param_4 = obj.getMinKey()
console.log(param_3, param_4)

/**
433. 最小基因变化
一条基因序列由一个带有8个字符的字符串表示，其中每个字符都属于 "A", "C", "G", "T"中的任意一个。
假设我们要调查一个基因序列的变化。一次基因变化意味着这个基因序列中的一个字符发生了变化。
例如，基因序列由"AACCGGTT" 变化至 "AACCGGTA" 即发生了一次基因变化。
与此同时，每一次基因变化的结果，都需要是一个合法的基因串，即该结果属于一个基因库。
现在给定3个参数 — start, end, bank，分别代表起始基因序列，目标基因序列及基因库，请找出能够使起始基因序列变化为目标基因序列所需的最少变化次数。如果无法实现目标变化，请返回 -1。

注意：
起始基因序列默认是合法的，但是它并不一定会出现在基因库中。
如果一个起始基因序列需要多次变化，那么它每一次变化之后的基因序列都必须是合法的。
假定起始基因序列与目标基因序列是不一样的。
 
示例 1：
start: "AACCGGTT"
end:   "AACCGGTA"
bank: ["AACCGGTA"]

返回值: 1

示例 2：
start: "AACCGGTT"
end:   "AAACGGTA"
bank: ["AACCGGTA", "AACCGCTA", "AAACGGTA"]

返回值: 2

示例 3：
start: "AAAAACCC"
end:   "AACCCCCC"
bank: ["AAAACCCC", "AAACCCCC", "AACCCCCC"]

返回值: 3

单向广度搜索
1 把begin放入队列中
2 出队一个元素，修改这个元素上第一字母，修改值在这四个字母中选择'A', 'C', 'G', 'T'，四个字母都遍历一遍，
	如果和最后一个元素匹配，那么就退出，返回当前的层级（step）
	如果修改后元素的在bank的中出现，那么就放入队列中，同时删除bank中的相同的元素。
3 然后把第一个元素还原原先的字母，然后开始修改第二个字母。执行和第2步一致。
**/
/**
 * @param {string} start
 * @param {string} end
 * @param {string[]} bank
 * @return {number}
 */
var minMutation = function(start, end, bank) {
	let bankMap = {} //基因库
	for(let i = 0; i<bank.length; i++) {
		bankMap[bank[i]] = true
	}
	if(!bankMap[end]) {
		return -1
	}
	let list = ['A', 'C', 'G', 'T']
	let step = 0
	let queue = [start]
	while(queue.length>0) {
		step++
		let nextQueue = []
		for(let i = 0; i<queue.length; i++) {
			let gene = queue[i]
			for(let j = 0; j<gene.length; j++) {
				for(let k = 0; k<list.length; k++) {
					// 替换
					let new_gene = gene.substring(0, j)+list[k]+gene.substring(j+1)
					if(end == new_gene) {
						return step
					}
					if(bankMap[new_gene]) {
						delete bankMap[new_gene]
						nextQueue.push(new_gene)
					}
				}
			}

		}
		queue = nextQueue
	}
	return -1
}
start="AAAAACCC"
end="AACCCCCC"
bank=["AAAACCCC", "AAACCCCC", "AACCCCCC"]

start="AACCGGTT"
end="AAACGGTA"
bank=["AACCGGTA", "AACCGCTA", "AAACGGTA"]

start = "AACCGGTT"
end =   "AAACGGTA"
bank = ["AACCGATT","AACCGATA","AAACGATA","AAACGGTA"]

start = "AACCGGTT"
end = "AACCGGTA"
bank = []
console.log('minMutation:', minMutation(start, end, bank))

/**
434. 字符串中的单词数
统计字符串中的单词个数，这里的单词指的是连续的不是空格的字符。

请注意，你可以假定字符串里不包括任何不可打印的字符。

示例:

输入: "Hello, my name is John"
输出: 5
解释: 这里的单词是指连续的不是空格的字符，所以 "Hello," 算作 1 个单词。
**/
/**
 * @param {string} s
 * @return {number}
 */
var countSegments = function(s) {
	let count = 0
	for(let i = 0; i<s.length; i++) {
		let c = s[i]
		if((i==0 || s[i-1]==' ')&&s[i]!=' '){
			count++
		}
	}
	return count
};
s = "Hello, my name is John"
console.log('countSegments:', countSegments(s))

/**
435. 无重叠区间
给定一个区间的集合，找到需要移除区间的最小数量，使剩余区间互不重叠。
注意:
可以认为区间的终点总是大于它的起点。
区间 [1,2] 和 [2,3] 的边界相互“接触”，但没有相互重叠。

示例 1:
输入: [ [1,2], [2,3], [3,4], [1,3] ]
输出: 1
解释: 移除 [1,3] 后，剩下的区间没有重叠。

示例 2:
输入: [ [1,2], [1,2], [1,2] ]
输出: 2
解释: 你需要移除两个 [1,2] 来使剩下的区间没有重叠。

示例 3:
输入: [ [1,2], [2,3] ]
输出: 0
解释: 你不需要移除任何区间，因为它们已经是无重叠的了。
**/
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var eraseOverlapIntervals = function(intervals) {
	//动态规划
	// 按左侧排序
	intervals.sort(function(a, b){
		return a[0]-b[0]
	})
	//「以区间 i 为最后一个区间，可以选出的区间数量的最大值」
	let n = intervals.length
	let f = new Array(n).fill(1)
	for(let i = 1; i<n; i++) {
		for(let j = 0; j<i; j++) {
			//状态转移方程
			if(intervals[j][1]<=intervals[i][0]) {
				//无重叠区间
				f[i] = Math.max(f[i], f[j]+1)
			}
		}
	}
	//取出最优解
	return n - Math.max(...f);
};
var eraseOverlapIntervals2 = function(intervals) {
	//贪心
	// 按右侧降序排序
	intervals.sort(function(a, b){
		return a[1]-b[1]
	})
	let n = intervals.length
	let r = intervals[0][1]
	let ans = 1;// 不重叠的最大数量
	for(let i = 1; i<n; i++) {
		if(intervals[i][0]>=r) {
			ans++;
			r = intervals[i][1];
		}
	}
	return n-ans;

}
let intervals = [ [1,2], [2,3], [3,4], [1,3] ]
console.log('eraseOverlapIntervals:', eraseOverlapIntervals2(intervals))


/**
436. 寻找右区间
给你一个区间数组 intervals ，其中 intervals[i] = [starti, endi] ，且每个 starti 都 不同 。
区间 i 的 右侧区间 可以记作区间 j ，并满足 startj >= endi ，且 startj 最小化 。
返回一个由每个区间 i 的 右侧区间 的最小起始位置组成的数组。如果某个区间 i 不存在对应的 右侧区间 ，则下标 i 处的值设为 -1 。
 
示例 1：
输入：intervals = [[1,2]]
输出：[-1]
解释：集合中只有一个区间，所以输出-1。

示例 2：
输入：intervals = [[3,4],[2,3],[1,2]]
输出：[-1, 0, 1]
解释：对于 [3,4] ，没有满足条件的“右侧”区间。
对于 [2,3] ，区间[3,4]具有最小的“右”起点;
对于 [1,2] ，区间[2,3]具有最小的“右”起点。

示例 3：
输入：intervals = [[1,4],[2,3],[3,4]]
输出：[-1, 2, -1]
解释：对于区间 [1,4] 和 [3,4] ，没有满足条件的“右侧”区间。
对于 [2,3] ，区间 [3,4] 有最小的“右”起点。

提示：
1 <= intervals.length <= 2 * 104
intervals[i].length == 2
-106 <= starti <= endi <= 106
每个间隔的起点都 不相同
**/
/**
 * @param {number[][]} intervals
 * @return {number[]}
 */
var findRightInterval = function(intervals) {
	//排序+二分，时间复杂度O(n*lgn)
	//原地记录位置
	let n = intervals.length
	for(let i = 0; i<n; i++) {
		intervals[i].push(i)
	}
	intervals.sort(function(l,r) {
		return l[0]-r[0]
	})
	console.log(intervals)
	let binarySearch = function(l, r) {
		if(l>r) {
			return -1
		}
		let start = l, end = r, f = intervals[start-1][1]
		console.log(start, end, f)
		while(l<=r) {
			let mid = parseInt((l+r)/2)
			if(intervals[mid][0]>=f) {
				if(mid == start || intervals[mid-1][0]<f) {
					return intervals[mid][2]
				}
				r = mid-1
			}else {
				l = mid+1
			}
		}
		return -1
	}
	let res = []
	for(let i = 0; i<n; i++) {
		if(intervals[i][0] == intervals[i][1]) {
			res[intervals[i][2]] = intervals[i][2]
			continue;
		}
		let l = i +1
		let r = n-1
		res[intervals[i][2]] = binarySearch(l,r)
	}
	return res
};
intervals = [[3,4],[2,3],[1,2]]
intervals = [[1,1],[3,4]]
console.log('findRightInterval:', findRightInterval(intervals))

/**
437. 路径总和 III
给定一个二叉树，它的每个结点都存放着一个整数值。

找出路径和等于给定数值的路径总数。

路径不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。

二叉树不超过1000个节点，且节点数值范围是 [-1000000,1000000] 的整数。

示例：

root = [10,5,-3,3,2,null,11,3,-2,null,1], sum = 8

      10
     /  \
    5   -3
   / \    \
  3   2   11
 / \   \
3  -2   1

返回 3。和等于 8 的路径有:

1.  5 -> 3
2.  5 -> 2 -> 1
3.  -3 -> 11
**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
var pathSum = function(root, targetSum) {
	let path = 0
	let calValue = function(node, value)
	{
		if(!node) {
			return
		}
		value+=node.val
		if(value == targetSum) {
			path++
		}
		calValue(node.left, value)
		calValue(node.right, value)
	}
	let backTrack = function(node) {
		if(!node) {
			return
		}
		//start cal
		calValue(node, 0)
		backTrack(node.left)
		backTrack(node.right)
	}
	backTrack(root)
	return path
};

/**
438. 找到字符串中所有字母异位词
给定一个字符串 s 和一个非空字符串 p，找到 s 中所有是 p 的字母异位词的子串，返回这些子串的起始索引。
字符串只包含小写英文字母，并且字符串 s 和 p 的长度都不超过 20100。

说明：
字母异位词指字母相同，但排列不同的字符串。
不考虑答案输出的顺序。

示例 1:
输入:
s: "cbaebabacd" p: "abc"
输出:
[0, 6]
解释:
起始索引等于 0 的子串是 "cba", 它是 "abc" 的字母异位词。
起始索引等于 6 的子串是 "bac", 它是 "abc" 的字母异位词。

 示例 2:
输入:
s: "abab" p: "ab"
输出:
[0, 1, 2]
解释:
起始索引等于 0 的子串是 "ab", 它是 "ab" 的字母异位词。
起始索引等于 1 的子串是 "ba", 它是 "ab" 的字母异位词。
起始索引等于 2 的子串是 "ab", 它是 "ab" 的字母异位词。
**/
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
	//异位词 思路字典 时间复杂度O(m*n)
	let res = []
	let sN = s.length
	let pN = p.length
	if(pN>sN) {
		return res
	}
	let pMap = {}
	for(let i = 0; i<pN; i++) {
		pMap[p[i]] = pMap[p[i]] || 0
		pMap[p[i]]++
	}
	for(let i = 0; i<sN-pN+1; i++) {
		let temp = {}
		let fit = true
		for(let j = i; j<i+pN; j++) {
			let c = s[j]
			if(!pMap[c]) {
				fit = false
				i = j
				break
			}
			temp[c] = temp[c] || 0
			temp[c]++
			if(temp[c]>pMap[c]) {
				fit = false
				break
			}
		}
		if(fit) {
			res.push(i)
		}
	}
	return res
};
var findAnagrams2 = function(s, p) {
	// 滑动窗口法 时间复杂度O(n)
	let sN = s.length
	let pN = p.length
	let res = []
	let aCode = 'a'.charCodeAt(0)
	let need = new Array(26).fill(0)//需要的
	let win = new Array(26).fill(0) //窗口内的
	for(let i = 0; i<pN; i++) {
		need[p[i].charCodeAt(0)-aCode]++
	}
	let left = 0, right = 0
	while(right<sN) {
		let idx = s[right].charCodeAt(0)-aCode
		win[idx]++
		right++

		while(win[idx]>need[idx]) {
			//移动左位置
			let lIdx = s[left].charCodeAt(0)-aCode
			left++
			win[lIdx]--
		}


		//判断满足条件
		if(right-left == pN) {
			res.push(left)
		}
	}
	return res
}
s="cbaebabacd" 
p="abc"
// s='baa'
// p='aa'
console.log('findAnagrams:', findAnagrams2(s, p), )

/**
440. 字典序的第K小数字
给定整数 n 和 k，找到 1 到 n 中字典序第 k 小的数字。
注意：1 ≤ k ≤ n ≤ 109。

示例 :
输入:
n: 13   k: 2

输出:
10

解释:
字典序的排列是 [1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9]，所以第二小的数字是 10。

思路
1、快速排序的变形查找(时间复杂度O(n*lgn))
2、字典树
时间复杂度O(N)
1
0 1 2 3 4 5 6 7 8 9
**/
/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var findKthNumber = function(n, k) {
	let getCount = function(profile){
		//确定指定前缀下所有子节点数 prefix是前缀，n是上界
		let count = 0
		let cur = profile
		let next = cur+1
		while(cur<=n){
			count += Math.min(n+1, next)-cur
			cur*=10
			next*=10
		}
		return count
	}
	let p = 1 //作为一个指针，指向当前所在位置，当p==k时，也就是到了排位第k的数(表示当前的排序)
	let profile = 1 //前缀(当前排序的值)
	while(p<k) {
		let count = getCount(profile)
		if(p+count>k) {//在当前前缀下
			p++ //把指针指向了第一个子节点的位置，比如11乘10后变成110，指针从11指向了110
			profile*=10//前往子节点
		}else{
			p+=count//注意这里的操作，把指针指向了下一前缀的起点
			profile++//前往相邻节点
		}
	}
	return profile
};
n = 13
k = 2
n = 10
k = 3
console.log('findKthNumber:', findKthNumber(n, k))

/**
441. 排列硬币
你总共有 n 枚硬币，你需要将它们摆成一个阶梯形状，第 k 行就必须正好有 k 枚硬币。
给定一个数字 n，找出可形成完整阶梯行的总行数。
n 是一个非负整数，并且在32位有符号整型的范围内。

示例 1:
n = 5
硬币可排列成以下几行:
¤
¤ ¤
¤ ¤
因为第三行不完整，所以返回2.

示例 2:
n = 8
硬币可排列成以下几行:
¤
¤ ¤
¤ ¤ ¤
¤ ¤
因为第四行不完整，所以返回3.

思路
k*(k+1)/2 <= n
k*(k+1) <= 2n
k<=sqrt(2n)
**/
/**
 * @param {number} n
 * @return {number}
 */
var arrangeCoins = function(n) {
	//二分法
	let l = 0, r = parseInt(Math.sqrt(2*n))
	while(l<=r) {
		let mid = parseInt((l+r)/2)
		let num = mid*(mid+1)
		if(num == 2*n) {
			return mid
		}else if(num<2*n) {
			l = mid+1
		}else {
			r = mid-1
		}
	}
	//结果介于r~l之间 r是完整的
	return r
};
console.log('arrangeCoins:', arrangeCoins(8))

/**
442. 数组中重复的数据
给定一个整数数组 a，其中1 ≤ a[i] ≤ n （n为数组长度）, 其中有些元素出现两次而其他元素出现一次。
找到所有出现两次的元素。
你可以不用到任何额外空间并在O(n)时间复杂度内解决这个问题吗？

示例：
输入:
[4,3,2,7,8,2,3,1]
输出:
[2,3]
**/
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDuplicates = function(nums) {
	// 原地修改，数字对应下标+n   时间复杂度O(n) 空间O(1)
	let res = []
	let n = nums.length
	for(let i = 0; i<n; i++) {
		let idx = (nums[i]-1)%n
		nums[idx] += n
	}
	for(let i = 0; i<n; i++) {
		if(nums[i]>2*n) {
			res.push(i+1)
		}
	}
	return res
};
nums = [4,3,2,7,8,2,3,1]
nums = [10,2,5,10,9,1,1,4,3,7]
console.log('findDuplicates:', findDuplicates(nums))
/**
443. 压缩字符串
给定一组字符，使用原地算法将其压缩。
压缩后的长度必须始终小于或等于原数组长度。
数组的每个元素应该是长度为1 的字符（不是 int 整数类型）。
在完成原地修改输入数组后，返回数组的新长度。

进阶：
你能否仅使用O(1) 空间解决问题？
 
示例 1：
输入：
["a","a","b","b","c","c","c"]
输出：
返回 6 ，输入数组的前 6 个字符应该是：["a","2","b","2","c","3"]
说明：
"aa" 被 "a2" 替代。"bb" 被 "b2" 替代。"ccc" 被 "c3" 替代。

示例 2：
输入：
["a"]
输出：
返回 1 ，输入数组的前 1 个字符应该是：["a"]
解释：
没有任何字符串被替代。

示例 3：
输入：
["a","b","b","b","b","b","b","b","b","b","b","b","b"]
输出：
返回 4 ，输入数组的前4个字符应该是：["a","b","1","2"]。
解释：
由于字符 "a" 不重复，所以不会被压缩。"bbbbbbbbbbbb" 被 “b12” 替代。
注意每个数字在数组中都有它自己的位置。
 
提示：
所有字符都有一个ASCII值在[35, 126]区间内。
1 <= len(chars) <= 1000。
**/
/**
 * @param {character[]} chars
 * @return {number}
 */
var compress = function(chars) {
	let ret = []
	let len = chars.length
	let count = 0//当前字符的个数
	let c = chars[0]//当前处理的字符
	ret.push(c)
	let began = 1
	let writeArray = function () {
		//写会数组
		let str = count.toString()
		for(let i = 0; i<str.length; i++) {
			chars[began++] = str[i]
		}
	}
	for(let i = 0; i<len; i++) {
		let _c = chars[i]
		if(_c == c) {
			count++
		}else {
			//不相同的
			if(count>1) {
				writeArray()
			}
			//deal next
			count = 1
			c = _c
			chars[began++] = c
		}
	}
	if(count>1) {
		writeArray()
	}
	return began
};
chars = ["a","b","b","b","b","b","b","b","b","b","b","b","b"]
chars = ["a","a","b","b","c","c","c"]
chars = ["a"]
console.log('compress:', compress(chars))

/**
445. 两数相加 II
给你两个 非空 链表来代表两个非负整数。数字最高位位于链表开始位置。它们的每个节点只存储一位数字。将这两数相加会返回一个新的链表。
你可以假设除了数字 0 之外，这两个数字都不会以零开头。

进阶：
如果输入链表不能修改该如何处理？换句话说，你不能对列表中的节点进行翻转。

示例：
输入：(7 -> 2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 8 -> 0 -> 7
**/
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
	let stack1 = []
	let stack2 = []
	while(l1) {
		stack1.push(l1.val)
		l1 = l1.next
	}
	while(l2) {
		stack2.push(l2.val)
		l2 = l2.next
	}
	let ret = null
	let base = 0
	while(stack1.length>0 || stack2.length>0) {
		let val1 = stack1.pop() || 0
		let val2 = stack2.pop() || 0
		let val = val1+val2+base
		base = parseInt(val/10)
		let node = new ListNode(val%10, ret)
		ret = node
	}
	if(base>0) {
		let node = new ListNode(base, ret)
		ret = node
	}
	return ret
};
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

lN1 = new ListNode(7)
lN2 = new ListNode(2)
lN3 = new ListNode(4)
lN1.next = lN2
lN2.next = lN3

lN11 = new ListNode(5)
lN12 = new ListNode(6)
lN13 = new ListNode(4)
lN11.next = lN12
lN12.next = lN13
node = addTwoNumbers(lN1, lN11)
console.log('addTwoNumbers:')
while(node) {
	console.log(node.val)
	node = node.next
}

/**
446. 等差数列划分 II - 子序列
如果一个数列至少有三个元素，并且任意两个相邻元素之差相同，则称该数列为等差数列。
例如，以下数列为等差数列:
1, 3, 5, 7, 9
7, 7, 7, 7
3, -1, -5, -9
以下数列不是等差数列。
1, 1, 2, 5, 7
数组 A 包含 N 个数，且索引从 0 开始。该数组子序列将划分为整数序列 (P0, P1, ..., Pk)，满足 0 ≤ P0 < P1 < ... < Pk < N。
如果序列 A[P0]，A[P1]，...，A[Pk-1]，A[Pk] 是等差的，那么数组 A 的子序列 (P0，P1，…，PK) 称为等差序列。值得注意的是，这意味着 k ≥ 2。
函数要返回数组 A 中所有等差子序列的个数。
输入包含 N 个整数。每个整数都在 -231 和 231-1 之间，另外 0 ≤ N ≤ 1000。保证输出小于 231-1。
 
示例：
输入：[2, 4, 6, 8, 10]
输出：7
解释：
所有的等差子序列为：
[2,4,6]
[4,6,8]
[6,8,10]
[2,4,6,8]
[4,6,8,10]
[2,4,6,8,10]
[2,6,10]

思路
f[i][d] ，代表以 A[i] 结束且公差为 d 的等差数列个数。
现在状态转移方程就十分简单：
对于所有 j < i，f[i][A[i] - A[j]] += (f[j][A[i] - A[j]] + 1)。

时间复杂度O(n方)
空间复杂度O(n方)
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var numberOfArithmeticSlices = function(nums) {
	let n = nums.length
	let ans = 0 //结果
	let f = [] //状态数组
	for(let i = 0; i<n; i++) {
		f[i] = new Map()
		for(let j = 0; j<i; j++) {
			let diff = nums[i]-nums[j]
			let sum = f[j].get(diff) || 0
			let origin = f[i].get(diff) || 0
			f[i].set(diff, sum+origin+1)
			ans+=sum
		}
	}
	return ans
};
nums = [2, 4, 6, 8, 10]
console.log('numberOfArithmeticSlices:', numberOfArithmeticSlices(nums))

/**
25. K 个一组翻转链表
给你一个链表，每 k 个节点一组进行翻转，请你返回翻转后的链表。

k 是一个正整数，它的值小于或等于链表的长度。

如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。

进阶：

你可以设计一个只使用常数额外空间的算法来解决此问题吗？
你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。
**/
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function(head, k) {
	let p = head
	for(let i = 0; i<k; i++){
		if(!p) {
			return head
		}
		p = p.next
	}
	//下一k个元素的头节点
	let pre = reverseKGroup(p, k)

	let now = head
	let next = head
	// 翻转当前k个元素
	for(let i = 0; i<k; i++) {
		next = now.next
		now.next = pre

		pre = now
		now = next
	}
	return pre
};
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
	let set = new Set();
	let l = 0,r = 0;
	let maxLen = 1
	for(let i = 0; i<s.length; i++) {
		let c = s[i];
		//找到重复的移动左下标
		while(set.has(c)) {
			set.delete(s[l]);
			l++
		}
		set.add(c)
		maxLen = Math.max(r-l+1, maxLen)
		r++;
	}
	return maxLen

};
s = "abcabcbb"
s = "pwwkew"
s = "bbbbb"
console.log('lengthOfLongestSubstring:', lengthOfLongestSubstring(s))

/**
447. 回旋镖的数量
给定平面上 n 对 互不相同 的点 points ，其中 points[i] = [xi, yi] 。回旋镖 是由点 (i, j, k) 表示的元组 ，其中 i 和 j 之间的距离和 i 和 k 之间的距离相等（需要考虑元组的顺序）。
返回平面上所有回旋镖的数量。

示例 1：
输入：points = [[0,0],[1,0],[2,0]]
输出：2
解释：两个回旋镖为 [[1,0],[0,0],[2,0]] 和 [[1,0],[2,0],[0,0]]

示例 2：
输入：points = [[1,1],[2,2],[3,3]]
输出：2

示例 3：
输入：points = [[1,1]]
输出：0

提示：
n == points.length
1 <= n <= 500
points[i].length == 2
-104 <= xi, yi <= 104
所有点都 互不相同

方法
哈希值法，记录距离的哈希值
**/
/**
 * @param {number[][]} points
 * @return {number}
 */
var numberOfBoomerangs = function(points) {
	let distance = function(p1, p2) {
		return Math.pow(p2[0]-p1[0], 2)+Math.pow(p2[1]-p1[1], 2)
	}
	let n = points.length
	let num = 0
	for(let i = 0; i<n; i++){
		for(let j = 0; j<n; j++) {
			if(i == j){
				continue
			}
			for(let k = 0; k<n; k++) {
				if(i == k || j == k) {
					continue
				}
				if(distance(points[i], points[j]) == distance(points[i], points[k])){
					num++
				}
			}
		}
	}
	return num
};
var numberOfBoomerangs2 = function(points) {
	let ret = []
	let n = points.length
	let num = 0
	let distance = function(p1, p2) {
		return Math.pow(p2[0]-p1[0], 2)+Math.pow(p2[1]-p1[1], 2)
	}
	for(let i = 0; i<n; i++){
		let map = new Map()
		for(let j = 0; j<n; j++) {
			let dis = distance(points[j], points[i])
			map.set(dis, (map.get(dis)||0)+1)
		}
		map.forEach((value, key)=>{
			num += value*(value-1) // 推算过程 2*n*(n-1)/2
		})
	}
	return num
}
points = [[1,1],[2,2],[3,3]]
console.log('numberOfBoomerangs:', numberOfBoomerangs2(points))

/**
448. 找到所有数组中消失的数字
给你一个含 n 个整数的数组 nums ，其中 nums[i] 在区间 [1, n] 内。请你找出所有在 [1, n] 范围内但没有出现在 nums 中的数字，并以数组的形式返回结果。

示例 1：

输入：nums = [4,3,2,7,8,2,3,1]
输出：[5,6]
示例 2：

输入：nums = [1,1]
输出：[2]
 

提示：

n == nums.length
1 <= n <= 105
1 <= nums[i] <= n
进阶：你能在不使用额外空间且时间复杂度为 O(n) 的情况下解决这个问题吗? 你可以假定返回的数组不算在额外空间内。
**/
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDisappearedNumbers = function(nums) {
	//同样的道理，对应的下表位置+n
	let n = nums.length
	for(let i = 0; i<n; i++) {
		let idx = (nums[i]-1)%n
		nums[idx]+=n
	}
	let ret = []
	for(let i = 0; i<n; i++) {
		if(nums[i]<=n) {
			ret.push(i+1)
		}
	}
	return ret
};
nums = [4,3,2,7,8,2,3,1]
console.log('findDisappearedNumbers:', findDisappearedNumbers(nums))

/**
449. 序列化和反序列化二叉搜索树
序列化是将数据结构或对象转换为一系列位的过程，以便它可以存储在文件或内存缓冲区中，或通过网络连接链路传输，以便稍后在同一个或另一个计算机环境中重建。
设计一个算法来序列化和反序列化 二叉搜索树 。 对序列化/反序列化算法的工作方式没有限制。 您只需确保二叉搜索树可以序列化为字符串，并且可以将该字符串反序列化为最初的二叉搜索树。
编码的字符串应尽可能紧凑。

示例 1：
输入：root = [2,1,3]
输出：[2,1,3]

示例 2：
输入：root = []
输出：[]

提示：
树中节点数范围是 [0, 104]
0 <= Node.val <= 104
题目数据 保证 输入的树是一棵二叉搜索树。
 
注意：不要使用类成员/全局/静态变量来存储状态。 你的序列化和反序列化算法应该是无状态的。
**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
	//广度优先
    let ret = []
    if(!root) {
    	ret.push()
    	return '[]'
    }
    let totalNum = 0
    let checkNum = function(node) {
    	if(!node) {
    		return
    	}
    	totalNum++
    	checkNum(node.left)
    	checkNum(node.right)
    }
    checkNum(root)
    let queue = [root]
    while(totalNum>0) {
    	let node = queue.shift()//第一个
    	if(node) {
    		totalNum --
    		ret.push(node.val)
    		queue.push(node.left)
    		queue.push(node.right)
    	}else {
    		ret.push(null)
    		queue.push(null)
    		queue.push(null)
    	}
    }
    return '['+ret.join()+']'
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    if(data == '[]') {
    	return null
    }
    data = data.substr(1, data.length-1)
    let queue = data.split(',')
    for(let i = 0; i<queue.length; i++) {
    	queue[i] = queue[i] == ''?null:new TreeNode(parseInt(queue[i]))
    }
    let n = queue.length
    for(let i = 0; i<queue.length; i++) {
    	if(!queue[i]) {
    		continue
    	}
    	let lIdx = 2*i+1
    	let rIdx = 2*i+2
    	if(lIdx<n) {
    		queue[i].left = queue[lIdx]
    	}
    	if(rIdx<n) {
    		queue[i].right = queue[rIdx]
    	}
    }
    return queue[0]
};
//优化版   深度优先   后续遍历  题目为二叉搜索树，是有序的
/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */

 /**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
	let ret = []
	let backTrack = function(node) {
		if(!node) {
			return
		}
		backTrack(node.left)
		backTrack(node.right)
		ret.push(node.val)
	}
	backTrack(root)
	return ret.join()
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
	if(data == '') {
		return null;
	}
    let queue = data.split(',')
    let backTrack = function(low, up, array){
    	if(array.length<=0) {
    		return null;
    	}
    	let val = array[array.length-1]
    	val = parseInt(val)
    	if(val<low || val>up) {
    		return null;
    	}
    	array.pop()
    	let node = new TreeNode(val)
    	node.right = backTrack(val, up, array)
    	node.left = backTrack(low, val, array)
    	return node
    }
    return backTrack(-1, Number.MAX_VALUE, queue)
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
function test449() {
	let n1 = new TreeNode(2);
	let n2 = new TreeNode(1);
	let n3 = new TreeNode(3);
	let n4 = new TreeNode(4);
	n1.left = n2;
	n1.right = n3;
	n3.right = n4;
	let res = serialize(n1)
	console.log('serialize:', res)
	let n = deserialize(res)
	console.log('deserialize:', n)
}
test449()

/**
450. 删除二叉搜索树中的节点
给定一个二叉搜索树的根节点 root 和一个值 key，删除二叉搜索树中的 key 对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。
一般来说，删除节点可分为两个步骤：
首先找到需要删除的节点；
如果找到了，删除它。
说明： 要求算法时间复杂度为 O(h)，h 为树的高度。

示例:

root = [5,3,6,2,4,null,7]
key = 3

    5
   / \
  3   6
 / \   \
2   4   7

给定需要删除的节点值是 3，所以我们首先找到 3 这个节点，然后删除它。

一个正确的答案是 [5,4,6,2,null,null,7], 如下图所示。

    5
   / \
  4   6
 /     \
2       7

另一个正确答案是 [5,2,6,null,4,null,7]。

    5
   / \
  2   6
   \   \
    4   7

**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
 class BinarySearch{
 	constructor(){

 	}
 	successor(node) {
 		//节点的后继
 		node = node.right
 		while(node.left) {
 			node = node.left
 		}
 		return node.val
 	}
 	predecessor(node) {
 		//节点的前驱
 		node = node.left
 		while(node.right) {
 			node = node.right
 		}
 		return node.val
 	}
 	deleteNode(root, val){
 		if(!root) {
 			return null
 		}
 		let value = root.val
 		if(val>value) {
 			root.right = this.deleteNode(root.right, val)
 		}else if(val<value) {
 			root.left = this.deleteNode(root.left, val)
 		}else {
 			if(!root.left && !root.right) {
 				//叶子节点
 				root = null
 			}else if(root.right) {
 				//有右节点
 				root.val = this.successor(root)
 				root.right = this.deleteNode(root.right, root.val)
 			}else {
 				root.val = this.predecessor(root)
 				root.left = this.deleteNode(root.left, root.val)
 			}
 		}

 		return root
 	}
 }
/**
 * @param {TreeNode} root
 * @param {number} key
 * @return {TreeNode}
 */
var deleteNode = function(root, key) {
	return new BinarySearch().deleteNode(root, key)
};
function test450() {
	let n1 = new TreeNode(2);
	let n2 = new TreeNode(1);
	let n3 = new TreeNode(3);
	let n4 = new TreeNode(4);
	n1.left = n2;
	n1.right = n3;
	n3.right = n4;
	console.log('deleteNode:', deleteNode(n1, 3))
}
test450()

/**
451. 根据字符出现频率排序
给定一个字符串，请将字符串里的字符按照出现的频率降序排列。

示例 1:
输入:
"tree"
输出:
"eert"
解释:
'e'出现两次，'r'和't'都只出现一次。
因此'e'必须出现在'r'和't'之前。此外，"eetr"也是一个有效的答案。

示例 2:
输入:
"cccaaa"
输出key: "value", 
"cccaaa"
解释:
'c'和'a'都出现三次。此外，"aaaccc"也是有效的答案。
注意"cacaca"是不正确的，因为相同的字母必须放在一起。

示例 3:
输入:
"Aabb"
输出:
"bbAa"
解释:
此外，"bbaA"也是一个有效的答案，但"Aabb"是不正确的。
注意'A'和'a'被认为是两种不同的字符。
**/
/**
 * @param {string} s
 * @return {string}
 */
var frequencySort = function(s) {
	let n = 48
	let nums = []
	for(let i = 0; i<n; i++) {
		nums.push({num:0, idx:i})
	}
	let code_A = 'A'.charCodeAt(0)
	let code_Z = 'Z'.charCodeAt(0)
	let code_a = 'a'.charCodeAt(0)
	let space = code_a-code_Z-1
	let convertC = function(c) {
		//转换为idx
		let code = c.charCodeAt(0)
		if(code>=code_a) {
			return code-space-code_A
		}
		return code-code_A
	}
	let convertIdx = function(idx) {
		idx = idx+code_A
		if(idx>code_Z) {
			idx += space
		}
		return String.fromCharCode(idx)
	}
	for(let i = 0; i<s.length; i++) {
		let idx = convertC(s[i])
		nums[idx].num++
	}
	nums.sort(function(a, b) {
		return b.num-a.num
	})
	let ret = []
	for(let i = 0; i<n; i++) {
		if(nums[i].num>0){
			let c = convertIdx(nums[i].idx)
			for(let j = 0; j<nums[i].num; j++) {
				ret.push(c)
			}
		}

	}
	return ret.join('')
};
var frequencySort = function(s) {
	//桶排序法
	// 思路：1、记录出现频率，最大频率n 2创建n大小数组，同频率的加入相同下标 3拼接字符
	let map = {}
	let n = s
	let maxLen = 0
	for(let i = 0; i<s.length; i++) {
		map[s[i]] = map[s[i]] || 0
		map[s[i]]++
		maxLen = Math.max(maxLen, map[s[i]])
	}

	let buckets = []
	for(let key in map){
		let idx = map[key]
		buckets[map[key]] = buckets[map[key]] || []
		buckets[map[key]].push(key)
	}
	console.log(buckets)
	let ret = []
	for(let i = maxLen; i>0; i--) {
		let bucket = buckets[i]
		if(!bucket) {
			continue
		}
		for(let j = 0; j<bucket.length; j++) {
			for(let k = 0; k<i; k++) {
				ret.push(bucket[j])
			}
		}
	}
	return ret.join('')
}
s = 'tree'
s = 'Aabb'
s = "2a554442f544asfasssffffasss"
console.log('frequencySort:', frequencySort(s))

/**
452. 用最少数量的箭引爆气球
在二维空间中有许多球形的气球。对于每个气球，提供的输入是水平方向上，气球直径的开始和结束坐标。由于它是水平的，所以纵坐标并不重要，因此只要知道开始和结束的横坐标就足够了。开始坐标总是小于结束坐标。
一支弓箭可以沿着 x 轴从不同点完全垂直地射出。在坐标 x 处射出一支箭，若有一个气球的直径的开始和结束坐标为 xstart，xend， 且满足  xstart ≤ x ≤ xend，则该气球会被引爆。可以射出的弓箭的数量没有限制。 
弓箭一旦被射出之后，可以无限地前进。我们想找到使得所有气球全部被引爆，所需的弓箭的最小数量。

给你一个数组 points ，其中 points [i] = [xstart,xend] ，返回引爆所有气球所必须射出的最小弓箭数。
 
示例 1：
输入：points = [[10,16],[2,8],[1,6],[7,12]]
输出：2
解释：对于该样例，x = 6 可以射爆 [2,8],[1,6] 两个气球，以及 x = 11 射爆另外两个气球

示例 2：
输入：points = [[1,2],[3,4],[5,6],[7,8]]
输出：4

示例 3：
输入：points = [[1,2],[2,3],[3,4],[4,5]]
输出：2

示例 4：
输入：points = [[1,2]]
输出：1

示例 5：
输入：points = [[2,3],[2,3]]
输出：1

提示：
1 <= points.length <= 104
points[i].length == 2
-231 <= xstart < xend <= 231 - 1

**/
/**
 * @param {number[][]} points
 * @return {number}
 */
var findMinArrowShots = function(points) {
	let n = points.length
	if(n<=1) {
		return n
	}
	//排序
	points.sort(function(a, b){
		return a[0]-b[0]
	})
	console.log(points)
	let count = 1
	let left = points[0][0]
	let right = points[0][1]
	for(let i = 1; i<points.length; i++) {
		if(points[i][0]<=right && points[i][1]>=left) {
			//贪心算法找最多的重叠 个数
			left = Math.max(left, points[i][0])
			right = Math.min(right, points[i][1])
		}else {
			count++
			left = points[i][0]
			right = points[i][1]
		}
	}
	return count
};
points = [[10,16],[2,8],[1,6],[7,12]]
points = [[1,2],[3,4],[5,6],[7,8]]
points = [[2,3],[2,3]]
console.log('findMinArrowShots:', findMinArrowShots(points))
/**
453. 最小操作次数使数组元素相等
给定一个长度为 n 的 非空 整数数组，每次操作将会使 n - 1 个元素增加 1。找出让数组所有元素相等的最小操作次数。

示例：

输入：
[1,2,3]
输出：
3
解释：
只需要3次操作（注意每次操作会增加两个元素的值）：
[1,2,3]  =>  [2,3,3]  =>  [3,4,3]  =>  [4,4,4]

方法
排序+累加
步骤
1234
a3-a0
+3
4564
a2-a0
+2
6766
a1-a0
+1
7777
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var minMoves = function(nums) {
	nums.sort(function(a, b){
		return a-b
	})
	let num = 0
	for(let i = nums.length-1; i>0; i--) {
		num+=nums[i]-nums[0]
	}
	return num
};
nums = [1,2,3]
console.log('minMoves:', minMoves(nums))

/**
454. 四数相加 II
给定四个包含整数的数组列表 A , B , C , D ,计算有多少个元组 (i, j, k, l) ，使得 A[i] + B[j] + C[k] + D[l] = 0。

为了使问题简单化，所有的 A, B, C, D 具有相同的长度 N，且 0 ≤ N ≤ 500 。所有整数的范围在 -228 到 228 - 1 之间，最终结果不会超过 231 - 1 。

例如:

输入:
A = [ 1, 2]
B = [-2,-1]
C = [-1, 2]
D = [ 0, 2]

输出:
2

解释:
两个元组如下:
1. (0, 0, 0, 1) -> A[0] + B[0] + C[0] + D[1] = 1 + (-2) + (-1) + 2 = 0
2. (1, 1, 0, 0) -> A[1] + B[1] + C[0] + D[0] = 2 + (-1) + (-1) + 0 = 0
**/
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number[]} nums3
 * @param {number[]} nums4
 * @return {number}
 */
var fourSumCount = function(nums1, nums2, nums3, nums4) {
	//思路 map key两数之和 value个数
	let map = new Map()
	for(let i = 0; i<nums1.length; i++) {
		for(let j = 0; j<nums2.length; j++) {
			let sum = nums1[i]+nums2[j]
			let count = map.get(sum) || 0
			map.set(sum, count+1)
		}
	}
	let res = 0
	console.log(map)
	for(let i = 0; i<nums3.length; i++) {
		for(let j = 0; j<nums4.length; j++) {
			let sum = nums3[i]+nums4[j]
			let count = map.get(-sum) || 0
			if(count>0) {
				res+=count
			}
		}
	}
	return res
};
A = [ 1, 2]
B = [-2,-1]
C = [-1, 2]
D = [ 0, 2]

A = [-1,-1]
B = [-1,1]
C = [-1,1]
D = [1,-1]
console.log('fourSumCount:', fourSumCount(A, B, C, D))

/**
455. 分发饼干
假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。

对每个孩子 i，都有一个胃口值 g[i]，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 j，都有一个尺寸 s[j] 。如果 s[j] >= g[i]，我们可以将这个饼干 j 分配给孩子 i ，这个孩子会得到满足。
你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。

 
示例 1:

输入: g = [1,2,3], s = [1,1]
输出: 1
解释: 
你有三个孩子和两块小饼干，3个孩子的胃口值分别是：1,2,3。
虽然你有两块小饼干，由于他们的尺寸都是1，你只能让胃口值是1的孩子满足。
所以你应该输出1。
示例 2:

输入: g = [1,2], s = [1,2,3]
输出: 2
解释: 
你有两个孩子和三块小饼干，2个孩子的胃口值分别是1,2。
你拥有的饼干数量和尺寸都足以让所有孩子满足。
所以你应该输出2.
 

提示：

1 <= g.length <= 3 * 104
0 <= s.length <= 3 * 104
1 <= g[i], s[j] <= 231 - 1
**/

/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
var findContentChildren = function(g, s) {
	// 思路 1排序 2贪心遍历
	g.sort((a, b)=>{
		return a-b
	})
	s.sort((a, b)=>{
		return a-b
	})
	let n1 = g.length
	let n2 = s.length
	let ret = 0
	for(let i = 0, j = 0; i<n1 && j<n2; i++,j++) {
		while(s[j]<g[i] && j<n2) {
			j++
		}
		if(j<n2) {
			ret++
		}
	}
	return ret
};
g = [1,2], s = [1,2,3]
console.log('findContentChildren:', findContentChildren(g, s))

/**
456. 132 模式
给你一个整数数组 nums ，数组中共有 n 个整数。132 模式的子序列 由三个整数 nums[i]、nums[j] 和 nums[k] 组成，并同时满足：i < j < k 和 nums[i] < nums[k] < nums[j] 。
如果 nums 中存在 132 模式的子序列 ，返回 true ；否则，返回 false 。

示例 1：
输入：nums = [1,2,3,4]
输出：false
解释：序列中不存在 132 模式的子序列。

示例 2：
输入：nums = [3,1,4,2]
输出：true
解释：序列中有 1 个 132 模式的子序列： [1, 4, 2] 。

示例 3：
输入：nums = [-1,3,2,0]
输出：true
解释：序列中有 3 个 132 模式的的子序列：[-1, 3, 2]、[-1, 3, 0] 和 [-1, 2, 0] 。

提示：
n == nums.length
1 <= n <= 2 * 105
-109 <= nums[i] <= 109

思路2
用一个单调栈（值递减）维护3
max_k维护真正的2
然后枚举1
**/
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var find132pattern = function(nums) {
	// 132模式，数的大小
	let n = nums.length
	for(let i = 0; i<n-2; i++) {
		for(let j = i+1; j<n-1; j++) {
			for(let k = j+1; k<n; k++) {
				if(nums[j]>nums[i] && nums[j]>nums[k] && nums[k]>nums[i]) {
					return true
				}
			}
		}
	}
	return false
};
var find132pattern2 = function(nums) {
	//时间复杂度O(n) 空间O(n)
	let n = nums.length
	let stack = [nums[n-1]]
	let max_k = -Number.MAX_VALUE
	//因为枚举1，所以从后往前遍历
	for(let i = n-2; i>=0; i--) {
		if(nums[i]<max_k) {
			return true
		}
		//发现新的2，更新max_k的值
		while(stack.length>0 && nums[i]>stack[stack.length-1]){
			max_k = stack.pop()
		}
		//更新3的值
		if(nums[i]>max_k) {
			stack.push(nums[i])
		}
	}
	return false
}
nums = [-1,3,2,0]
nums = [1,2,3,4]
console.log('find132pattern:', find132pattern2(nums))
/**
457. 环形数组是否存在循环
存在一个不含 0 的 环形 数组 nums ，每个 nums[i] 都表示位于下标 i 的角色应该向前或向后移动的下标个数：
如果 nums[i] 是正数，向前 移动 nums[i] 步
如果 nums[i] 是负数，向后 移动 nums[i] 步
因为数组是 环形 的，所以可以假设从最后一个元素向前移动一步会到达第一个元素，而第一个元素向后移动一步会到达最后一个元素。
数组中的 循环 由长度为 k 的下标序列 seq ：
遵循上述移动规则将导致重复下标序列 seq[0] -> seq[1] -> ... -> seq[k - 1] -> seq[0] -> ...
所有 nums[seq[j]] 应当不是 全正 就是 全负
k > 1
如果 nums 中存在循环，返回 true ；否则，返回 false 。

示例 1：
输入：nums = [2,-1,1,2,2]
输出：true
解释：存在循环，按下标 0 -> 2 -> 3 -> 0 。循环长度为 3 。

示例 2：
输入：nums = [-1,2]
输出：false
解释：按下标 1 -> 1 -> 1 ... 的运动无法构成循环，因为循环的长度为 1 。根据定义，循环的长度必须大于 1 。

示例 3:
输入：nums = [-2,1,-1,-2,-2]
输出：false
解释：按下标 1 -> 2 -> 1 -> ... 的运动无法构成循环，因为 nums[1] 是正数，而 nums[2] 是负数。
所有 nums[seq[j]] 应当不是全正就是全负。
 
提示：
1 <= nums.length <= 5000
-1000 <= nums[i] <= 1000
nums[i] != 0
 
进阶：你能设计一个时间复杂度为 O(n) 且额外空间复杂度为 O(1) 的算法吗？
**/
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var circularArrayLoop = function(nums) {
	let n = nums.length
	let next = function(i) {
		//下一个
		return ((i+nums[i])%n+n)%n
	}
	let check2 = function(start) {
		//快慢指针 不一定循环一次
		let slow = start, fast = next(start)
		//a * b > 0 说明是同号，在这里就是同向。因为需要保证整个线路是同向的，nums[slow] * nums[fast] > 0，保证 第0 1 3 5 7 。。。步是同向的，nums[slow] * nums[next(fast)] > 0保证的是 0 2 4 6 8。。。是同向的
		while(nums[slow]*nums[fast]>0&&nums[slow]*nums[next(fast)]>0){
			if(slow == fast) {
				if(slow!=next(slow)) {
					//循环长度>1
					return true
				}else{
					break
				}
			}
			slow = next(slow)
			fast = next(next(fast))
		}
		//减枝
		let add = start;
        while (nums[add] * nums[next(add)] > 0) {
            let tmp = add;
            add = next(add);
            nums[tmp] = 0;
        }
		return false
	}
	for(let i = 0; i<nums.length; i++) {
		if(nums[i]!=0&&check2(i)) {
			return true
		}
	}
	return false
};
nums = [2,-1,1,2,2]
nums = [1,2,3,4,5]
nums = [-1,-1,-1]
nums = [-2,-17,-1,-2,-2]
// nums = [-1,2]
// nums = [-2,1,-1,-2,-2]
console.log('circularArrayLoop:', circularArrayLoop(nums))

/**
458. 可怜的小猪
有 buckets 桶液体，其中 正好 有一桶含有毒药，其余装的都是水。它们从外观看起来都一样。为了弄清楚哪只水桶含有毒药，你可以喂一些猪喝，通过观察猪是否会死进行判断。
不幸的是，你只有 minutesToTest 分钟时间来确定哪桶液体是有毒的。

喂猪的规则如下：
选择若干活猪进行喂养
可以允许小猪同时饮用任意数量的桶中的水，并且该过程不需要时间。
小猪喝完水后，必须有 minutesToDie 分钟的冷却时间。在这段时间里，你只能观察，而不允许继续喂猪。
过了 minutesToDie 分钟后，所有喝到毒药的猪都会死去，其他所有猪都会活下来。
重复这一过程，直到时间用完。
给你桶的数目 buckets ，minutesToDie 和 minutesToTest ，返回在规定时间内判断哪个桶有毒所需的 最小 猪数。

示例 1：
输入：buckets = 1000, minutesToDie = 15, minutesToTest = 60
输出：5

示例 2：
输入：buckets = 4, minutesToDie = 15, minutesToTest = 15
输出：2

示例 3：
输入：buckets = 4, minutesToDie = 15, minutesToTest = 30
输出：2

提示：

1 <= buckets <= 1000
1 <= minutesToDie <= minutesToTest <= 100

思路
这里「状态」的意思是：在可以测试的次数的范围内，一只小猪可能测试出现的状态。
states = minutesToTest / minutesToDie + 1

因此我们需要找到最小的 x，使得 states的x次方≥buckets
x≥log以states为底buckets的对数
x>=log以10为底buckets的对数/log以10为底states的对数
​
 buckets。
**/
/**
 * @param {number} buckets
 * @param {number} minutesToDie
 * @param {number} minutesToTest
 * @return {number}
 */
var poorPigs = function(buckets, minutesToDie, minutesToTest) {
	let states = parseInt(minutesToTest / minutesToDie) + 1;
    return Math.ceil(Math.log(buckets) / Math.log(states));
};
buckets = 1000, minutesToDie = 15, minutesToTest = 60
console.log('poorPigs:', poorPigs(buckets, minutesToDie, minutesToTest))

/**
459. 重复的子字符串
给定一个非空的字符串，判断它是否可以由它的一个子串重复多次构成。给定的字符串只含有小写英文字母，并且长度不超过10000。

示例 1:
输入: "abab"
输出: True
解释: 可由子字符串 "ab" 重复两次构成。

示例 2:
输入: "aba"
输出: False

示例 3:
输入: "abcabcabcabc"
输出: True

解释: 可由子字符串 "abc" 重复四次构成。 (或者子字符串 "abcabc" 重复两次构成。)
**/
/**
 * @param {string} s
 * @return {boolean}
 */
var repeatedSubstringPattern = function(s) {
	let len = s.length
	let num = 1
	while(num<=len/2) {
		if(len%num==0) {
			let bet = len/num
			let new_s = new Array(bet).fill(s.slice(0, num))
			if(new_s.join('') == s) {
				return true
			}
		}
		num++
	}
	return false
};
s = "abcabcabcabc"
s = "aba"
s = "abab"
console.log('repeatedSubstringPattern:', repeatedSubstringPattern(s))

/**
460. LFU 缓存
请你为 最不经常使用（LFU）缓存算法设计并实现数据结构。
实现 LFUCache 类：

LFUCache(int capacity) - 用数据结构的容量 capacity 初始化对象
int get(int key) - 如果键存在于缓存中，则获取键的值，否则返回 -1。
void put(int key, int value) - 如果键已存在，则变更其值；如果键不存在，请插入键值对。当缓存达到其容量时，则应该在插入新项之前，使最不经常使用的项无效。在此问题中，当存在平局（即两个或更多个键具有相同使用频率）时，应该去除 最近最久未使用 的键。
注意「项的使用次数」就是自插入该项以来对其调用 get 和 put 函数的次数之和。使用次数会在对应项被移除后置为 0 。
为了确定最不常使用的键，可以为缓存中的每个键维护一个 使用计数器 。使用计数最小的键是最久未使用的键。
当一个键首次插入到缓存中时，它的使用计数器被设置为 1 (由于 put 操作)。对缓存中的键执行 get 或 put 操作，使用计数器的值将会递增。

示例：
输入：
["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [3], [4, 4], [1], [3], [4]]
输出：
[null, null,   null,   1,    null, -1,   3,   null,   -1,  3,   4]

解释：
// cnt(x) = 键 x 的使用计数
// cache=[] 将显示最后一次使用的顺序（最左边的元素是最近的）
LFUCache lFUCache = new LFUCache(2);
lFUCache.put(1, 1);   // cache=[1,_], cnt(1)=1
lFUCache.put(2, 2);   // cache=[2,1], cnt(2)=1, cnt(1)=1
lFUCache.get(1);      // 返回 1
                      // cache=[1,2], cnt(2)=1, cnt(1)=2
lFUCache.put(3, 3);   // 去除键 2 ，因为 cnt(2)=1 ，使用计数最小
                      // cache=[3,1], cnt(3)=1, cnt(1)=2
lFUCache.get(2);      // 返回 -1（未找到）
lFUCache.get(3);      // 返回 3
                      // cache=[3,1], cnt(3)=2, cnt(1)=2
lFUCache.put(4, 4);   // 去除键 1 ，1 和 3 的 cnt 相同，但 1 最久未使用
                      // cache=[4,3], cnt(4)=1, cnt(3)=2
lFUCache.get(1);      // 返回 -1（未找到）
lFUCache.get(3);      // 返回 3
                      // cache=[3,4], cnt(4)=1, cnt(3)=3
lFUCache.get(4);      // 返回 4
                      // cache=[3,4], cnt(4)=2, cnt(3)=3
 
提示：
0 <= capacity, key, value <= 104
最多调用 105 次 get 和 put 方法

进阶：你可以为这两种操作设计时间复杂度为 O(1) 的实现吗？
**/
let DLinkedNodeLFU = function(key,value) {
	this.key = key
	this.value = value
	this.time = 0
	this.prev = null
	this.next = null
}
/**
 * @param {number} capacity
 */
var LFUCache = function(capacity) {
	//方法一：哈希表(key,value指向链表元素) + 双向链表(保存键值)
	//问题：需要解决重复time查找问题
	this.map = {}
	this.capacity = capacity
	this.size = 0
	this.head = new DLinkedNodeLFU()//由小到大
	this.tail = new DLinkedNodeLFU()
	this.head.next = this.tail
	this.tail.prev = this.head
};

/**
*增加次数
*/
LFUCache.prototype.addTime = function(node) {
	node.time++
	let prev = node.prev
	let next = node.next
	//del
	prev.next = next
	next.prev = prev
	//insert
	let find = prev
	while(next.next!=null && next.time<=node.time) {
		find  = next
		next = next.next
	}
	find.next = node
	node.prev = find

	node.next = next
	next.prev = node
}

/** 
 * @param {number} key
 * @return {number}
 */
LFUCache.prototype.get = function(key) {
	let node = this.map[key]
	if(node){
		this.addTime(node)
		return node.value
	}else {
		return -1
	}
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LFUCache.prototype.put = function(key, value) {
	let node = this.map[key]
	if(node) {
		this.addTime(node)
		node.value = value
	}else {
		if(this.size>=this.this.capacity) {
			//del
			let prev = this.head
			let next = this.head.next.next
			prev.next = next
			next.prev = prev
		}
		//insert
		node = new DLinkedNodeLFU(key, value)
		let find = this.head
		while(find!=this.tail&&find.time<=node.time){
			find++
		}
		let next = find.next
		find.next = node
		node.prev = find
		node.next = next
		next.prev = node
		node.time++
		this.size++
	}
};

/**
 * Your LFUCache object will be instantiated and called as such:
 * var obj = new LFUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

 /**
 461. 汉明距离
两个整数之间的 汉明距离 指的是这两个数字对应二进制位不同的位置的数目。

给你两个整数 x 和 y，计算并返回它们之间的汉明距离。

示例 1：
输入：x = 1, y = 4
输出：2
解释：
1   (0 0 0 1)
4   (0 1 0 0)
       ↑   ↑
上面的箭头指出了对应二进制位不同的位置。

示例 2：
输入：x = 3, y = 1
输出：1

提示：
0 <= x, y <= 231 - 1
 **/
 /**
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
var hammingDistance = function(x, y) {
	//异或
	let s = x^y
	let ret = 0
	while(s>0) {
		ret += s&1
		s>>=1
	}
	return ret
};
x = 1, y = 4
// x = 3, y = 1
console.log('hammingDistance:', hammingDistance(x, y))

/**
462. 最少移动次数使数组元素相等 II
给定一个非空整数数组，找到使所有数组元素相等所需的最小移动数，其中每次移动可将选定的一个元素加1或减1。 您可以假设数组的长度最多为10000。

例如:
输入:
[1,2,3]
输出:
2

说明：
只有两个动作是必要的（记得每一步仅可使其中一个元素加1或减1）： 

思路：
找中位数
找到一个点x，使N个点到x点的距离和最小
数学知识：x为这N个数的中位数时，可使距离最小
奇数个时唯一中位数，偶数个时两个都可以

1、排序法
时间复杂度O(n*lgn)
2、快排的思想查找
时间复杂度O(n)

[1,2,3]  =>  [2,2,3]  =>  [2,2,2]
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var minMoves2 = function(nums) {
	// 快速排序法
	let quickFind = function(l,r,k){
		if(l>=r) {
			return nums[l]
		}
		let i = l, j = r, x = nums[l]
		while(i<j) {
			//从右边找小于x的j
			while(i<j&&nums[j]>=x){
				j--
			}
			if(i<j){
				nums[i++] = nums[j]
			}
			//从左边找大于x的i
			while(i<j&&nums[i]<=x){
				i++
			}
			if(i<j){
				nums[j--] = nums[i]
			}
		}
		//x为有序
		nums[i] = x
		if(k == i){
			return x
		}else if(k>i) {
			//从右侧找
			return quickFind(i+1, r, k)
		}else {
			return quickFind(l, i-1, k)
		}
	}
	let _k = parseInt(nums.length/2)
	let value = quickFind(0, nums.length-1, _k)
	let ret = 0
	for(let i = 0; i<nums.length; i++) {
		ret+=Math.abs(nums[i]-value)
	}
	return ret
};
nums = [1,2,3] 
nums = [1]
console.log('minMoves2:', minMoves2(nums))

/**
463. 岛屿的周长
给定一个 row x col 的二维网格地图 grid ，其中：grid[i][j] = 1 表示陆地， grid[i][j] = 0 表示水域。

网格中的格子 水平和垂直 方向相连（对角线方向不相连）。整个网格被水完全包围，但其中恰好有一个岛屿（或者说，一个或多个表示陆地的格子相连组成的岛屿）。

岛屿中没有“湖”（“湖” 指水域在岛屿内部且不和岛屿周围的水相连）。格子是边长为 1 的正方形。网格为长方形，且宽度和高度均不超过 100 。计算这个岛屿的周长。
 
示例 1：

输入：grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]
输出：16
解释：它的周长是上面图片中的 16 个黄色的边

示例 2：

输入：grid = [[1]]
输出：4

示例 3：

输入：grid = [[1,0]]
输出：4
 

提示：

row == grid.length
col == grid[i].length
1 <= row, col <= 100
grid[i][j] 为 0 或 1
**/
/**
 * @param {number[][]} grid
 * @return {number}
 */
var islandPerimeter = function(grid) {
	let row = grid.length
	let col = grid[0].length
	let pos = [[0,1], [0,-1], [-1,0], [1,0]]
	let calNum = function(x,y) {
		//计算某一块的周长
		let num = 0
		for(let k = 0; k<pos.length; k++) {
			let nextX = pos[k][0]+x
			let nextY = pos[k][1]+y
			if(nextX<0 || nextX>=row || nextY<0 || nextY>=col) {
				num++
			}else if(grid[nextX][nextY] == 0) {
				num++
			}
		}
		return num
	}
	//记录访问过的
	let ret = 0
	let backTrack = function(x, y) {
		if(x<0 || x>=row || y<0 || y>=col){
			return
		}
		if(grid[x][y] == 0) {
			return
		}
		if(grid[x][y]>1) {
			//减枝
			return
		}
		let num = calNum(x, y)
		ret+=num
		grid[x][y] = 2
		for(let i = 0; i<pos.length; i++) {
			backTrack(pos[i][0]+x, pos[i][1]+y)
		}
	}
	let find = false
	for(let i = 0; i<row; i++) {
		for(let j = 0; j<col; j++) {
			if(grid[i][j] == 1) {
				backTrack(i, j)
				find = true
				break
			}
		}
		if(find) {
			break
		}
	}

	return ret
};
grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]
grid = [[1]]
grid = [[1,0]]
console.log('islandPerimeter:', islandPerimeter(grid))

/**
464. 我能赢吗
在 "100 game" 这个游戏中，两名玩家轮流选择从 1 到 10 的任意整数，累计整数和，先使得累计整数和达到或超过 100 的玩家，即为胜者。

如果我们将游戏规则改为 “玩家不能重复使用整数” 呢？

例如，两个玩家可以轮流从公共整数池中抽取从 1 到 15 的整数（不放回），直到累计整数和 >= 100。

给定一个整数 maxChoosableInteger （整数池中可选择的最大数）和另一个整数 desiredTotal（累计和），判断先出手的玩家是否能稳赢（假设两位玩家游戏时都表现最佳）？

你可以假设 maxChoosableInteger 不会大于 20， desiredTotal 不会大于 300。

示例：

输入：
maxChoosableInteger = 10
desiredTotal = 11

输出：
false

解释：
无论第一个玩家选择哪个整数，他都会失败。
第一个玩家可以选择从 1 到 10 的整数。
如果第一个玩家选择 1，那么第二个玩家只能选择从 2 到 10 的整数。
第二个玩家可以通过选择整数 10（那么累积和为 11 >= desiredTotal），从而取得胜利.
同样地，第一个玩家选择任意其他整数，第二个玩家都会赢。
**/
/**
 * @param {number} maxChoosableInteger
 * @param {number} desiredTotal
 * @return {boolean}
 */
var canIWin = function(maxChoosableInteger, desiredTotal) {
	//思路 回溯法 dp记录所有状态 比如2个数有4种状态：00、01、10、11(1、2都被选择)
	if(maxChoosableInteger>=desiredTotal) {
		//先手必赢
		return true
	}
	if(maxChoosableInteger*(maxChoosableInteger+1)/2<desiredTotal) {
		//总和<desiredTotal
		return false
	}
	let dp = []//各个状态是否出现过以及输赢
	//state 当前所有数字被选择与否的状态
	let dfs = function(max, total, state, dp) {
		if(dp[state]!=null) {
			return dp[state]
		}
		//遍历所有能选择的数
		for(let i = 1; i<=max; i++) {
			let cur = (1<<(i-1)) //当前位
			if((cur&state) != 0) {//&操作符的优先级低
				continue
			}
			//如果当前数i比剩余要达到的目标desiredTotal要大
			//如果当前先手选了i之后还不能马上赢，但是下一步后手选数字的时候选输了
			if(total<=i || !dfs(max, total-i, state|cur, dp)) {
				//先手能赢
				dp[state] = true
				return true
			}

		}
		//如果遍历完了所有的整数，当前state还没有返回过True
		dp[state] = false
		return false
	}
	return dfs(maxChoosableInteger, desiredTotal, 0, dp)
};
maxChoosableInteger = 10
desiredTotal = 11

maxChoosableInteger = 10
desiredTotal = 40

maxChoosableInteger = 6
desiredTotal = 16

console.log('canIWin:', canIWin(maxChoosableInteger, desiredTotal))


/**
467. 环绕字符串中唯一的子字符串
把字符串 s 看作是“abcdefghijklmnopqrstuvwxyz”的无限环绕字符串，所以 s 看起来是这样的："...zabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd....". 
现在我们有了另一个字符串 p 。你需要的是找出 s 中有多少个唯一的 p 的非空子串，尤其是当你的输入是字符串 p ，你需要输出字符串 s 中 p 的不同的非空子串的数目。 
注意: p 仅由小写的英文字母组成，p 的大小可能超过 10000。
 
示例 1:

输入: "a"
输出: 1
解释: 字符串 S 中只有一个"a"子字符。
 

示例 2:

输入: "cac"
输出: 2
解释: 字符串 S 中的字符串“cac”只有两个子串“a”、“c”。.
 

示例 3:

输入: "zab"
输出: 6
解释: 在字符串 S 中有六个子串“z”、“a”、“b”、“za”、“ab”、“zab”。.

思路
1，记录以每个字符结尾字串的最长长度
2，然后最终累加即可得结果
**/

/**
 * @param {string} p
 * @return {number}
 */
var findSubstringInWraproundString = function(p) {
	let n = p.length
	let a_code = 'a'.charCodeAt(0)
	let checkNext = function(i,j){
		
	}
	let count = 0
	let map = {}
	let checkSmart = function(i,j) {
		//j与j-1检查连续
		if(j>i) {
			let now = p.charCodeAt(j-1)
			let next = p.charCodeAt(j)
			if(next != now+1 && now-next != 25) {
				return false
			}
		}
		let sub = p.substring(i, j+1)
		if(!map[sub]) {
			count++
			map[sub] = true
			return true
		}
		return true
	}
	for(let i = 0; i<n; i++) {
		for(let j = i; j<n; j++){
			let res = checkSmart(i, j)
			if(!res) {
				break
			}
		}
	}
	return count
};
var findSubstringInWraproundString2 = function(p) {
	//时间复杂度O(p.length)
	let checkSmart = function(j) {
		if(j>0) {
			let now = p.charCodeAt(j-1)
			let next = p.charCodeAt(j)
			if(next == now+1 || now-next == 25) {
				return true
			}
		}
		return false
	}
	let a_code = 'a'.charCodeAt(0)
	let arr = [] //以本字母结尾的最大长度
	let k = 0
	for(let i = 0; i<p.length; i++) {
		if(i>0 && checkSmart(i)) {
			k++
		}else {
			k = 1
		}
		let idx = p.charCodeAt(i)-a_code
		arr[idx] = Math.max(arr[idx]||0, k)
	}
	let count = 0
	for(let i = 0; i<arr.length; i++) {
		count+= arr[i]||0
	}
	return count
}
p = 'zab'
// p = 'a'
// p = 'abaab'
// p = 'aabb'
// p = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"
console.log('findSubstringInWraproundString:', findSubstringInWraproundString2(p))

/**
468. 验证IP地址
编写一个函数来验证输入的字符串是否是有效的 IPv4 或 IPv6 地址。

如果是有效的 IPv4 地址，返回 "IPv4" ；
如果是有效的 IPv6 地址，返回 "IPv6" ；
如果不是上述类型的 IP 地址，返回 "Neither" 。
IPv4 地址由十进制数和点来表示，每个地址包含 4 个十进制数，其范围为 0 - 255， 用(".")分割。比如，172.16.254.1；

同时，IPv4 地址内的数不会以 0 开头。比如，地址 172.16.254.01 是不合法的。

IPv6 地址由 8 组 16 进制的数字来表示，每组表示 16 比特。这些组数字通过 (":")分割。比如,  2001:0db8:85a3:0000:0000:8a2e:0370:7334 是一个有效的地址。
而且，我们可以加入一些以 0 开头的数字，字母可以使用大写，也可以是小写。所以， 2001:db8:85a3:0:0:8A2E:0370:7334 也是一个有效的 IPv6 address地址 (即，忽略 0 开头，忽略大小写)。

然而，我们不能因为某个组的值为 0，而使用一个空的组，以至于出现 (::) 的情况。 比如， 2001:0db8:85a3::8A2E:0370:7334 是无效的 IPv6 地址。

同时，在 IPv6 地址中，多余的 0 也是不被允许的。比如， 02001:0db8:85a3:0000:0000:8a2e:0370:7334 是无效的。

示例 1：

输入：IP = "172.16.254.1"
输出："IPv4"
解释：有效的 IPv4 地址，返回 "IPv4"
示例 2：

输入：IP = "2001:0db8:85a3:0:0:8A2E:0370:7334"
输出："IPv6"
解释：有效的 IPv6 地址，返回 "IPv6"
示例 3：

输入：IP = "256.256.256.256"
输出："Neither"
解释：既不是 IPv4 地址，又不是 IPv6 地址
示例 4：

输入：IP = "2001:0db8:85a3:0:0:8A2E:0370:7334:"
输出："Neither"
示例 5：

输入：IP = "1e1.4.5.6"
输出："Neither"
 

提示：

IP 仅由英文字母，数字，字符 '.' 和 ':' 组成。
**/
/**
 * @param {string} IP
 * @return {string}
 */
var validIPAddress = function(IP) {
	let values = IP.split('.')
	if(values.length!=4) {
		values = IP.split(':')
		if(values.length!=8) {
			return 'Neither'
		}
		// check ipv6
		let map = {
			'0':true,'1':true,'2':true,'3':true,'4':true,'5':true,'6':true,'7':true,'8':true,'9':true,
			'A':true,'B':true,'C':true,'D':true,'E':true,'F':true,
			'a':true,'b':true,'c':true,'d':true,'e':true,'f':true
		}
		for(let i = 0; i<values.length; i++) {
			let value = values[i]
			if(value == '' || value.length>4) {
				return 'Neither'
			}
			for(let j = 0; j<value.length; j++) {
				if(!map[value[j]]) {
					return 'Neither'
				}
			}
		}
		return "IPv6"
	}else {
		// check ipv4
		for(let i = 0; i<values.length; i++) {
			let value = values[i]
			if(value == '' || value.length>3) {
				return 'Neither'
			}
			if(value.length>1 && value[0] == '0') {
				return 'Neither'
			}
			for(let j = 0; j<value.length; j++) {
				let code = value.charCodeAt(j)
				if(code<48 || code>57) {
					return 'Neither'
				}
			}
			if(parseInt(value)>255) {
				return 'Neither'
			}
		}
		return "IPv4"
	}
};
IP = "172.16.254.1"
IP = "2001:0db8:85a3:0:0:8A2E:0370:7334"
IP = "256.256.256.256"
IP = "2001:0db8:85a3:0:0:8A2E:0370:7334:"
IP = "1e1.4.5.6"
IP = "2001:0db8:85a3:00000:0:8A2E:0370:7334"
console.log('validIPAddress:', validIPAddress(IP))
/**
470. 用 Rand7() 实现 Rand10()
已有方法 rand7 可生成 1 到 7 范围内的均匀随机整数，试写一个方法 rand10 生成 1 到 10 范围内的均匀随机整数。

不要使用系统的 Math.random() 方法。

 

示例 1:

输入: 1
输出: [7]
示例 2:

输入: 2
输出: [8,4]
示例 3:

输入: 3
输出: [8,1,10]
 

提示:

rand7 已定义。
传入参数: n 表示 rand10 的调用次数。
 

进阶:

rand7()调用次数的 期望值 是多少 ?
你能否尽量少调用 rand7() ?

思路
(rand_X() - 1) × Y + rand_Y() ==> 可以等概率的生成[1, X * Y]范围的随机数
即实现了 rand_XY()
要实现rand10()，就需要先实现rand_N()，并且保证N大于10且是10的倍数。这样再通过rand_N() % 10 + 1 就可以得到[1,10]范围的随机数了。
**/
/**
 * The rand7() API is already defined for you.
 * var rand7 = function() {}
 * @return {number} a random integer in the range 1 to 7
 */
 var rand7 = function() {
 	return 1+Math.floor(Math.random()*7)
 }
var rand10 = function() {
    while(true) {
    	let a = rand7()
    	let b = rand7()
    	let ret = (a-1)*7+b //1-49
    	// 拒绝采样
    	if(ret<=40){
    		return ret%10+1
    	}

    	// 以下优化提高命中
    	a = ret-40 //1-9
    	b = rand7()
    	ret = (a-1)*7+b //1-63
    	if(ret<=60) {
    		return ret%10+1
    	}

    	a = ret-60 //1-3
    	b = rand7()
    	ret = (a-1)*7+b //1-21
    	if(ret<=20) {
    		return ret%10+1
    	}
    }
};
console.log('rand7:', rand7())
console.log('rand10:', rand10())

/**
472. 连接词
给定一个 不含重复 单词的字符串数组 words ，编写一个程序，返回 words 中的所有 连接词 。
连接词 的定义为：一个字符串完全是由至少两个给定数组中的单词组成的。
 

示例 1：

输入：words = ["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"]
输出：["catsdogcats","dogcatsdog","ratcatdogcat"]
解释："catsdogcats"由"cats", "dog" 和 "cats"组成; 
     "dogcatsdog"由"dog", "cats"和"dog"组成; 
     "ratcatdogcat"由"rat", "cat", "dog"和"cat"组成。
示例 2：

输入：words = ["cat","dog","catdog"]
输出：["catdog"]
 

提示：

1 <= words.length <= 104
0 <= words[i].length <= 1000
words[i] 仅由小写字母组成
0 <= sum(words[i].length) <= 105

方法字典树+dfs遍历

**/
/**
 * @param {string[]} words
 * @return {string[]}
 */
var findAllConcatenatedWordsInADict = function(words) {
	// create trie
	let trie = {}
	for(let word of words){
		if(word == '') {
			continue
		}
		let cur = trie
		for(let c of word) {
			cur[c] = cur[c] || {}
			cur = cur[c]
		}
		cur['#'] = '#'//结束标志
	}
	//dfs word要检查的单词  idx当前下标  cnt单词个数 cur剩余的字典树
	let dfs = function(word, idx, cnt, cur) {
		//end
		if(idx == word.length) {
			if(cur['#'] && cnt>=1) {
				return true
			}
			return false
		}
		//check one word
		if(cur['#']) {
			//满足一个之后从头在检查,因为组合单词都是由单个单词组成的
			if(dfs(word, idx, cnt+1, trie)) {
				return true
			}
		}
		if(!cur[word[idx]]) {
			return false
		}
		//step
		if(dfs(word, idx+1, cnt, cur[word[idx]])) {
			return true
		}
	}

	//res
	let res = []
	for(word of words) {
		if(dfs(word, 0, 0, trie)) {
			res.push(word)
		}
	}
	return res
};
words = ["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"]
words = ["cat","dog","catdog"]
words = ['', "cat"]
console.log('findAllConcatenatedWordsInADict:', findAllConcatenatedWordsInADict(words))

/**
473. 火柴拼正方形
还记得童话《卖火柴的小女孩》吗？现在，你知道小女孩有多少根火柴，请找出一种能使用所有火柴拼成一个正方形的方法。不能折断火柴，可以把火柴连接起来，并且每根火柴都要用到。

输入为小女孩拥有火柴的数目，每根火柴用其长度表示。输出即为是否能用所有的火柴拼成正方形。

示例 1:

输入: [1,1,2,2,2]
输出: true

解释: 能拼成一个边长为2的正方形，每边两根火柴。
示例 2:

输入: [3,3,3,3,4]
输出: false

解释: 不能用所有火柴拼成一个正方形。
注意:

给定的火柴长度和在 0 到 10^9之间。
火柴数组的长度不超过15。

思路
把每一根火柴放入4个箱子中的一个，最后检查4个箱子中的和是否相等
时间复杂度O（4的n次方）
**/
/**
 * @param {number[]} matchsticks
 * @return {boolean}
 */
var makesquare = function(matchsticks) {
	let num = 4
	let box = new Array(num).fill(0)
	let width = 0
	let total = 0
	for(let value of matchsticks) {
		total += value
	}
	width = parseInt(total/4)
	if(width*4 != total) {
		return false
	}
	let backTrack = function(idx){
		if(idx>=matchsticks.length) {
			for(let i = 1; i<num; i++) {
				if(box[i]!=box[0]) {
					return false
				}
			}
			return true
		}
		for(let i = 0; i<num; i++) {
			if(box[i]+matchsticks[idx]>width) {
				//剪枝
				continue
			}
			box[i]+=matchsticks[idx]
			if(backTrack(idx+1)) {
				return true
			}
			box[i]-=matchsticks[idx]
		}
		return false
	}
	return backTrack(0)
};

matchsticks = [1,1,2,2,2]
matchsticks = [9,9,2,1,7,2,4,2,5,6,9,1,5,2,1]
console.log('makesquare:', makesquare(matchsticks))

/**
474. 一和零
给你一个二进制字符串数组 strs 和两个整数 m 和 n 。

请你找出并返回 strs 的最大子集的长度，该子集中 最多 有 m 个 0 和 n 个 1 。

如果 x 的所有元素也是 y 的元素，集合 x 是集合 y 的 子集 。

 

示例 1：

输入：strs = ["10", "0001", "111001", "1", "0"], m = 5, n = 3
输出：4
解释：最多有 5 个 0 和 3 个 1 的最大子集是 {"10","0001","1","0"} ，因此答案是 4 。
其他满足题意但较小的子集包括 {"0001","1"} 和 {"10","1","0"} 。{"111001"} 不满足题意，因为它含 4 个 1 ，大于 n 的值 3 。
示例 2：

输入：strs = ["10", "0", "1"], m = 1, n = 1
输出：2
解释：最大的子集是 {"0", "1"} ，所以答案是 2 。
 

提示：

1 <= strs.length <= 600
1 <= strs[i].length <= 100
strs[i] 仅由 '0' 和 '1' 组成
1 <= m, n <= 100

**/

/**
 * @param {string[]} strs
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var findMaxForm = function(strs, m, n) {
	//时间复杂度2的n次方
	let get0_1 = function(str) {
		let ret = [0, 0]
		for(let c of str) {
			if(c == '0') {
				ret[0]+=1
			}else {
				ret[1]+=1
			}
		}
		return ret
	}
	let maxNum = 0
	let nowNum = 0
	let m_num = 0
	let n_num = 0
	let backTrack = function(idx) {
		if(idx>=strs.length) {
			maxNum = Math.max(maxNum, nowNum)
			return
		}
		//select
		let nums = get0_1(strs[idx])
		if(m_num+nums[0]<=m && n_num+nums[1]<=n) {
			m_num+=nums[0]
			n_num+=nums[1]
			nowNum+=1
			backTrack(idx+1)
			m_num-=nums[0]
			n_num-=nums[1]
			nowNum-=1
		}
		// no select
		backTrack(idx+1)
	}
	backTrack(0)
	return maxNum
};
/**
方法二
动态规划方程
dp[i][j][k] 表示输入字符串在子区间 [0, i] 能够使用 j 个 0 和 k 个 1 的字符串的最大数量。
**/
var findMaxForm2 = function(strs, m, n) {
	//时间复杂度O(i*j*k)
	let get0_1 = function(str) {
		let ret = [0, 0]
		for(let c of str) {
			if(c == '0') {
				ret[0]+=1
			}else {
				ret[1]+=1
			}
		}
		return ret
	}
	let len = strs.length
	let dp = []
	dp[0] = []
	for(let j = 0; j<=m; j++) {
		dp[0][j] = []
	}
	for(let i = 1; i<=len; i++) {
		dp[i] = []
		let counts = get0_1(strs[i-1])
		for(let j = 0; j<=m; j++) {
			dp[i][j] = []
			for(let k = 0; k<=n; k++){
				//状态转移方程1 不选择的情况
				dp[i][j][k] = dp[i-1][j][k] || 0

				//选择当前串的情况
				if(counts[0]<=j && counts[1]<=k) {
					dp[i][j][k] = Math.max(dp[i-1][j][k] || 0, (dp[i-1][j-counts[0]][k-counts[1]]||0)+1)
				}
			}	
		}
	}
	return dp[len][m][n]
}
strs = ["10", "0001", "111001", "1", "0"], m = 5, n = 3
strs = ["10", "0", "1"], m = 1, n = 1
strs = ["11","11","0","0","10","1","1","0","11","1","0","111","11111000","0","11","000","1","1","0","00","1","101","001","000","0","00","0011","0","10000"]
m = 90
n = 66
console.log('findMaxForm:', findMaxForm2(strs, m, n))

/**
475. 供暖器
冬季已经来临。 你的任务是设计一个有固定加热半径的供暖器向所有房屋供暖。

在加热器的加热半径范围内的每个房屋都可以获得供暖。

现在，给出位于一条水平线上的房屋 houses 和供暖器 heaters 的位置，请你找出并返回可以覆盖所有房屋的最小加热半径。

说明：所有供暖器都遵循你的半径标准，加热的半径也一样。

 

示例 1:

输入: houses = [1,2,3], heaters = [2]
输出: 1
解释: 仅在位置2上有一个供暖器。如果我们将加热半径设为1，那么所有房屋就都能得到供暖。
示例 2:

输入: houses = [1,2,3,4], heaters = [1,4]
输出: 1
解释: 在位置1, 4上有两个供暖器。我们需要将加热半径设为1，这样所有房屋就都能得到供暖。
示例 3：

输入：houses = [1,5], heaters = [2]
输出：3
 

提示：

1 <= houses.length, heaters.length <= 3 * 104
1 <= houses[i], heaters[i] <= 109

找到每个房屋离加热器的最短距离（即找出离房屋最近的加热器）。

**/
/**
 * @param {number[]} houses
 * @param {number[]} heaters
 * @return {number}
 */
var findRadius = function(houses, heaters) {
	//查找heater在houses中的位置
	heaters.sort(function(a, b) {
		return a-b
	})
	let len = heaters.length
	let ret = []
	let binarySearch = function(value) {
		//查找距离房子最近的加热器
		let left = 0,right = len-1
		while(left<right) {
			let mid = parseInt((left+right)/2)
			if(value==heaters[mid]) {
				left = right = mid
			}else if(value>heaters[mid]){
				left = mid+1
			}else {
				right = mid-1
			}
		}
		if(value == heaters[left]) {
			ret.push(0)
		}else if(value>heaters[left]) {
			let r = value-heaters[left]
			if(left+1<len) {
				r = Math.min(r, heaters[left+1]-value)
			}
			ret.push(r)
		}else {
			let r = heaters[left]-value
			if(left-1>=0) {
				r = Math.min(r, value-heaters[left-1])
			}
			ret.push(r)
		}
	}
	for(let value of houses) {
		binarySearch(value)
	}
	let max = 0
	console.log(heaters, ret)
	for(let value of ret) {
		max = Math.max(max, value)
	}
	return max
};
houses = [1,2,3], heaters = [2]
// houses = [1,2,3,4], heaters = [1,4]
// houses = [1,5], heaters = [2]
// houses = [1,5], heaters = [10]
houses = [282475249,622650073,984943658,144108930,470211272,101027544,457850878,458777923]
heaters = [823564440,115438165,784484492,74243042,114807987,137522503,441282327,16531729,823378840,143542612]
//161834419
console.log('findRadius:', findRadius(houses, heaters))
/**
476. 数字的补数
给你一个 正 整数 num ，输出它的补数。补数是对该数的二进制表示取反。

 

示例 1：

输入：num = 5
输出：2
解释：5 的二进制表示为 101（没有前导零位），其补数为 010。所以你需要输出 2 。
示例 2：

输入：num = 1
输出：0
解释：1 的二进制表示为 1（没有前导零位），其补数为 0。所以你需要输出 0 。
 

提示：

给定的整数 num 保证在 32 位带符号整数的范围内。
num >= 1
你可以假定二进制数不包含前导零位。
本题与 1009 https://leetcode-cn.com/problems/complement-of-base-10-integer/ 相同

5的二进制是：0101，7的二进制是： 0111，它们的抑或为：0010，去掉前导零位即为取反。
**/
/**
 * @param {number} num
 * @return {number}
 */
var findComplement = function(num) {
	let temp = 1
	while(temp<num) {
		temp<<=1
		temp = temp+1
	}
	return (temp^num)
};
num = 5
console.log('findComplement:', findComplement(num))

/**
477. 汉明距离总和
两个整数的 汉明距离 指的是这两个数字的二进制数对应位不同的数量。

给你一个整数数组 nums，请你计算并返回 nums 中任意两个数之间汉明距离的总和。

 

示例 1：

输入：nums = [4,14,2]
输出：6
解释：在二进制表示中，4 表示为 0100 ，14 表示为 1110 ，2表示为 0010 。（这样表示是为了体现后四位之间关系）
所以答案为：
HammingDistance(4, 14) + HammingDistance(4, 2) + HammingDistance(14, 2) = 2 + 2 + 2 = 6
示例 2：

输入：nums = [4,14,4]
输出：4
 

提示：

1 <= nums.length <= 105
0 <= nums[i] <= 109
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var totalHammingDistance = function(nums) {
	//暴力法
	let getDistance = function(a, b){
		//两数之间的汉明距离
		let dis = 0
		while(a>0 || b>0) {
			dis += ((a&1)^(b&1))
			a = (a>>1)
			b = (b>>1)
		}
		return dis
	}
	let count = 0
	for(let i = 0; i<nums.length; i++) {
		for(let j = i+1; j<nums.length; j++) {
			count += getDistance(nums[i], nums[j])
		}
	}
	return count
};
var totalHammingDistance2 = function(nums) {
	//时间复杂度O(N*L) L为30
	let len = nums.length
	let count = 0
	for(let i = 0; i<30; i++) {
		let one = 0//某一位上1的个数
		for(let j = 0; j<nums.length; j++) {
			one+=((nums[j]>>i)&1)
		}
		//某一位上汉明距离
		count += one*(len-one)
	}
	return count
}
nums = [4,14,2]
console.log('totalHammingDistance:', totalHammingDistance2(nums))

/**
478. 在圆内随机生成点
给定圆的半径和圆心的 x、y 坐标，写一个在圆中产生均匀随机点的函数 randPoint 。

说明:

输入值和输出值都将是浮点数。
圆的半径和圆心的 x、y 坐标将作为参数传递给类的构造函数。
圆周上的点也认为是在圆中。
randPoint 返回一个包含随机点的x坐标和y坐标的大小为2的数组。
示例 1：

输入: 
["Solution","randPoint","randPoint","randPoint"]
[[1,0,0],[],[],[]]
输出: [null,[-0.72939,-0.65505],[-0.78502,-0.28626],[-0.83119,-0.19803]]
示例 2：

输入: 
["Solution","randPoint","randPoint","randPoint"]
[[10,5,-7.5],[],[],[]]
输出: [null,[11.52438,-8.33273],[2.46992,-16.21705],[11.13430,-12.42337]]
输入语法说明：

输入是两个列表：调用成员函数名和调用的参数。Solution 的构造函数有三个参数，圆的半径、圆心的 x 坐标、圆心的 y 坐标。randPoint 没有参数。输入参数是一个列表，即使参数为空，也会输入一个 [] 空列表。
**/
/**
 * @param {number} radius
 * @param {number} x_center
 * @param {number} y_center
 */
var Solution = function(radius, x_center, y_center) {
	this.radius = radius
	this.x_center = x_center
	this.y_center = y_center
};

/**
 * @return {number[]}
 */
Solution.prototype.randPoint2 = function() {
	// x>=-radius+x_center x<=radius+x_center
	let x = Math.random()*(2*this.radius)+(-this.radius+this.x_center)
	//(x-x_center)²+(y-y_center)² = radius²
	let temp = Math.pow(this.radius, 2)-Math.pow(x-this.x_center, 2)
	temp = Math.sqrt(temp)
	let y1 = temp+this.y_center
	let y2 = -temp+this.y_center
	//let y1>y2
	if(y1<y2){
		temp = y1
		y1 = y2
		y2 = temp
	}
	let y = Math.random()*(y1-y2)+y2
	return [x, y]
};
Solution.prototype.randPoint = function() {
	//拒绝采样，把圆看做正方形采样，不再圆内则重新采样  [0,radius*2)范围内的随机数
	let x0 = this.x_center - this.radius
	let y0 = this.y_center - this.radius
	while(true) {
		let x = x0+Math.random()*2*this.radius
		let y = y0+Math.random()*2*this.radius
		if(Math.sqrt(Math.pow(x-this.x_center, 2)+Math.pow(y-this.y_center, 2))<=this.radius) {
			return [x, y]
		}
	}
}

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(radius, x_center, y_center)
 * var param_1 = obj.randPoint()
 */
 radius = 1, x_center = 0, y_center = 0
 // radius = 0.01, x_center = -73839.1, y_center = -3289891.3
 obj = new Solution(radius, x_center, y_center)
 console.log('randPoint:', obj.randPoint())

 /**
 479. 最大回文数乘积
你需要找到由两个 n 位数的乘积组成的最大回文数。

由于结果会很大，你只需返回最大回文数 mod 1337得到的结果。

示例:

输入: 2

输出: 987

解释: 99 x 91 = 9009, 9009 % 1337 = 987

说明:

n 的取值范围为 [1,8]。

思路，从大到小构造一个回文数，判断这个回文数是否由给定的数相乘得到
 **/
 /**
 * @param {number} n
 * @return {number}
 */
var largestPalindrome = function(n) {
	if(n == 1) return 9;
	let palindrome = function(value){
		let ret = value
		while(value>0) {
			ret = ret*10+value%10
			value = parseInt(value/10)
		}
		return ret
	}
	let max = Math.pow(10, n)-1 // 2->99
	//max-1的目的是max*max得到的一定不是回文数
	// i>max/10 满足n位数
	for(let i = max-1; i>max/10; i--){
		//构造回文数
		let value = palindrome(i)
		// 判断这个回文数是否由给定的数相乘得到
		for(let j = max; j*j>=value; j--) {
			if(value%j == 0) {
				console.log(value, i, Number.MAX_VALUE)
				return value%1337
			}
		}
	}
	return -1
	
};
console.log('largestPalindrome:', largestPalindrome(8))

/**
480. 滑动窗口中位数
中位数是有序序列最中间的那个数。如果序列的长度是偶数，则没有最中间的数；此时中位数是最中间的两个数的平均数。

例如：

[2,3,4]，中位数是 3
[2,3]，中位数是 (2 + 3) / 2 = 2.5
给你一个数组 nums，有一个长度为 k 的窗口从最左端滑动到最右端。窗口中有 k 个数，每次窗口向右移动 1 位。你的任务是找出每次窗口移动后得到的新窗口中元素的中位数，并输出由它们组成的数组。
中位数是有序序列最中间的那个数
示例：

给出 nums = [1,3,-1,-3,5,3,6,7]，以及 k = 3。

窗口位置                      中位数
---------------               -----
[1  3  -1] -3  5  3  6  7       1
 1 [3  -1  -3] 5  3  6  7      -1
 1  3 [-1  -3  5] 3  6  7      -1
 1  3  -1 [-3  5  3] 6  7       3
 1  3  -1  -3 [5  3  6] 7       5
 1  3  -1  -3  5 [3  6  7]      6
 因此，返回该滑动窗口的中位数数组 [1,-1,-1,3,5,6]。

提示：

你可以假设 k 始终有效，即：k 始终小于等于输入的非空数组的元素个数。
与真实值误差在 10 ^ -5 以内的答案将被视作正确答案。

堆的位置关系
(01) 索引为i的左孩子的索引是 (2*i+1);
(02) 索引为i的右孩子的索引是 (2*i+2);
(03) 索引为i的父结点的索引是 floor((i-1)/2);
**/
class Heap {
	//最小堆
	constructor(array){
		//构造堆，时间复杂度O(n)
		this.array = array || []
		for(let i = 0; i<this.array.length; i++) {
			this.shiftUpHeap(i)
		}
	}
	swap(i,j){
		let temp = this.array[i]
		this.array[i] = this.array[j]
		this.array[j] = temp
	}
	insertHeap(a) {
		//插入堆 时间复杂度O（1）
		this.array.push(a)
		let insertPos = this.array.length-1
		this.shiftUpHeap(insertPos)
	}
	deleteHeap(a) {
		//删除 时间复杂度O(log(n))
		let deletePos = -1
		for(let i = 0; i<this.array.length; i++) {
			if(this.array[i] == a) {
				deletePos = i
				break
			}
		}
		if(deletePos<0) {
			return
		}
		this.swap(deletePos, this.array.length-1)
		this.array.pop()//删掉最后一个
		//判断向上还是向下
		let parentPos = parseInt((deletePos-1)/2)
		let left = deletePos*2+1, right = deletePos*2+2
		let len = this.array.length
		if(deletePos == 0) {
			this.shiftDownHeap(deletePos)
		}else if(left>=len) {
			this.shiftUpHeap(deletePos)
		}else {
			//中间
			if(this.array[parentPos]>this.array[deletePos]) {
				this.shiftUpHeap(deletePos)
			}else if(this.array[left]<this.array[deletePos] || (right<len&&this.array[right]<this.array[deletePos])) {
				this.shiftDownHeap(deletePos)
			}
		}
	}
	shiftDownHeap(i) {
		//向下比较
		let left = i*2+1, right = i*2+2
		let minPos = i// 节点中较小的
		let len = this.array.length
		while(i<len) {
			if(left<len && this.array[left]<this.array[minPos]) {
				minPos = left
			}
			if(right<len && this.array[right]<this.array[minPos]){
				minPos = right
			}
			if(minPos != i) {
				this.swap(i, minPos)
				i = minPos
				left = i*2+1
				right = i*2+2
			}else {
				break
			}
		}
	}
	shiftUpHeap(i) {
		let parentPos = parseInt((i-1)/2)
		while(parentPos>=0&&this.array[parentPos]>this.array[i]) {
			this.swap(i, parentPos)
			i = parentPos
			parentPos = parseInt((i-1)/2)
		}
	}
	peak() {
		return this.array[0]
	}
	length() {
		return this.array.length
	}
}
class BigHeap {
	//最大堆
	constructor(array){
		//构造堆，时间复杂度O(n)
		this.array = array || []
		for(let i = 0; i<this.array.length; i++) {
			this.shiftUpHeap(i)
		}
	}
	swap(i,j){
		let temp = this.array[i]
		this.array[i] = this.array[j]
		this.array[j] = temp
	}
	insertHeap(a) {
		//插入堆 时间复杂度O（1）
		this.array.push(a)
		let insertPos = this.array.length-1
		this.shiftUpHeap(insertPos)
	}
	deleteHeap(a) {
		//删除 时间复杂度O(log(n))
		let deletePos = -1
		for(let i = 0; i<this.array.length; i++) {
			if(this.array[i] == a) {
				deletePos = i
				break
			}
		}
		if(deletePos<0) {
			return
		}
		this.swap(deletePos, this.array.length-1)
		this.array.pop()//删掉最后一个
		//判断向上还是向下
		let parentPos = parseInt((deletePos-1)/2)
		let left = deletePos*2+1, right = deletePos*2+2
		let len = this.array.length
		if(deletePos == 0) {
			this.shiftDownHeap(deletePos)
		}else if(left>=len) {
			this.shiftUpHeap(deletePos)
		}else {
			//中间
			if(this.array[parentPos]<this.array[deletePos]) {
				this.shiftUpHeap(deletePos)
			}else if(this.array[left]>this.array[deletePos] || (right<len&&this.array[right]>this.array[deletePos])) {
				this.shiftDownHeap(deletePos)
			}
		}
	}
	shiftDownHeap(i) {
		//向下比较
		let left = i*2+1, right = i*2+2
		let maxPos = i// 节点中较大的
		let len = this.array.length
		while(i<len) {
			if(left<len && this.array[left]>this.array[maxPos]) {
				maxPos = left
			}
			if(right<len && this.array[right]>this.array[maxPos]){
				maxPos = right
			}
			if(maxPos != i) {
				this.swap(i, maxPos)
				i = maxPos
				left = i*2+1
				right = i*2+2
			}else {
				break
			}
		}
	}
	shiftUpHeap(i) {
		let parentPos = parseInt((i-1)/2)
		while(parentPos>=0&&this.array[parentPos]<this.array[i]) {
			this.swap(i, parentPos)
			i = parentPos
			parentPos = parseInt((i-1)/2)
		}
	}
	peak() {
		return this.array[0]
	}
	length() {
		return this.array.length
	}
}
class DualHeap {
	constructor(k) {
		this.small = new BigHeap() //大堆盛放较小的那部分
		this.large = new Heap() //小堆盛放较大的部分
		this.k = k
	}
	insert(value) {
		//如果num≤top，我们就将其加入small 中；
		//如果num>top，我们就将其加入large 中。
		if(this.small.length()<=0 || value<=this.small.peak()) {
			this.small.insertHeap(value)
		}else {
			this.large.insertHeap(value)
		}
		this.makeBalance()
	}
	earse(value) {
		//删除
		let v1 = this.small.peak()
		let v2 = this.large.peak()
		if(value<=v1) {
			this.small.deleteHeap(value)
		}else{
			this.large.deleteHeap(value)
		}
		this.makeBalance()
	}
	getMedian() {
		if(this.k%2 == 0) {
			let v1 = this.small.peak()
			let v2 = this.large.peak()
			return (v1+v2)/2
		}else {
			return this.small.peak()
		}
	}
	makeBalance() {
		//调整small，large，使两个堆满足要求
		let len1 = this.small.length()
		let len2 = this.large.length()
		if(len1>len2+1) {
			//small 比 large 大2
			let value = this.small.peak()
			this.small.deleteHeap(value)
			this.large.insertHeap(value)
		}else if(len1<len2) {
			let value = this.large.peak()
			this.large.deleteHeap(value)
			this.small.insertHeap(value)
		}
	}
}
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var medianSlidingWindow = function(nums, k) {
	let ret = []
	let heap = new DualHeap(k)
	for(let i = 0; i<k; i++) {
		heap.insert(nums[i])
	}
	ret.push(heap.getMedian())
	//console.log(heap.small.array, heap.large.array)
	for(let i = k; i<nums.length; i++) {
		heap.insert(nums[i])
		heap.earse(nums[i-k])
		ret.push(heap.getMedian())
	}
	return ret
};
nums = [1,3,-1,-3,5,3,6,7],k = 3
nums = [1,2,3,4,2,3,1,4,2],k = 3
nums = [5,2,2,7,3,7,9,0,2,3],k = 9
// [1,-1,-1,3,5,6]
console.log('medianSlidingWindow:', medianSlidingWindow(nums, k))

/**
481. 神奇字符串
神奇字符串 s 仅由 '1' 和 '2' 组成，并需要遵守下面的规则：

神奇字符串 s 的神奇之处在于，串联字符串中 '1' 和 '2' 的连续出现次数可以生成该字符串。
s 的前几个元素是 s = "1221121221221121122……" 。如果将 s 中连续的若干 1 和 2 进行分组，可以得到 "1 22 11 2 1 22 1 22 11 2 11 22 ......" 。每组中 1 或者 2 的出现次数分别是 "1 2 2 1 1 2 1 2 2 1 2 2 ......" 。上面的出现次数正是 s 自身。
给你一个整数 n ，返回在神奇字符串 s 的前 n 个数字中 1 的数目。

示例 1：

输入：n = 6
输出：3
解释：神奇字符串 s 的前 6 个元素是 “122112”，它包含三个 1，因此返回 3 。 
示例 2：

输入：n = 1
输出：1
 

提示：

1 <= n <= 105
通过次数5,742提交次数10,6

str的构造：
index = 0，str = “”，尾部添加一个'1'，str更新为“1”
index = 1，str = “1”，尾部添加str[index] - '0' = 2个 ‘2’，str 更新为 “122”，
index = 2，str = “122”，尾部添加str[index] - '0' = 2个 ‘1’，str 更新为 “122 11”，
index = 3，str = “12211”，尾部添加str[index] - '0' = 1个 ‘2’，str更新为“12211 2”
index = 4，str = “122112”，尾部添加str[index] - '0' = 1个 ‘1’，str更新 “122112 1”，
index = 5，str = “1221121”，尾部添加str[index] - '0' = 2个 ‘2’，str更新为“1221121 22”
index = 6，str = “122112122”，尾部添加str[index] - '0' = 1个‘1’，str 更新 “122112122 1”，
index = 7，str = “1221121221”，尾部添加str[index] - '0' = 2个‘2’，str更新为“1221121221 22”
**/
/**
 * @param {number} n
 * @return {number}
 */
var magicalString = function(n) {
	let arr = ['1','2','2']
	let idx = 2
	let last = 2
	let num = 0
	let num_1 = 1
	while(arr.length<n) {
		last = (2-last)+1
		num = parseInt(arr[idx])
		for(let i = 0; i<num; i++) {
			arr.push(last.toString())
			if(arr.length<=n && last == 1) {
				num_1++
			}
		}
		idx++
	}
	return num_1
};
console.log('magicalString:', magicalString(4))

/**
482. 密钥格式化
有一个密钥字符串 S ，只包含字母，数字以及 '-'（破折号）。其中， N 个 '-' 将字符串分成了 N+1 组。

给你一个数字 K，请你重新格式化字符串，使每个分组恰好包含 K 个字符。特别地，第一个分组包含的字符个数必须小于等于 K，但至少要包含 1 个字符。两个分组之间需要用 '-'（破折号）隔开，并且将所有的小写字母转换为大写字母。

给定非空字符串 S 和数字 K，按照上面描述的规则进行格式化。

 

示例 1：

输入：S = "5F3Z-2e-9-w", K = 4
输出："5F3Z-2E9W"
解释：字符串 S 被分成了两个部分，每部分 4 个字符；
     注意，两个额外的破折号需要删掉。
示例 2：

输入：S = "2-5g-3-J", K = 2
输出："2-5G-3J"
解释：字符串 S 被分成了 3 个部分，按照前面的规则描述，第一部分的字符可以少于给定的数量，其余部分皆为 2 个字符。
 

提示:

S 的长度可能很长，请按需分配大小。K 为正整数。
S 只包含字母数字（a-z，A-Z，0-9）以及破折号'-'
S 非空

**/
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var licenseKeyFormatting = function(s, k) {
	let len = s.length
	let end = len-1
	let num = 0
	let ret = []
	for(let i = len-1; i>=0; i--) {
		let c = s[i]
		if(c == '-'){
			if(s[end] != '-') {
				ret.unshift(s.substring(i+1, end+1).toUpperCase())
				end = i-1
			}
		}else {
			if(s[end] == '-'){
				end = i
			}
			num++
			if(num>=k) {
				ret.unshift(s.substring(i, end+1).toUpperCase())
				ret.unshift('-')

				num = 0
				end = i-1
			}
		}

	}
	if(end>=0 && s[end]!='-') {
		ret.unshift(s.substring(0, end+1).toUpperCase())
	}
	if(ret.length>0&&ret[0]=='-'){
		ret[0] = ''
	}
	return ret.join('')
};
s = "2-5g-3-J", k = 2
s = "5F3Z-2e-9-w", k = 4
s = "2-4A0r7-4k", k = 3
console.log('licenseKeyFormatting:', licenseKeyFormatting(s,k))
/**
483. 最小好进制
对于给定的整数 n, 如果n的k（k>=2）进制数的所有数位全为1，则称 k（k>=2）是 n 的一个好进制。

以字符串的形式给出 n, 以字符串的形式返回 n 的最小好进制。

 

示例 1：

输入："13"
输出："3"
解释：13 的 3 进制是 111。
示例 2：

输入："4681"
输出："8"
解释：4681 的 8 进制是 11111。
示例 3：

输入："1000000000000000000"
输出："999999999999999999"
解释：1000000000000000000 的 999999999999999999 进制是 11。
 

提示：

n的取值范围是 [3, 10^18]。
输入总是有效且没有前导 0。

**/
/**
 * @param {string} n
 * @return {string}
 */
var smallestGoodBase1 = function(n) {
	let checkGoodBase = function(value) {
		let max = value
		for(let i = 2; i<max; i++) {
			let check = max-1
			while(check>=0) {
				if(check == 0) {
					return true
				}
				if(check%i!=0) {
					break
				}
				check = check/i-1
			}
		}
		return false
	}
	return checkGoodBase(n)
};
var smallestGoodBase = function(n) {
	const nVal = parseInt(n);
    const mMax = Math.floor(Math.log(nVal) / Math.log(2));
    for (let m = mMax; m > 1; m--) {
        const k = BigInt(Math.floor(Math.pow(nVal, 1.0 / m)));
        if (k > 1) {
            let mul = BigInt(1), sum = BigInt(1);
            for (let i = 1; i <= m; i++) {
                mul *= k;
                sum += mul;
            }
            if (sum === BigInt(n)) {
                return k + '';
            }
        }
    }
    return (BigInt(n) - BigInt(1)) + '';
}
n = 4681
console.log('smallestGoodBase:', (smallestGoodBase(n)))

/**
485. 最大连续 1 的个数
给定一个二进制数组， 计算其中最大连续 1 的个数。

示例：

输入：[1,1,0,1,1,1]
输出：3
解释：开头的两位和最后的三位都是连续 1 ，所以最大连续 1 的个数是 3.
 

提示：
输入的数组只包含 0 和 1 。
输入数组的长度是正整数，且不超过 10,000。
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxConsecutiveOnes = function(nums) {
	let maxLen = 0
	let count = 0
	for(let num of nums){
		if(num == 1) {
			count++
		}else {
			maxLen = Math.max(maxLen, count)
			count = 0
		}
	}
	maxLen = Math.max(maxLen, count)
	return maxLen
};
nums = [1,1,0,1,1,1]
console.log('findMaxConsecutiveOnes:', findMaxConsecutiveOnes(nums))

/**
486. 预测赢家
给你一个整数数组 nums 。玩家 1 和玩家 2 基于这个数组设计了一个游戏。
玩家 1 和玩家 2 轮流进行自己的回合，玩家 1 先手。开始时，两个玩家的初始分值都是 0 。每一回合，玩家从数组的任意一端取一个数字（即，nums[0] 或 nums[nums.length - 1]），
取到的数字将会从数组中移除（数组长度减 1 ）。玩家选中的数字将会加到他的得分上。当数组中没有剩余数字可取时，游戏结束。
如果玩家 1 能成为赢家，返回 true 。如果两个玩家得分相等，同样认为玩家 1 是游戏的赢家，也返回 true 。你可以假设每个玩家的玩法都会使他的分数最大化。

示例 1：
输入：nums = [1,5,2]
输出：false
解释：一开始，玩家 1 可以从 1 和 2 中进行选择。
如果他选择 2（或者 1 ），那么玩家 2 可以从 1（或者 2 ）和 5 中进行选择。如果玩家 2 选择了 5 ，那么玩家 1 则只剩下 1（或者 2 ）可选。 
所以，玩家 1 的最终分数为 1 + 2 = 3，而玩家 2 为 5 。
因此，玩家 1 永远不会成为赢家，返回 false 。

示例 2：
输入：nums = [1,5,233,7]
输出：true
解释：玩家 1 一开始选择 1 。然后玩家 2 必须从 5 和 7 中进行选择。无论玩家 2 选择了哪个，玩家 1 都可以选择 233 。
最终，玩家 1（234 分）比玩家 2（12 分）获得更多的分数，所以返回 true，表示玩家 1 可以成为赢家。
 

提示：

1 <= nums.length <= 20
0 <= nums[i] <= 107
**/
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var PredictTheWinner = function(nums) { 
	// 递归
	let backTrack = function(start, end, turn) {
		if(start == end) {
			return nums[start]*turn
		}
		//当数组中剩下的数字多于 1 个时，当前玩家会选择最优的方案，使得自己的分数最大化
		let first = nums[start]*turn + backTrack(start+1, end, -turn)
		let last = nums[end]*turn + backTrack(start, end-1, -turn)
		if(turn == 1) {
			return Math.max(first, last)
		}else {
			return Math.min(first, last)
		}
	}
	return backTrack(0, nums.length-1, 1)>=0
};
nums = [1,5,2]
nums = [1,5,233,7]
console.log('PredictTheWinner：', PredictTheWinner(nums))

/**
488. 祖玛游戏(困难)
你正在参与祖玛游戏的一个变种。

在这个祖玛游戏变体中，桌面上有 一排 彩球，每个球的颜色可能是：红色 'R'、黄色 'Y'、蓝色 'B'、绿色 'G' 或白色 'W' 。你的手中也有一些彩球。

你的目标是 清空 桌面上所有的球。每一回合：

从你手上的彩球中选出 任意一颗 ，然后将其插入桌面上那一排球中：两球之间或这一排球的任一端。
接着，如果有出现 三个或者三个以上 且 颜色相同 的球相连的话，就把它们移除掉。
如果这种移除操作同样导致出现三个或者三个以上且颜色相同的球相连，则可以继续移除这些球，直到不再满足移除条件。
如果桌面上所有球都被移除，则认为你赢得本场游戏。
重复这个过程，直到你赢了游戏或者手中没有更多的球。
给你一个字符串 board ，表示桌面上最开始的那排球。另给你一个字符串 hand ，表示手里的彩球。请你按上述操作步骤移除掉桌上所有球，计算并返回所需的 最少 球数。如果不能移除桌上所有的球，返回 -1 。


示例 1：

输入：board = "WRRBBW", hand = "RB"
输出：-1
解释：无法移除桌面上的所有球。可以得到的最好局面是：
- 插入一个 'R' ，使桌面变为 WRRRBBW 。WRRRBBW -> WBBW
- 插入一个 'B' ，使桌面变为 WBBBW 。WBBBW -> WW
桌面上还剩着球，没有其他球可以插入。
示例 2：

输入：board = "WWRRBBWW", hand = "WRBRW"
输出：2
解释：要想清空桌面上的球，可以按下述步骤：
- 插入一个 'R' ，使桌面变为 WWRRRBBWW 。WWRRRBBWW -> WWBBWW
- 插入一个 'B' ，使桌面变为 WWBBBWW 。WWBBBWW -> WWWW -> empty
只需从手中出 2 个球就可以清空桌面。
示例 3：

输入：board = "G", hand = "GGGGG"
输出：2
解释：要想清空桌面上的球，可以按下述步骤：
- 插入一个 'G' ，使桌面变为 GG 。
- 插入一个 'G' ，使桌面变为 GGG 。GGG -> empty
只需从手中出 2 个球就可以清空桌面。
示例 4：

输入：board = "RBYYBBRRB", hand = "YRBGB"
输出：3
解释：要想清空桌面上的球，可以按下述步骤：
- 插入一个 'Y' ，使桌面变为 RBYYYBBRRB 。RBYYYBBRRB -> RBBBRRB -> RRRB -> B
- 插入一个 'B' ，使桌面变为 BB 。
- 插入一个 'B' ，使桌面变为 BBB 。BBB -> empty
只需从手中出 3 个球就可以清空桌面。
 

提示：

1 <= board.length <= 16
1 <= hand.length <= 5
board 和 hand 由字符 'R'、'Y'、'B'、'G' 和 'W' 组成
桌面上一开始的球中，不会有三个及三个以上颜色相同且连着的球
**/
/**
 * @param {string} board
 * @param {string} hand
 * @return {number}
 */
var findMinStep = function(board, hand) {

};

/**
491. 递增子序列
给你一个整数数组 nums ，找出并返回所有该数组中不同的递增子序列，递增子序列中 至少有两个元素 。你可以按 任意顺序 返回答案。

数组中可能含有重复元素，如出现两个整数相等，也可以视作递增序列的一种特殊情况。

 

示例 1：

输入：nums = [4,6,7,7]
输出：[[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]
示例 2：

输入：nums = [4,4,3,2,1]
输出：[[4,4]]
 

提示：

1 <= nums.length <= 15
-100 <= nums[i] <= 100
**/

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var findSubsequences = function(nums) {
	//回溯法，每个数有两种状态，选或不选
	let temp = []
	let ret = []
	let keyMap = {}
	function backTrack(idx) {
		if(idx>=nums.length) {
			return
		}
		//不选
		backTrack(idx+1)
		//选择
		if(temp.length<=0 || nums[idx]>=temp[temp.length-1]) {
			temp.push(nums[idx])
			//check
			if(temp.length>=2) {
				let _temp = []
				for(let i = 0; i<temp.length; i++) {
					_temp.push(temp[i])
				}
				let key = _temp.join('_')
				if(!keyMap[key]) {
					keyMap[key] = true
					ret.push(_temp)
				}
			}

			backTrack(idx+1)
			temp.pop()
		}
	}
	backTrack(0)
	return ret
};
nums = [4,6,7,7]
nums = [4,4,3,2,1]
console.log('findSubsequences:', findSubsequences(nums))

/**
492. 构造矩形
作为一位web开发者， 懂得怎样去规划一个页面的尺寸是很重要的。 现给定一个具体的矩形页面面积，你的任务是设计一个长度为 L 和宽度为 W 且满足以下要求的矩形的页面。要求：

1. 你设计的矩形页面必须等于给定的目标面积。

2. 宽度 W 不应大于长度 L，换言之，要求 L >= W 。

3. 长度 L 和宽度 W 之间的差距应当尽可能小。
你需要按顺序输出你设计的页面的长度 L 和宽度 W。

示例：

输入: 4
输出: [2, 2]
解释: 目标面积是 4， 所有可能的构造方案有 [1,4], [2,2], [4,1]。
但是根据要求2，[1,4] 不符合要求; 根据要求3，[2,2] 比 [4,1] 更能符合要求. 所以输出长度 L 为 2， 宽度 W 为 2。
说明:

给定的面积不大于 10,000,000 且为正整数。
你设计的页面的长度和宽度必须都是正整数。
**/
/**
 * @param {number} area
 * @return {number[]}
 */
var constructRectangle = function(area) {
	let start = Math.ceil(Math.sqrt(area))
	for(let i = start; i>0; i--) {
		if(area%i == 0) {
			let value = area/i
			if(value>i) {
				return [value, i]
			}else {
				return [i,value]
			}
		}
	}
};
area = 37
console.log('constructRectangle:', constructRectangle(area))

/**困难
493. 翻转对
给定一个数组 nums ，如果 i < j 且 nums[i] > 2*nums[j] 我们就将 (i, j) 称作一个重要翻转对。

你需要返回给定数组中的重要翻转对的数量。

示例 1:

输入: [1,3,2,3,1]
输出: 2
示例 2:

输入: [2,4,3,5,1]
输出: 3
注意:

给定数组的长度不会超过50000。
输入数组中的所有数字都在32位整数的表示范围内。

1、归并
在归并排序的过程中，假设对于数组[l..r]nums[l..r] 而言，我们已经分别求出了子数组[l..m]nums[l..m] 与[m+1..r]nums[m+1..r] 的翻转对数目，
并已将两个子数组分别排好序，则[l..r]nums[l..r] 中的翻转对数目，就等于两个子数组的翻转对数目之和，加上左右端点分别位于两个子数组的翻转对数目。

2、树状数Binary Indexed Tree
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var reversePairs = function(nums) {
	//归并排序查找  两个子数组的翻转对数目之和，加上左右端点分别位于两个子数组的翻转对数目 时间复杂度ON*lg(N),空间O(N)
	function mergeSort(left, right) {
		//升序排序
		if(left == right) {
			return 0
		}
		let mid = Math.floor((left+right)/2)
		let n1 = mergeSort(left, mid)
		let n2 = mergeSort(mid+1, right)
		let ret = n1+n2

		//cal 左右端点分别位于两个子数组的翻转对数目 i集合在左，j集合在右
		let i = left, j = mid+1
		while(i<=mid) {
			while(j<=right && nums[i]>2*nums[j]){
				//找到第一个不符合要求的
				j++
			}
			ret = ret+j-mid-1
			i++
		}

		//排序为一个数组
		let temp = new Array(right-left+1)
		i = left
		j = mid+1
		let idx = 0
		while(i<=mid || j<=right) {
			if(i>mid) {
				temp[idx++] = nums[j++]
			}else if(j>right) {
				temp[idx++] = nums[i++]
			}else {
				if(nums[i]<nums[j]) {
					temp[idx++] = nums[i++]
				}else {
					temp[idx++] = nums[j++]
				}
			}
		}
		for(let i = left; i<=right; i++) {
			nums[i] = temp[i-left]
		}
		return ret
	}
	return mergeSort(0, nums.length-1)
};
var reversePairs2 = function(nums) {
	const allNumbers = Array.from(
        new Set([...nums, ...nums.map(x => 2 * x)]
        .sort((x, y) => x - y))
    );
    // 利用哈希表进行优化
    const values = new Map();
    let idx = 0;
    allNumbers.forEach(x => values.set(x, ++idx));
    console.log(values)

    let ret = 0;
    const bit = new BIT(values.size);
    for (let i = 0; i < nums.length; i++) {
        let left = values.get(nums[i] * 2), right = values.size;
        ret += bit.getSum(right) - bit.getSum(left);
        bit.update(values.get(nums[i]), 1);
    }
    return ret;
}
class BIT {
	constructor(n) {
		this.n = n
		this.tree = new Array(n+1).fill(0)
	}
	lowbit(x){
		//取出x的最低位
		return x&(-x)
	}
	update(x,d) {
		//x为更新的位置，d为更新后的数
		while(x<this.n){
			this.tree[x]+=d
			x+=this.lowbit(x)
		}
	}
	getSum(x) {
		//到x位置的值的总和
		let sum = 0
		while(x>0) {
			sum+=this.tree[x]
			x-=this.lowbit(x)
		}
		return sum
	}
}
nums = [1,3,2,3,1]
nums = [2,4,3,5,1]
console.log('reversePairs:', reversePairs(nums))


/**
494. 目标和
给你一个整数数组 nums 和一个整数 target 。

向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个 表达式 ：

例如，nums = [2, 1] ，可以在 2 之前添加 '+' ，在 1 之前添加 '-' ，然后串联起来得到表达式 "+2-1" 。
返回可以通过上述方法构造的、运算结果等于 target 的不同 表达式 的数目。

示例 1：

输入：nums = [1,1,1,1,1], target = 3
输出：5
解释：一共有 5 种方法让最终目标和为 3 。
-1 + 1 + 1 + 1 + 1 = 3
+1 - 1 + 1 + 1 + 1 = 3
+1 + 1 - 1 + 1 + 1 = 3
+1 + 1 + 1 - 1 + 1 = 3
+1 + 1 + 1 + 1 - 1 = 3
示例 2：

输入：nums = [1], target = 1
输出：1
 

提示：

1 <= nums.length <= 20
0 <= nums[i] <= 1000
0 <= sum(nums[i]) <= 1000
-1000 <= target <= 1000

**/
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function(nums, target) {
	let ret = 0
	let sum = 0
	let fuhao = [1,-1]
	let backTrack = function(idx){
		if(idx>=nums.length) {
			if(sum == target) {
				ret++
			}
			return
		}
		//两种情况
		for(let i = 0; i<fuhao.length; i++) {
			sum+=nums[idx]*fuhao[i]
			backTrack(idx+1)
			sum-=nums[idx]*fuhao[i]
		}
	}
	backTrack(0)
	return ret
};
var findTargetSumWays2 = function(nums, target) {
    let sum = 0;
    for (const num of nums) {
        sum += num;
    }
    const diff = sum - target;
    if (diff < 0 || diff % 2 !== 0) {
        return 0;
    }
    const n = nums.length, neg = diff / 2;
    const dp = new Array(n + 1).fill(0).map(() => new Array(neg + 1).fill(0));
    dp[0][0] = 1;
    for (let i = 1; i <= n; i++) {
        const num = nums[i - 1];
        for (let j = 0; j <= neg; j++) {
            dp[i][j] = dp[i - 1][j];
            if (j >= num) {
                dp[i][j] += dp[i - 1][j - num];
            }
        }
    }
    console.log(dp, n, neg)
    return dp[n][neg];
};
nums = [1,1,1,1,1]
target = 3
// nums = [1000]
// target = -1000
console.log('findTargetSumWays:', findTargetSumWays2(nums, target))

/**
495. 提莫攻击
在《英雄联盟》的世界中，有一个叫 “提莫” 的英雄。他的攻击可以让敌方英雄艾希（编者注：寒冰射手）进入中毒状态。

当提莫攻击艾希，艾希的中毒状态正好持续 duration 秒。

正式地讲，提莫在 t 发起发起攻击意味着艾希在时间区间 [t, t + duration - 1]（含 t 和 t + duration - 1）处于中毒状态。如果提莫在中毒影响结束 前 再次攻击，中毒状态计时器将会 重置 ，在新的攻击之后，中毒影响将会在 duration 秒后结束。

给你一个 非递减 的整数数组 timeSeries ，其中 timeSeries[i] 表示提莫在 timeSeries[i] 秒时对艾希发起攻击，以及一个表示中毒持续时间的整数 duration 。

返回艾希处于中毒状态的 总 秒数。

 
示例 1：

输入：timeSeries = [1,4], duration = 2
输出：4
解释：提莫攻击对艾希的影响如下：
- 第 1 秒，提莫攻击艾希并使其立即中毒。中毒状态会维持 2 秒，即第 1 秒和第 2 秒。
- 第 4 秒，提莫再次攻击艾希，艾希中毒状态又持续 2 秒，即第 4 秒和第 5 秒。
艾希在第 1、2、4、5 秒处于中毒状态，所以总中毒秒数是 4 。
示例 2：

输入：timeSeries = [1,2], duration = 2
输出：3
解释：提莫攻击对艾希的影响如下：
- 第 1 秒，提莫攻击艾希并使其立即中毒。中毒状态会维持 2 秒，即第 1 秒和第 2 秒。
- 第 2 秒，提莫再次攻击艾希，并重置中毒计时器，艾希中毒状态需要持续 2 秒，即第 2 秒和第 3 秒。
艾希在第 1、2、3 秒处于中毒状态，所以总中毒秒数是 3 。
 

提示：

1 <= timeSeries.length <= 104
0 <= timeSeries[i], duration <= 107
timeSeries 按 非递减 顺序排列
**/
/**
 * @param {number[]} timeSeries
 * @param {number} duration
 * @return {number}
 */
var findPoisonedDuration = function(timeSeries, duration) {
	let time = 0
	let len = timeSeries.length
	if(len<=1) {
		return duration
	}
	for(let i = 1; i<len; i++) {
		let cha = timeSeries[i]-timeSeries[i-1]
		if(cha>=duration) {
			time+=duration
		}else {
			time+=cha
		}
	}
	time+=duration
	return time
};
timeSeries = [1,4], duration = 2
timeSeries = [1,2], duration = 2
console.log('findPoisonedDuration:', findPoisonedDuration(timeSeries, duration))

/**
496. 下一个更大元素 I
nums1 中数字 x 的 下一个更大元素 是指 x 在 nums2 中对应位置 右侧 的 第一个 比 x 大的元素。

给你两个 没有重复元素 的数组 nums1 和 nums2 ，下标从 0 开始计数，其中nums1 是 nums2 的子集。

对于每个 0 <= i < nums1.length ，找出满足 nums1[i] == nums2[j] 的下标 j ，并且在 nums2 确定 nums2[j] 的 下一个更大元素 。如果不存在下一个更大元素，那么本次查询的答案是 -1 。

返回一个长度为 nums1.length 的数组 ans 作为答案，满足 ans[i] 是如上所述的 下一个更大元素 。

 

示例 1：

输入：nums1 = [4,1,2], nums2 = [1,3,4,2].
输出：[-1,3,-1]
解释：nums1 中每个值的下一个更大元素如下所述：
- 4 ，用加粗斜体标识，nums2 = [1,3,4,2]。不存在下一个更大元素，所以答案是 -1 。
- 1 ，用加粗斜体标识，nums2 = [1,3,4,2]。下一个更大元素是 3 。
- 2 ，用加粗斜体标识，nums2 = [1,3,4,2]。不存在下一个更大元素，所以答案是 -1 。
示例 2：

输入：nums1 = [2,4], nums2 = [1,2,3,4].
输出：[3,-1]
解释：nums1 中每个值的下一个更大元素如下所述：
- 2 ，用加粗斜体标识，nums2 = [1,2,3,4]。下一个更大元素是 3 。
- 4 ，用加粗斜体标识，nums2 = [1,2,3,4]。不存在下一个更大元素，所以答案是 -1 。
 

提示：

1 <= nums1.length <= nums2.length <= 1000
0 <= nums1[i], nums2[i] <= 104
nums1和nums2中所有整数 互不相同
nums1 中的所有整数同样出现在 nums2 中
 

进阶：你可以设计一个时间复杂度为 O(nums1.length + nums2.length) 的解决方案吗？
**/
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var nextGreaterElement = function(nums1, nums2) {
	//用单调栈来维护更大的元素
	let map = {}//记录nums2中当前值的下一个元素
	let stack = []
	for(let i = nums2.length-1; i>=0; i--) {
		let num = nums2[i]
		//维护栈
		while(stack.length>0 && stack[stack.length-1]<num) {
			stack.pop()
		}
		map[num] = stack.length>0?stack[stack.length-1]:-1
		stack.push(num)
	}
	let ret = []
	for(let i = 0; i<nums1.length; i++) {
		ret.push(map[nums1[i]])
	}
	return ret
};
nums1 = [4,1,2], nums2 = [1,3,4,2]
console.log('nextGreaterElement:', nextGreaterElement(nums1, nums2))

/**
497. 非重叠矩形中的随机点
给定一个非重叠轴对齐矩形的列表 rects，写一个函数 pick 随机均匀地选取矩形覆盖的空间中的整数点。

提示：

整数点是具有整数坐标的点。
矩形周边上的点包含在矩形覆盖的空间中。
第 i 个矩形 rects [i] = [x1，y1，x2，y2]，其中 [x1，y1] 是左下角的整数坐标，[x2，y2] 是右上角的整数坐标。
每个矩形的长度和宽度不超过 2000。
1 <= rects.length <= 100
pick 以整数坐标数组 [p_x, p_y] 的形式返回一个点。
pick 最多被调用10000次。
 

示例 1：

输入: 
["Solution","pick","pick","pick"]
[[[[1,1,5,5]]],[],[],[]]
输出: 
[null,[4,1],[4,1],[3,3]]
示例 2：

输入: 
["Solution","pick","pick","pick","pick","pick"]
[[[[-2,-2,-1,-1],[1,0,3,0]]],[],[],[],[],[]]
输出: 
[null,[-1,-2],[2,0],[-2,-1],[3,0],[-2,-2]]
 

输入语法的说明：

输入是两个列表：调用的子例程及其参数。Solution 的构造函数有一个参数，即矩形数组 rects。pick 没有参数。参数总是用列表包装的，即使没有也是如此。
**/
/**
 * @param {number[][]} rects
 */
var Solution = function(rects) {
	//算法  二分法查找点
	this.rects = rects
	this.psum = []
	this.tol = 0
	for(let i = 0; i<rects.length; i++) {
		let x = rects[i]
		this.tol += (x[2]-x[0]+1)*(x[3]-x[1]+1)
		this.psum[i] = this.tol
	}
};
Solution.prototype.getRandom = function(s,e){
	//开始到结束的整数 标准随机，概率相同
	return s + Math.floor(Math.random()*(e-s+1))
}

/**
 * @return {number[]}
 */
Solution.prototype.pick = function() {
	let random = this.getRandom(0, Math.max(0, this.tol-1))
	// 二分查找所在区间
	let l = 0, r = this.rects.length-1
	while(l<r) {
		let mid = parseInt((l+r)/2)
		if(random>=this.psum[mid]){
			l = mid+1
		}else{
			r = mid
		}
	}
	let x = this.rects[l]
	let width = x[2]-x[0]+1
	let height = x[3]-x[1]+1
	let base = this.psum[l]-width*height
	console.log(this.psum)
	console.log(random, l, width, height, base)
	let ret = []
	ret[0] = x[0]+(random-base)%width
	ret[1] = x[1]+parseInt((random-base)/width)
	return ret
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(rects)
 * var param_1 = obj.pick()
 */
 rects = [[-2,-2,-1,-1],[1,0,3,0]]
 obj = new Solution(rects)
 console.log('pick:', obj.pick())

 /**
 498. 对角线遍历
给你一个大小为 m x n 的矩阵 mat ，请以对角线遍历的顺序，用一个数组返回这个矩阵中的所有元素。

示例 1：


输入：mat = [[1,2,3],[4,5,6],[7,8,9]]
输出：[1,2,4,7,5,3,6,8,9]
示例 2：

输入：mat = [[1,2],[3,4]]
输出：[1,2,3,4]
 

提示：

m == mat.length
n == mat[i].length
1 <= m, n <= 104
1 <= m * n <= 104
-105 <= mat[i][j] <= 105

 **/
 /**
 * @param {number[][]} mat
 * @return {number[]}
 */
var findDiagonalOrder = function(mat) {
	if(mat.length<=0 || mat[0].length<=0) {
		return []
	}
	if(mat.length == 1) {
		return mat[0]
	}
	if(mat[1].length == 1) {
		let ret = []
		for(let i = 0; i<mat.length; i++) {
			ret.push(mat[i][0])
		}
		return ret
	}
	let row = mat.length
	let col = mat[0].length
	let ret = []
	for(let i = 0; i<row; i++) {
		let s_i = i
		let s_j = 0
		let temp = []
		while(s_i>=0 && s_j<col) {
			temp.push(mat[s_i][s_j])
			s_i--
			s_j++
		}
		ret.push(temp)
	}
	for(let j = 1; j<col; j++) {
		let s_i = row-1
		let s_j = j
		let temp = []
		while(s_i>=0 && s_j<col) {
			temp.push(mat[s_i][s_j])
			s_i--
			s_j++
		}
		ret.push(temp)
	}
	console.log(ret)
	let res = []
	for(let i = 0; i<ret.length; i++) {
		if(i%2 == 0) {
			for(let j = 0; j<ret[i].length; j++) {
				res.push(ret[i][j])
			}
		}else {
			for(let j = ret[i].length-1; j>=0; j--) {
				res.push(ret[i][j])
			}
		}
	}
	return res
};
mat = [[1,2],[3,4]]
mat = [[1,2,3],[4,5,6],[7,8,9]]
// mat = [[6,9,7]]
// mat = [[7],[9],[6]]
// mat = [[2,3,4],[5,6,7],[8,9,10],[11,12,13],[14,15,16]]
console.log('findDiagonalOrder:', findDiagonalOrder(mat))

/**
500. 键盘行
给你一个字符串数组 words ，只返回可以使用在 美式键盘 同一行的字母打印出来的单词。键盘如下图所示。

美式键盘 中：

第一行由字符 "qwertyuiop" 组成。
第二行由字符 "asdfghjkl" 组成。
第三行由字符 "zxcvbnm" 组成。
American keyboard

示例 1：

输入：words = ["Hello","Alaska","Dad","Peace"]
输出：["Alaska","Dad"]
示例 2：

输入：words = ["omk"]
输出：[]
示例 3：

输入：words = ["adsdf","sfd"]
输出：["adsdf","sfd"]
 

提示：

1 <= words.length <= 20
1 <= words[i].length <= 100
words[i] 由英文字母（小写和大写字母）组成
**/
/**
 * @param {string[]} words
 * @return {string[]}
 */
var findWords = function(words) {
	let map = {
		'q':1,'w':1,'e':1,'r':1,'t':1,'y':1,'u':1,'i':1,'o':1,'p':1,
		'a':2,'s':2,'d':2,'f':2,'g':2,'h':2,'j':2,'k':2,'l':2,
		'z':3,'x':3,'c':3,'v':3,'b':3,'n':3,'m':3,
	}
	let ret = []
	for(let i = 0 ; i<words.length; i++){
		let k = map[words[i][0].toLowerCase()]
		for(let j = 1; j<words[i].length; j++) {
			if(map[words[i][j].toLowerCase()]!=k) {
				k = -1
				break
			}
		}
		if(k>0) {
			ret.push(words[i])
		}
	}
	return ret
};
words = ["Hello","Alaska","Dad","Peace"]
console.log('findWords:', findWords(words))

/**
501. 二叉搜索树中的众数
给你一个含重复值的二叉搜索树（BST）的根节点 root ，找出并返回 BST 中的所有 众数（即，出现频率最高的元素）。
如果树中有不止一个众数，可以按 任意顺序 返回。

假定 BST 满足如下定义：

结点左子树中所含节点的值 小于等于 当前节点的值
结点右子树中所含节点的值 大于等于 当前节点的值
左子树和右子树都是二叉搜索树
 
示例 1：

输入：root = [1,null,2,2]
输出：[2]
示例 2：

输入：root = [0]
输出：[0]

提示：

树中节点的数目在范围 [1, 104] 内
-105 <= Node.val <= 105
 

进阶：你可以不使用额外的空间吗？（假设由递归产生的隐式调用栈的开销不被计算在内）
**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var findMode = function(root) {
	let ret = []
	let nowValue = 0
	let nowNum = 0
	let maxNum = 0
	let update = function(val) {
		if(nowValue == val) {
			nowNum++
		}else {
			nowValue = val
			nowNum = 1
		}
		if(nowNum == maxNum) {
			ret.push(val)
		}
		if(nowNum>maxNum) {
			ret.length = 0
			ret.push(val)
			maxNum = nowNum
		}
	}
	//中序遍历为递增序列
	let dfs = function(node) {
		if(!node) {
			return
		}
		dfs(node.left)
		//value
		update(node.val)
		dfs(node.right)
	}
	dfs(root)
	return ret
};
n1 = new TreeNode(1)
n2 = new TreeNode(2)
n3 = new TreeNode(2)
n1.right = n2
n2.left = n3
console.log('findMode:', findMode(n1))

/**
503. 下一个更大元素 II
给定一个循环数组（最后一个元素的下一个元素是数组的第一个元素），输出每个元素的下一个更大元素。数字 x 的下一个更大的元素是按数组遍历顺序，这个数字之后的第一个比它更大的数，
这意味着你应该循环地搜索它的下一个更大的数。如果不存在，则输出 -1。

示例 1:

输入: [1,2,1]
输出: [2,-1,2]
解释: 第一个 1 的下一个更大的数是 2；
数字 2 找不到下一个更大的数； 
第二个 1 的下一个最大的数需要循环搜索，结果也是 2。
注意: 输入数组的长度不会超过 10000。
**/
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var nextGreaterElements = function(nums) {
	//用单调栈来维护更大的元素
	let stack = []
	for(let i = nums.length-1; i>=0; i--) {
		while(stack.length>0 && nums[i]>=stack[stack.length-1]) {
			stack.pop()
		}
		stack.push(nums[i])
	}
	let ret = []
	for(let i = nums.length-1; i>=0; i--) {
		while(stack.length>0 && nums[i]>=stack[stack.length-1]) {
			stack.pop()
		}
		ret[i] = stack.length>0?stack[stack.length-1]:-1
		stack.push(nums[i])
	}
	return ret
};
var nextGreaterElements2 = function(nums) {
    const n = nums.length;
    const ret = new Array(n).fill(-1);
    const stk = [];
    for (let i = 0; i < n * 2 - 1; i++) {
        while (stk.length && nums[stk[stk.length - 1]] < nums[i % n]) {
            ret[stk[stk.length - 1]] = nums[i % n];
            stk.pop();
        }
        stk.push(i % n);
    }
    return ret;
};
nums = [1,2,1]
console.log('nextGreaterElements=', nextGreaterElements(nums))
/**
504. 七进制数
给定一个整数 num，将其转化为 7 进制，并以字符串形式输出。

示例 1:

输入: num = 100
输出: "202"
示例 2:

输入: num = -7
输出: "-10"
 

提示：

-107 <= num <= 107

**/
/**
 * @param {number} num
 * @return {string}
 */
var convertToBase7 = function(num) {
	let str = ''
	let b = ''
	if(num<0){
		b = '-'
	}
	num = Math.abs(num)
	while(num!=0){
		str = num%7+str
		num = parseInt(num/7)
	}
	return str == ''?'0':b+str
};
num = 100
// num = -7
// num = 0
// num = -8
console.log('convertToBase7 = ', convertToBase7(num))
/**
506. 相对名次
给你一个长度为 n 的整数数组 score ，其中 score[i] 是第 i 位运动员在比赛中的得分。所有得分都 互不相同 。

运动员将根据得分 决定名次 ，其中名次第 1 的运动员得分最高，名次第 2 的运动员得分第 2 高，依此类推。运动员的名次决定了他们的获奖情况：

名次第 1 的运动员获金牌 "Gold Medal" 。
名次第 2 的运动员获银牌 "Silver Medal" 。
名次第 3 的运动员获铜牌 "Bronze Medal" 。
从名次第 4 到第 n 的运动员，只能获得他们的名次编号（即，名次第 x 的运动员获得编号 "x"）。
使用长度为 n 的数组 answer 返回获奖，其中 answer[i] 是第 i 位运动员的获奖情况。

 

示例 1：

输入：score = [5,4,3,2,1]
输出：["Gold Medal","Silver Medal","Bronze Medal","4","5"]
解释：名次为 [1st, 2nd, 3rd, 4th, 5th] 。
示例 2：

输入：score = [10,3,8,9,4]
输出：["Gold Medal","5","Bronze Medal","Silver Medal","4"]
解释：名次为 [1st, 5th, 3rd, 2nd, 4th] 。
 

提示：

n == score.length
1 <= n <= 104
0 <= score[i] <= 106
score 中的所有值 互不相同
**/
/**
 * @param {number[]} score
 * @return {string[]}
 */
var findRelativeRanks = function(score) {
	let map = {}
	for(let i = 0; i<score.length; i++) {
		map[score[i]] = i
	}
	// 根据返回的（负、零、正）值对值进行排序
	score.sort((a,b) => {return b-a})
	let ret = new Array(score.length)
	let values = ["Gold Medal","Silver Medal","Bronze Medal"]
	for(let i = 0; i<score.length; i++) {
		let idx = map[score[i]]
		if(i<3) {
			ret[idx] = values[i]
		}else {
			ret[idx] = (i+1).toString()
		}
	}
	return ret
};
score = [10,3,8,9,4]
score = [5,4,3,2,1]
console.log('findRelativeRanks:', findRelativeRanks(score))

/**
507. 完美数
对于一个 正整数，如果它和除了它自身以外的所有 正因子 之和相等，我们称它为 「完美数」。
给定一个 整数 n， 如果是完美数，返回 true；否则返回 false。

示例 1：
输入：num = 28
输出：true
解释：28 = 1 + 2 + 4 + 7 + 14
1, 2, 4, 7, 和 14 是 28 的所有正因子。

示例 2：
输入：num = 7
输出：true
 
提示：

1 <= num <= 108
**/
/**
 * @param {number} num
 * @return {boolean}
 */
var checkPerfectNumber = function(num) {
	if(num == 1) {
		return false
	}
	let end = Math.floor(Math.sqrt(num))
	let ret = 1
	for(let i = 2; i<=end; i++) {
		if(num%i == 0) {
			ret += i
			ret += num/i
		}
	}
	return ret == num
};
num = 28
num = 7
num = 6
console.log('checkPerfectNumber:', checkPerfectNumber(num))
/**
508. 出现次数最多的子树元素和
给你一个二叉树的根结点 root ，请返回出现次数最多的子树元素和。如果有多个元素出现的次数相同，返回所有出现次数最多的子树元素和（不限顺序）。

一个结点的 「子树元素和」 定义为以该结点为根的二叉树上所有结点的元素之和（包括结点本身）。

 

示例 1：


输入: root = [5,2,-3]
输出: [2,-3,4]
示例 2：


输入: root = [5,2,-5]
输出: [2]

提示:

节点数在 [1, 104] 范围内
-105 <= Node.val <= 105
**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var findFrequentTreeSum = function(root) {
	//后续遍历
	let ret = []
	let map = {} //值：count
	let maxNum = 0
	let dfs = function(node) {
		if(!node) {
			return
		}
		let left = node.left
		dfs(left)
		let right = node.right
		dfs(right)
		let total = node.val
		if(left) total+=left.total
		if(right) total+=right.total
		node.total = total
		map[total] = (map[total] || 0)+1
		if(maxNum == map[total]) {
			ret.push(total)
		}else if(map[total]>maxNum) {
			maxNum = map[total]
			ret.length = 0
			ret.push(total)
		}
	}
	dfs(root)
	return ret
};
root = new TreeNode(5)
root.left = new TreeNode(2)
root.right = new TreeNode(-5)
console.log('findFrequentTreeSum:', findFrequentTreeSum(root))

/*
509. 斐波那契数
斐波那契数 （通常用 F(n) 表示）形成的序列称为 斐波那契数列 。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。也就是：

F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1
给定 n ，请计算 F(n) 。

 

示例 1：

输入：n = 2
输出：1
解释：F(2) = F(1) + F(0) = 1 + 0 = 1
示例 2：

输入：n = 3
输出：2
解释：F(3) = F(2) + F(1) = 1 + 1 = 2
示例 3：

输入：n = 4
输出：3
解释：F(4) = F(3) + F(2) = 2 + 1 = 3
 

提示：

0 <= n <= 30

*/
/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
	if(n <= 1) {
		return n
	}else{
		return fib(n-1)+fib(n-2)
	}
};
var fib = function(n) {
	if(n<=1) {
		return n
	}
	let p = 0, q = 0, r = 1//p n-2  q n-1  r当前
	for(let i = 2; i<=n; i++) {
		//计算下一次
		p = q
		q = r
		r = p+q
	}
	return r
}
n = 4
console.log('fib:', fib(n))

/*
513. 找树左下角的值
给定一个二叉树的 根节点 root，请找出该二叉树的 最底层 最左边 节点的值。

假设二叉树中至少有一个节点。

示例 1:

输入: root = [2,1,3]
输出: 1

示例 2:

输入: [1,2,3,4,null,5,6,null,null,7]
输出: 7
 

提示:

二叉树的节点个数的范围是 [1,104]
-231 <= Node.val <= 231 - 1 
*/
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var findBottomLeftValue = function(root) {
	//满足两个条件  1最后一层，2最左边
	//中序遍历
	let maxDepth = 0
	let res = 0
	let backTrack = function(node, depth){
		if(!node){
			return
		}
		depth++
		let left = node.left
		let right = node.right
		backTrack(left, depth)
		if(!left && !right) {
			//叶子
			if(depth>maxDepth){
				maxDepth = depth
				res = node.val
			}
		}
		backTrack(right, depth)
	}
	backTrack(root, 0)
	return res
};
function test(){
	let n1 = new TreeNode(2)
	let n2 = new TreeNode(1)
	let n3 = new TreeNode(3)
	n1.left = n2
	n1.right = n3
	console.log("findBottomLeftValue:", findBottomLeftValue(n1))

}
test()

/**
515. 在每个树行中找最大值
给定一棵二叉树的根节点 root ，请找出该二叉树中每一层的最大值。

示例1：

输入: root = [1,3,2,5,3,null,9]
输出: [1,3,9]
示例2：

输入: root = [1,2,3]
输出: [1,3]
 

提示：

二叉树的节点个数的范围是 [0,104]
-231 <= Node.val <= 231 - 1

**/
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var largestValues = function(root) {
	if(!root) {
		return []
	}
	let queue = [root]
	let ret = []
	while(queue.length>0) {
		let size = queue.length
		let max = queue[0].val
		for(let i = 0; i<size; i++){
			let node = queue[i]
			max = Math.max(max, node.val)
			if(node.left) {
				queue.push(node.left)
			}
			if(node.right) {
				queue.push(node.right)
			}
		}
		ret.push(max)
		queue = queue.slice(size)
	}
	return ret
};
function test_largestValues(){
	let n1 = new TreeNode(2)
	let n2 = new TreeNode(1)
	let n3 = new TreeNode(3)
	n1.left = n2
	n1.right = n3
	console.log("largestValues:", largestValues(n1))

}
test_largestValues()

/**
516. 最长回文子序列
给你一个字符串 s ，找出其中最长的回文子序列，并返回该序列的长度。

子序列定义为：不改变剩余字符顺序的情况下，删除某些字符或者不删除任何字符形成的一个序列。

 

示例 1：

输入：s = "bbbab"
输出：4
解释：一个可能的最长回文子序列为 "bbbb" 。
示例 2：

输入：s = "cbbd"
输出：2
解释：一个可能的最长回文子序列为 "bb" 。
 

提示：

1 <= s.length <= 1000
s 仅由小写英文字母组成

**/
/**
 * @param {string} s
 * @return {number}
 */
var longestPalindromeSubseq = function(s) {
	let checkPD = function(str) {
		let len = str.length
		for(let i = 0; i<Math.floor(len/2); i++){
			if(str[i]!=str[len-1-i]){
				return false
			}
		}
		return true
	}
	let maxLen = 0
	let len = s.length
	let temp = []
	let backTrack = function(idx) {
		if(idx>=len) {
			return
		}
		//两种可能
		temp.push(s[idx])
		if(checkPD(temp)) {
			if(temp.length>maxLen) {
				maxLen = temp.length
			}
		}
		backTrack(idx+1)
		temp.pop()

		backTrack(idx+1)
	}
	backTrack(0)
	return maxLen
};
/**
回溯法
dp[i][j] 表示s[i,j]内最长回文子串 的长度
**/
var longestPalindromeSubseq1 = function(s) {
	const n = s.length
	const dp = new Array(n).fill(0).map(() => new Array(n).fill(0));
	for(let i = n-1; i>=0; i--) {
		dp[i][i] = 1
		for(let j = i+1; j<n; j++) {
			if(s[i] == s[j]) {
				//回文串首位相同
				dp[i][j] = dp[i+1][j-1]+2
			}else {
				dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1])
			}
		}
	}
	return dp[0][n-1]
}
s = "bbbab"
s = "cbbd"
s = "aabaa"
console.log('longestPalindromeSubseq=', longestPalindromeSubseq1(s))

/**
518. 零钱兑换 II
给你一个整数数组 coins 表示不同面额的硬币，另给一个整数 amount 表示总金额。

请你计算并返回可以凑成总金额的硬币组合数。如果任何硬币组合都无法凑出总金额，返回 0 。

假设每一种面额的硬币有无限个。 

题目数据保证结果符合 32 位带符号整数。

 

示例 1：

输入：amount = 5, coins = [1, 2, 5]
输出：4
解释：有四种方式可以凑成总金额：
5=5
5=2+2+1
5=2+1+1+1
5=1+1+1+1+1
示例 2：

输入：amount = 3, coins = [2]
输出：0
解释：只用面额 2 的硬币不能凑成总金额 3 。
示例 3：

输入：amount = 10, coins = [10] 
输出：1
 

提示：

1 <= coins.length <= 300
1 <= coins[i] <= 5000
coins 中的所有值 互不相同
0 <= amount <= 5000
**/
/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
var change = function(amount, coins) {
	let counts = []
	for(let i = 0; i<coins.length; i++) {
		counts.push(Math.floor(amount/coins[i]))
	}
	let value = 0 //当前值
	let total = 0 //总的满足的个数
	let backTrack = function(idx){
		if(idx>=coins.length) {
			return
		}
		for(let i = 0; i<=counts[idx]; i++) {
			let now = i*coins[idx]
			if(value+now == amount) {
				total++
			}else if(value+now<amount) {
				value+=now
				backTrack(idx+1)
				value-=now
			}else {
				break
			}
		}
	}
	backTrack(0)
	return total
};
var change2 = function(amount, coins) {
	//动态规划  dp[x] 表示和=x的金币组合数 时间O(amont*coins.length)  空间O(amount)
	let dp = new Array(amount+1).fill(0)
	dp[0] = 1 //一个都不拿
	for(let coin of coins) {
		for(let i = coin; i<=amount; i++) {
			dp[i] += dp[i-coin]
		}
	}
	return dp[amount]
}
amount = 5, coins = [1, 2, 5]
amount = 3, coins = [2]
amount = 10, coins = [10] 
amount = 500, coins = [3,5,7,8,9,10,11]
console.log('change', change2(amount, coins))

/**
519. 随机翻转矩阵
给你一个 m x n 的二元矩阵 matrix ，且所有值被初始化为 0 。请你设计一个算法，随机选取一个满足 matrix[i][j] == 0 的下标 (i, j) ，并将它的值变为 1 。
所有满足 matrix[i][j] == 0 的下标 (i, j) 被选取的概率应当均等。

尽量最少调用内置的随机函数，并且优化时间和空间复杂度。

实现 Solution 类：

Solution(int m, int n) 使用二元矩阵的大小 m 和 n 初始化该对象
int[] flip() 返回一个满足 matrix[i][j] == 0 的随机下标 [i, j] ，并将其对应格子中的值变为 1
void reset() 将矩阵中所有的值重置为 0
 

示例：

输入
["Solution", "flip", "flip", "flip", "reset", "flip"]
[[3, 1], [], [], [], [], []]
输出
[null, [1, 0], [2, 0], [0, 0], null, [2, 0]]

解释
Solution solution = new Solution(3, 1);
solution.flip();  // 返回 [1, 0]，此时返回 [0,0]、[1,0] 和 [2,0] 的概率应当相同
solution.flip();  // 返回 [2, 0]，因为 [1,0] 已经返回过了，此时返回 [2,0] 和 [0,0] 的概率应当相同
solution.flip();  // 返回 [0, 0]，根据前面已经返回过的下标，此时只能返回 [0,0]
solution.reset(); // 所有值都重置为 0 ，并可以再次选择下标返回
solution.flip();  // 返回 [2, 0]，此时返回 [0,0]、[1,0] 和 [2,0] 的概率应当相同
 

提示：

1 <= m, n <= 104
每次调用flip 时，矩阵中至少存在一个值为 0 的格子。
最多调用 1000 次 flip 和 reset 方法。
**/
/**
 * @param {number} m
 * @param {number} n
 */
var Solution = function(m, n) {
	this.total = m*n
	this.map = {}//交换的数据
	this.row = m//行
	this.col = n//列
};

Solution.prototype.getRndInteger = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
/**
 * @return {number[]}
 */
Solution.prototype.flip = function() {
	let ret = this.getRndInteger(1, this.total)
	let _ret = ret
	if(this.map[_ret]) {
		//剔除重复
		_ret = this.map[_ret]
		delete this.map[_ret]
	}
	let row = Math.ceil(_ret/this.col)
	let col = _ret%this.col
	//swap
	if(this.map[this.total]){
		//剔除重复
		this.map[ret] = this.map[this.total]
		delete this.map[this.total]
	}else {
		this.map[ret] = this.total
	}
	// console.log(this.total, ret, this.map)
	this.total --
	return [row-1, col]
};

/**
 * @return {void}
 */
Solution.prototype.reset = function() {
	this.map = {}
	this.total = this.row*this.col
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(m, n)
 * var param_1 = obj.flip()
 * obj.reset()
 */
 solution = new Solution(3, 1)
 console.log('Solution', solution.flip())
 console.log('Solution', solution.flip())
 console.log('Solution', solution.flip())
 solution.reset()
 console.log('Solution', solution.flip())

 /**
 520. 检测大写字母
我们定义，在以下情况时，单词的大写用法是正确的：

全部字母都是大写，比如 "USA" 。
单词中所有字母都不是大写，比如 "leetcode" 。
如果单词不只含有一个字母，只有首字母大写， 比如 "Google" 。
给你一个字符串 word 。如果大写用法正确，返回 true ；否则，返回 false 。

 

示例 1：

输入：word = "USA"
输出：true
示例 2：

输入：word = "FlaG"
输出：false
 

提示：

1 <= word.length <= 100
word 由小写和大写英文字母组成
 **/
 /**
 * @param {string} word
 * @return {boolean}
 */
var detectCapitalUse = function(word) {
	let allBig = true
	let allSmall = true
	let firstBig = true
	for(let i = 0; i<word.length; i++) {
		let code = word.charCodeAt(i)
		if(code>=65&&code<=90) {
			//big
			allSmall = false
			if(i!=0) {
				firstBig = false
			}
		}else {
			allBig = false
			if(i==0) {
				firstBig = false
			}
		}

		if(!(allBig||allSmall||firstBig)) {
			return false
		}
	}
	return true
};
word = "USA"
word = "flag"
console.log('detectCapitalUse:', detectCapitalUse(word))

/**
521. 最长特殊序列 Ⅰ
给你两个字符串 a 和 b，请返回 这两个字符串中 最长的特殊序列  的长度。如果不存在，则返回 -1 。

「最长特殊序列」 定义如下：该序列为 某字符串独有的最长子序列（即不能是其他字符串的子序列） 。

字符串 s 的子序列是在从 s 中删除任意数量的字符后可以获得的字符串。

例如，"abc" 是 "aebdc" 的子序列，因为删除 "aebdc" 中斜体加粗的字符可以得到 "abc" 。 "aebdc" 的子序列还包括 "aebdc" 、 "aeb" 和 "" (空字符串)。
 

示例 1：

输入: a = "aba", b = "cdc"
输出: 3
解释: 最长特殊序列可为 "aba" (或 "cdc")，两者均为自身的子序列且不是对方的子序列。
示例 2：

输入：a = "aaa", b = "bbb"
输出：3
解释: 最长特殊序列是 "aaa" 和 "bbb" 。
示例 3：

输入：a = "aaa", b = "aaa"
输出：-1
解释: 字符串 a 的每个子序列也是字符串 b 的每个子序列。同样，字符串 b 的每个子序列也是字符串 a 的子序列。
 

提示：

1 <= a.length, b.length <= 100
a 和 b 由小写英文字母组成
**/
/**
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
var findLUSlength = function(a, b) {
	//思路，只需要判断两者相等即可
	let equal = a == b
	if(equal) {
		return -1
	}else {
		return Math.max(a.length, b.length)
	}
};
a = "aba", b = "cdc"
a = "aaa", b = "aaa"
console.log('findLUSlength:', findLUSlength(a, b))

/**
522. 最长特殊序列 II
给定字符串列表 strs ，返回 它们中 最长的特殊序列 。如果最长特殊序列不存在，返回 -1 。

最长特殊序列 定义如下：该序列为某字符串 独有的最长子序列（即不能是其他字符串的子序列）。

 s 的 子序列可以通过删去字符串 s 中的某些字符实现。

例如，"abc" 是 "aebdc" 的子序列，因为您可以删除"aebdc"中的下划线字符来得到 "abc" 。"aebdc"的子序列还包括"aebdc"、 "aeb" 和 "" (空字符串)。
 

示例 1：

输入: strs = ["aba","cdc","eae"]
输出: 3
示例 2:

输入: strs = ["aaa","aaa","aa"]
输出: -1
 

提示:

2 <= strs.length <= 50
1 <= strs[i].length <= 10
strs[i] 只包含小写英文字母
**/
/**
 * @param {string[]} strs
 * @return {number}
 */
var findLUSlength = function(strs) {
	//判断两个字符串是否是子序列时间复杂度O(x的3次方)
	let checkChild = function(a, b) {
		//a是b的子序列
		let i = 0
		for(let j = 0; j<b.length&&i<a.length; j++) {
			if(a[i] == b[j]) {
				i++
			}
			console.log(j, b.length)
		}
		return i == a.length
	}
	let res = -1
	for(let i = 0; i<strs.length; i++) {
		let j
		for(j = 0; j<strs.length; j++) {
			if(i == j) {
				continue
			}else if(checkChild(strs[i], strs[j])) {
				break
			}
		}
		if(j == strs.length) {
			res = Math.max(res, strs[i].length)
		}
	}
	return res

};
strs = ["aba","cdc","eae"]
strs = ["aaa","aaa","aa"]
console.log('findLUSlength::', findLUSlength(strs))

/**
523. 连续的子数组和
给你一个整数数组 nums 和一个整数 k ，编写一个函数来判断该数组是否含有同时满足下述条件的连续子数组：

子数组大小 至少为 2 ，且
子数组元素总和为 k 的倍数。
如果存在，返回 true ；否则，返回 false 。

如果存在一个整数 n ，令整数 x 符合 x = n * k ，则称 x 是 k 的一个倍数。0 始终视为 k 的一个倍数。

 

示例 1：

输入：nums = [23,2,4,6,7], k = 6
输出：true
解释：[2,4] 是一个大小为 2 的子数组，并且和为 6 。
示例 2：

输入：nums = [23,2,6,4,7], k = 6
输出：true
解释：[23, 2, 6, 4, 7] 是大小为 5 的子数组，并且和为 42 。 
42 是 6 的倍数，因为 42 = 7 * 6 且 7 是一个整数。
示例 3：

输入：nums = [23,2,6,4,7], k = 13
输出：false
 

提示：

1 <= nums.length <= 105
0 <= nums[i] <= 109
0 <= sum(nums[i]) <= 231 - 1
1 <= k <= 231 - 1
**/
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var checkSubarraySum1 = function(nums, k) {
	//时间复杂度O(n方)
	for(let i = 0; i<nums.length; i++) {
		let total = nums[i]
		for(let j = i+1; j<nums.length;j++) {
			total+=nums[j]
			if(total%k == 0) {
				return true
			}
		}
	}
	return false
};
var checkSubarraySum = function(nums, k) {
	//时间复杂度O(n)  前缀法+哈希   
	//preNums为前缀数组，如果preNums[i]~preNums[j]为k的倍数，那么preNums[i]和preNums[j]除以k榆树相同
	let len = nums.length
	if(len<2) return false
	let map = new Map()
	map.set(0, -1)//开始空的前缀下标-1 值0
	let reminder = 0
	for(let i = 0; i<len; i++){
		reminder = (reminder+nums[i])%k
		if(map.has(reminder)) {
			let preIdx = map.get(reminder)
			if(i-preIdx>=2){
				return true
			}
		}else {
			map.set(reminder, i)
		}

	}
	return false
};
nums = [23,2,6,4,7], k = 13
// nums = [0], k = 1
nums = [23,2,6,4,7], k = 6
console.log('checkSubarraySum:', checkSubarraySum(nums, k))
/**
524. 通过删除字母匹配到字典里最长单词
给你一个字符串 s 和一个字符串数组 dictionary ，找出并返回 dictionary 中最长的字符串，该字符串可以通过删除 s 中的某些字符得到。

如果答案不止一个，返回长度最长且字母序最小的字符串。如果答案不存在，则返回空字符串。

 

示例 1：

输入：s = "abpcplea", dictionary = ["ale","apple","monkey","plea"]
输出："apple"
示例 2：

输入：s = "abpcplea", dictionary = ["a","b","c"]
输出："a"
 

提示：

1 <= s.length <= 1000
1 <= dictionary.length <= 1000
1 <= dictionary[i].length <= 1000
s 和 dictionary[i] 仅由小写英文字母组成

**/
/**
 * @param {string} s
 * @param {string[]} dictionary
 * @return {string}
 */
var findLongestWord2 = function(s, dictionary) {
	let sMap = {}
	for(let i = 0; i<s.length; i++) {
		let temp = sMap[s[i]] || []
		temp.push(i)
		sMap[s[i]] = temp
	}
	dictionary.sort(function(a, b){
		let lenA = a.length
		let lenB = b.length
		if(lenA!=lenB) return lenB-lenA
		return a<b?-1:1
	})
	let check = function(str) {
		let tmap = {}//记录访问过的下标
		let index = -1 //当前字符的下标
		for(let i = 0; i<str.length; i++) {
			let c = str[i]
			let temp = sMap[c]
			if(!temp) return false
			let idx = tmap[c] || 0
			let find = false
			for(let j = idx; j<temp.length; j++) {
				if(temp[j]>index) {
					find = true
					tmap[c] = j+1
					index = temp[j]
					break
				}
			}
			if(!find) {
				return false
			}
			
		}
		return true
	}
	for(let i = 0; i<dictionary.length; i++) {
		if(check(dictionary[i])){
			return dictionary[i]
		}
	}
	return ''
};

var findLongestWord = function(s, dictionary) {
	dictionary.sort(function(a, b){
		let lenA = a.length
		let lenB = b.length
		if(lenA!=lenB) return lenB-lenA
		return a<b?-1:1
	})
	for(let t of dictionary) {
		let i = 0, j = 0
		while(i<s.length && j<t.length) {
			if(s[i] == t[j]) {
				j++
			}
			i++
		}
		if(j == t.length) {
			return t
		}
	}
	return ''
}
s = "abpcplea", dictionary = ["ale","apple","monkey","plea"]
// s = "abpcplea", dictionary = ["a","b","c"]
s = "aewfafwafjlwajflwajflwafj"
dictionary = ["apple","ewaf","awefawfwaf","awef","awefe","ewafeffewafewf"]
// s = "apple"
// dictionary = ["zxc","vbn"]
console.log('findLongestWord:', findLongestWord(s, dictionary))


/**
525. 连续数组
给定一个二进制数组 nums , 找到含有相同数量的 0 和 1 的最长连续子数组，并返回该子数组的长度。

 

示例 1:

输入: nums = [0,1]
输出: 2
说明: [0, 1] 是具有相同数量 0 和 1 的最长连续子数组。
示例 2:

输入: nums = [0,1,0]
输出: 2
说明: [0, 1] (或 [1, 0]) 是具有相同数量0和1的最长连续子数组。
 

提示：

1 <= nums.length <= 105
nums[i] 不是 0 就是 1
**/
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxLength = function(nums) {
	//前缀法+哈希表
	let counter = 0 //前缀和
	let map = new Map()//前缀和  下标
	map.set(counter, -1)//初始值 方便包含0位置的
	let maxLen = 0
	for(let i = 0; i<nums.length; i++) {
		if(nums[i] == 1) {
			counter++
		}else {
			counter--
		}
		if(map.has(counter)) {
			let preIdx = map.get(counter)
			maxLen = Math.max(maxLen, i-preIdx)
		}else {
			map.set(counter, i)
		}
	}
	return maxLen
};
nums = [0,1]
console.log('findMaxLength', findMaxLength(nums))


/**
526. 优美的排列
假设有从 1 到 n 的 n 个整数。用这些整数构造一个数组 perm（下标从 1 开始），只要满足下述条件 之一 ，该数组就是一个 优美的排列 ：

perm[i] 能够被 i 整除
i 能够被 perm[i] 整除
给你一个整数 n ，返回可以构造的 优美排列 的 数量 。

 

示例 1：

输入：n = 2
输出：2
解释：
第 1 个优美的排列是 [1,2]：
    - perm[1] = 1 能被 i = 1 整除
    - perm[2] = 2 能被 i = 2 整除
第 2 个优美的排列是 [2,1]:
    - perm[1] = 2 能被 i = 1 整除
    - i = 2 能被 perm[2] = 1 整除
示例 2：

输入：n = 1
输出：1
 

提示：

1 <= n <= 15

**/

/**
 * @param {number} n
 * @return {number}
 */
var countArrangement = function(n) {
	//1回溯法 时间复杂度O(n方+n!) 空间复杂度O(n)
	let used = new Array(n+1).fill(0)//是否访问过
	let match = new Array(n+1)//匹配的内容
	match[0] = []
	for(let i = 1; i<=n; i++){
		match[i] = []
		for(let j = 1; j<=n; j++) {
			if(i%j==0 || j%i==0) {
				match[i].push(j)
			}
		}
	}
	let num = 0
	let backTrack = function(idx){
		if(idx == n+1) {
			num++
			return
		}
		for(let i = 0; i<match[idx].length; i++) {
			let value = match[idx][i]
			if(!used[value]) {
				used[value] = true
				backTrack(idx+1)
				used[value] = false
			}
		}
	}
	backTrack(1)
	return num
};
console.log('countArrangement:', countArrangement(3))

/**
528. 按权重随机选择
给你一个 下标从 0 开始 的正整数数组 w ，其中 w[i] 代表第 i 个下标的权重。

请你实现一个函数 pickIndex ，它可以 随机地 从范围 [0, w.length - 1] 内（含 0 和 w.length - 1）选出并返回一个下标。选取下标 i 的 概率 为 w[i] / sum(w) 。

例如，对于 w = [1, 3]，挑选下标 0 的概率为 1 / (1 + 3) = 0.25 （即，25%），而选取下标 1 的概率为 3 / (1 + 3) = 0.75（即，75%）。
 

示例 1：

输入：
["Solution","pickIndex"]
[[[1]],[]]
输出：
[null,0]
解释：
Solution solution = new Solution([1]);
solution.pickIndex(); // 返回 0，因为数组中只有一个元素，所以唯一的选择是返回下标 0。
示例 2：

输入：
["Solution","pickIndex","pickIndex","pickIndex","pickIndex","pickIndex"]
[[[1,3]],[],[],[],[],[]]
输出：
[null,1,1,1,1,0]
解释：
Solution solution = new Solution([1, 3]);
solution.pickIndex(); // 返回 1，返回下标 1，返回该下标概率为 3/4 。
solution.pickIndex(); // 返回 1
solution.pickIndex(); // 返回 1
solution.pickIndex(); // 返回 1
solution.pickIndex(); // 返回 0，返回下标 0，返回该下标概率为 1/4 。

由于这是一个随机问题，允许多个答案，因此下列输出都可以被认为是正确的:
[null,1,1,1,1,0]
[null,1,1,1,1,1]
[null,1,1,1,0,0]
[null,1,1,1,0,1]
[null,1,0,1,0,0]
......
诸若此类。
 

提示：

1 <= w.length <= 104
1 <= w[i] <= 105
pickIndex 将被调用不超过 104 次

**/
/**
 * @param {number[]} w
 */
var Solution = function(w) {
	this.weights = []
	this.total = 0
	for(let i = 0; i<w.length; i++) {
		this.total+=w[i]
		this.weights[i] = this.total
	}
};
//随机一个数 1-this.total
Solution.prototype.random = function() {
	return Math.floor(Math.random()*this.total)+1
}

//二分算法
Solution.prototype.binarySearch = function(num) {
	let left = 0, right = this.weights.length-1
	while(left<right){
		let mid = Math.floor((left+right)/2)
		if(num<=this.weights[left]) {
			return left
		}else if(num<=this.weights[mid]) {
			right = mid
		}else {
			left = mid+1
		}
	}
	return left
}
/**
 * @return {number}
 */
Solution.prototype.pickIndex = function() {
	let value = this.random()
	return this.binarySearch(value)
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(w)
 * var param_1 = obj.pickIndex()
 */
 solution = new Solution([3,14,1,7])
 console.log('Solution', solution.pickIndex())

 /**
 529. 扫雷游戏
让我们一起来玩扫雷游戏！

给你一个大小为 m x n 二维字符矩阵 board ，表示扫雷游戏的盘面，其中：

'M' 代表一个 未挖出的 地雷，
'E' 代表一个 未挖出的 空方块，
'B' 代表没有相邻（上，下，左，右，和所有4个对角线）地雷的 已挖出的 空白方块，
数字（'1' 到 '8'）表示有多少地雷与这块 已挖出的 方块相邻，
'X' 则表示一个 已挖出的 地雷。
给你一个整数数组 click ，其中 click = [clickr, clickc] 表示在所有 未挖出的 方块（'M' 或者 'E'）中的下一个点击位置（clickr 是行下标，clickc 是列下标）。

根据以下规则，返回相应位置被点击后对应的盘面：

如果一个地雷（'M'）被挖出，游戏就结束了- 把它改为 'X' 。
如果一个 没有相邻地雷 的空方块（'E'）被挖出，修改它为（'B'），并且所有和其相邻的 未挖出 方块都应该被递归地揭露。
如果一个 至少与一个地雷相邻 的空方块（'E'）被挖出，修改它为数字（'1' 到 '8' ），表示相邻地雷的数量。
如果在此次点击中，若无更多方块可被揭露，则返回盘面。
 

示例 1：


输入：board = [["E","E","E","E","E"],["E","E","M","E","E"],["E","E","E","E","E"],["E","E","E","E","E"]], click = [3,0]
输出：[["B","1","E","1","B"],["B","1","M","1","B"],["B","1","1","1","B"],["B","B","B","B","B"]]
示例 2：


输入：board = [["B","1","E","1","B"],["B","1","M","1","B"],["B","1","1","1","B"],["B","B","B","B","B"]], click = [1,2]
输出：[["B","1","E","1","B"],["B","1","X","1","B"],["B","1","1","1","B"],["B","B","B","B","B"]]
 

提示：

m == board.length
n == board[i].length
1 <= m, n <= 50
board[i][j] 为 'M'、'E'、'B' 或数字 '1' 到 '8' 中的一个
click.length == 2
0 <= clickr < m
0 <= clickc < n
board[clickr][clickc] 为 'M' 或 'E'
 **/
 /**
 * @param {character[][]} board
 * @param {number[]} click
 * @return {character[][]}
 */
var updateBoard = function(board, click) {

};

/**
530. 二叉搜索树的最小绝对差
给你一个二叉搜索树的根节点 root ，返回 树中任意两不同节点值之间的最小差值 。

差值是一个正数，其数值等于两值之差的绝对值。

 

示例 1：


输入：root = [4,2,6,1,3]
输出：1
示例 2：


输入：root = [1,0,48,null,null,12,49]
输出：1
 

提示：

树中节点的数目范围是 [2, 104]
0 <= Node.val <= 105
**/

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var getMinimumDifference = function(root) {
	//中序深度优先遍历
	let min = Number.MAX_VALUE, pre = -1
	let dfs = function(node) {
		if(!node) {
			return
		}
		dfs(node.left)
		if(pre == -1) {
			pre = node.val
		}else {
			min = Math.min(min, Math.min(node.val-pre))
			pre = node.val
		}
		dfs(node.right)
	}
	dfs(root)
	return min
};
var test = function() {
	//[236,104,701,null,227,null,911]
	let d1 = new TreeNode(4)
	let d2 = new TreeNode(2)
	let d3 = new TreeNode(6)
	let d4 = new TreeNode(1)
	let d5 = new TreeNode(3)
	d1.left = d2
	d1.right = d3
	d2.left = d4
	d2.right = d5
	console.log('getMinimumDifference:', getMinimumDifference(d1))
}
test()

/**
532. 数组中的 k-diff 数对
给定一个整数数组和一个整数 k，你需要在数组里找到 不同的 k-diff 数对，并返回不同的 k-diff 数对 的数目。

这里将 k-diff 数对定义为一个整数对 (nums[i], nums[j])，并满足下述全部条件：

0 <= i < j < nums.length
|nums[i] - nums[j]| == k
注意，|val| 表示 val 的绝对值。

 

示例 1：

输入：nums = [3, 1, 4, 1, 5], k = 2
输出：2
解释：数组中有两个 2-diff 数对, (1, 3) 和 (3, 5)。
尽管数组中有两个1，但我们只应返回不同的数对的数量。
示例 2：

输入：nums = [1, 2, 3, 4, 5], k = 1
输出：4
解释：数组中有四个 1-diff 数对, (1, 2), (2, 3), (3, 4) 和 (4, 5)。
示例 3：

输入：nums = [1, 3, 1, 5, 4], k = 0
输出：1
解释：数组中只有一个 0-diff 数对，(1, 1)。
 

提示：

1 <= nums.length <= 104
-107 <= nums[i] <= 107
0 <= k <= 107

**/
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findPairs = function(nums, k) {

};