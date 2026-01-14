import { defineStore } from 'pinia';
import {
  createGroup,
  addGroupMember,
  removeGroupMember,
  fetchGroupMembers,
  fetchGroupsForUser // 👈 adăugat aici
} from '../../services/friends/groupService';

export const useGroupStore = defineStore('groups', {
  state: () => ({
    groups: [],
    members: {},  // { group_id: [users] }
    loading: false,
    error: null
  }),

  actions: {
    async createNewGroup(groupData) {
      try {
        const group = await createGroup(groupData);
        this.groups.push(group);
        return group;
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async addMemberToGroup(group_id, user_id) {
      try {
        const member = await addGroupMember(group_id, user_id);
        this.members[group_id] = [...(this.members[group_id] || []), member];
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async removeMemberFromGroup(group_id, user_id) {
      try {
        await removeGroupMember(group_id, user_id);
        this.members[group_id] = (this.members[group_id] || []).filter(u => u.id !== user_id);
      } catch (err) {
        this.error = err.message;
        throw err;
      }
    },

    async loadGroupMembers(group_id) {
      try {
        const members = await fetchGroupMembers(group_id);
        this.members[group_id] = members;
      } catch (err) {
        this.error = err.message;
      }
    },

    async loadGroupsForUser(user_id) {  // 👈 NOU
      try {
        this.loading = true;
        const groups = await fetchGroupsForUser(user_id);
        this.groups = groups;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
