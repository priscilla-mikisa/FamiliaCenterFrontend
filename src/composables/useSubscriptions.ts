// src/composables/useSubscriptions.ts
import { ref, computed } from 'vue';
import { SubscriptionService } from '@/services/apiService';
import type { SubscriptionPlan } from '@/services/apiService';
import type { CurrentSubscription } from '@/services/apiService';

export const useSubscriptions = () => {
  const plans = ref<SubscriptionPlan[]>([]);
  const currentSubscription = ref<CurrentSubscription | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const freePlans = computed(() =>
    plans.value.filter(plan => plan.price === 0)
  );

  const paidPlans = computed(() =>
    plans.value.filter(plan => plan.price > 0)
  );

  const fetchPlans = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await SubscriptionService.getSubscriptionPlans();
      plans.value = response.plans || response.data || response || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch subscription plans';
    } finally {
      loading.value = false;
    }
  };

  const getCurrentSubscription = async () => {
    try {
      const response = await SubscriptionService.getCurrentSubscription();
      currentSubscription.value = response.subscription || response.data || null;
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch current subscription';
      throw err;
    }
  };

  const subscribeToPlan = async (planId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await SubscriptionService.subscribeToPlan(planId);
      currentSubscription.value = response.subscription || response.data;
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to subscribe to plan';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cancelSubscription = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await SubscriptionService.cancelSubscription();
      currentSubscription.value = null;
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to cancel subscription';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const formatPrice = (price: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    plans,
    freePlans,
    paidPlans,
    currentSubscription,
    loading,
    error,
    fetchPlans,
    getCurrentSubscription,
    subscribeToPlan,
    cancelSubscription,
    formatPrice,
    clearError
  };
};
