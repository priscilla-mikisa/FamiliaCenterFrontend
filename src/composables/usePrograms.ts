import { ref, computed } from 'vue';
import { ProgramService, CounsellorService, type Program } from '@/services/apiService';

export const usePrograms = () => {
  const programs = ref<Program[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const enrolledPrograms = computed(() =>
    programs.value.filter(p => p.is_enrolled)
  );

  const availablePrograms = computed(() =>
    programs.value.filter(p => !p.is_enrolled)
  );

  const fetchPrograms = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await ProgramService.getPrograms();
      programs.value = response.data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch programs';
    } finally {
      loading.value = false;
    }
  };

  const fetchCounsellorPrograms = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await CounsellorService.getCounsellorPrograms();
      // Handle different response structures
      if (Array.isArray(response)) {
        programs.value = response;
      } else if (response?.data) {
        programs.value = Array.isArray(response.data) ? response.data : [response.data];
      } else if (response?.programs) {
        programs.value = Array.isArray(response.programs) ? response.programs : [response.programs];
      } else {
        programs.value = [];
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch counselor programs';
      console.error('Error fetching counselor programs:', err);
    } finally {
      loading.value = false;
    }
  };

  const enrollInProgram = async (programId: number) => {
    try {
      await ProgramService.enrollInProgram(programId);
      const programIndex = programs.value.findIndex(p => p.id === programId);
      if (programIndex !== -1) {
        programs.value[programIndex].is_enrolled = true;
        programs.value[programIndex].current_week = 1;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to enroll in program';
      throw err;
    }
  };

  return {
    programs,
    enrolledPrograms,
    availablePrograms,
    loading,
    error,
    fetchPrograms,
    fetchCounsellorPrograms,
    enrollInProgram
  };
};
