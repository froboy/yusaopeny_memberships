<template>
  <div id="app" :class="'membership-app ' + $router.currentRoute.name">
    <router-view @go-next="goNext" @go-prev="goPrev" @go-home="goHome" />
  </div>
</template>

<script>
import Vue from 'vue'
import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

export default {
  name: 'App',
  computed: {
    step() {
      return this.$store.state.step
    }
  },
  mounted() {
    this.$store.commit('setStep', 1);
    let stepsConfig = window.drupalSettings.openy_memberships_front && window.drupalSettings.openy_memberships_front.steps ? window.drupalSettings.openy_memberships_front.steps : null;
    if (stepsConfig) {
      this.$store.commit('setSteps', stepsConfig);
    }
    let step = this.$store.state.step;
    let steps = this.$store.state.steps;
    if (steps[step] && this.$route.name != steps[step]) {
      this.$router.replace({ name:  steps[step] })
    }
    if (!this.$route.name) {
      this.$router.replace({ name:  steps[0] })
    }
    // Check if user has selected Home Branch and set location.
    if (this.$cookies.get('home_branch').id !== null) {
      this.$store.commit('setLocation', this.$cookies.get('home_branch').id);
      // Move to next step if we still on initial step.
      if (step == 0 && this.$cookies.get('home_branch').id !== null) {
        this.$store.commit('setStep', 1);
      }
    }
  },
  data: () => ({
    //
  }),
  methods: {
    goNext() {
      let currentStep = this.$store.state.steps.indexOf(this.$route.name);
      if(currentStep !== -1 && currentStep + 1 < this.$store.state.steps.length) {
        this.$store.commit('setStep', currentStep + 1)
      }
      if (currentStep + 1 === this.$store.state.step) {
        this.navigateToPage();
      }
    },
    goPrev() {
      let currentStep = this.$store.state.steps.indexOf(this.$route.name);
      if(currentStep !== -1 && currentStep - 1 < this.$store.state.steps.length) {
        this.$store.commit('setStep', currentStep -1);
      }
      if (currentStep - 1 === this.$store.state.step) {
        this.navigateToPage();
      }
    },
    goHome() {
      this.$store.commit('setStep', 0);
      this.navigateToPage();
    },
    navigateToPage() {
      let header = window.document.querySelector('.main-header .top-navs');
      let block = window.document.getElementsByClassName('paragraph--type--memberships');

      if (header && block) {
        let topOffset = window.scrollY + block[0].getBoundingClientRect().top - header.offsetHeight - header.getBoundingClientRect().top - 100;
        window.scrollTo(0, topOffset);
      }

      let step = this.$store.state.step;
      let steps = this.$store.state.steps;
      if (steps[step] && this.$route.name != steps[step]) {
        this.$router.push({ name:  steps[step] })
      }
    }
  },
  watch: {
    '$route' (to) {
      let step = this.$store.state.step;
      let currentStep = this.$store.state.steps.indexOf(to.name);

      if (currentStep != -1 && step != currentStep) {
        this.$store.commit('setStep', currentStep)
      }
    },
    step() {
      this.navigateToPage();
    }
  }
};
</script>

<!-- Make sure app.css gets generated. -->
<style>
.membership-app {
  display: inherit;
}
</style>
