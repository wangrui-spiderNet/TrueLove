import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 请求配置
const config = {
  // 基础URL，可以根据环境变量配置
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'https://api.truelove.com',
  // 超时时间
  timeout: 10000,
  // 请求头
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
};

// 响应结果接口
interface Result<T = any> {
  code: number;
  message: string;
  data: T;
}

// HTTP请求类
class HttpRequest {
  // axios实例
  private instance: AxiosInstance;
  
  constructor(config: AxiosRequestConfig) {
    // 创建axios实例
    this.instance = axios.create(config);
    
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 添加token
        const token = uni.getStorageSync('token');
        if (token) {
          // 确保headers存在
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
    
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response;
        
        // 处理HTTP状态码
        if (response.status === 200) {
          // 处理业务状态码
          if (data.code === 0 || data.code === 200) {
            return data;
          } else {
            // 处理业务错误
            this.handleBusinessError(data);
            return Promise.reject(data);
          }
        } else {
          // 处理HTTP错误
          this.handleHttpError(response);
          return Promise.reject(response);
        }
      },
      (error: any) => {
        // 处理网络错误
        this.handleNetworkError(error);
        return Promise.reject(error);
      }
    );
  }
  
  // 业务错误处理
  private handleBusinessError(data: Result) {
    switch (data.code) {
      case 401:
        // token过期或未授权
        uni.showToast({
          title: '登录已过期，请重新登录',
          icon: 'none'
        });
        // 清除登录状态
        uni.removeStorageSync('token');
        // 跳转到登录页
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/index'
          });
        }, 1500);
        break;
      default:
        uni.showToast({
          title: data.message || '操作失败',
          icon: 'none'
        });
    }
  }
  
  // HTTP错误处理
  private handleHttpError(response: AxiosResponse) {
    // 根据状态码处理
    const status = response.status;
    let message = '';
    
    switch (status) {
      case 400:
        message = '请求错误';
        break;
      case 401:
        message = '未授权，请重新登录';
        break;
      case 403:
        message = '拒绝访问';
        break;
      case 404:
        message = '请求出错';
        break;
      case 408:
        message = '请求超时';
        break;
      case 500:
        message = '服务器错误';
        break;
      case 501:
        message = '服务未实现';
        break;
      case 502:
        message = '网络错误';
        break;
      case 503:
        message = '服务不可用';
        break;
      case 504:
        message = '网络超时';
        break;
      case 505:
        message = 'HTTP版本不受支持';
        break;
      default:
        message = '请求失败';
    }
    
    uni.showToast({
      title: message,
      icon: 'none'
    });
  }
  
  // 网络错误处理
  private handleNetworkError(error: any) {
    let message = '';
    
    if (error.message.includes('timeout')) {
      message = '请求超时';
    } else if (error.message.includes('Network')) {
      message = '网络异常';
    } else {
      message = '请求失败';
    }
    
    uni.showToast({
      title: message,
      icon: 'none'
    });
  }
  
  // 请求方法封装
  request<T = any>(config: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.request(config);
  }
  
  get<T = any>(url: string, params?: any, config: AxiosRequestConfig = {}): Promise<Result<T>> {
    return this.instance.get(url, { params, ...config });
  }
  
  post<T = any>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<Result<T>> {
    return this.instance.post(url, data, config);
  }
  
  put<T = any>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<Result<T>> {
    return this.instance.put(url, data, config);
  }
  
  delete<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<Result<T>> {
    return this.instance.delete(url, config);
  }
}

// 导出HTTP请求实例
export default new HttpRequest(config); 