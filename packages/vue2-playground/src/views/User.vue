<template>
  <div class="user">
    <h2>User View - ID: {{ userId }}</h2>
    <UserProfile :user="userData" />

    <div class="user-nav">
      <router-link :to="`/user/${userId}/posts`">Posts</router-link> |
      <router-link :to="`/user/${userId}/settings`">Settings</router-link>
    </div>

    <div class="user-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import UserProfile from '../components/UserProfile.vue';

export default {
  name: 'User',
  components: {
    UserProfile
  },
  computed: {
    userId() {
      return this.$route.params.id;
    },
    userData() {
      return {
        name: `User ${this.userId}`,
        email: `user${this.userId}@example.com`
      };
    }
  }
};
</script>

<style scoped>
.user-nav {
  margin: 20px 0;
  padding: 15px;
  background: #f0f0f0;
  border-radius: 8px;
}

.user-nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #42b983;
  font-weight: 500;
}

.user-nav a.router-link-exact-active {
  color: #35495e;
  font-weight: bold;
}

.user-content {
  margin-top: 20px;
  border: 2px solid #42b983;
  border-radius: 8px;
  min-height: 200px;
}
</style>
