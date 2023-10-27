<template>
  <div class="page-content">
    <div class="content-text">
      <p class="display-1 font-weight-bold mb-3 font-green">
          THANK YOU FOR TRYING {{$root.appTitle.toUpperCase()}}!
      </p>
      <p class="body-1">
          You can re-enroll at anytime.
      </p>
    </div>
  </div>  
</template>
<script>
module.exports = {
  name: 'App',
  beforeCreate() {
    this.$root.buttons=[];
    this.$root.title="UN-ENROLLMENT SUCCESSFUL";
  },
}
</script>
