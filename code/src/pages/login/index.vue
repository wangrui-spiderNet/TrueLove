<template>
  <view class="login-page">
    <view class="login-header">
      <image class="login-logo" src="../../assets/images/logo.png" mode="aspectFit"></image>
      <text class="login-title">True Love</text>
      <text class="login-subtitle">找到你真正热爱的事业</text>
    </view>
    
    <view class="login-form">
      <view class="login-tabs">
        <view 
          class="login-tab" 
          :class="{ 'login-tab--active': activeTab === 'login' }"
          @tap="activeTab = 'login'"
        >
          登录
        </view>
        <view 
          class="login-tab" 
          :class="{ 'login-tab--active': activeTab === 'register' }"
          @tap="activeTab = 'register'"
        >
          注册
        </view>
      </view>
      
      <!-- 登录表单 -->
      <view v-if="activeTab === 'login'" class="login-form-content">
        <view class="login-form-item">
          <tl-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefixIcon="icon-user"
            clearable
            :error="loginErrors.username !== ''"
            :errorMsg="loginErrors.username"
          ></tl-input>
        </view>
        
        <view class="login-form-item">
          <tl-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefixIcon="icon-lock"
            clearable
            :error="loginErrors.password !== ''"
            :errorMsg="loginErrors.password"
          ></tl-input>
        </view>
        
        <view class="login-form-item login-form-forgot">
          <text @tap="handleForgotPassword">忘记密码?</text>
        </view>
        
        <view class="login-form-submit">
          <tl-button 
            type="primary" 
            size="large" 
            :loading="loginLoading"
            @click="handleLogin"
          >
            登录
          </tl-button>
        </view>
      </view>
      
      <!-- 注册表单 -->
      <view v-else class="login-form-content">
        <view class="login-form-item">
          <tl-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            prefixIcon="icon-user"
            clearable
            :error="registerErrors.username !== ''"
            :errorMsg="registerErrors.username"
          ></tl-input>
        </view>
        
        <view class="login-form-item">
          <tl-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            prefixIcon="icon-lock"
            clearable
            :error="registerErrors.password !== ''"
            :errorMsg="registerErrors.password"
          ></tl-input>
        </view>
        
        <view class="login-form-item">
          <tl-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            prefixIcon="icon-lock"
            clearable
            :error="registerErrors.confirmPassword !== ''"
            :errorMsg="registerErrors.confirmPassword"
          ></tl-input>
        </view>
        
        <view class="register-form-gender">
          <view class="register-form-label">性别</view>
          <tl-radio-group v-model="registerForm.gender">
            <tl-radio :value="1" label="男"></tl-radio>
            <tl-radio :value="0" label="女"></tl-radio>
          </tl-radio-group>
        </view>
        
        <view class="login-form-item">
          <tl-input
            v-model="registerForm.age"
            type="number"
            placeholder="请输入年龄"
            prefixIcon="icon-calendar"
            clearable
            :error="registerErrors.age !== ''"
            :errorMsg="registerErrors.age"
          ></tl-input>
        </view>
        
        <view class="login-form-submit">
          <tl-button 
            type="primary" 
            size="large" 
            :loading="registerLoading"
            @click="handleRegister"
          >
            注册
          </tl-button>
        </view>
      </view>
    </view>
    
    <view class="login-footer">
      <text class="login-agreement">登录/注册即表示您同意</text>
      <text class="login-agreement-link" @tap="handleShowAgreement">用户协议</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { UserService } from '../../api';
import TlInput from '../../components/TlInput.vue';
import TlButton from '../../components/TlButton.vue';
import TlRadio from '../../components/TlRadio.vue';
import TlRadioGroup from '../../components/TlRadioGroup.vue';

// 当前激活的标签
const activeTab = ref<'login' | 'register'>('login');

// 登录表单
const loginForm = reactive({
  username: '',
  password: ''
});

// 注册表单
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  gender: 1, // 默认男性
  age: ''
});

// 登录表单错误信息
const loginErrors = reactive({
  username: '',
  password: ''
});

// 注册表单错误信息
const registerErrors = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  age: ''
});

// 加载状态
const loginLoading = ref(false);
const registerLoading = ref(false);

// 验证登录表单
const validateLoginForm = (): boolean => {
  let isValid = true;
  
  // 重置错误信息
  loginErrors.username = '';
  loginErrors.password = '';
  
  if (!loginForm.username) {
    loginErrors.username = '请输入用户名';
    isValid = false;
  }
  
  if (!loginForm.password) {
    loginErrors.password = '请输入密码';
    isValid = false;
  }
  
  return isValid;
};

// 验证注册表单
const validateRegisterForm = (): boolean => {
  let isValid = true;
  
  // 重置错误信息
  registerErrors.username = '';
  registerErrors.password = '';
  registerErrors.confirmPassword = '';
  registerErrors.age = '';
  
  if (!registerForm.username) {
    registerErrors.username = '请输入用户名';
    isValid = false;
  }
  
  if (!registerForm.password) {
    registerErrors.password = '请输入密码';
    isValid = false;
  } else if (registerForm.password.length < 6) {
    registerErrors.password = '密码长度不能少于6位';
    isValid = false;
  }
  
  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = '请确认密码';
    isValid = false;
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }
  
  if (!registerForm.age) {
    registerErrors.age = '请输入年龄';
    isValid = false;
  } else {
    const age = parseInt(registerForm.age);
    if (isNaN(age) || age <= 0 || age > 120) {
      registerErrors.age = '请输入有效的年龄';
      isValid = false;
    }
  }
  
  return isValid;
};

// 处理登录
const handleLogin = async () => {
  if (!validateLoginForm()) return;
  
  loginLoading.value = true;
  
  try {
    const result = await UserService.login({
      username: loginForm.username,
      password: loginForm.password
    });
    
    // 保存token和用户信息
    uni.setStorageSync('token', result.data.token);
    uni.setStorageSync('userInfo', JSON.stringify(result.data.userInfo));
    
    // 跳转到首页
    uni.switchTab({
      url: '/pages/home/index'
    });
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    });
  } catch (error) {
    console.error('登录失败', error);
  } finally {
    loginLoading.value = false;
  }
};

// 处理注册
const handleRegister = async () => {
  if (!validateRegisterForm()) return;
  
  registerLoading.value = true;
  
  try {
    const result = await UserService.register({
      username: registerForm.username,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
      gender: registerForm.gender,
      age: parseInt(registerForm.age)
    });
    
    // 保存token和用户信息
    uni.setStorageSync('token', result.data.token);
    uni.setStorageSync('userInfo', JSON.stringify(result.data.userInfo));
    
    // 跳转到首页
    uni.switchTab({
      url: '/pages/home/index'
    });
    
    uni.showToast({
      title: '注册成功',
      icon: 'success'
    });
  } catch (error) {
    console.error('注册失败', error);
  } finally {
    registerLoading.value = false;
  }
};

// 处理忘记密码
const handleForgotPassword = () => {
  uni.showToast({
    title: '暂未开放，请联系客服',
    icon: 'none'
  });
};

// 处理查看用户协议
const handleShowAgreement = () => {
  uni.navigateTo({
    url: '/pages/agreement/index'
  });
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 60rpx 40rpx;
  background-color: $bg-color-page;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.login-logo {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 30rpx;
}

.login-title {
  font-size: $font-size-xxlarge;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: 16rpx;
}

.login-subtitle {
  font-size: $font-size-medium;
  color: $text-color-secondary;
}

.login-form {
  background-color: #fff;
  border-radius: $border-radius-large;
  box-shadow: $shadow-base;
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.login-tabs {
  display: flex;
  border-bottom: 2rpx solid $border-color;
  margin-bottom: 40rpx;
}

.login-tab {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: $font-size-medium;
  color: $text-color-regular;
  position: relative;
  transition: all 0.3s;
  
  &--active {
    color: $primary-color;
    font-weight: 500;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 4rpx;
      background-color: $primary-color;
      border-radius: 2rpx;
    }
  }
}

.login-form-content {
  padding: 20rpx 0;
}

.login-form-item {
  margin-bottom: 30rpx;
}

.login-form-forgot {
  text-align: right;
  font-size: $font-size-small;
  color: $primary-color;
}

.login-form-submit {
  margin-top: 60rpx;
}

.register-form-gender {
  margin-bottom: 30rpx;
}

.register-form-label {
  font-size: $font-size-medium;
  color: $text-color-primary;
  margin-bottom: 20rpx;
}

.login-footer {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 40rpx;
  font-size: $font-size-small;
}

.login-agreement {
  color: $text-color-secondary;
}

.login-agreement-link {
  color: $primary-color;
  margin-left: 6rpx;
}
</style> 