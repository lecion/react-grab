<template>
  <div class="user-profile">
    <h2>User Profile</h2>
    <UserCard :user="user" />
  </div>
</template>

<script>
import UserCard from './UserCard.vue';

export default {
  name: 'UserProfile',
  components: {
    UserCard
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.user-profile {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
