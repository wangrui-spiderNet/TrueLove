import http from './http';
import type { CommunityPost, Comment, PageParams, PageResult } from './types';

/**
 * 社区API服务
 */
export default class CommunityService {
  /**
   * 获取社区文章列表
   * @param params 分页参数
   */
  static getPosts(params: PageParams) {
    return http.get<PageResult<CommunityPost>>('/community/posts', params);
  }
  
  /**
   * 获取文章详情
   * @param id 文章ID
   */
  static getPostDetail(id: string) {
    return http.get<CommunityPost>(`/community/post/${id}`);
  }
  
  /**
   * 创建文章
   * @param post 文章信息
   */
  static createPost(post: Pick<CommunityPost, 'title' | 'content' | 'tags'>) {
    return http.post<CommunityPost>('/community/post', post);
  }
  
  /**
   * 更新文章
   * @param id 文章ID
   * @param post 文章信息
   */
  static updatePost(id: string, post: Partial<Pick<CommunityPost, 'title' | 'content' | 'tags'>>) {
    return http.put<boolean>(`/community/post/${id}`, post);
  }
  
  /**
   * 删除文章
   * @param id 文章ID
   */
  static deletePost(id: string) {
    return http.delete<boolean>(`/community/post/${id}`);
  }
  
  /**
   * 点赞文章
   * @param id 文章ID
   */
  static likePost(id: string) {
    return http.post<boolean>(`/community/post/${id}/like`);
  }
  
  /**
   * 取消点赞文章
   * @param id 文章ID
   */
  static unlikePost(id: string) {
    return http.delete<boolean>(`/community/post/${id}/like`);
  }
  
  /**
   * 获取文章评论
   * @param postId 文章ID
   * @param params 分页参数
   */
  static getComments(postId: string, params: PageParams) {
    return http.get<PageResult<Comment>>(`/community/post/${postId}/comments`, params);
  }
  
  /**
   * 创建评论
   * @param postId 文章ID
   * @param content 评论内容
   * @param parentId 父评论ID，用于回复评论
   */
  static createComment(postId: string, content: string, parentId?: string) {
    return http.post<Comment>(`/community/post/${postId}/comment`, {
      content,
      parentId
    });
  }
  
  /**
   * 删除评论
   * @param postId 文章ID
   * @param commentId 评论ID
   */
  static deleteComment(postId: string, commentId: string) {
    return http.delete<boolean>(`/community/post/${postId}/comment/${commentId}`);
  }
  
  /**
   * 点赞评论
   * @param postId 文章ID
   * @param commentId 评论ID
   */
  static likeComment(postId: string, commentId: string) {
    return http.post<boolean>(`/community/post/${postId}/comment/${commentId}/like`);
  }
  
  /**
   * 取消点赞评论
   * @param postId 文章ID
   * @param commentId 评论ID
   */
  static unlikeComment(postId: string, commentId: string) {
    return http.delete<boolean>(`/community/post/${postId}/comment/${commentId}/like`);
  }
  
  /**
   * 搜索文章
   * @param keyword 关键词
   * @param params 分页参数
   */
  static searchPosts(keyword: string, params: PageParams) {
    return http.get<PageResult<CommunityPost>>('/community/posts/search', {
      ...params,
      keyword
    });
  }
  
  /**
   * 获取热门标签
   */
  static getHotTags() {
    return http.get<Array<{name: string; count: number}>>('/community/tags/hot');
  }
  
  /**
   * 根据标签获取文章
   * @param tag 标签
   * @param params 分页参数
   */
  static getPostsByTag(tag: string, params: PageParams) {
    return http.get<PageResult<CommunityPost>>(`/community/posts/tag/${tag}`, params);
  }
} 