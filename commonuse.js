/*
* @Author: haoyanwei
* @Date:   2022-12-04 15:48:22
* @Last Modified by:   haoyanwei
* @Last Modified time: 2022-12-04 20:55:31
* 常用的50道算法题
*/

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