<template>
  <BaseWindow :item="item" className="loading-view">
    <template v-slot:body>
      <div class="message"> {{ state.message }}</div>
      <div class="loading">
        <figure>
          <section>
            <div></div>
          </section>
          <section>
            <div></div>
          </section>
          <section>
            <div></div>
          </section>
          <section>
            <div></div>
          </section>
          <section>
            <div></div>
          </section>
          <section>
            <div></div>
          </section>
          <section>
            <div></div>
          </section>
          <section>
            <div></div>
          </section>
        </figure>
      </div>
    </template>
    <template v-slot:header>
      <header>提示</header>
    </template>
  </BaseWindow>

</template>


<script setup>
import { defineProps, reactive } from "vue";
import BaseWindow from "../components/window.vue";

const props = defineProps({
  item: Object,
  actionWindowId: String,
});
let state = reactive({ ...props.item.data });
</script>

<style>
@keyframes move {
  from {
    transform: translate(0, 50%);
  }
  to {
    transform: translate(0, 850%);
  }
}

figure > section:nth-child(1) > div {
  animation-delay: -0.875s;
}
figure > section:nth-child(2) > div {
  animation-delay: -0.75s;
}
figure > section:nth-child(3) > div {
  animation-delay: -0.625s;
}
figure > section:nth-child(4) > div {
  animation-delay: -0.5s;
}
figure > section:nth-child(5) > div {
  animation-delay: -0.375s;
}
figure > section:nth-child(6) > div {
  animation-delay: -0.25s;
}
figure > section:nth-child(7) > div {
  animation-delay: -0.125s;
}

figure {
  width: 70px;
  height: 70px;
  position: relative;
}

section {
  width: 10%;
  height: 100%;
  position: absolute;
  left: 45%;
}

section:nth-child(2) {
  transform: rotate(22.5deg);
}
section:nth-child(3) {
  transform: rotate(45deg);
}
section:nth-child(4) {
  transform: rotate(67.5deg);
}
section:nth-child(5) {
  transform: rotate(90deg);
}
section:nth-child(6) {
  transform: rotate(112.5deg);
}
section:nth-child(7) {
  transform: rotate(135deg);
}
section:nth-child(8) {
  transform: rotate(157.5deg);
}

figure div {
  height: 10%;
  border-radius: 50%;
  background: dodgerblue;
  animation: move 1s ease-in-out infinite alternate;
}
</style>