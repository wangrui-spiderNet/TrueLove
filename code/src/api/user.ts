import http from './http';
import type { UserInfo, LoginParams, LoginResult, RegisterParams, PageParams, PageResult } from './types';

/**
 * 用户API服务
 */
export default class UserService {
  /**
   * 登录
   * @param params 登录参数
   */
  static login(params: LoginParams) {
    return http.post<LoginResult>('/user/login', params);
  }
  
  /**
   * 注册
   * @param params 注册参数
   */
  static register(params: RegisterParams) {
    return http.post<LoginResult>('/user/register', params);
  }
  
  /**
   * 退出登录
   */
  static logout() {
    return http.post<boolean>('/user/logout');
  }
  
  /**
   * 获取用户信息
   */
  static getUserInfo() {
    return http.get<UserInfo>('/user/info');
  }
  
  /**
   * 更新用户信息
   * @param userInfo 用户信息
   */
  static updateUserInfo(userInfo: Partial<UserInfo>) {
    return http.put<boolean>('/user/info', userInfo);
  }
  
  /**
   * 更新用户头像
   * @param file 头像文件
   */
  static updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return http.post<string>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  /**
   * 修改密码
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  static changePassword(oldPassword: string, newPassword: string) {
    return http.put<boolean>('/user/password', {
      oldPassword,
      newPassword
    });
  }
  
  /**
   * 获取用户成长计划
   * @param params 分页参数
   */
  static getUserPlans(params: PageParams) {
    return http.get('/user/plans', params);
  }
  
  /**
   * 获取用户测试历史
   * @param params 分页参数
   */
  static getUserTests(params: PageParams) {
    return http.get('/user/tests', params);
  }
  
  /**
   * 获取用户收藏的职业
   * @param params 分页参数
   */
  static getUserFavoriteCareers(params: PageParams) {
    return http.get('/user/favorite/careers', params);
  }
  
  /**
   * 收藏职业
   * @param careerId 职业ID
   */
  static addFavoriteCareer(careerId: string) {
    return http.post<boolean>('/user/favorite/career', { careerId });
  }
  
  /**
   * 取消收藏职业
   * @param careerId 职业ID
   */
  static removeFavoriteCareer(careerId: string) {
    return http.delete<boolean>(`/user/favorite/career/${careerId}`);
  }
  
  /**
   * 获取用户收藏的文章
   * @param params 分页参数
   */
  static getUserFavoritePosts(params: PageParams) {
    return http.get<PageResult<any>>('/user/favorite/posts', params);
  }
  
  /**
   * 收藏文章
   * @param postId 文章ID
   */
  static addFavoritePost(postId: string) {
    return http.post<boolean>('/user/favorite/post', { postId });
  }
  
  /**
   * 取消收藏文章
   * @param postId 文章ID
   */
  static removeFavoritePost(postId: string) {
    return http.delete<boolean>(`/user/favorite/post/${postId}`);
  }
} 