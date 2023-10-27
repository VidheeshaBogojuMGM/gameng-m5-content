<template>
  <div class="wrapper">
    <header>
      <img src="assets/icons/playMyWay-01.svg" alt="Responsible Gaming" class="logo" />
      <div style="position: relative; top: 60px">
        <input
          type="text"
          style="width: 250px"
          autofocus
          placeholder="Enter card no"
          v-model="cardId"
        />
        <button :disabled="!cardId" v-on:click="login(cardId)">Login</button>
      </div>
    </header>
    <section>
      <ul>
        <li>
          <h6>
            To enroll in program<br />
            swipe your card
          </h6>
        </li>
        <li>
          <img
            src="assets/icons/pointingHand.svg"
            alt="swipe your card"
            class="pointer"
          />
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
module.exports = {
  name: "App",
  data: function () {
    return {
      view: "",
      cardId: "",
    };
  },
  beforeCreate() {
    if (this.$route.query.kioskId) {
      localStorage.setItem("kioskId", this.$route.query.kioskId);
    } else {
      localStorage.removeItem("kioskId");
    }
    this.$root.buttons = [];
    localStorage.setItem("isLoggedIn", false);
  },
  methods: {
    login: function (cardId) {
      let vm = this;
      vm.$root.service.validateCard(cardId).then(function (response) {
        if (response.data.playerId) {
          let playerId = response.data.playerId;
          let kioskId = localStorage.getItem("kioskId");

          localStorage.setItem("isLoggedIn", true);
          vm.$router.push({
            path: "/index",
            query: { playerId: playerId, kioskId: kioskId },
          });
        }
      });
    },
  },
  watch: {
    cardId(value) {
      this.cardId = value.replace(/\W/g, "");
    },
  },
};
</script>