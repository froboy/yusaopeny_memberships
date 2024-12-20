<template>
  <section class="app-container">
    <loading :active.sync="isLoading"></loading>
    <h1 class="title">
      Membership Builder
    </h1>
    <div class="description">
      <div class="description-text">
        What type of Membership would you like to purchase?
      </div>

      <div class="d-block d-lg-none">
        <a class="view-loactions" href="/membership-qa">View member benefits<ViewLocationIcon name="ViewBenefits" /></a>
      </div>

      <div class="mt-2 back-to-start alert alert-warning" v-if="!$store.state.location">
        <p class="description-text">There seems to be a problem.</p>
        <button class="btn btn-prev btn-outline-info" @click="$emit('go-home')">Please try again</button>
      </div>
    </div>

    <div class="family-wrapper">
      <div class="item-wrapper" :key="index" v-for="(group, index) in age_groups">
        <div class="item">
          <input type="radio" :value="group.uuid" :id="group.uuid" v-model="picked" @click="updateFamily(group.uuid, $event)"/>
          <label class="label" :for="group.uuid">{{ group.title }}</label>
        </div>
      </div>
    </div>
    <div class="navigation" v-if="totalCount > 0">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-auto mr-auto">
            <button class="btn btn-prev" @click="$emit('go-prev')">PREVIOUS STEP</button>
          </div>
          <div class="col-auto ml-auto">
            <button class="btn btn-next" @click="$emit('go-next')">NEXT STEP</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Cart from '../helpers/Cart';

import ViewLocationIcon from "@/assets/launch.svg?inline";

export default {
  mounted() {
    this.isLoading = true;
    this.totalCount = this.totalCountCalc();
    this.locationId = this.getLocationId();
    Cart.getAgeGroups(this.locationId).then(json => {
      let leave_items = {};
      this.age_groups = Object.keys(json).map((key) => {
        leave_items[json[key].uuid] = true;
         this.$store.commit('setFamilyTerm', {
            key: json[key].uuid,
            value: key,
            title: json[key].title,
            weight: json[key].weight,
         })
        return {key: key, title: json[key].title, uuid: json[key].uuid, weight: json[key].weight,};
      })
      this.age_groups.sort((a, b) => (a.weight > b.weight) ? 1 : ((b.weight > a.weight) ? -1 : 0))
      Object.keys(this.$store.state.family).forEach((key) => {
        if (!leave_items[key]) {
          this.$store.commit('deleteFamilyKey', key);
        }
      })
      this.isLoading = false;
    }).catch(() => {
      this.isLoading = false;
    });
  },
  computed: {
    family() {
      return this.$store.state.family;
    }
  },
  components: {
    Loading,
    ViewLocationIcon
  },
  data() {
    return {
      isLoading: false,
      age_groups: [],
      totalCount: 0,
      locationId: '',
      picked: '',
    }
  },
  methods: {
    updateFamily(group_uuid, event) {
      if (event.target.checked) {
        this.$store.state.family[group_uuid].count = 1;
      }
      else {
        this.$store.state.family[group_uuid].count = 0;
      }
      this.totalCount = this.totalCountCalc(group_uuid);
    },
    totalCountCalc(group_uuid = null) {
      let count = 0;
      Object.keys(this.$store.state.family).forEach(element => {
        if ((element !== group_uuid) && (group_uuid !== null)) {
          this.$store.state.family[element].count = 0;
        }

        if (this.$store.state.family[element].count) {
          this.picked = element;
        }

        count = count + this.$store.state.family[element].count;
      });
      return count;
    },
    getLocationId() {
      let memberships = window.localStorage.getItem('memberships');
      memberships = JSON.parse(memberships);
      if (memberships['location'] === null) {
        // This doesn't work. I still don't know why.
        this.$router.push({ name: 'BranchSelectorHome' });
      }
      return memberships['location'];
    }
  }
}
</script>
