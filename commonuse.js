/*
* @Author: haoyanwei
* @Date:   2022-12-04 15:48:22
* @Last Modified by:   haoyanwei
* @Last Modified time: 2022-12-18 22:16:31
* 常用的50道算法题
*/

/**
扁平数据转tree
疯狂上机
时间复杂度O(n)
空间复杂度O(n)
**/
function toTree(arr){
	let map = {}
	for(let item of arr){
		map[item.id] = item
	}
	let root = null
	for(let item of arr){
		let pid = item.pid
		if(pid == 0){
			root = item
		}else {
			let parent = map[pid]
			parent.children = parent.children || []
			parent.children.push(item)
		}
	}
	return root
}
var arr = [
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 1},
  {id: 4, name: '部门4', pid: 3},
  {id: 5, name: '部门5', pid: 4},
]
console.log('toTree:', toTree(arr))
/**
1、合并两个有序数组
方法：双指针法
时间复杂度O(m+n)
空间复杂度O(m+n)
https://leetcode.cn/problems/merge-sorted-array/
**/
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
	let p1 = 0, p2 = 0
	let sorted = new Array(m+n)
	let curr = 0
	while(p1<m || p2<n){
		if (p1<m && p2<n) {
			if (nums1[p1]<nums2[p2]) {
				sorted[curr++] = nums1[p1++]
			}else {
				sorted[curr++] = nums2[p2++]
			}
		}else if(p1<m){
			sorted[curr++] = nums1[p1++]
		}else if(p2<n){
			sorted[curr++] = nums2[p2++]
		}
	}
	for(let i = 0; i<m+n; i++){
		nums1[i] = sorted[i]
	}
};
var nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
merge(nums1, m, nums2, n)
console.log('merge', nums1)

/**
2、合并两个有序链表
时间复杂度O(m+n)
空间复杂度O(1)
https://leetcode.cn/problems/merge-two-sorted-lists/
**/
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function ListNode(val, next) {
	this.val = (val===undefined ? 0 : val)
	this.next = (next===undefined ? null : next)
}
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
	let list = new ListNode(-1)
	let prev = list
	while(list1 && list2) {
		if (list1.val<list2.val) {
			prev.next = list1
			list1 = list1.next
		}else {
			prev.next = list2
			list2 = list2.next
		}
		prev = prev.next
	}
	prev.next = list1?list1:list2
	return list.next
};
/**
3、快速排序
//思路：选择一个基准要素，一般是第一个元素，通过一趟扫描小于基准元素的放到左边，大于的放到右边，基准要素是有序的;  然后用同样的方法遍历其它两部分。
时间复杂度O(nLogn)
空间O(1)
**/
function quickSort(nums){
	let backTrack=function(l,r){
		if(l<r){
			//x为选取的基准要素
			let i = l,j = r,x = nums[l]
			while(i<j){
				//从右边找<x的值
				while(i<j && nums[j]>=x){
					j--
				}
				if (i<j) {
					nums[i++] = nums[j]
				}
				//从左边找>x的值
				while(i<j && nums[i]<x){
					i++
				}
				if (i<j) {
					nums[j--] = nums[i]
				}
			}
			//i为有序
			nums[i] = x
			backTrack(l, i-1)
			backTrack(i+1, r)
		}
		
	}
	backTrack(0, nums.length-1)
}
var nums = [3,1,1,4,2]
quickSort(nums)
console.log('quickSort', nums)

//归并排序
//时间O(nLgn) 空间O(n)
function mergeSort(nums)
{
	let temp = []
	let backTrack = function(l,r){
		if(l>=r){
			return 
		}
		let mid = parseInt((l+r)/2)
		backTrack(l, mid)
		backTrack(mid+1, r)
		//合并
		let start1 = l, start2 = mid+1
		let idx = l
		while(start1<=mid || start2<=r){
			if(start1<=mid && start2<=r){
				if(nums[start1]<nums[start2]){
					temp[idx++] = nums[start1++]
				}else {
					temp[idx++] = nums[start2++]
				}
			}else if(start1<=mid ){
				temp[idx++] = nums[start1++]
			}else{
				temp[idx++] = nums[start2++]
			}
		}
		//赋值给nums
		for(let i = l; i<=r; i++){
			nums[i] = temp[i]
		}
	}
	backTrack(0, nums.length-1)
}
/**
4、二分查找
有序的数组进行查找
时间复杂度OLog(n)
空间复杂度(O(1))
**/
function binarySearch(nums,value){
	let left = 0,right = nums.length-1
	while(left<right) {
		let mid = parseInt((left+right)/2)
		if(nums[mid] == value){
			return mid
		}else if(nums[mid]<value){
			left = mid+1
		}else {
			right = mid-1
		}
	}
	return left
}
var nums = [1,2,2,4,6,9]
console.log('binarySearch', binarySearch(nums, 2))

/**
5、上台阶问题，每次可爬1阶或者2阶，共有多少种方法爬到楼顶
LeetCode：https://leetcode-cn.com/problems/climbing-stairs/

动态规划
f(x)=f(x−1)+f(x−2)
爬到x级台阶总方案=爬到x-1总方案 + 爬到x-2总方案
已知 f(0) = 0  f(1) = 1

时间复杂度O(n)
空间复杂度O(1)
**/
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
	let p = 0,q = 0,r = 1
	for(let i = 1; i<=n; i++){
		p = q
		q = r
		r = p+q
	}
	return r
};
console.log('climbStairs:', climbStairs(5))

/**
6、斐波那契数列
https://leetcode.cn/problems/fei-bo-na-qi-shu-lie-lcof/description/
时间复杂度O(n)
空间复杂度O(1)
**/
/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
	if (n <= 1) {
		return n
	}
	let MOD = 1000000007
	let p = 0, q = 1, r = 1
	for(let i = 2; i<=n; i++){
		r = (p+q)%MOD
		p = q
		q = r
	}
	return r
};
console.log('fib:', fib(3))

/**
7、翻转链表
时间复杂度O(n)
空间复杂度O(1)
**/
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
	let prev = null
	let curr = head
	while(curr){
		let next = curr.next
		curr.next = prev

		prev = curr
		curr = next
	}
	return prev
};
/**
8、相交链表
https://leetcode-cn.com/problems/intersection-of-two-linked-lists/
时间复杂度O(m+n+common)
空间O(1)

双指针法
A距离
B距离
C相交的链表
A+C+B = B+C+A
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
	if (headA === null || headB === null) {
        return null
    }
    let pA = headA, pB = headB
    while(pA!==pB){
    	pA = pA==null?headB:pA.next
    	pB = pB==null?headA:pB.next
    }
    return pA
};
/**
9、判断链表中是否有环
https://leetcode-cn.com/problems/linked-list-cycle/

思路：快慢指针
时间复杂度O(n)
空间复杂度O(1)
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
 * @return {boolean}
 */
var hasCycle = function(head) {
    if (!head) {
    	return false
    }
    let low = head
    let fast = head.next
    while(low!=fast){
    	if(!fast || !fast.next){
    		//判断fast为空则无环
    		return false
    	}
    	low = low.next
    	fast = fast.next.next
    }
    return true
};
/**
10、给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null
https://leetcode-cn.com/problems/linked-list-cycle-ii/
双指针法
a 非环形区距离
b 环形区相遇点距离
c 环形剩余距离
快慢指针
(a+b)*2 = a+(b+c)*n+b
a = c+(b+c)*(n-1)
即快慢指针相遇后，p从头走和慢指针相遇点就是环开始的位置

时间复杂度O(n)
空间复杂度O(1)
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
	if (head == null) {
		return null
	}
    let slow = head
    let fast = head
    while(fast!=null){
    	slow = slow.next
    	if(fast.next!=null){
    		fast = fast.next.next
    	}else{
    		return null
    	}
    	if(fast == slow){
    		//相遇点,ptr从头走
    		let ptr = head
    		while(ptr!=slow){
    			ptr = ptr.next
    			slow = slow.next
    		}
    		return ptr
    	}
    }
    return null
};
/**
11、给定一个链表，两两交换其中相邻的节点，并返回交换后的链表。
https://leetcode-cn.com/problems/swap-nodes-in-pairs/

时间复杂度O(n)
空间复杂度O(1)
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
var swapPairs = function(head) {
	let start = new ListNode(-1)
	let curr = start
	let p = head
	while(p){
		let next = p.next
		if(!next){
			curr.next = p
			p.next = null
			curr = p
			break
		}
		let nnext = next.next
		curr.next = next
		next.next = p

		curr = p
		p = nnext
	}
	if (curr) {
		curr.next = null
	}
	return start.next
};

/**
12、删除 排序 链表中的重复元素
https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/

时间复杂度O(n)
空间O(1)
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
var deleteDuplicates = function(head) {
	if(!head){
		return null
	}
	let curr = head
	while(curr.next){
		let next = curr.next
		if(next.val == curr.val){
			curr.next = next.next
		}else {
			curr = next
		}
	}
	return head
};
/**
13、给你一个链表的头节点 head 和一个整数 val ，请你删除链表中所有满足 Node.val == val 的节点，并返回 新的头节点
时间O(n)
空间O(1)
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
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function(head, val) {
	let node = new ListNode(-1)
	let curr = node
	let p = head
	while(p){
		if (p.val != val) {
			curr.next = p
			curr = p
		}
		p = p.next
	}
	curr.next = null
	return node.next
};
/**
给你一个链表，每 k 个节点一组进行翻转，请你返回翻转后的链表
https://leetcode-cn.com/problems/reverse-nodes-in-k-group/
时间复杂度O(n)
空间复杂度O(1)
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
	let p = new ListNode(0)
	p.next = head
	let prev = p
	let curr = head
	let reverse = function(from, to){
		let _prev = null
		let _p = from
		while(_p!=to){
			let next = _p.next
			_p.next = _prev

			_prev = _p
			_p = next
		}
		_p.next = _prev
		return [to, from]
	}
	while(curr){
		let endP = curr
		let startP = curr
		//检查到k个
		for(let i = 1; i<k; i++){
			endP = endP.next
			if(!endP){
				return p.next
			}
		}
		let next = endP.next;
		[startP,endP] = reverse(startP, endP)
		endP.next = next
		prev.next = startP
		curr = next
		prev = endP
	}
	return p.next
};
var n1 = new ListNode(1)
var n2 = new ListNode(2)
n1.next = n2
console.log('reverseKGroup：', reverseKGroup(n1, 2))

/**
括号生成
https://leetcode-cn.com/problems/generate-parentheses/

回溯法
**/
/**
数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。

示例 1：
输入：n = 3
输出：["((()))","(()())","(())()","()(())","()()()"]
示例 2：

输入：n = 1
输出：["()"]
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
	let temp = []
	let res = []
	let items = ['(', ')']
	let itemNums = [0, 0]
	let backTrack = function(i){
		if (i>=2*n) {
			res.push(temp.join(''))
			return
		}
		for(let j = 0; j<items.length; j++){
			if(itemNums[j]>=n){
				continue
			}
			if(j==1 && itemNums[1]>=itemNums[0]){
				continue
			}
			temp.push(items[j])
			itemNums[j]++
			backTrack(i+1)
			temp.pop()
			itemNums[j]--
		}
	}
	backTrack(0)
	return res
};
console.log('generateParenthesis:', generateParenthesis(3))

/**
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
https://leetcode-cn.com/problems/valid-parentheses/

时间O(n)
空间O(n)
**/
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
	let dic = {')':'(', '}':'{', ']':'['}
	let stack = []
	for(let i = 0; i<s.length; i++){
		let item = dic[s[i]]
		if (item && stack.pop()!=item) {
			return false
		}
		if(!item){
			stack.push(s[i])
		}
	}
	return stack.length == 0
};
var s = "(()[])"
console.log('isValid:', isValid(s))

/**
仅使用两个栈实现先入先出队列
https://leetcode-cn.com/problems/implement-queue-using-stacks/
两个栈
stackIn 输入栈
stackOut 输出栈
push 推入到statkIn
pop peek 从stackOut中输出，如果为空，把stackIn的数据加入到stackOut中
**/
var MyQueue = function() {
	this.m_stackIn = []
	this.m_stackOut = []
};

/** 
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function(x) {
	this.m_stackIn.push(x)
};

/**
 * @return {number}
 */
MyQueue.prototype.pop = function() {
	this.inToOut()
	return this.m_stackOut.pop()
};

/**
 * @return {number}
 */
MyQueue.prototype.peek = function() {
	this.inToOut()
	return this.m_stackOut[this.m_stackOut.length-1]
};

/**
 * @return {boolean}
 */
MyQueue.prototype.empty = function() {
	return this.m_stackIn.length==0 && this.m_stackOut.length==0
};
MyQueue.prototype.inToOut = function(){
	if (this.m_stackOut.length == 0) {
		while(this.m_stackIn.length>0){
			this.m_stackOut.push(this.m_stackIn.pop())
		}
	}
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */
 /**
 请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（push、pop、peek、empty）：

实现 MyQueue 类：

void push(int x) 将元素 x 推到队列的末尾
int pop() 从队列的开头移除并返回元素
int peek() 返回队列开头的元素
boolean empty() 如果队列为空，返回 true ；否则，返回 false
说明：

你 只能 使用标准的栈操作 —— 也就是只有 push to top, peek/pop from top, size, 和 is empty 操作是合法的。
你所使用的语言也许不支持栈。你可以使用 list 或者 deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。
 **/

 /**
 仅使用两个队列实现一个后入先出（LIFO）的栈
 https://leetcode-cn.com/problems/implement-stack-using-queues/
 **/
 var MyStack = function() {
 	this.m_stack = []
};

/** 
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function(x) {
	this.m_stack.push(x)
};

/**
 * @return {number}
 */
MyStack.prototype.pop = function() {
	return this.m_stack.pop()
};

/**
 * @return {number}
 */
MyStack.prototype.top = function() {
	return this.m_stack[this.m_stack.length-1]
};

/**
 * @return {boolean}
 */
MyStack.prototype.empty = function() {
	return !this.m_stack.length
};

/**
 * Your MyStack object will be instantiated and called as such:
 * var obj = new MyStack()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.empty()
 */
 /**
请你仅使用两个队列实现一个后入先出（LIFO）的栈，并支持普通栈的全部四种操作（push、top、pop 和 empty）。

实现 MyStack 类：

void push(int x) 将元素 x 压入栈顶。
int pop() 移除并返回栈顶元素。
int top() 返回栈顶元素。
boolean empty() 如果栈是空的，返回 true ；否则，返回 false 。
 
注意：
你只能使用队列的基本操作 —— 也就是 push to back、peek/pop from front、size 和 is empty 这些操作。
你所使用的语言也许不支持队列。 你可以使用 list （列表）或者 deque（双端队列）来模拟一个队列 , 只要是标准的队列操作即可。
 **/

 /**
求数组中前k个大数
https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/
 **/
 /**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 */
var getLeastNumbers = function(arr, k) {
	//排序，然后取前k
	arr.sort(function(a, b){
		return a-b
	})
	let res = []
	for(let i = 0; i<k; i++){
		res.push(arr[i])
	}
	return res
};
/*
输入整数数组 arr ，找出其中最小的 k 个数。例如，输入4、5、1、6、2、7、3、8这8个数字，则最小的4个数字是1、2、3、4。

示例 1：
输入：arr = [3,2,1], k = 2
输出：[1,2] 或者 [2,1]
*/

console.log('getLeastNumbers:', getLeastNumbers([1,5,2,3], 2))

/*
在未排序的数组中找到第 k 个最大的元素
https://leetcode-cn.com/problems/kth-largest-element-in-an-array/

时间O(n)
空间O(1)
*/
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
	let backTrack = function(left, right)
	{
		if (left<right) {
			let i = left, j = right, r = nums[i]
			//从大到小
			while(i<j){
				//从右边找>k的值
				while(i<j && nums[j]<=r){
					j--
				}
				if(i<j){
					nums[i++] = nums[j]
				}
				//从左边找<k的值
				while(i<j && nums[i]>=r){
					i++
				}
				if(i<j){
					nums[j--] = nums[i]
				}
			}
			nums[i] = r
			if(k == i+1){
				return r
			}else if(k<i+1){
				return backTrack(left, i-1)
			}else {
				return backTrack(i+1, right)
			}

		}
		return nums[left]
	}
	return backTrack(0, nums.length-1)
};
console.log('findKthLargest:', findKthLargest([2,3,1,4,5], 3))

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
 			//遍历子节点调整 root i  子 k+1 k+2
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

//---------------------------树相关--------------
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}
/**
判断一棵二叉树，是否为二叉搜索树
https://leetcode-cn.com/problems/validate-binary-search-tree/
中序遍历是有序的，判断后一个元素大于前一个元素即可
时间复杂度(O(n))
空间O(1)
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
 * @return {boolean}
 */
var isValidBST = function(root) {
	let isValid = true
	let preValue = -Infinity
	let backTrack = function(node){
		if (!isValid) {
			return
		}
		if(!node){
			return
		}
		backTrack(node.left)
		if(node.val<=preValue){
			isValid = false
			return
		}
		preValue = node.val
		backTrack(node.right)
	}
	backTrack(root)
	return isValid
};

/*
从上到下打印二叉树
https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-lcof/
用队列实现，先进先出
时间O(n)
空间O(1)
*/
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
var levelOrder = function(root) {
	if(!root){
		return []
	}
	let queue = [root]
	let res = []
	while(queue.length>0){
		let node = queue.shift()
		res.push(node.val)
		if(node.left){
			queue.push(node.left)
		}
		if(node.right){
			queue.push(node.right)
		}
	}
	return res
};
/*
每一层打印到一行
https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-ii-lcof/
*/
/*
判断一棵二叉树，是否是一棵 完全二叉树
https://leetcode-cn.com/problems/check-completeness-of-a-binary-tree/

给定一个二叉树的 root ，确定它是否是一个 完全二叉树 。

在一个 完全二叉树 中，除了最后一个关卡外，所有关卡都是完全被填满的，并且最后一个关卡中的所有节点都是尽可能靠左的。它可以包含 1 到 2的h 节点之间的最后一级 h 。

思路：把所有节点放到数组中并重新赋值
1
2 3
4 5 6 7
父n 子2n 2n+1
判断数组的最后一个元素的值和数组的元素个数相同
时间O(n)
空间O(n)
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
 * @return {boolean}
 */
var isCompleteTree = function(root) {
	let arr = [root]
	if (root) {root.val = 1}
	let i = 0
	while(i<arr.length){
		let node = arr[i++]
		if (node.left) {
			node.left.val = 2*node.val
			arr.push(node.left)
		}
		if (node.right) {
			node.right.val = 2*node.val+1
			arr.push(node.right)
		}
	}
	return arr[arr.length-1].val == arr.length
};
/*
查找二叉树中的节点
https://leetcode.cn/problems/search-in-a-binary-search-tree/
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
 * @param {number} val
 * @return {TreeNode}
 */
var searchBST = function(root, val) {
	if (!root) {
		return null
	}
	if(root.val == val){
		return root
	}
	return val<root.val?searchBST(root.left, val):searchBST(root.right, val)
};


/*
删除二叉搜索树中的节点后，保持二叉搜索树性质不变
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
 * @param {number} key
 * @return {TreeNode}
 */
var deleteNode = function(root, key) {
	if(!root){
		return null
	}
	if(root.val>key){
		//在左子树
		root.left = deleteNode(root.left, key)
	}else if(root.val<key){
		//在右子树
		root.right = deleteNode(root.right, key)
	}else{
		//需要删除的节点
		if(!root.left){
			return root.right
		}
		if(!root.right){
			return root.left
		}
		//左右节点都存在 左节点挂到有节点的最小子树上，并返回右节点
		let minRight = root.right
		while(minRight.left){
			minRight = minRight.left
		}
		minRight.left = root.left
		return root.right
	}
	return root
};
/*
给定一个二叉搜索树的根节点 root 和一个值 key，删除二叉搜索树中的 key 对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。

一般来说，删除节点可分为两个步骤：

首先找到需要删除的节点；
如果找到了，删除它。

根据二叉搜索树的性质

如果目标节点大于当前节点值，则去右子树中删除；
如果目标节点小于当前节点值，则去左子树中删除；
如果目标节点就是当前节点，分为以下三种情况：
	其无左子：其右子顶替其位置，删除了该节点；
	其无右子：其左子顶替其位置，删除了该节点；
	其左右子节点都有：其左子树转移到其右子树的最左节点的左子树上，然后右子树顶替其位置，由此删除了该节点。
*/

/*
二叉搜索树插入一个值
https://leetcode.cn/problems/insert-into-a-binary-search-tree/
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
 * @param {number} val
 * @return {TreeNode}
 */
var insertIntoBST = function(root, val) {
	if(!root){
		return new TreeNode(val)
	}
	if(root.val<val){
		root.right = insertIntoBST(root.right, val)
	}else{
		root.left = insertIntoBST(root.left, val)
	}
	return root
};

/*
二叉搜索树最小距离

https://leetcode.cn/problems/minimum-distance-between-bst-nodes/
*/
/*
将有序数组转换为二叉搜索树

https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/

中序遍历，总是选择中间位置左边的数字作为根节点
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
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function(nums) {
	let backTrack = function(left, right){
		if(left>right){return null}

		let mid = Math.floor((left+right)/2)
		let node = new TreeNode(nums[mid])
		node.left = backTrack(left, mid-1)
		node.right = backTrack(mid+1, right)
		return node
	}
	return backTrack(0, nums.length-1)
};

/*
226. 翻转二叉树
https://leetcode.cn/problems/invert-binary-tree/

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
 * @return {TreeNode}
 */
var invertTree = function(root) {
	if (!root) {return null}
	let left = root.left
	let right = root.right
	root.left = invertTree(right)
	root.right = invertTree(left)
	return root
};

//继承的实现
function Person(id){
	this.id = id
}
function Student(id, age){
	//借用构造，继承构造函数的
	Person.call(this, id)
	this.age = age
}
//继承原型链上的
(function AA(){
	function A(){
	}
	A.prototype = Person.prototype
	Student.prototype = new A()
})()


/*
最长重复子串
https://leetcode-cn.com/problems/longest-duplicate-substring/

给你一个字符串 s ，考虑其所有 重复子串 ：即 s 的（连续）子串，在 s 中出现 2 次或更多次。这些出现之间可能存在重叠。
返回 任意一个 可能具有最长长度的重复子串。如果 s 不含重复子串，那么答案为 "" 。
*/
/**
 * @param {string} s
 * @return {string}
 */
var longestDupSubstring = function(s) {
	let maxSub = ''
	let map = {}
	let len = s.length
	let getAllSub = function(start){
		//获取以start开头的子串
		for(let i = len-1; i>=start; i--){
			if(maxSub.length>=i-start+1){
				break
			}
			let sub = s.slice(start, i+1)
			if(map[sub]){
				if (sub.length>maxSub.length) {
					maxSub = sub
					break
				}
			}else {
				map[sub] = true
			}
		}
	}
	for(let i = 0; i<s.length; i++){
		getAllSub(i)
	}
	return maxSub
};
var s = 'ddabcabc'
console.log('longestDupSubstring:', longestDupSubstring(s))
/*
3. 无重复字符的最长子串
给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。
https://leetcode.cn/problems/longest-substring-without-repeating-characters/

滑动窗口法
时间O(n)
空间O(n)
*/
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
	let maxLen = 0
	let map = {}
	let st = 0, ed = 0
	for(let i = 0; i<s.length; i++){
		let c = s[i]
		if(!map[c]){
			map[c] = 1
			ed=i
			maxLen = Math.max(maxLen, ed-st+1)
		}else{
			ed = i
			while(s[st]!=c){
				map[s[st]]--
				st++
			}
			//s[st]==c
			st++
		}
	} 
	return maxLen
};
s = "abcabcbb"
console.log('lengthOfLongestSubstring', lengthOfLongestSubstring(s))

/*
28. 找出字符串中第一个匹配项的下标
https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/
给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串的第一个匹配项的下标（下标从 0 开始）。如果 needle 不是 haystack 的一部分，则返回  -1 。
穷举法
时间O((n-m)*m)
空间O(1)
*/
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
	let n = haystack.length
	let m = needle.length
	for(let i = 0; i<=n-m; i++){
		let a = i, b = 0
		while(b<m && haystack[a]==needle[b]){
			a++
			b++
		}
		if (b==m) {return i}
	}
	return -1
};
haystack = "sadbutsad", needle = "sad"
haystack = "a", needle = "a"
console.log('strStr:', strStr(haystack, needle))

/*
242. 有效的字母异位词
给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。

注意：若 s 和 t 中每个字符出现的次数都相同，则称 s 和 t 互为字母异位词。

https://leetcode.cn/problems/valid-anagram/
哈希表
时间复杂度O(n)
空间O(n)
*/
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
	if (s.length!=t.length) {
		return false
	}
	let map = {}
	for(let i = 0; i<s.length; i++){
		map[s[i]] = map[s[i]] || 0
		map[s[i]]++
	}
	for(let i = 0; i<t.length; i++){
		map[t[i]] = map[t[i]] || 0
		map[t[i]]--
		if(map[t[i]]<0){
			return false
		}
	}
	return true
};
s = "anagram", t = "nagaram"
console.log('isAnagram:', isAnagram(s,t))
/*
53. 最大子数组和
https://leetcode.cn/problems/maximum-subarray/

f(i) = max(f(i-1)+nums[i], nums[i])
*/
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
	let pre = 0, maxNum = nums[0]
	for(let i = 0; i<nums.length; i++) {
		pre = Math.max(pre+nums[i], nums[i])
		maxNum = Math.max(maxNum, pre)
	}
	return maxNum
};
nums = [-2,1,-3,4,-1,2,1,-5,4]
console.log('maxSubArray:', maxSubArray(nums))

/*
300. 最长递增子序列
https://leetcode.cn/problems/longest-increasing-subsequence/
给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。

动态规划
时间O(n*n)
空间O(n)
*/
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
	if(nums.length<=0){
		return 0
	}
	let dp = new Array(nums.length)
	dp[0] = 1
	let maxNum = 1
	for(let i = 1; i<nums.length; i++)
	{
		dp[i] = 1
		for(let j = 0; j<i; j++){
			if(nums[j]<nums[i]){
				dp[i] = Math.max(dp[i], dp[j]+1)
			}
		}
		maxNum = Math.max(maxNum, dp[i])
	}
	return 
};
nums = [10,9,2,5,3,7,101,18]
nums = [0]
console.log('lengthOfLIS:', lengthOfLIS(nums))

/*
1143. 最长公共子序列
https://leetcode.cn/problems/longest-common-subsequence/
1143. 最长公共子序列
给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 0 。
一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。

例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列

*/
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function(text1, text2) {
	const m = text1.length, n = text2.length;
    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        const c1 = text1[i - 1];
        for (let j = 1; j <= n; j++) {
            const c2 = text2[j - 1];
            //当两个字符相同时
            if (c1 === c2) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
            	//当前判断的两个字符不同时
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
};
