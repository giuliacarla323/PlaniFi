<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const message = ref("");

const sendResetEmail = async () => {
    try {
        const response = await axios.post("http://localhost:3000/auth/reset-password", {
            email: email.value,
        });
        message.value = response.data.message;
    } catch (error) {
        message.value = "❌ " + (error.response?.data?.error || " Error sending the email");
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-[radial-gradient(circle,_rgba(240,192,213,1)_0%,_rgba(148,233,232,1)_83%,_rgba(180,242,198,1)_100%)]">
        <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold mb-4 text-center text-[#177170]">Password Reset</h2>
            <input
                v-model="email"
                placeholder="Email"
                class="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <button
                @click="sendResetEmail"
                class="w-full bg-[#177170] text-white p-3 rounded-lg hover:bg-[#115251]"
            >
            Send Reset Email
            </button>
        
            <p class="text-center text-red-500 mt-4" v-if="message">{{ message }}</p>
            
            <router-link 
                to="/" 
                class="block text-center text-[#177170] font-semibold mt-2 hover:underline"
            >
                Go Back To Login Page
            </router-link>
        </div>
    </div>
</template>
