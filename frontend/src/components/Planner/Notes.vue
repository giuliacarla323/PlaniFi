<template>
  <div class="bg-[#E6F7FA] border border-[#CDEDEF] rounded-2xl shadow-md p-6">
    <h2 class="text-xl font-bold text-[#134F5E] mb-4 flex items-center gap-2">
      🗒️ Notes
    </h2>

    <textarea
      v-model="noteText"
      class="w-full h-40 p-4 border border-[#A0DDE3] bg-white rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-[#6EC0CD] transition resize-none text-sm text-[#134F5E]"
      placeholder="Write your note or daily summary..."
    />

    <button
      @click="saveNote"
      class="mt-4 bg-[#134F5E] hover:bg-[#94E9E8] cursor-pointer text-white px-5 py-2 rounded-lg font-semibold shadow-md transition">
      💾 Save Note
    </button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useNoteStore } from '../../store/noteStore';

const props = defineProps({
  dailyPlanId: Number
});

const noteStore = useNoteStore();
const noteText = ref('');

async function loadOrCreateNote() {
  if (!props.dailyPlanId) return;
  const note = await noteStore.loadOrCreateNote(props.dailyPlanId);
  noteText.value = note?.note_text || '';
}

async function saveNote() {
  if (!props.dailyPlanId) return;

  const updatedContent = { note_text: noteText.value };

  if (noteStore.note?.id) {
    await noteStore.updateNote(noteStore.note.id, updatedContent);
  } else {
    await noteStore.saveNote({
      daily_plan_id: props.dailyPlanId,
      note_text: noteText.value
    });
  }
}

watch(
  () => props.dailyPlanId,
  (newVal) => {
    if (newVal) loadOrCreateNote();
  },
  { immediate: true }
);
</script>
