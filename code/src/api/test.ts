import http from './http';
import type { 
  ValueQuestion, 
  ValueTestResult, 
  AbilityQuestion, 
  AbilityTestResult, 
  InterestQuestion, 
  InterestTestResult,
  AnalysisReport
} from './types';

/**
 * 测试API服务
 */
export default class TestService {
  /**
   * 获取价值观测试问题
   */
  static getValueQuestions() {
    return http.get<ValueQuestion[]>('/test/value/questions');
  }
  
  /**
   * 提交价值观测试答案
   * @param answers 测试答案，键为问题ID，值为选项ID
   */
  static submitValueTest(answers: Record<string, string>) {
    return http.post<ValueTestResult>('/test/value/submit', { answers });
  }
  
  /**
   * 获取价值观测试结果
   * @param resultId 结果ID，不传则获取最新的测试结果
   */
  static getValueTestResult(resultId?: string) {
    return http.get<ValueTestResult>(
      resultId ? `/test/value/result/${resultId}` : '/test/value/result/latest'
    );
  }
  
  /**
   * 获取能力测试问题
   */
  static getAbilityQuestions() {
    return http.get<AbilityQuestion[]>('/test/ability/questions');
  }
  
  /**
   * 提交能力测试答案
   * @param answers 测试答案，键为问题ID，值为选项ID
   */
  static submitAbilityTest(answers: Record<string, string>) {
    return http.post<AbilityTestResult>('/test/ability/submit', { answers });
  }
  
  /**
   * 获取能力测试结果
   * @param resultId 结果ID，不传则获取最新的测试结果
   */
  static getAbilityTestResult(resultId?: string) {
    return http.get<AbilityTestResult>(
      resultId ? `/test/ability/result/${resultId}` : '/test/ability/result/latest'
    );
  }
  
  /**
   * 获取兴趣测试问题
   */
  static getInterestQuestions() {
    return http.get<InterestQuestion[]>('/test/interest/questions');
  }
  
  /**
   * 提交兴趣测试答案
   * @param answers 测试答案，键为问题ID，值为选项ID
   */
  static submitInterestTest(answers: Record<string, string>) {
    return http.post<InterestTestResult>('/test/interest/submit', { answers });
  }
  
  /**
   * 获取兴趣测试结果
   * @param resultId 结果ID，不传则获取最新的测试结果
   */
  static getInterestTestResult(resultId?: string) {
    return http.get<InterestTestResult>(
      resultId ? `/test/interest/result/${resultId}` : '/test/interest/result/latest'
    );
  }
  
  /**
   * 获取综合分析报告
   * @param reportId 报告ID，不传则生成新的报告
   */
  static getAnalysisReport(reportId?: string) {
    return http.get<AnalysisReport>(
      reportId ? `/test/analysis/${reportId}` : '/test/analysis/generate'
    );
  }
  
  /**
   * 获取用户的测试历史
   * @param type 测试类型：value-价值观，ability-能力，interest-兴趣
   */
  static getTestHistory(type: 'value' | 'ability' | 'interest') {
    return http.get(`/test/${type}/history`);
  }
} 