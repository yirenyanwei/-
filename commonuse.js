/*
* @Author: haoyanwei
* @Date:   2022-12-04 15:48:22
* @Last Modified by:   haoyanwei
* @Last Modified time: 2022-12-06 20:51:24
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
console.log('climbStairs:', climbStairs(2))

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
		next = curr.next
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