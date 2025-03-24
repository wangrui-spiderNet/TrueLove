import http from './http';
import type { GrowthPlan, GrowthPlanStep, PageParams, PageResult } from './types';

/**
 * 成长计划API服务
 */
export default class PlanService {
  /**
   * 获取成长计划列表
   * @param params 分页参数
   */
  static getPlans(params: PageParams) {
    return http.get<PageResult<GrowthPlan>>('/plan/list', params);
  }
  
  /**
   * 获取成长计划详情
   * @param id 计划ID
   */
  static getPlanDetail(id: string) {
    return http.get<GrowthPlan>(`/plan/${id}`);
  }
  
  /**
   * 创建成长计划
   * @param plan 计划信息
   */
  static createPlan(plan: Omit<GrowthPlan, 'id' | 'userId' | 'createTime' | 'progress'>) {
    return http.post<GrowthPlan>('/plan/create', plan);
  }
  
  /**
   * 更新成长计划
   * @param id 计划ID
   * @param plan 计划信息
   */
  static updatePlan(id: string, plan: Partial<GrowthPlan>) {
    return http.put<boolean>(`/plan/${id}`, plan);
  }
  
  /**
   * 删除成长计划
   * @param id 计划ID
   */
  static deletePlan(id: string) {
    return http.delete<boolean>(`/plan/${id}`);
  }
  
  /**
   * 更新计划步骤状态
   * @param planId 计划ID
   * @param stepId 步骤ID
   * @param status 状态
   */
  static updateStepStatus(planId: string, stepId: string, status: GrowthPlanStep['status']) {
    return http.put<boolean>(`/plan/${planId}/step/${stepId}/status`, { status });
  }
  
  /**
   * 添加计划步骤
   * @param planId 计划ID
   * @param step 步骤信息
   */
  static addPlanStep(planId: string, step: Omit<GrowthPlanStep, 'id'>) {
    return http.post<GrowthPlanStep>(`/plan/${planId}/step`, step);
  }
  
  /**
   * 更新计划步骤
   * @param planId 计划ID
   * @param stepId 步骤ID
   * @param step 步骤信息
   */
  static updatePlanStep(planId: string, stepId: string, step: Partial<GrowthPlanStep>) {
    return http.put<boolean>(`/plan/${planId}/step/${stepId}`, step);
  }
  
  /**
   * 删除计划步骤
   * @param planId 计划ID
   * @param stepId 步骤ID
   */
  static deletePlanStep(planId: string, stepId: string) {
    return http.delete<boolean>(`/plan/${planId}/step/${stepId}`);
  }
  
  /**
   * 根据职业推荐计划模板
   * @param careerId 职业ID
   */
  static recommendPlanTemplate(careerId: string) {
    return http.get<GrowthPlan>(`/plan/template/recommend/${careerId}`);
  }
  
  /**
   * 获取计划模板列表
   * @param params 分页参数
   */
  static getPlanTemplates(params: PageParams) {
    return http.get<PageResult<GrowthPlan>>('/plan/templates', params);
  }
  
  /**
   * 从模板创建计划
   * @param templateId 模板ID
   */
  static createPlanFromTemplate(templateId: string) {
    return http.post<GrowthPlan>('/plan/create/template', { templateId });
  }
} 