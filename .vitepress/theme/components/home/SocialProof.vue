<script setup>
const frameworks = [
  'MyBatis-Plus',
  'MPJ 联表',
  'Spring Boot',
  'XML Mapper',
  '注解 SQL',
  'SQL 日志',
  '批量操作',
  'SQL 补全',
]
</script>

<template>
  <section class="social-proof-section">
    <div class="container">
      <p class="social-proof-text">支持多种 SQL 调试场景</p>
      <div class="social-proof-logos">
        <div v-for="fw in frameworks" :key="fw" class="social-proof-logo">
          {{ fw }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.social-proof-section {
  padding: 3rem 0;
  background-color: var(--bg-secondary);
}

.social-proof-text {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.social-proof-logos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  opacity: 0.5;
}

.social-proof-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-secondary);
  opacity: 0.7;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .social-proof-logos {
    gap: 1.5rem;
  }
  .social-proof-logo {
    font-size: 1.125rem;
  }
}
</style>
