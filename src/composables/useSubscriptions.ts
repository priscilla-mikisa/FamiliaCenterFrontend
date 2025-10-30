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
      const rawPlans = response.plans || response.data || response || [];
      
      // Normalize plans: convert backend ID (capitalized) to frontend id (lowercase)
      plans.value = rawPlans.map((plan: any) => {
        // Convert price from cents to dollars if price > 100 (assuming backend sends in cents)
        const normalizedPrice = plan.price > 100 ? plan.price / 100 : plan.price;
        
        return {
          ...plan,
          id: plan.ID || plan.id, // Use backend ID if available, fallback to id
          price: normalizedPrice,
          currency: plan.currency || 'USD',
          billing_cycle: plan.billing_cycle || 'month',
          // Convert description to features array if needed
          features: plan.features || (plan.description ? plan.description.split('\n').filter((f: string) => f.trim()) : [])
        };
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch subscription plans';
    } finally {
      loading.value = false;
    }
  };

  const getCurrentSubscription = async () => {
    try {
      const response = await SubscriptionService.getCurrentSubscription();
      // Handle null response gracefully
      if (!response) {
        currentSubscription.value = null;
        return { subscription: null };
      }
      
      const subscription = response.subscription || response.data || null;
      if (subscription) {
        // Extract plan data if nested
        const plan = subscription.plan || subscription.Plan || null;
        const planPrice = plan?.price || subscription.price;
        const planName = plan?.name || subscription.plan_name || subscription.name;
        const planDescription = plan?.description || subscription.description;
        
        // Normalize price: convert from cents to dollars if price > 100
        const normalizedPrice = planPrice && planPrice > 100 ? planPrice / 100 : (planPrice || 0);
        
        // Convert description to features if needed
        const features = plan?.features || 
                        subscription.features || 
                        (planDescription ? planDescription.split('\n').filter((f: string) => f.trim()) : []);
        
        // Extract next billing date from various possible field names
        const nextBillingDate = subscription.next_billing_date || 
                               subscription.nextBillingDate || 
                               subscription.NextBillingDate ||
                               subscription.next_billing ||
                               subscription.billing_date ||
                               null;
        
        currentSubscription.value = {
          ...subscription,
          id: subscription.id || subscription.ID,
          plan_id: subscription.plan_id || plan?.ID || plan?.id,
          plan_name: planName,
          price: normalizedPrice,
          currency: subscription.currency || plan?.currency || 'USD',
          billing_cycle: subscription.billing_cycle || plan?.billing_cycle || 'month',
          next_billing_date: nextBillingDate,
          features: features,
          description: planDescription || subscription.description
        };
      } else {
        currentSubscription.value = null;
      }
      return response;
    } catch (err) {
      // Don't throw error for missing subscription, just set to null
      console.warn('Failed to fetch current subscription:', err);
      currentSubscription.value = null;
      return { subscription: null };
    }
  };

  const subscribeToPlan = async (planId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await SubscriptionService.subscribeToPlan(planId);
      if (response) {
        const subscription = response.subscription || response.data || null;
        if (subscription) {
          // Normalize subscription data similar to plans
          const normalizedPrice = subscription.price > 100 ? subscription.price / 100 : subscription.price;
          
          // Extract next billing date from various possible field names
          const nextBillingDate = subscription.next_billing_date || 
                                 subscription.nextBillingDate || 
                                 subscription.NextBillingDate ||
                                 subscription.next_billing ||
                                 subscription.billing_date ||
                                 null;
          
          currentSubscription.value = {
            ...subscription,
            price: normalizedPrice || 0,
            currency: subscription.currency || 'USD',
            billing_cycle: subscription.billing_cycle || 'month',
            next_billing_date: nextBillingDate
          };
        } else {
          currentSubscription.value = null;
        }
      }
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

  const formatPrice = (price: number | undefined, currency = 'USD') => {
    if (price === undefined || price === null || isNaN(price)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
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
