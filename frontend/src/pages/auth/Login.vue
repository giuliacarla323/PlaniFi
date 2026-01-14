<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useUserStore } from '../../store/user';

const email = ref("");
const password = ref("");
const message = ref("");

const router = useRouter();
const userStore = useUserStore();

const login = async () => {
    try {
        const response = await axios.post("http://localhost:3000/auth/login", { 
            email: email.value, 
            password: password.value 
        });

        message.value = response.data.message;

        // Dacă login-ul e cu succes, redirect către Home
        if (response.data.success) {
    // Salvezi user-ul primit în localStorage
    //localStorage.setItem("user", JSON.stringify(response.data.user));
    


userStore.setUser(response.data.user);

    setTimeout(() => {
        router.push("/home");
    }, 2000);


}


    } catch (error) {
        message.value = "❌ Login error: " + error.response?.data?.error;
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-[radial-gradient(circle,_rgba(240,192,213,1)_0%,_rgba(148,233,232,1)_83%,_rgba(180,242,198,1)_100%)]">
        <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h1 class="text-4xl font-bold text-[#177170] text-center mb-4">Welcome To PlaniFi!</h1>
            
            <p class="text-[#177170] text-center mb-6">Login To Continue</p>

            <input v-model="email" class="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Email" />
            <input v-model="password" type="password" class="w-full p-3 border border-gray-300 rounded-lg mb-4" placeholder="Password" />
            
            <button 
                @click="login" 
                class="w-full bg-[#177170] text-white p-3 rounded-lg hover:bg-[#115251] transition cursor-pointer"
            >
                Login
            </button>

            <p class="text-[#177170] text-center mt-4">New user?</p>
            
            <router-link 
                to="/signup" 
                class="block text-center text-[#177170] font-semibold mt-2 hover:underline cursor-pointer"
            >
                Create an Account
            </router-link>

            <p class="text-[#177170] text-center mt-2">
                <router-link 
                    to="/reset-password" 
                    class="text-[#177170] font-semibold hover:underline cursor-pointer"
                >
                Forgot your Password?
                </router-link>
            </p>

            <p class="text-red-500 text-center mt-3" v-if="message">{{ message }}</p>
        </div>
    </div>
</template>
