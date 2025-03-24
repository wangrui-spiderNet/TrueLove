import http from './http';
import type { CareerRecommendation, PageParams, PageResult } from './types';

/**
 * 职业API服务
 */
export default class CareerService {
  /**
   * 获取推荐职业列表
   * @param params 分页参数
   */
  static getRecommendedCareers(params: PageParams) {
    return http.get<PageResult<CareerRecommendation>>('/career/recommended', params);
  }
  
  /**
   * 获取职业详情
   * @param id 职业ID
   */
  static getCareerDetail(id: string) {
    return http.get<CareerRecommendation>(`/career/${id}`);
  }
  
  /**
   * 搜索职业
   * @param keyword 关键词
   * @param params 分页参数
   */
  static searchCareers(keyword: string, params: PageParams) {
    return http.get<PageResult<CareerRecommendation>>('/career/search', {
      ...params,
      keyword
    });
  }
  
  /**
   * 根据价值观匹配职业
   * @param valueIds 价值观维度ID列表
   * @param params 分页参数
   */
  static matchCareersByValues(valueIds: string[], params: PageParams) {
    return http.post<PageResult<CareerRecommendation>>('/career/match/values', {
      valueIds,
      ...params
    });
  }
  
  /**
   * 根据能力匹配职业
   * @param abilityIds 能力维度ID列表
   * @param params 分页参数
   */
  static matchCareersByAbilities(abilityIds: string[], params: PageParams) {
    return http.post<PageResult<CareerRecommendation>>('/career/match/abilities', {
      abilityIds,
      ...params
    });
  }
  
  /**
   * 根据兴趣匹配职业
   * @param interestIds 兴趣维度ID列表
   * @param params 分页参数
   */
  static matchCareersByInterests(interestIds: string[], params: PageParams) {
    return http.post<PageResult<CareerRecommendation>>('/career/match/interests', {
      interestIds,
      ...params
    });
  }
  
  /**
   * 综合匹配职业
   * @param valueIds 价值观维度ID列表
   * @param abilityIds 能力维度ID列表
   * @param interestIds 兴趣维度ID列表
   * @param params 分页参数
   */
  static matchCareers(
    valueIds: string[],
    abilityIds: string[],
    interestIds: string[],
    params: PageParams
  ) {
    return http.post<PageResult<CareerRecommendation>>('/career/match', {
      valueIds,
      abilityIds,
      interestIds,
      ...params
    });
  }
  
  /**
   * 获取职业分类
   */
  static getCareerCategories() {
    return http.get<Array<{id: string; name: string}>>('/career/categories');
  }
  
  /**
   * 根据分类获取职业
   * @param categoryId 分类ID
   * @param params 分页参数
   */
  static getCareersByCategory(categoryId: string, params: PageParams) {
    return http.get<PageResult<CareerRecommendation>>(`/career/category/${categoryId}`, params);
  }
  
  /**
   * 获取热门职业
   * @param params 分页参数
   */
  static getHotCareers(params: PageParams) {
    return http.get<PageResult<CareerRecommendation>>('/career/hot', params);
  }
} 