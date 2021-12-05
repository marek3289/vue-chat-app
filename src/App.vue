<template>
  <router-view />
</template>

<script setup lang="ts">
import "nprogress/nprogress.css";
import "@/styles/tailwind.css";
</script>

<style>
html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
  -moz-appearance: none; 
  -webkit-appearance: none; 
  appearance: none;
}

#app {
  height: 100vh;
  width: 100vw;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: #F8FAFC;
}

.dot-elastic {
  position: relative;
  width: 6px;
  height: 6px;
  border-radius: 5px;
  background-color: #919191;
  color: #919191;
  animation: dotElastic 1s infinite linear;
}

.dot-elastic::before, .dot-elastic::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-elastic::before {
  left: -10px;
  width: 6px;
  height: 6px;
  border-radius: 5px;
  background-color: #919191;
  color: #919191;
  animation: dotElasticBefore 1s infinite linear;
}

.dot-elastic::after {
  left: 10px;
  width: 6px;
  height: 6px;
  border-radius: 5px;
  background-color: #919191;
  color: #919191;
  animation: dotElasticAfter 1s infinite linear;
}

@keyframes dotElasticBefore {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1.5);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}

@keyframes dotElastic {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 1.5);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}

@keyframes dotElasticAfter {
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1.5);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
