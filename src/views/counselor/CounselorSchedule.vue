<template>
  <div class="space-y-6">
    <!-- Header with Date Navigation -->
    <div class="bg-white rounded-xl shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div class="flex items-center space-x-4">
          <h2 class="text-xl font-semibold text-gray-900">My Schedule</h2>
          <div class="flex items-center space-x-2">
            <button @click="previousWeek" class="p-2 rounded-lg hover:bg-gray-100">
              <ChevronLeftIcon class="w-4 h-4" />
            </button>
            <span class="text-sm font-medium">{{ formatWeekRange() }}</span>
            <button @click="nextWeek" class="p-2 rounded-lg hover:bg-gray-100">
              <ChevronRightIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="flex space-x-3">
          <select v-model="viewMode" class="border border-gray-300 rounded-lg px-3 py-2">
            <option value="week">Week View</option>
            <option value="day">Day View</option>
          </select>
          <button
            @click="showNewAppointment = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            New Appointment
          </button>
        </div>
      </div>
    </div>

    <!-- Calendar View -->
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <!-- Week Header -->
      <div class="grid grid-cols-8 border-b border-gray-200">
        <div class="p-4 text-center font-medium text-gray-500">Time</div>
        <div
          v-for="day in weekDays"
          :key="day.date"
          class="p-4 text-center border-l border-gray-200"
        >
          <div class="font-medium">{{ day.name }}</div>
          <div class="text-sm text-gray-500">{{ day.date }}</div>
        </div>
      </div>

      <!-- Time Slots -->
      <div class="max-h-96 overflow-y-auto">
        <div
          v-for="hour in timeSlots"
          :key="hour"
          class="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50"
        >
          <div class="p-3 text-center text-sm text-gray-500 border-r border-gray-200">
            {{ formatHour(hour) }}
          </div>
          <div
            v-for="(day, dayIndex) in weekDays"
            :key="`${day.date}-${hour}`"
            class="p-1 min-h-16 border-l border-gray-100 relative"
            @click="scheduleAppointment(dayIndex, hour)"
          >
            <div
              v-for="appointment in getAppointmentsForSlot(dayIndex, hour)"
              :key="appointment.id"
              :class="`absolute inset-1 rounded p-2 text-xs cursor-pointer ${getAppointmentClass(appointment.type)}`"
              @click.stop="viewAppointment(appointment)"
            >
              <div class="font-medium truncate">{{ appointment.client }}</div>
              <div class="truncate">{{ appointment.type }}</div>
              <div class="text-xs opacity-75">{{ appointment.duration }}min</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Summary -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Today's Appointments</h3>
        <div class="space-y-3">
          <div
            v-for="appointment in todaysAppointments"
            :key="appointment.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <div class="font-medium">{{ appointment.client }}</div>
              <div class="text-sm text-gray-600">{{ appointment.time }} - {{ appointment.type }}</div>
            </div>
            <div class="flex space-x-2">
              <button
                v-if="appointment.canStart"
                @click="startSession(appointment.id)"
                class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Start
              </button>
              <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Availability Settings</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
            <div class="grid grid-cols-2 gap-3">
              <input
                v-model="availability.startTime"
                type="time"
                class="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                v-model="availability.endTime"
                type="time"
                class="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="day in daysOfWeek"
                :key="day.value"
                class="flex items-center"
              >
                <input
                  v-model="availability.workingDays"
                  :value="day.value"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm">{{ day.label }}</span>
              </label>
            </div>
          </div>
          <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save Availability
          </button>
        </div>
      </div>
    </div>

    <!-- New Appointment Modal -->
    <div v-if="showNewAppointment" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl max-w-md w-full">
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Schedule New Appointment</h3>
            <button @click="showNewAppointment = false" class="p-1 hover:bg-gray-100 rounded">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <form @submit.prevent="createAppointment" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <select v-model="newAppointment.clientId" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="">Select client</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                v-model="newAppointment.date"
                type="date"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                v-model="newAppointment.time"
                type="time"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <select v-model="newAppointment.duration" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select v-model="newAppointment.type" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="individual">Individual Session</option>
                <option value="couple">Couples Session</option>
                <option value="family">Family Session</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              v-model="newAppointment.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Optional notes about the appointment..."
            ></textarea>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="showNewAppointment = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XIcon
} from 'lucide-vue-next';

const currentWeekStart = ref(new Date());
const viewMode = ref('week');
const showNewAppointment = ref(false);

const availability = ref({
  startTime: '09:00',
  endTime: '17:00',
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
});

const newAppointment = ref({
  clientId: '',
  date: '',
  time: '',
  duration: '60',
  type: 'individual',
  notes: ''
});

const daysOfWeek = [
  { label: 'Mon', value: 'monday' },
  { label: 'Tue', value: 'tuesday' },
  { label: 'Wed', value: 'wednesday' },
  { label: 'Thu', value: 'thursday' },
  { label: 'Fri', value: 'friday' },
  { label: 'Sat', value: 'saturday' },
  { label: 'Sun', value: 'sunday' }
];

// Mock data
const clients = ref([
  { id: 1, name: 'John & Mary Smith' },
  { id: 2, name: 'Jennifer Wilson' },
  { id: 3, name: 'The Johnson Family' }
]);

const appointments = ref([
  {
    id: 1,
    client: 'John & Mary Smith',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    type: 'Couples Session',
    dayIndex: 1,
    hour: 9,
    canStart: true
  },
  {
    id: 2,
    client: 'Jennifer Wilson',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    duration: 45,
    type: 'Individual Session',
    dayIndex: 1,
    hour: 11,
    canStart: false
  }
]);

const timeSlots = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 6 PM

const weekDays = computed(() => {
  const days = [];
  const start = new Date(currentWeekStart.value);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push({
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      fullDate: date.toISOString().split('T')[0]
    });
  }

  return days;
});

const todaysAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return appointments.value.filter(apt => apt.date === today);
});

const formatWeekRange = () => {
  const start = new Date(currentWeekStart.value);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

const formatHour = (hour: number) => {
  return `${hour}:00`;
};

const previousWeek = () => {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() - 7);
  currentWeekStart.value = newDate;
};

const nextWeek = () => {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() + 7);
  currentWeekStart.value = newDate;
};

const getAppointmentsForSlot = (dayIndex: number, hour: number) => {
  return appointments.value.filter(apt => apt.dayIndex === dayIndex && apt.hour === hour);
};

const getAppointmentClass = (type: string) => {
  const classes = {
    'Couples Session': 'bg-blue-100 text-blue-800 border border-blue-200',
    'Individual Session': 'bg-green-100 text-green-800 border border-green-200',
    'Family Session': 'bg-purple-100 text-purple-800 border border-purple-200',
    'Consultation': 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  };
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800 border border-gray-200';
};

const scheduleAppointment = (dayIndex: number, hour: number) => {
  console.log(`Scheduling for day ${dayIndex} at hour ${hour}`);
  showNewAppointment.value = true;
};

type Appointment = {
  id: number;
  client: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  dayIndex: number;
  hour: number;
  canStart?: boolean;
};

const viewAppointment = (appointment: Appointment) => {
  console.log('Viewing appointment:', appointment);
};

const startSession = (appointmentId: number) => {
  console.log('Starting session:', appointmentId);
};

const createAppointment = () => {
  console.log('Creating appointment:', newAppointment.value);
  showNewAppointment.value = false;
  // Reset form
  newAppointment.value = {
    clientId: '',
    date: '',
    time: '',
    duration: '60',
    type: 'individual',
    notes: ''
  };
};

onMounted(() => {
  // Set current week start to Monday
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  currentWeekStart.value = monday;
});
</script>
