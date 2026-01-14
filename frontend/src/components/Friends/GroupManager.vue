<template>
  <div class="mt-8 space-y-8">

    <div v-if="friendStore.friends.length === 0" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
  ⚠️ You need to add friends in order to create groups or expenses.
</div>


    <!-- Grupurile existente -->
    <div>
      <h3 class="text-2xl font-bold text-[#3b2c56] mb-4">🧑‍🤝‍🧑 My Groups</h3>

      <div v-if="groupStore.groups.length === 0" class="text-gray-500">
        No groups yet. Create one below!
      </div>

      <ul v-else class="space-y-3">
        <li
          v-for="group in groupStore.groups"
          :key="group.id"
          class="bg-white p-4 rounded-xl border shadow-sm space-y-2"
        >
          <div >
            <h4 class="font-semibold text-[#3b2c56]">{{ group.name }}</h4>
            <div class="text-sm text-gray-600 space-y-1">
              <p v-if="!groupStore.members[group.id]">Loading members...</p>
              <ul v-else>
                <li
                  v-for="member in groupStore.members[group.id]"
                  :key="member.user?.id"
                >
                  👤 {{  member.user?.username ||  member.user?.email }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Expenses per grup -->
          <div class="mt-2 text-sm text-gray-800">
            <p class="font-semibold text-[#3b2c56]">💰 Expenses:</p>
<p v-if="sharedExpenseStore.loading">Loading expenses...</p>

<!-- Active expenses -->
<div v-else>
  <p class="font-semibold text-sm text-[#48763D] mt-2">🟢 Active:</p>
  <ul>
    <li
      v-for="expense in (sharedExpenseStore.groupExpenses[group.id] || []).filter(e => !e.settled)"
      :key="'active-' + expense.id"
      class="pl-2 flex items-center justify-between"
    >
      <div>
        <span class="font-medium text-[#21371C]">💸 {{ expense.title }}</span> —
        <span>
          {{ getUsername(group.id, expense.payer_id) }} owes
          {{ expense.amount }} {{ expense.currency || 'RON' }} to
          {{ getUsername(group.id, expense.owned_id) }}
        </span>
      </div>
      <button
        @click="confirmDeleteExpense(expense.id, group.id)"
        class="text-red-600 hover:text-red-800 text-sm ml-2 cursor-pointer"
      >
        🗑️
      </button>
    </li>
  </ul>

  <!-- Settled expenses -->
  <p class="font-semibold text-sm text-gray-600 mt-4">✅ Settled:</p>
  <ul>
    <li
      v-for="expense in (sharedExpenseStore.groupExpenses[group.id] || []).filter(e => e.settled)"
      :key="'settled-' + expense.id"
      class="pl-2 text-gray-500"
    >
      <div>
        <span class="font-medium">{{ expense.title }}</span> —
        <span>
          {{ getUsername(group.id, expense.payer_id) }} paid
          {{ expense.amount }} {{ expense.currency || 'RON' }} to
          {{ getUsername(group.id, expense.owned_id) }}
        </span>
      </div>
    </li>
  </ul>
</div>

          </div>

          <button
            @click="openExpenseModal(group)"
            class="mt-2 text-sm text-[#3b2c56] hover:underline cursor-pointer"
          >
            ➕ Add Expense
          </button>
        </li>
      </ul>
    </div>

    <!-- Formular creare grup -->
    <div class="bg-white p-6 rounded-xl border shadow space-y-4 max-w-xl">
      <h3 class="text-xl font-semibold text-[#3b2c56]">➕ Create New Group</h3>

      <form @submit.prevent="createGroup">
        <div class="space-y-4">
          <input
            v-model="newGroup.name"
            type="text"
            placeholder="Group name"
            class="border rounded px-3 py-2 w-full"
          />

          <div>
            <label class="font-medium block mb-1">Select friends:</label>
            <div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              <label
                v-for="friend in friendStore.friends"
                :key="friend.id"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="friend.id"
                  v-model="newGroup.memberIds"
                />
                <span>{{ friend.username || friend.email }}</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            class="bg-[#3b2c56] text-white px-6 py-2 rounded hover:bg-[#635878] cursor-pointer"
            :disabled="!canSubmit"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>

    <!-- Modal: Add Expense -->
    <div
      v-if="showExpenseModal"
      class="fixed inset-0 bg-[#CDEDEF]/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg">
        <h3 class="text-xl font-semibold text-[#3b2c56]">Add Expense to {{ activeGroup?.name }}</h3>

        <div class="space-y-2">
          <input
            v-model="expenseForm.title"
            type="text"
            placeholder="Expense title"
            class="w-full border px-3 py-2 rounded"
          />

          <input
            v-model.number="expenseForm.amount"
            type="number"
            placeholder="Amount"
            class="w-full border px-3 py-2 rounded"
          />

          <div>
            <label class="block mb-1 font-medium">Who paid?</label>
            <select v-model="expenseForm.owned_id" class="w-full border px-3 py-2 rounded">
              <option
                v-for="member in groupStore.members[activeGroup?.id] || []"
                :key="member.user?.id"
                :value="member.user?.id"
              >
                {{ member.user?.username || member.user?.email }}
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-1 font-medium">Split with:</label>
            <select v-model="expenseForm.splitType" class="w-full border px-3 py-2 rounded">
              <option value="everyone">To everyone (incl. payer)</option>
              <option value="rest">To the rest (excl. payer)</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="showExpenseModal = false" class="px-4 py-2 rounded bg-gray-300 cursor-pointer">Cancel</button>
          <button @click="submitExpense" class="px-4 py-2 rounded bg-[#3b2c56] text-white hover:bg-[#79718a] cursor-pointer">
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Confirm Delete -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0  flex items-center justify-center  bg-[#CDEDEF]/40 backdrop-blur-sm z-50"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-sm shadow space-y-4">
        <h3 class="text-lg font-semibold text-[#3b2c56]">Confirm Delete</h3>
        <p>Are you sure you want to delete this expense?</p>

        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="deleteExpense(expenseToDelete.id, expenseToDelete.groupId)"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../store/user';
import { useFriendListStore } from '../../store/friends/friendListStore';
import { useGroupStore } from '../../store/friends/groupStore';
import { useSharedExpenseStore } from '../../store/friends/sharedExpenseStore';

const userStore = useUserStore();
const friendStore = useFriendListStore();
const groupStore = useGroupStore();
const sharedExpenseStore = useSharedExpenseStore();

const newGroup = ref({
  name: '',
  memberIds: []
});

const canSubmit = computed(() => {
  return newGroup.value.name.trim() !== '' && newGroup.value.memberIds.length > 0;
});

const showDeleteModal = ref(false);
const expenseToDelete = ref({ id: null, groupId: null });

function confirmDeleteExpense(id, groupId) {
  expenseToDelete.value = { id, groupId };
  showDeleteModal.value = true;
}

function getUsername(groupId, userId) {
  const members = groupStore.members[groupId] || [];
  const member = members.find(m => m.user?.id === userId);
  return member?.user?.username || member?.user?.email || 'Unknown';
}

async function createGroup() {
  const creatorId = userStore.user?.id;
  if (!creatorId) {
    alert('User not loaded');
    return;
  }

  const payload = {
    name: newGroup.value.name,
    created_by: creatorId
  };

  try {
    const group = await groupStore.createNewGroup(payload);
    const friendIdsOnly = newGroup.value.memberIds.filter(id => id !== creatorId);
    for (const id of friendIdsOnly) {
      await groupStore.addMemberToGroup(group.id, id);
    }

    await groupStore.loadGroupsForUser(creatorId);
    await groupStore.loadGroupMembers(group.id);
    await sharedExpenseStore.loadGroupExpenses(group.id);

    newGroup.value = {
      name: '',
      memberIds: []
    };
  } catch (err) {
    alert('Error creating group: ' + err.message);
  }
}

const showExpenseModal = ref(false);
const activeGroup = ref(null);
const expenseForm = ref({
  title: '',
  amount: null,
  owned_id: null,
  splitType: 'everyone'
});

function openExpenseModal(group) {
  activeGroup.value = group;
  expenseForm.value = {
    title: '',
    amount: null,
    owned_id: null,
    splitType: 'everyone'
  };
  showExpenseModal.value = true;
}

async function deleteExpense(expenseId, groupId) {
  try {
    await sharedExpenseStore.deleteExpense(expenseId);
    await sharedExpenseStore.loadGroupExpenses(groupId);
    showDeleteModal.value = false;
    expenseToDelete.value = { id: null, groupId: null };
  } catch (err) {
    alert('Failed to delete expense: ' + err.message);
  }
}

async function submitExpense() {
  const creatorId = userStore.user?.id;
  const group = activeGroup.value;
  const members = groupStore.members[group.id] || [];

  if (!creatorId || !group || !expenseForm.value.owned_id || !expenseForm.value.amount) {
    alert('Please fill in all fields.');
    return;
  }

  const payerId = expenseForm.value.owned_id;
  const total = parseFloat(expenseForm.value.amount);
  const includePayer = expenseForm.value.splitType === 'everyone';

  const splitWith = members
    .map(m => m.user?.id)
    .filter(id => includePayer || id !== payerId);

  const perUser = +(total / splitWith.length).toFixed(2);

  try {
    for (const userId of splitWith) {
      if (userId === payerId) continue;

      await sharedExpenseStore.addExpense({
        title: expenseForm.value.title,
        amount: perUser,
        creator_id: creatorId,
        payer_id: userId,
        owned_id: payerId,
        group_id: group.id,
        settled: false
      });
    }

    await sharedExpenseStore.loadGroupExpenses(group.id);
    showExpenseModal.value = false;
  } catch (err) {
    alert('Failed to add expense: ' + err.message);
  }
}

onMounted(async () => {
  await userStore.loadUser();
  const uid = userStore.user?.id;
  if (!uid) return;

  await friendStore.loadFriends(uid);
  await groupStore.loadGroupsForUser(uid);

  for (const group of groupStore.groups) {
    await groupStore.loadGroupMembers(group.id);
    await sharedExpenseStore.loadGroupExpenses(group.id);
  }
});
</script> 