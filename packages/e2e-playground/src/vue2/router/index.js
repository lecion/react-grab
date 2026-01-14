import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import User from '../views/User.vue';
import UserPosts from '../views/UserPosts.vue';
import UserSettings from '../views/UserSettings.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/user/:id',
    name: 'User',
    component: User,
    children: [
      {
        path: 'posts',
        name: 'UserPosts',
        component: UserPosts
      },
      {
        path: 'settings',
        name: 'UserSettings',
        component: UserSettings
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'hash',
  routes
});

export default router;
