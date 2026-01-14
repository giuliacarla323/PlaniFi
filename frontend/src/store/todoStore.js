import { defineStore } from 'pinia';
import {
  addTodoItem,
  fetchTodoItems,
  deleteTodoItem,
  updateTodoItem
} from '../services/todoService';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    loading: false,
    error: null
  }),

  actions: {
    async loadTodos(planId) {
      this.loading = true;
      try {
        this.todos = await fetchTodoItems(planId);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async saveTodo(item) {
      try {
        const saved = await addTodoItem(item);
        this.todos.push(saved[0]);
      } catch (err) {
        this.error = err.message;
      }
    },

    async removeTodo(id) {
      try {
        await deleteTodoItem(id);
        this.todos = this.todos.filter(todo => todo.id !== id);
      } catch (err) {
        this.error = err.message;
      }
    },

    async editTodo(id, updated) {
      try {
        const updatedItem = await updateTodoItem(id, updated);
        const index = this.todos.findIndex(i => i.id === id);
        if (index !== -1) this.todos[index] = updatedItem[0];
      } catch (err) {
        this.error = err.message;
      }
    }
  }
});
