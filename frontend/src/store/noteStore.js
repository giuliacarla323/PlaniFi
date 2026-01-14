import { defineStore } from 'pinia';
import { fetchNote, createNote, updateNote } from '../services/noteService';

export const useNoteStore = defineStore('note', {
  state: () => ({
    note: null,
    loading: false,
    error: null
  }),

  actions: {
    async loadNote(planId) {
      this.loading = true;
      try {
        this.note = await fetchNote(planId);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async saveNote(note) {
      try {
        this.note = await createNote(note);
      } catch (err) {
        this.error = err.message;
      }
    },

    async updateNote(id, updatedContent) {
      try {
        this.note = await updateNote(id, updatedContent);
      } catch (err) {
        this.error = err.message;
      }
    },
    async loadOrCreateNote(dailyPlanId) {
        this.loading = true;
        try {
          const note = await fetchNote(dailyPlanId);
      
          if (note && !Array.isArray(note)) {
            this.note = note;
            return note;
          }
      
          // Dacă este array, extragem primul
          const existingNote = Array.isArray(note) ? note[0] : null;
      
          if (existingNote) {
            this.note = existingNote;
            return existingNote;
          }
      
          // Dacă nu există deloc, creăm unul nou
          const newNote = await createNote({
            daily_plan_id: dailyPlanId,
            note_text: ''
          });
      
          this.note = newNote;
          return newNote;
        } catch (err) {
          this.error = err.message;
        } finally {
          this.loading = false;
        }
      }
      
      
  }
});
