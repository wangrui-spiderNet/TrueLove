<template>
  <view class="test-page">
    <!-- 进度条 -->
    <view class="test-progress">
      <tl-progress 
        :percentage="progressPercentage" 
        :type="progressType" 
        :format="progressFormat"
      ></tl-progress>
    </view>
    
    <!-- 问题部分 -->
    <view v-if="!testCompleted" class="test-content">
      <test-question
        v-if="currentQuestion"
        :question="currentQuestion"
        :index="currentIndex"
        v-model="selectedOptions[currentQuestion.id]"
        @change="handleOptionChange"
      ></test-question>
      
      <!-- 导航按钮 -->
      <view class="test-actions">
        <tl-button 
          v-if="currentIndex > 0" 
          type="default" 
          size="medium"
          @click="handlePrevQuestion"
        >
          上一题
        </tl-button>
        
        <tl-button 
          :type="isLastQuestion ? 'success' : 'primary'" 
          size="medium"
          :disabled="!selectedOptions[currentQuestion?.id]"
          @click="handleNextQuestion"
        >
          {{ isLastQuestion ? '完成测试' : '下一题' }}
        </tl-button>
      </view>
    </view>
    
    <!-- 加载中状态 -->
    <view v-else-if="isLoading" class="test-loading">
      <view class="test-loading__icon"></view>
      <text class="test-loading__text">正在计算结果...</text>
    </view>
    
    <!-- 结果部分 -->
    <view v-else class="test-result">
      <result-card
        :title="testInfo.title + '结果'"
        :items="testResult.items"
        :analysis="testResult.analysis"
        :date="testResult.date"
        :show-analysis="true"
        :show-date="true"
        :show-detail-btn="true"
      ></result-card>
      
      <view class="test-result-actions">
        <tl-button 
          type="primary" 
          size="medium"
          @click="handleViewCareers"
        >
          查看匹配职业
        </tl-button>
        
        <tl-button 
          type="success" 
          size="medium"
          @click="handleBack"
        >
          返回首页
        </tl-button>
      </view>
      
      <!-- 职业匹配列表 -->
      <view v-if="matchedCareers.length > 0" class="test-matched-careers">
        <view class="test-matched-careers__title">匹配职业推荐</view>
        
        <view class="test-matched-careers__list">
          <view 
            v-for="career in matchedCareers" 
            :key="career.id"
            class="test-matched-careers__item"
            @tap="handleCareerDetail(career.id)"
          >
            <tl-card shadow="hover" class="test-career-card">
              <view class="test-career-card__header">
                <image class="test-career-card__icon" :src="career.icon" mode="aspectFit"></image>
                <text class="test-career-card__title">{{ career.title }}</text>
                <view class="test-career-card__match">
                  <text class="test-career-card__match-value">{{ career.matchRate }}%</text>
                </view>
              </view>
              
              <view class="test-career-card__desc">{{ career.description }}</view>
              
              <text class="test-career-card__more">点击查看详情 &gt;</text>
            </tl-card>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import TlProgress from '../../components/TlProgress.vue';
import TlButton from '../../components/TlButton.vue';
import TlCard from '../../components/TlCard.vue';
import TestQuestion from '../../components/business/TestQuestion.vue';
import ResultCard from '../../components/business/ResultCard.vue';
import { TestService, CareerService } from '../../api';

// 页面参数
const testId = ref('');

// 测试信息
const testInfo = reactive({
  id: '',
  title: '',
  description: '',
  questionCount: 0
});

// 测试题目
const questions = ref<any[]>([]);

// 当前问题索引
const currentIndex = ref(0);

// 是否已完成测试
const testCompleted = ref(false);

// 是否正在加载结果
const isLoading = ref(false);

// 已选答案
const selectedOptions = reactive<Record<string, string>>({});

// 测试结果
const testResult = reactive<any>({
  items: [],
  analysis: '',
  date: new Date()
});

// 匹配的职业
const matchedCareers = ref<any[]>([]);

// 当前问题
const currentQuestion = computed(() => {
  if (questions.value.length === 0) return null;
  return questions.value[currentIndex.value];
});

// 是否是最后一题
const isLastQuestion = computed(() => {
  return currentIndex.value === questions.value.length - 1;
});

// 进度百分比
const progressPercentage = computed(() => {
  if (questions.value.length === 0) return 0;
  return Math.round(((currentIndex.value + 1) / questions.value.length) * 100);
});

// 进度条类型
const progressType = computed(() => {
  if (progressPercentage.value < 30) return 'primary';
  if (progressPercentage.value < 70) return 'warning';
  return 'success';
});

// 进度文本格式化
const progressFormat = (percentage: number) => {
  if (questions.value.length === 0) return '';
  return `${currentIndex.value + 1}/${questions.value.length}`;
};

// 初始化
const init = async () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  // @ts-ignore
  const options = currentPage.$page?.options;
  
  if (options && options.id) {
    testId.value = options.id;
    await loadTestInfo();
    await loadQuestions();
  } else {
    uni.showToast({
      title: '缺少测试ID',
      icon: 'none'
    });
    uni.navigateBack();
  }
};

// 加载测试信息
const loadTestInfo = async () => {
  try {
    const result = await TestService.getTestInfo(testId.value);
    Object.assign(testInfo, result.data);
  } catch (error) {
    console.error('获取测试信息失败', error);
    uni.showToast({
      title: '获取测试信息失败',
      icon: 'none'
    });
  }
};

// 加载问题
const loadQuestions = async () => {
  try {
    const result = await TestService.getTestQuestions(testId.value);
    questions.value = result.data;
  } catch (error) {
    console.error('获取测试题目失败', error);
    uni.showToast({
      title: '获取测试题目失败',
      icon: 'none'
    });
  }
};

// 处理选项变更
const handleOptionChange = (data: any) => {
  selectedOptions[data.questionId] = data.optionId;
};

// 处理上一题
const handlePrevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

// 处理下一题
const handleNextQuestion = async () => {
  if (!selectedOptions[currentQuestion.value.id]) {
    uni.showToast({
      title: '请选择一个选项',
      icon: 'none'
    });
    return;
  }
  
  if (isLastQuestion.value) {
    await completeTest();
  } else {
    currentIndex.value++;
  }
};

// 完成测试
const completeTest = async () => {
  isLoading.value = true;
  testCompleted.value = true;
  
  try {
    // 收集所有的答案
    const answers = Object.keys(selectedOptions).map(questionId => ({
      questionId,
      optionId: selectedOptions[questionId]
    }));
    
    // 提交测试结果
    const result = await TestService.submitTestResult(testId.value, answers);
    
    // 更新测试结果
    Object.assign(testResult, result.data);
    
    // 加载匹配的职业
    await loadMatchedCareers();
  } catch (error) {
    console.error('提交测试结果失败', error);
    uni.showToast({
      title: '提交测试结果失败',
      icon: 'none'
    });
  } finally {
    isLoading.value = false;
  }
};

// 加载匹配的职业
const loadMatchedCareers = async () => {
  try {
    const result = await CareerService.getMatchedCareers(testId.value);
    matchedCareers.value = result.data;
  } catch (error) {
    console.error('获取匹配职业失败', error);
  }
};

// 处理查看职业详情
const handleCareerDetail = (careerId: string) => {
  uni.navigateTo({
    url: `/pages/career/detail?id=${careerId}`
  });
};

// 处理查看匹配职业
const handleViewCareers = () => {
  uni.navigateTo({
    url: `/pages/career/match?testId=${testId.value}`
  });
};

// 处理返回首页
const handleBack = () => {
  uni.switchTab({
    url: '/pages/home/index'
  });
};

onMounted(() => {
  init();
});
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.test-page {
  min-height: 100vh;
  padding: 40rpx 30rpx;
  background-color: $bg-color-page;
}

.test-progress {
  margin-bottom: 40rpx;
}

.test-content {
  margin-bottom: 60rpx;
}

.test-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 60rpx;
}

.test-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  
  &__icon {
    width: 80rpx;
    height: 80rpx;
    border: 6rpx solid $primary-color;
    border-top-color: transparent;
    border-radius: 50%;
    margin-bottom: 30rpx;
    animation: loading 1s linear infinite;
  }
  
  &__text {
    font-size: $font-size-medium;
    color: $text-color-regular;
  }
}

.test-result {
  padding: 20rpx 0;
}

.test-result-actions {
  display: flex;
  justify-content: space-between;
  margin: 40rpx 0 60rpx;
}

.test-matched-careers {
  margin-top: 60rpx;
  
  &__title {
    font-size: $font-size-large;
    font-weight: 500;
    color: $text-color-primary;
    margin-bottom: 30rpx;
  }
  
  &__list {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
  }
}

.test-career-card {
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  &__icon {
    width: 60rpx;
    height: 60rpx;
    margin-right: 16rpx;
  }
  
  &__title {
    flex: 1;
    font-size: $font-size-medium;
    font-weight: 500;
    color: $text-color-primary;
  }
  
  &__match {
    padding: 6rpx 12rpx;
    background-color: rgba($primary-color, 0.1);
    border-radius: $border-radius-small;
  }
  
  &__match-value {
    font-size: $font-size-small;
    font-weight: bold;
    color: $primary-color;
  }
  
  &__desc {
    font-size: $font-size-small;
    color: $text-color-regular;
    margin-bottom: 20rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  
  &__more {
    display: block;
    text-align: right;
    font-size: $font-size-small;
    color: $primary-color;
  }
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 