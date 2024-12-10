export default {
  setSteps(state, steps) {
    state.steps = steps
  },
  setStep(state, step) {
    state.step = step
  },
  setLocation(state, location) {
    state.location = location
  },
  setLocationBranch(state, location) {
    state.locationBranch = location;
  },
  setSelectedPackageUrl(state, items) {
    state.selectedPackageUrl = items.value;
  },
  setFamily(state, family) {
    state.family[family.key].count = family.value;

    let totalCount = 0;
    Object.keys(state.family).forEach(element => {
      totalCount = totalCount + state.family[element].count;
    });
    state.familyTotalCount = totalCount;
  },
  setFamilyTerm(state, family) {
    if(!state.family[family.key] || !state.family[family.key].count ) {
      state.family[family.key] = {
        count: 0
      }
    }
    state.family[family.key].term_id = family.value;
    state.family[family.key].title = family.title;
  },
  deleteFamilyKey(state, key) {
    this._vm.$delete(state.family, key);
  },
  setProduct(state, product) {
    state.product = product
  },
  setItem(state, item) {
    state[item.key] = item.value
  },
  clearStorage(state) {
    state.family = {
      adults: 0,
      youth: 0,
      seniors: 0
    }
    state.familyTotalCount = 0
    state.location = null
    // state.product = null
    state.keepCart = false
    state.members = []
    state.income = 0
    state.billing = {}
  }
}
