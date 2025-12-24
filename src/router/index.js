import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import AddWalk from "@/views/AddWalk.vue"; 

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/add-walk",
        name: "AddWalk",
        component: AddWalk,

    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;