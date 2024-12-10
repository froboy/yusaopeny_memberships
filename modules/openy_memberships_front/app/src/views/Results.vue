<template>
  <section class="app-container">
    <h1 class="title">
      Membership Builder
    </h1>
    <h3 class="subtitle">
      You’ve selected: <strong><span v-if="selectedFamily">{{ selectedFamily }}</span> <span
        v-if="selectedBranch">at {{ selectedBranch.name }}</span></strong>
    </h3>
    <div class="description" v-if="products.length">
      <div class="description-text--small">
        {{ descriptionText }}
      </div>
    </div>
    <div class="cta" v-if="products.length">
      Select an Adult Membership type:
    </div>
    <div class="product-wrapper">
      <loading :active.sync="isLoading"></loading>
      <products @go-next="$emit('go-next')" v-if="products.length" :products="products"/>
      <div class="no-result" v-if="!products.length">
        No suitable products were found.
      </div>
    </div>

    <div class="navigation">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-auto mr-auto">
            <button class="btn btn-prev" @click="$emit('go-prev')">PREVIOUS STEP</button>
          </div>
          <div class="col-auto ml-auto">
            <a class="btn btn-next" :disabled="!$store.state.selectedPackageUrl"
               :href="$store.state.selectedPackageUrl">SELECT & PAY</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Products from '../components/Products'

export default {
  mounted() {
    this.isLoading = true;
    this.selectedFamily = [];
    let family = this.$store.state.family;
    let family_option = ''
    for (let type_uuid in family) {
      let count = family[type_uuid].count;
      let term_id = family[type_uuid].term_id;
      family_option += term_id + '_' + count + ';';

      if (count > 0) {
        this.selectedFamily.push(family[type_uuid].title);
      }
    }

    this.selectedFamily = this.selectedFamily.join(', ');
    this.selectedBranch = this.$store.state.locationBranch;

    window.jQuery.ajax({
          url: '/memberships/api/products/' + (this.$store.state.location ? this.$store.state.location : '') + '/' + family_option,
          dataType: 'json',
          data: {}
        }
    ).then((data) => {
      this.isLoading = false;
      this.products = Object.keys(data).map(product => data[product]);
    }).catch(() => {
      this.isLoading = false
    })
  },
  components: {
    Loading,
    Products
  },
  data() {
    return {
      isLoading: false,
      products: [],
      selectedFamily: '',
      selectedBranch: ''
    }
  },
  computed: {
    descriptionText() {
      return this.selectedBranch.name === 'Glastonbury YMCA'
          ? 'Glastonbury memberships are only valid at the Glastonbury location. A one-time joining fee of $25 (adult, senior, young adult) or $50 (couple or senior couple) will be added to your membership.'
          : 'As a member of the YMCA of Greater Hartford, you can use all of our facilities. Your "home" branch should be the one you intend to use most. A one-time joining fee of $25 (adult, senior, young adult) or $50 (couple, family or senior couple) will be added to your membership.';
    }
  }
}
</script>
