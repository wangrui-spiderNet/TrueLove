// 用户相关类型定义
export interface UserInfo {
  id: string;
  username: string;
  avatar: string;
  gender: 0 | 1; // 0-女性 1-男性
  age: number;
  email?: string;
  phone?: string;
  bio?: string; // 个人简介
  occupation?: string; // 职业
  education?: string; // 教育背景
  createTime: string;
  lastLoginTime: string;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResult {
  token: string;
  userInfo: UserInfo;
}

// 注册请求参数
export interface RegisterParams {
  username: string;
  password: string;
  confirmPassword: string;
  gender: 0 | 1;
  age: number;
  email?: string;
  phone?: string;
}

// 价值观测试相关类型
export interface ValueQuestion {
  id: string;
  title: string;
  options: ValueQuestionOption[];
}

export interface ValueQuestionOption {
  id: string;
  content: string;
  score: number;
}

export interface ValueTestResult {
  id: string;
  userId: string;
  createTime: string;
  scores: {
    [key: string]: number;
  };
  topValues: ValueDimension[];
  analysis: string;
}

export interface ValueDimension {
  id: string;
  name: string;
  description: string;
  score: number;
}

// 能力测试相关类型
export interface AbilityQuestion {
  id: string;
  title: string;
  options: AbilityQuestionOption[];
}

export interface AbilityQuestionOption {
  id: string;
  content: string;
  score: number;
}

export interface AbilityTestResult {
  id: string;
  userId: string;
  createTime: string;
  scores: {
    [key: string]: number;
  };
  topAbilities: AbilityDimension[];
  analysis: string;
}

export interface AbilityDimension {
  id: string;
  name: string;
  description: string;
  score: number;
}

// 兴趣测试相关类型
export interface InterestQuestion {
  id: string;
  title: string;
  options: InterestQuestionOption[];
}

export interface InterestQuestionOption {
  id: string;
  content: string;
  score: number;
}

export interface InterestTestResult {
  id: string;
  userId: string;
  createTime: string;
  scores: {
    [key: string]: number;
  };
  topInterests: InterestDimension[];
  analysis: string;
}

export interface InterestDimension {
  id: string;
  name: string;
  description: string;
  score: number;
}

// 综合分析报告类型
export interface AnalysisReport {
  id: string;
  userId: string;
  createTime: string;
  valueResult: ValueTestResult;
  abilityResult: AbilityTestResult;
  interestResult: InterestTestResult;
  combinedAnalysis: string;
  careerRecommendations: CareerRecommendation[];
}

// 职业推荐类型
export interface CareerRecommendation {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  requiredAbilities: AbilityDimension[];
  alignedValues: ValueDimension[];
  relatedInterests: InterestDimension[];
  outlook: string; // 就业前景
  salary: {
    min: number;
    max: number;
    unit: string;
  };
  educationRequired: string;
}

// 成长计划类型
export interface GrowthPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  createTime: string;
  targetCareer: string;
  steps: GrowthPlanStep[];
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // 0-100的百分比
}

export interface GrowthPlanStep {
  id: string;
  title: string;
  description: string;
  duration: string; // 例如：'2周', '3个月'
  resources: Resource[];
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface Resource {
  id: string;
  type: 'book' | 'course' | 'website' | 'app' | 'other';
  title: string;
  link?: string;
  description?: string;
}

// 导师相关类型
export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string; // 职位头衔
  company: string;
  bio: string; // 个人简介
  expertise: string[];
  experience: string;
  rating: number; // 评分，1-5
  reviewCount: number; // 评价数量
  price: {
    value: number;
    unit: string;
  };
  availability: boolean; // 是否可预约
}

// 社区相关类型
export interface CommunityPost {
  id: string;
  userId: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  title: string;
  content: string;
  createTime: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  content: string;
  createTime: string;
  likes: number;
  replies?: Comment[];
}

// 分页请求参数
export interface PageParams {
  page: number;
  size: number;
}

// 分页响应结果
export interface PageResult<T> {
  records: T[];
  total: number;
  pages: number;
  current: number;
  size: number;
} 