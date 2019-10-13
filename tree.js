/**94
给定一个二叉树，返回它的中序 遍历。

示例:

输入: [1,null,2,3]
   1
    \
     2
    /
   3

输出: [1,3,2]
进阶: 递归算法很简单，你可以通过迭代算法完成吗？

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/binary-tree-inorder-traversal
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

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
var inorderTraversal = function(root) {
    //中序遍历 左，中，右
    let res = [];
    let backTrack = function(root) {
        if(!root) {
            return;
        }
        backTrack(root.left);
        res.push(root.val);
        backTrack(root.right);
    }
    backTrack(root);
    return res;
};
var inorderTraversal2 = function(root) {
    //先序遍历 中，左，右
    let res = [];
    let backTrack = function(root) {
        if(!root) {
            return;
        }
        res.push(root.val);
        backTrack(root.left);
        backTrack(root.right);
    }
    backTrack(root);
    return res;
};

var inorderTraversal3 = function(root) {
    //后序遍历 左，右，中
    let res = [];
    let backTrack = function(root) {
        if(!root) {
            return;
        }
        backTrack(root.left);
        backTrack(root.right);
        res.push(root.val);
    }
    backTrack(root);
    return res;
};
//非递归中序
var inorderTraversal = function(root) {
    //中序遍历 左，中，右
    /**
    其核心思想如下：

    使用颜色标记节点的状态，新节点为白色，已访问的节点为灰色。
    如果遇到的节点为白色，则将其标记为灰色，然后将其右子节点、自身、左子节点依次入栈。
    如果遇到的节点为灰色，则将节点的值输出。
    **/
    let WHITE = 0, GRAY = 1;
    let res = [];
    let stack = [[WHITE, root]];
    while(stack.length>0) {
        let one = stack.pop();
        let state = one[0];
        let node = one[1];
        if(!node) {
            continue;
        }
        if(state == WHITE) {
            stack.push([WHITE, node.right]);
            stack.push([GRAY, node]);
            stack.push([WHITE, node.left]);
        }else {
            res.push(node.val);
        }
    }
    return res;
};


/**95
给定一个整数 n，生成所有由 1 ... n 为节点所组成的二叉搜索树。

示例:

输入: 3
输出:
[
  [1,null,3,2],
  [3,2,null,1],
  [3,1,null,null,2],
  [2,1,3],
  [1,null,2,null,3]
]
解

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/unique-binary-search-trees-ii
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {number} n
 * @return {TreeNode[]}
 */
var generateTrees = function(n) {
    //递归法， 选出一个root
    if(n==0) {
        return [];
    }
    let backTrack = function(start, end) {
        if(start>end) {
            return [null];
        }
        let all_trees = [];
        for(let i = start; i<=end; i++) {
            let left_trees = backTrack(start, i-1);
            let right_trees = backTrack(i+1, end);

            //以i为root构建数
            for(let k = 0; k<left_trees.length; k++) {
                for(let j = 0; j<right_trees.length; j++){
                    let current = new TreeNode(i);
                    current.left = left_trees[k];
                    current.right = right_trees[j];
                    all_trees.push(current);
                }
            }
        }
        return all_trees;
    }
    return backTrack(1, n);
};

/**
 * @param {number} n
 * @return {number}
 */
var numTrees = function(n) {
    let G = [];
    G[0] = 1;
    G[1] = 1;

    for (let i = 2; i <= n; ++i) {
      for (let j = 1; j <= i; ++j) {
        G[i] = G[i] || 0;
        G[i] += G[j - 1] * G[i - j];
      }
    }
    return G[n];
};
// console.log(numTrees(3));




/**97
给定三个字符串 s1, s2, s3, 验证 s3 是否是由 s1 和 s2 交错组成的。

示例 1:

输入: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
输出: true
示例 2:

输入: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
输出: false

 * @param {string} s1
 * @param {string} s2
 * @param {string} s3
 * @return {boolean}
 */
var isInterleave = function(s1, s2, s3) {
    //回溯法
    /**
    p1,p2,p3三个指针，用p1、p2去和p3对比
    **/
    let n1 = s1.length,n2 = s2.length, n3 = s3.length;
    if(n1+n2 != n3) {
        return false;
    }
    let res = false;
    let backTrack = function(p1, p2, p3) {
        if(res) {
            return;
        }
        if(p3 == n3) {
            res = true;
            return;
        }
        if(p1<n1 && s1[p1] == s3[p3]) {
            backTrack(p1+1, p2, p3+1);
        }

        if(p2<n2 && s2[p2] == s3[p3]) {
            backTrack(p1, p2+1, p3+1);
        }

    };
    backTrack(0, 0, 0);
    return res;
};
// console.log(isInterleave('aabcc', 'dbbca', 'aadbbbaccc'));


var createTree = function(array){
    function TreeNode(val) {
        this.val = val;
        this.left = this.right = null;
    }
    /**
    以n为低x的对数
    **/
    function lg(x,n){
        return Math.log(x)/Math.log(n)
    }
    let m = array.length+1;
    let num = Math.ceil(lg(m, 2));

    let root = new TreeNode(array[0]);
    let roots = [root];
    for(let i = 2; i<=num; i++){//每一行
        let before = roots;
        roots = [];
        let sum = Math.pow(2, i-1);
        let start = Math.pow(2, i)-1-sum;
        for(let k = 0; k<sum/2; k++) {
            for(let j = 0; j<2; j++) {//每一个接点
                let idx = start+k*2+j;
                if(idx<=array.length-1){
                    let node = new TreeNode(array[idx]);
                    if(j == 0) {
                        before[k].left = node;
                    }else {
                        before[k].right = node;
                    }
                    roots.push(node);
                }
            }
        }
    }
    return root;
};
/**98
给定一个二叉树，判断其是否是一个有效的二叉搜索树。

假设一个二叉搜索树具有如下特征：

节点的左子树只包含小于当前节点的数。
节点的右子树只包含大于当前节点的数。
所有左子树和右子树自身必须也是二叉搜索树。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/validate-binary-search-tree
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function(root) {
    //回溯法  左边值小于父节点，右边值大于父节点
    let backTrack = function (root, min, max) {
        if(!root || root.val === null) {
            return true;
        }
        let val = root.val;
        if(min!==null && val<=min) {
            return false;
        }
        if(max!==null && val>=max) {
            return false;
        }
        if(!backTrack(root.left, min, val)) {
            return false;
        }

        if(!backTrack(root.right, val, max)) {
            return false;
        }
        return true;
    };
    return backTrack(root, null, null);
};
/**
let root = createTree([2, 1,3]);
console.log(isValidBST(root));
**/

/**99
二叉搜索树中的两个节点被错误地交换。

请在不改变其结构的情况下，恢复这棵树。


 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var recoverTree = function(root) {
    //中序遍历，找到不合法的值
    let pre = null;
    let first = null;
    let secode = null;
    let backTrack = function(node) {
        if(!node||node.val === null) {
            return;
        }
        backTrack(node.left);
        if(pre!=null && pre.val>node.val){
            if(!first) {
                first = pre;
            }
            secode = node;
        }
        pre = node;
        backTrack(node.right);
    };
    backTrack(root);
    let temp = first.val;
    first.val = secode.val;
    secode.val = temp;
};
/**
let root = createTree([3,1,4,null,null,2]);
recoverTree(root);
**/


/**
给定两个二叉树，编写一个函数来检验它们是否相同。

如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。


 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function(p, q) {
    //回溯遍历
    if(!p && !q) return true;
    if(!p ||!q) return false;

    if(p.val != q.val) {
        return false;
    }

    return isSameTree(p.left, q.left)&&isSameTree(p.right, q.right);
};


/**
给定一个二叉树，检查它是否是镜像对称的。

例如，二叉树 [1,2,2,3,4,4,3] 是对称的。


 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
    /**
    如果同时满足下面的条件，两个树互为镜像：

    它们的两个根结点具有相同的值。
    每个树的右子树都与另一个树的左子树镜像对称。
    **/
    let isMirror = function(root1, root2) {
        if(!root1 && !root2) {
            return true;
        }
        if(!root1 || !root2) {
            return false;
        }

        return root1.val == root2.val &&
        isMirror(root1.left, root2.right) &&
        isMirror(root1.right, root2.left);
    }
    return isMirror(root, root);
};
