import http from './http';
import type { Mentor, PageParams, PageResult } from './types';

/**
 * 导师API服务
 */
export default class MentorService {
  /**
   * 获取导师列表
   * @param params 分页参数
   */
  static getMentors(params: PageParams) {
    return http.get<PageResult<Mentor>>('/mentor/list', params);
  }
  
  /**
   * 获取导师详情
   * @param id 导师ID
   */
  static getMentorDetail(id: string) {
    return http.get<Mentor>(`/mentor/${id}`);
  }
  
  /**
   * 根据专业领域筛选导师
   * @param expertise 专业领域
   * @param params 分页参数
   */
  static getMentorsByExpertise(expertise: string, params: PageParams) {
    return http.get<PageResult<Mentor>>('/mentor/expertise', {
      ...params,
      expertise
    });
  }
  
  /**
   * 搜索导师
   * @param keyword 关键词
   * @param params 分页参数
   */
  static searchMentors(keyword: string, params: PageParams) {
    return http.get<PageResult<Mentor>>('/mentor/search', {
      ...params,
      keyword
    });
  }
  
  /**
   * 获取推荐导师
   * @param params 分页参数
   */
  static getRecommendedMentors(params: PageParams) {
    return http.get<PageResult<Mentor>>('/mentor/recommended', params);
  }
  
  /**
   * 根据价格区间筛选导师
   * @param minPrice 最低价格
   * @param maxPrice 最高价格
   * @param params 分页参数
   */
  static getMentorsByPriceRange(minPrice: number, maxPrice: number, params: PageParams) {
    return http.get<PageResult<Mentor>>('/mentor/price', {
      ...params,
      minPrice,
      maxPrice
    });
  }
  
  /**
   * 根据评分筛选导师
   * @param minRating 最低评分
   * @param params 分页参数
   */
  static getMentorsByRating(minRating: number, params: PageParams) {
    return http.get<PageResult<Mentor>>('/mentor/rating', {
      ...params,
      minRating
    });
  }
  
  /**
   * 预约导师
   * @param mentorId 导师ID
   * @param date 预约日期，格式：YYYY-MM-DD
   * @param timeSlot 预约时间段，格式：HH:mm-HH:mm
   * @param topic 咨询主题
   * @param description 咨询描述
   */
  static bookMentor(
    mentorId: string,
    date: string,
    timeSlot: string,
    topic: string,
    description: string
  ) {
    return http.post('/mentor/book', {
      mentorId,
      date,
      timeSlot,
      topic,
      description
    });
  }
  
  /**
   * 获取导师可用时间段
   * @param mentorId 导师ID
   * @param date 日期，格式：YYYY-MM-DD
   */
  static getMentorAvailableTimeSlots(mentorId: string, date: string) {
    return http.get<string[]>(`/mentor/${mentorId}/available-time-slots`, { date });
  }
  
  /**
   * 取消预约
   * @param appointmentId 预约ID
   */
  static cancelAppointment(appointmentId: string) {
    return http.delete<boolean>(`/mentor/appointment/${appointmentId}`);
  }
  
  /**
   * 获取我的预约列表
   * @param params 分页参数
   */
  static getMyAppointments(params: PageParams) {
    return http.get('/mentor/my-appointments', params);
  }
  
  /**
   * 评价导师
   * @param mentorId 导师ID
   * @param appointmentId 预约ID
   * @param rating 评分，1-5
   * @param comment 评价内容
   */
  static rateMentor(mentorId: string, appointmentId: string, rating: number, comment: string) {
    return http.post<boolean>(`/mentor/${mentorId}/rate`, {
      appointmentId,
      rating,
      comment
    });
  }
} 