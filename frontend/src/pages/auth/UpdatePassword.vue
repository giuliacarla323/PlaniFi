<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { createClient } from "@supabase/supabase-js";

const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const message = ref("");
const loading = ref(true);
const router = useRouter();

const supabase = createClient(
  "https://xkiplwdmsmjubajzzabu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraXBsd2Rtc21qdWJhanp6YWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NTk3NzAsImV4cCI6MjA1ODIzNTc3MH0.vW6pmciPlLOGH2gLZcOe9NKHy0nj7cGZm0aT8IvprFk"
);

// ✅ Validare parolă complexă
const validatePassword = (pwd) => {
  const lengthValid = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSymbol = /[\W_]/.test(pwd);

  return lengthValid && hasUpper && hasLower && hasNumber && hasSymbol;
};

const updatePassword = async () => {
  message.value = "";

  if (password.value !== confirmPassword.value) {
    message.value = "❌ Passwords do not match.";
    return;
  }

  if (!validatePassword(password.value)) {
    message.value = "❌ Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a symbol, and a number.";
    return;
  }

  const { error } = await supabase.auth.updateUser({ password: password.value });

  if (error) {
    message.value = "❌ " + error.message;
  } else {
    message.value = "✅ Password updated successfully! Redirecting...";
    setTimeout(() => {
      router.push("/"); // 🔁 Redirecționare către pagina de login
    }, 2000);
  }
};

onMounted(async () => {
  loading.value = false;

  const { data: sessionData, error } = await supabase.auth.getSession();
  
  if (!sessionData?.session?.user) {
    message.value = "❌ Unauthenticated user or session not found.";
  }
});

</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-[radial-gradient(circle,_rgba(240,192,213,1)_0%,_rgba(148,233,232,1)_83%,_rgba(180,242,198,1)_100%)]">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-[#177170]">
        Set a new password
      </h2>

      <!-- Parolă nouă -->
      <div class="relative mb-4">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="New Password"
          class="w-full p-3 border border-gray-300 rounded-lg"
          :disabled="loading"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#E65100]"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? 'Hide' : 'Show' }}
        </button>
      </div>

      <!-- Confirmă parola -->
      <div class="relative mb-4">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="Confirm password"
          class="w-full p-3 border border-gray-300 rounded-lg"
          :disabled="loading"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#E65100]"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          {{ showConfirmPassword ? 'Hide' : 'Show' }}
        </button>
      </div>

      <!-- Buton salvare -->
      <button
        @click="updatePassword"
        class="w-full bg-[#177170] text-white p-3 rounded-lg hover:bg-[#115251]"
        :disabled="loading"
      >
        Save Password
      </button>

      <!-- Mesaje -->
      <p class="text-center text-red-500 mt-4" v-if="message && message.startsWith('❌')">
        {{ message }}
      </p>
      <p class="text-center text-green-600 mt-4" v-if="message && message.startsWith('✅')">
        {{ message }}
      </p>
    </div>
  </div>
</template>
