<template>
  <div class="user-settings">
    <h3>User Settings</h3>
    <div class="settings-form">
      <div class="form-group">
        <label>Username:</label>
        <input type="text" :value="'User ' + userId" />
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" :value="`user${userId}@example.com`" />
      </div>
      <div class="form-group">
        <label>Notifications:</label>
        <input type="checkbox" checked />
        <span>Enable email notifications</span>
      </div>
      <button class="save-button">Save Settings</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSettings',
  computed: {
    userId() {
      return this.$route.params.id;
    }
  }
};
</script>

<style scoped>
.user-settings {
  padding: 20px;
}

.settings-form {
  margin-top: 15px;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="email"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group input[type="checkbox"] {
  margin-right: 8px;
}

.save-button {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-button:hover {
  background: #35a372;
}
</style>
