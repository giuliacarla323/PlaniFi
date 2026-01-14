<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const message = ref("");

const validatePassword = (password) => {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return pattern.test(password);
};

const register = async () => {
  message.value = ""; // resetăm mesajul

  if (!validatePassword(password.value)) {
    message.value = "❌ Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a symbol, and a number.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    message.value = "❌ Passwords do not match.";
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/auth/signup", {
      email: email.value,
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });

    message.value = response.data.message;
  } catch (error) {
    message.value = "❌ " + (error.response?.data?.error || "Registration error");
  }
};

</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-[radial-gradient(circle,_rgba(240,192,213,1)_0%,_rgba(148,233,232,1)_83%,_rgba(180,242,198,1)_100%)]">
        <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h1 class="text-4xl font-bold text-[#177170] text-center mb-4">Create a New Account</h1>

            <p class="text-[#177170] text-center mb-6">  SIGNUP TO GET STARTED!</p>

            <!-- Form pentru înregistrare -->
            <input v-model="email" class="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Email" />
            <input v-model="username" class="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Username" />
            <input v-model="password" type="password" class="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Password" />
            <input v-model="confirmPassword" type="password" class="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Confirm password" />

            <!-- Butonul pentru înregistrare -->
            <button 
                @click="register" 
                class="w-full bg-[#177170] text-white p-3 rounded-lg hover:bg-[#115251] transition"
            >
                SignUp
            </button>

            <!-- Mesajul de tip text, dacă există -->
            <p class="text-red-500 text-center mt-3" v-if="message">{{ message }}</p>

            <!-- Link către login -->
            <p class="text-[#177170] text-center mt-4">Already have an account?</p>
            
            <router-link 
                to="/" 
                class="block text-center text-[#177170] font-semibold mt-2 hover:underline"
            >
                Login
            </router-link>
        </div>
    </div>
</template>  