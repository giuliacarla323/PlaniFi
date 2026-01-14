<template>
  <div class="mt-8 space-y-8">
    <h3 class="text-2xl font-bold text-[#3b2c56]">💸 Shared Expenses Overview</h3>

    <div class="flex justify-end">
      <button @click="showAddModal = true" class="bg-[#3b2c56] text-white px-4 py-2 rounded hover:bg-[#776c8c] cursor-pointer">
        ➕ Add Expense
      </button>
    </div>

    <div v-if="loading" class="text-gray-500">Loading expenses...</div>
    <div v-else-if="!Object.keys(groupedByUser).length" class="text-gray-500">No shared expenses yet.</div>

    <div v-for="(group, uid) in groupedByUser" :key="uid" class="bg-white p-4 shadow rounded-xl border border-[#d5e6d2]">
      <div class="flex justify-between items-center mb-2">
        <div>
          <h4 class="text-lg font-bold text-[#3b2c56]">{{ group.user.username || group.user.email }}</h4>
          <p class="text-sm text-gray-600">
            Balance:
            <span :class="balanceMap[uid] >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ balanceMap[uid] >= 0 ? '+ ' : '- ' }}{{ Math.abs(balanceMap[uid]) }} RON
            </span>
          </p>
        </div>
        <button @click="openSettleModal(parseInt(uid))" class="bg-[#3b2c56] text-white px-4 py-1.5 rounded hover:bg-[#726a81] cursor-pointer">
          Settle All
        </button>
      </div>

      <!-- Active Expenses -->
      <p class="font-semibold text-sm text-[#48763D] mt-2">🟢 Active:</p>
      <ul class="divide-y divide-gray-200">
        <li
          v-for="expense in group.expenses.filter(e => !e.settled)"
          :key="'active-' + expense.id"
          class="py-2 flex items-center justify-between text-[#21371C]"
        >
          <div>
            <span class="font-medium">💸 {{ expense.title }}</span> —
            <span>
              {{ getUser(expense.payer_id)?.username || 'User ' + expense.payer_id }} owes 
              {{ expense.amount }} RON to 
              {{ getUser(expense.owned_id)?.username || 'User ' + expense.owned_id }}
            </span>
          </div>
          <button
            @click="openDeleteModal(expense.id, group.user.id)"
            class="text-red-600 hover:text-red-800 text-sm ml-2 cursor-pointer"
          >
            🗑️
          </button>
        </li>
      </ul>

      <!-- Settled Expenses -->
      <p class="font-semibold text-sm text-gray-600 mt-4">✅ Settled:</p>
      <ul class="text-gray-500 text-sm pl-2">
        <li
          v-for="expense in group.expenses.filter(e => e.settled)"
          :key="'settled-' + expense.id"
        >
          {{ expense.title }} — {{ getUser(expense.payer_id)?.username }} paid {{ expense.amount }} RON to {{ getUser(expense.owned_id)?.username }}
        </li>
      </ul>
    </div>

    <!-- Add Expense Modal -->
    <div v-if="showAddModal" class="fixed inset-0  bg-[#CDEDEF]/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg">
        <h3 class="text-xl font-semibold text-[#3b2c56]">Add Shared Expense</h3>

        <div class="space-y-2">
          <input v-model="form.description" type="text" placeholder="Expense title" class="w-full border px-3 py-2 rounded" />
          <input v-model.number="form.amount" type="number" placeholder="Amount" class="w-full border px-3 py-2 rounded" />

          <div>
            <label class="block mb-1 font-medium">Split with:</label>
            <select v-model="form.paidBy" class="w-full border px-3 py-2 rounded">
              <option disabled value="">Who owes?</option>
              <option :value="userStore.user.id">You</option>
              <option v-for="f in friendStore.friends" :key="f.id" :value="f.id">
                {{ f.username || f.email }}
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-1 font-medium">Who paid?</label>
            <select v-model="form.otherUserId" class="w-full border px-3 py-2 rounded">
              <option disabled value="">Who paid?</option>
              <option :value="userStore.user.id">You</option>
              <option v-for="f in friendStore.friends" :key="f.id" :value="f.id">
                {{ f.username || f.email }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="showAddModal = false" class="px-4 py-2 rounded bg-gray-300 cursor-pointer">Cancel</button>
          <button :disabled="!formValid" @click="submitExpense" class="px-4 py-2 rounded bg-[#3b2c56] text-white hover:bg-[#7a6e8f] cursor-pointer">
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-[#CDEDEF]/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg text-center">
        <h3 class="text-lg font-semibold text-[#21371C]">Are you sure you want to delete this expense?</h3>
        <div class="flex justify-center space-x-4">
          <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-300 rounded cursor-pointer">Cancel</button>
          <button @click="deleteExpense" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>

    <!-- Settle Confirmation Modal -->
    <div v-if="showSettleModal" class="fixed inset-0 bg-[#CDEDEF]/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg text-center">
        <h3 class="text-lg font-semibold text-[#3b2c56]">Settle Expenses</h3>
        <p>Are you sure you want to mark all active expenses with {{ getUser(activeSettleUser)?.username || 'this user' }} as settled?</p>
        <div class="flex justify-center space-x-4 mt-4">
          <button @click="showSettleModal = false" class="px-4 py-2 bg-gray-300 rounded cursor-pointer">Cancel</button>
          <button @click="settleAll" class="px-4 py-2 bg-[#3b2c56] text-white rounded hover:bg-[#6f6680] cursor-pointer">Settle All</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../../store/user';
import { useSharedExpenseStore } from '../../store/friends/sharedExpenseStore';
import { useFriendListStore } from '../../store/friends/friendListStore';

const userStore = useUserStore();
const sharedExpenseStore = useSharedExpenseStore();
const friendStore = useFriendListStore();

const loading = computed(() => sharedExpenseStore.loading);

const form = ref({
  description: '',
  amount: null,
  paidBy: '',
  otherUserId: ''
});

const formValid = computed(() =>
  form.value.description &&
  form.value.amount > 0 &&
  form.value.paidBy &&
  form.value.otherUserId &&
  form.value.paidBy !== form.value.otherUserId
);

// Grupare după user implicat (cei cu care userul logat are cheltuieli)
const groupedByUser = computed(() => {
  const groups = {};
  for (const e of sharedExpenseStore.allExpenses) {
    // Ignoră cheltuielile settled
    if (e.settled) continue;
    // Determină id-ul celuilalt user
    const otherId = e.payer_id === userStore.user.id ? e.owned_id :
                    e.owned_id === userStore.user.id ? e.payer_id : null;
    if (!otherId) continue;
    if (!groups[otherId]) {
      const user = friendStore.friends.find(f => f.id === otherId) || { id: otherId, email: `User ${otherId}` };
      groups[otherId] = { user, expenses: [] };
    }
    groups[otherId].expenses.push(e);
  }
  return groups;
});

// Calculează balanța pentru fiecare user (doar active)
const balanceMap = computed(() => {
  const map = {};
  for (const [uid, group] of Object.entries(groupedByUser.value)) {
    let balance = 0;
    for (const e of group.expenses) {
      // Dacă userul logat primește, balance crește; dacă plătește, scade
      if (e.owned_id === userStore.user.id) balance += e.amount;
      else balance -= e.amount;
    }
    map[uid] = balance;
  }
  return map;
});

function getUser(id) {
  return id === userStore.user.id
    ? userStore.user
    : friendStore.friends.find(f => f.id === id);
}

// Modal pentru confirmare de ștergere
const showDeleteModal = ref(false);
const selectedDeleteId = ref(null);

function openDeleteModal(expenseId) {
  selectedDeleteId.value = expenseId;
  showDeleteModal.value = true;
}

async function deleteExpense() {
  try {
    await sharedExpenseStore.deleteExpense(selectedDeleteId.value);
    await sharedExpenseStore.loadUserExpenses(userStore.user.id);
    showDeleteModal.value = false;
  } catch (err) {
    alert('Failed to delete expense: ' + err.message);
  }
}

// Modal pentru confirmare de settle
const showSettleModal = ref(false);
const activeSettleUser = ref(null);

function openSettleModal(otherId) {
  activeSettleUser.value = otherId;
  showSettleModal.value = true;
}

async function settleAll() {
  if (!activeSettleUser.value) return;
  try {
    const relatedExpenses = sharedExpenseStore.allExpenses.filter(e =>
      !e.settled &&
      ((e.owned_id === userStore.user.id && e.payer_id === activeSettleUser.value) ||
       (e.payer_id === userStore.user.id && e.owned_id === activeSettleUser.value))
    );
    for (const e of relatedExpenses) {
      await sharedExpenseStore.settleExpense(e.id);
    }
    await sharedExpenseStore.loadUserExpenses(userStore.user.id);
    showSettleModal.value = false;
  } catch (err) {
    alert('Failed to settle expenses: ' + err.message);
  }
}

async function submitExpense() {
  const { description, amount, paidBy, otherUserId } = form.value;
  const payer_id = parseInt(paidBy);
  // Logica: dacă utilizatorul logat este cel selectat ca plătitor, atunci recipientul este otherUserId; altfel, e invers.
  const owned_id = payer_id === userStore.user.id ? parseInt(otherUserId) : userStore.user.id;

  try {
    await sharedExpenseStore.addExpense({
      title: description,
      amount,
      creator_id: userStore.user.id,
      payer_id,
      owned_id,
      group_id: null,
      settled: false
    });
    await sharedExpenseStore.loadUserExpenses(userStore.user.id);
    showAddModal.value = false;
    form.value = { description: '', amount: null, paidBy: '', otherUserId: '' };
  } catch (err) {
    alert('Failed to add expense: ' + err.message);
  }
}

const showAddModal = ref(false);

onMounted(async () => {
  await userStore.loadUser();
  const uid = userStore.user?.id;
  if (!uid) return;
  await friendStore.loadFriends(uid);
  await sharedExpenseStore.loadUserExpenses(uid);
});
</script>
