const idle = window['com.igt.idle_screen']("#app", {
	state: {
		preferredDisplayType: "normal",
		adPlayerFormat: "short/full/standard/custom",
		showCSDiagnostic: false
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
		  let displayResolution = this.displayName.replace('_', '');
		  console.log('displayResolution: ' + displayResolution);
		  if (this.appConfig.ads) {
		    var displayName = "IDLE_" + displayResolution;
		    const displayConfig = this.appConfig.ads[displayName];
		    return window.adurl = `${this.appConfig.adServiceAddress}/ad-service/client/?name=Idle${displayResolution}-${displayConfig.size}&size=${displayConfig.size}&location=${this.floorLocation}&machineNumber=${this.machineNumber}`
		  }
		  return `${this.appConfig.adServiceAddress}/ad-service/client/?name=Idle-${this.displayName}&size=${displayConfig.size}&location=${this.floorLocation}&machineNumber=${this.machineNumber}`;
		}
	},
	methods: {
		getQRCode() {
			this.$store.dispatch("getQRCode");
		}
	}
});

$('#info').click(function () {
	idle.analytics.trackNavigate("property_info");
  idle.navigate("./property_info.html");
});

idle.vm.$on('CSCDisplayChanged', ({compShowing, status})=>{
	console.log("CS comp is showing: ", compShowing, "current cardless status: ", status)
	if(!compShowing && status != null)
	{
		idle.state.showCSDiagnostic = true;
		setTimeout(()=>{
			idle.state.showCSDiagnostic = false;
		}, 15000)
	}
})

var qrcodeInstance = null;
idle.watch("qrcode", function (value) {
	if (value) {
		qrcodeInstance = new QRCode(document.getElementById("qrcode"), {
			text: value.qrCode,
			width: 128,
			height: 128,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: QRCode.CorrectLevel.H
		});
	} else {
		qrcodeInstance.clear();
	}
})
