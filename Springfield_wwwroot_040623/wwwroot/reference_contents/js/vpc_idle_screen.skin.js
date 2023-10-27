const vpc_idle = window['com.igt.vpc_idle_screen']("#app", {
	state: {
		preferredDisplayType: "normal",
		adPlayerFormat: "short/full/standard/custom"
	},
	data() {
		return {
			adPlayerWidth: 0,
			adPlayerHeight: 0,
			ro: null
		}
	},
	mounted() {
		var self = this;
		this.ro = new ResizeObserver(function (entries) {
		  for (const entry of entries) {
			const cr = entry.contentRect;
			self.adPlayerWidth = Math.round(cr.width * self.$root.matrix[0]);
			self.adPlayerHeight = Math.round(cr.height * self.$root.matrix[0]);
		  }
		});
		this.ro.observe(document.getElementById("adPlayer"));
	},
	beforeDestroyed() {
		this.ro.unobserve(document.getElementById("adPlayer"));
		this.ro = null;
	},
	computed: {
		adPlayerSrc() {
		  if (this.appConfig == null) return "";
		  if (!this.appConfig.hasOwnProperty('adServiceAddress')) return "";
		  if (this.displayName === "") return "";
		  if (this.floorLocation === "") return "";
		  if (this.machineNumber === "") return "";
		  if (this.adPlayerWidth === 0) return "";
		  if (this.adPlayerHeight === 0) return "";
		  return `${this.appConfig.adServiceAddress}/ad-service/client/?name=Vpc-Idle-${this.displayName}&size=${this.adPlayerWidth}x${this.adPlayerHeight}&location=${this.floorLocation}&machineNumber=${this.machineNumber}`
		}
	}, 
	methods: {
		yourPlay() {
			this.$store.dispatch("waitForNavigateToVpcLas");
	    }
	}
});

