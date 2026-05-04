const mongoose = require('mongoose');
const Problem = require('./src/models/Problem');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const sampleProblems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'easy',
    correctPattern: 'twoPointers',
    wrongPatternExplanations: {
      slidingWindow: 'Sliding window is used for contiguous subarray problems, not for finding pairs that sum to a target.',
      binarySearch: 'Binary search requires a sorted array and is used for finding elements, not pairs.',
      dynamicProgramming: 'DP is used for optimization problems with overlapping subproblems, not for simple pair finding.',
    },
    tags: ['array', 'hash-table'],
    companyFrequency: 95,
    timeLimit: 45,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
    ],
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'medium',
    correctPattern: 'slidingWindow',
    wrongPatternExplanations: {
      twoPointers: 'Two pointers alone won\'t track character occurrences efficiently.',
      binarySearch: 'Binary search is not applicable here as we\'re not searching in a sorted structure.',
      dynamicProgramming: 'While possible, DP would be overkill for this problem.',
    },
    tags: ['string', 'hash-table'],
    companyFrequency: 90,
    timeLimit: 60,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
  },
  {
    title: 'Search in Rotated Sorted Array',
    description: 'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given the array nums after the rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
    difficulty: 'medium',
    correctPattern: 'binarySearch',
    wrongPatternExplanations: {
      slidingWindow: 'Sliding window is for contiguous subarray problems, not searching in rotated arrays.',
      twoPointers: 'Two pointers won\'t efficiently handle the rotation aspect.',
      dynamicProgramming: 'DP is not needed for this search problem.',
    },
    tags: ['array', 'binary-search'],
    companyFrequency: 85,
    timeLimit: 60,
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
      },
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 3',
        output: '-1',
      },
    ],
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.',
    ],
  },
  {
    title: 'Climbing Stairs',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    difficulty: 'easy',
    correctPattern: 'dynamicProgramming',
    wrongPatternExplanations: {
      slidingWindow: 'This is not a contiguous subarray problem.',
      twoPointers: 'Two pointers won\'t capture the recursive nature of this problem.',
      binarySearch: 'Binary search is not applicable here.',
    },
    tags: ['math', 'dynamic-programming'],
    companyFrequency: 80,
    timeLimit: 45,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top: 1 step + 1 step or 2 steps.',
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways to climb to the top: 1 + 1 + 1, 1 + 2, or 2 + 1.',
      },
    ],
    constraints: [
      '1 <= n <= 45',
    ],
  },
  {
    title: 'Jump Game',
    description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
    difficulty: 'medium',
    correctPattern: 'greedy',
    wrongPatternExplanations: {
      dynamicProgramming: 'While DP works, greedy is more efficient for this problem.',
      slidingWindow: 'This is not a sliding window problem.',
      twoPointers: 'Two pointers won\'t capture the jump optimization.',
    },
    tags: ['array', 'greedy'],
    companyFrequency: 75,
    timeLimit: 60,
    examples: [
      {
        input: 'nums = [2,3,1,1,4]',
        output: 'true',
        explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.',
      },
      {
        input: 'nums = [3,2,1,0,4]',
        output: 'false',
        explanation: 'You cannot reach the last index.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '0 <= nums[i] <= 10^5',
    ],
  },
  {
    title: 'Subsets',
    description: 'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.',
    difficulty: 'medium',
    correctPattern: 'backtracking',
    wrongPatternExplanations: {
      slidingWindow: 'This is not a contiguous subarray problem.',
      twoPointers: 'Two pointers won\'t generate all subsets.',
      dynamicProgramming: 'While possible, backtracking is more intuitive for this problem.',
    },
    tags: ['array', 'backtracking'],
    companyFrequency: 70,
    timeLimit: 60,
    examples: [
      {
        input: 'nums = [1,2,3]',
        output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10',
      '-10 <= nums[i] <= 10',
      'All the numbers of nums are unique.',
    ],
  },
  {
    title: 'Number of Islands',
    description: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    difficulty: 'medium',
    correctPattern: 'dfs',
    wrongPatternExplanations: {
      slidingWindow: 'This is not a sliding window problem.',
      twoPointers: 'Two pointers won\'t traverse the 2D grid properly.',
      binarySearch: 'Binary search is not applicable for grid traversal.',
    },
    tags: ['array', 'depth-first-search', 'breadth-first-search'],
    companyFrequency: 85,
    timeLimit: 60,
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1',
      },
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.',
    ],
  },
  {
    title: 'Binary Tree Level Order Traversal',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    difficulty: 'medium',
    correctPattern: 'bfs',
    wrongPatternExplanations: {
      dfs: 'DFS would require additional logic to track levels.',
      slidingWindow: 'This is not a sliding window problem.',
      twoPointers: 'Two pointers won\'t handle tree level traversal.',
    },
    tags: ['tree', 'breadth-first-search'],
    companyFrequency: 75,
    timeLimit: 60,
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '[[3],[9,20],[15,7]]',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 2000].',
      '-1000 <= Node.val <= 1000',
    ],
  },
  {
    title: 'Kth Largest Element in an Array',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.',
    difficulty: 'medium',
    correctPattern: 'heap',
    wrongPatternExplanations: {
      slidingWindow: 'This is not a sliding window problem.',
      twoPointers: 'Two pointers won\'t efficiently find the kth largest.',
      binarySearch: 'Binary search requires a sorted array.',
    },
    tags: ['array', 'heap', 'priority-queue'],
    companyFrequency: 80,
    timeLimit: 60,
    examples: [
      {
        input: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5',
      },
      {
        input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4',
        output: '4',
      },
    ],
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
  },
  {
    title: 'Number of Provinces',
    description: 'There are n cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c. A province is a group of directly or indirectly connected cities and no other cities outside of the group. You are given an n x n matrix isConnected where isConnected[i][j] = 1 if the ith city and the jth city are directly connected, and isConnected[i][j] = 0 otherwise. Return the total number of provinces.',
    difficulty: 'medium',
    correctPattern: 'unionFind',
    wrongPatternExplanations: {
      dfs: 'While DFS works, Union Find is more efficient for this connectivity problem.',
      bfs: 'BFS would work but is less efficient than Union Find.',
      slidingWindow: 'This is not a sliding window problem.',
    },
    tags: ['depth-first-search', 'breadth-first-search', 'union-find'],
    companyFrequency: 65,
    timeLimit: 60,
    examples: [
      {
        input: 'isConnected = [[1,1,0],[1,1,0],[0,0,1]]',
        output: '2',
      },
    ],
    constraints: [
      '1 <= n <= 200',
      'n == isConnected.length',
      'n == isConnected[i].length',
      'isConnected[i][j] is 1 or 0.',
      'isConnected[i][i] == 1',
    ],
  },
  {
    title: 'Subarray Sum Equals K',
    description: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.',
    difficulty: 'medium',
    correctPattern: 'prefixSum',
    wrongPatternExplanations: {
      slidingWindow: 'Sliding window only works for positive numbers, not when negatives are present.',
      twoPointers: 'Two pointers won\'t handle the sum tracking efficiently.',
      dynamicProgramming: 'DP is overkill for this problem.',
    },
    tags: ['array', 'hash-table', 'prefix-sum'],
    companyFrequency: 75,
    timeLimit: 60,
    examples: [
      {
        input: 'nums = [1,1,1], k = 2',
        output: '2',
      },
      {
        input: 'nums = [1,2,3], k = 3',
        output: '2',
      },
    ],
    constraints: [
      '1 <= nums.length <= 2 * 10^4',
      '-1000 <= nums[i] <= 1000',
      '-10^7 <= k <= 10^7',
    ],
  },
  {
    title: 'Permutations',
    description: 'Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.',
    difficulty: 'medium',
    correctPattern: 'recursion',
    wrongPatternExplanations: {
      slidingWindow: 'This is not a sliding window problem.',
      twoPointers: 'Two pointers won\'t generate all permutations.',
      dynamicProgramming: 'DP is not the most efficient approach for this problem.',
    },
    tags: ['array', 'backtracking'],
    companyFrequency: 70,
    timeLimit: 60,
    examples: [
      {
        input: 'nums = [1,2,3]',
        output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
      },
    ],
    constraints: [
      '1 <= nums.length <= 6',
      '-10 <= nums[i] <= 10',
      'All the integers of nums are unique.',
    ],
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-pattern-tutor');
    console.log('Connected to MongoDB');

    // Clear existing problems
    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    // Insert sample problems
    const insertedProblems = await Problem.insertMany(sampleProblems);
    console.log(`Inserted ${insertedProblems.length} problems`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@dsatutor.com' });
    if (!adminExists) {
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@dsatutor.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Created admin user: admin@dsatutor.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
