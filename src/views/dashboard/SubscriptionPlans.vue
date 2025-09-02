<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Subscription Plans</h2>
          <p class="text-gray-600">Choose the plan that best fits your needs</p>
        </div>
        <div v-if="currentSubscription" class="text-sm">
          <span class="text-gray-500">Current Plan:</span>
          <span class="font-medium text-green-600 ml-1">{{ currentSubscription.plan_name }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading && plans.length === 0" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading subscription plans...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">{{ error }}</p>
      <button
        @click="fetchPlans"
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Retry
      </button>
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
        <div class="text-center">
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-white mb-4">
            Free Trial
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Get Started</h3>
          <div class="mt-4">
            <span class="text-4xl font-bold text-gray-900">$0</span>
            <span class="text-gray-600">/14 days</span>
          </div>
          <p class="text-gray-600 mt-2">Perfect for trying our services</p>
        </div>

        <ul class="mt-6 space-y-3">
          <li class="flex items-center">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
            <span class="text-gray-700">2 counseling sessions</span>
          </li>
          <li class="flex items-center">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
            <span class="text-gray-700">Access to basic resources</span>
          </li>
          <li class="flex items-center">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
            <span class="text-gray-700">Email support</span>
          </li>
        </ul>

        <button
          @click="startFreeTrial"
          :disabled="loading || hasFreeTrial"
          class="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ hasFreeTrial ? 'Trial Used' : 'Start Free Trial' }}
        </button>
      </div>

      <div
        v-for="plan in paidPlans"
        :key="plan.id"
        :class="`relative rounded-xl p-6 border-2 ${
          plan.is_popular
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100'
            : 'border-gray-200 bg-white'
        }`"
      >
        <div v-if="plan.is_popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span class="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>

        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900">{{ plan.name }}</h3>
          <div class="mt-4">
            <span class="text-4xl font-bold text-gray-900">{{ formatPrice(plan.price, plan.currency) }}</span>
            <span class="text-gray-600">/{{ plan.billing_cycle }}</span>
          </div>
        </div>

        <ul class="mt-6 space-y-3">
          <li v-for="feature in plan.features" :key="feature" class="flex items-center">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span class="text-gray-700">{{ feature }}</span>
          </li>
        </ul>

        <button
          @click="selectPlan(plan)"
          :disabled="loading || isCurrentPlan(plan.id)"
          :class="`w-full mt-6 px-6 py-3 rounded-lg font-medium ${
            plan.is_popular
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          } disabled:opacity-50 disabled:cursor-not-allowed`"
        >
          {{ isCurrentPlan(plan.id) ? 'Current Plan' : `Subscribe to ${plan.name}` }}
        </button>
      </div>
    </div>

    <div v-if="currentSubscription" class="bg-white rounded-xl shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Manage Your Subscription</h3>

      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Plan:</span>
              <span class="font-medium">{{ currentSubscription.plan_name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Price:</span>
              <span class="font-medium">{{ formatPrice(currentSubscription.price, currentSubscription.currency) }}/{{ currentSubscription.billing_cycle }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span :class="`font-medium ${currentSubscription.status === 'active' ? 'text-green-600' : 'text-red-600'}`">
                {{ currentSubscription.status }}
              </span>
            </div>
            <div v-if="currentSubscription.next_billing_date" class="flex justify-between">
              <span class="text-gray-600">Next Billing:</span>
              <span class="font-medium">{{ formatDate(currentSubscription.next_billing_date) }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col space-y-3">
          <button
            @click="showUpgradeOptions = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upgrade Plan
          </button>
          <button
            @click="showCancelModal = true"
            class="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>

    <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Cancel Subscription</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
        </p>

        <div class="flex space-x-3">
          <button
            @click="showCancelModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Keep Subscription
          </button>
          <button
            @click="handleCancelSubscription"
            :disabled="loading"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {{ loading ? 'Canceling...' : 'Yes, Cancel' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSubscriptions } from '@/composables/useSubscriptions';
import { CheckIcon } from 'lucide-vue-next';
import type { SubscriptionPlan } from '@/services/apiService';

const {
  plans,
  paidPlans,
  currentSubscription,
  loading,
  error,
  fetchPlans,
  getCurrentSubscription,
  subscribeToPlan,
  cancelSubscription,
  formatPrice
} = useSubscriptions();

const showCancelModal = ref(false);
const showUpgradeOptions = ref(false);
const successMessage = ref('');
const hasFreeTrial = ref(false);

const isCurrentPlan = (planId: string) => {
  return currentSubscription.value?.plan_id === planId;
};

const selectPlan = async (plan: SubscriptionPlan) => {
  try {
    await subscribeToPlan(plan.id);
    successMessage.value = `Successfully subscribed to ${plan.name}!`;

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);

    await getCurrentSubscription();
  } catch (err) {
    console.error('Subscription failed:', err);
    alert('Failed to subscribe to plan. Please try again.');
  }
};

const startFreeTrial = async () => {
  try {
    const freeTrialPlan = {
      id: 'free_trial',
      name: 'Free Trial',
      price: 0,
      currency: 'USD',
      billing_cycle: '14 days',
      features: ['2 counseling sessions', 'Basic resources', 'Email support']
    };

    await subscribeToPlan(freeTrialPlan.id);
    hasFreeTrial.value = true;
    successMessage.value = 'Free trial started successfully!';

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);

    await getCurrentSubscription();
  } catch (err) {
    console.error('Free trial failed:', err);
    alert('Failed to start free trial. Please try again.');
  }
};

const handleCancelSubscription = async () => {
  try {
    await cancelSubscription();
    showCancelModal.value = false;
    successMessage.value = 'Subscription cancelled successfully.';

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);

    await getCurrentSubscription();
  } catch (err) {
    console.error('Cancel subscription failed:', err);
    alert('Failed to cancel subscription. Please try again.');
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(async () => {
  await Promise.all([
    fetchPlans(),
    getCurrentSubscription().catch(() => {
      console.log('No current subscription found');
    })
  ]);
});
</script>
