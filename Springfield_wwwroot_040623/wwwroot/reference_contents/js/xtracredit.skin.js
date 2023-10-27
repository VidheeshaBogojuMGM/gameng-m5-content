var statusRespMsg = {
	activate: {
		0: "{0} active.",
		1: "{0} active; not cancelable.",
		2: "{0} already active.",
		3: "{0} balance is too low to activate.",
		4: "{0} not active; not available on this device.",
		5: "{0} not active; see players club.",
		6: "{0} not active; duplicate card.",
		7: "{0} not active; abandoned card.",
		8: "{0} not active; PIN is locked.",
		9: "{0} not active; Bonusing not available on this machine.",
		10: "{0} not active; PIN validation failed."
	},
	cancel: {
		0: "{0} canceled.", //gets mapped to a single enum list in for a single html status element
		1: "{0} not cancelable.",
		2: "Cancel " + "{0} after game cycle completes."
	}
};

var statusDisplayMsg = {
	"success": "{0} Succeeded!!!",
	"fail": "{0} Failed!!!",
	"processing": "{0} in progress..."
}

const cancelOpe = "Cancel";
const activationOpe = "Activation";

const XC = window['com.igt.xtracredit']("#app", {
	data() {
		return {
			pid: Math.random(),
			showDetailMsg: false,
			showButtonSucceed: false,
			showButtonFailed: false,
			statusMsg: "",
			detailMsg: "",
			errorMessage: "",
			isActiveOpe: true,
			xcToActive: 0,
			isLoading: false,
			page: {
				sessionpane: true,
				selectpane: false,
				msgpane: false,
			}
		}
	},
	components: {
		"digitalpanel": loadSkinTemplate("./components/digitalpanel.htm"),
	},
	mounted() {
		this.$store.state.preferToUseOldAPI = false;
		this.$store.state.needToUseRoundDown = true;
	},
	methods: {
		activateXC() {
			this.analytics.trackPress("activateXC");
			this.startProgress(activationOpe);

			this.isActiveOpe = true;
			this.$store.dispatch("activeXC", this.xcToActive);
		},
		transferAll() {
			this.xcToActive = this.XCInactiveAmout;
			this.activateXC();
		},
		transferAmount() {
			this.pid = Math.random();
			this.changePage(1);
		},
		clearXC() {
			this.analytics.trackPress("clearXC");
			this.startProgress(cancelOpe);

			this.isActiveOpe = false;
			this.$store.dispatch("cancelXC");
		},
		startProgress(op) {
			this.changePage(2);
			this.isLoading = true;
			this.statusMsg = this.changePlaceholder(statusDisplayMsg.processing.translate(), op.translate());
			this.showDetailMsg = false;
			this.showButtonFailed = false;
			this.showButtonSucceed = false;
		},
		confirm() {
			if (this.xcToActive > this.XCInactiveAmout) {
				this.errorMessage = "Exceed Limit";
			}
			else if (this.xcToActive == 0) {
				this.errorMessage = "Invalid Number";
			}
			else
				this.activateXC();
		},
		backToApps() {
			this.analytics.trackPress("backToApps");
			window.history.back();
		},
		backToHome() {
			if(this.goHomeTimer){
				clearTimeout(this.goHomeTimer);
				this.goHomeTimer = null;
			}

			this.analytics.trackPress("backToHome");
			this.xcToActive = 0;
			this.changePage(0);
		},
		retry() {
			if (!this.isActiveOpe) {
				this.clearXC();
			} else {
				this.activateXC();
			}
		},
		onEnter() { },
		getDigitalFromPanel(data) {
			this.xcToActive = data;
		},
		changePage(pageIndex) {
			this.page.sessionpane = pageIndex === 0;
			this.page.selectpane = pageIndex === 1;
			this.page.msgpane = pageIndex === 2;
		},
		showResult(res, ope, success) {
			var msg = '';

			var xcName = (this.CasinoNameForXtraCredit == null ? 'Freeplay' : this.CasinoNameForXtraCredit).translate();

			if (ope == activationOpe) {
				msg = this.changePlaceholder(statusRespMsg.activate[res.status].translate(), xcName);
			} else {
				msg = this.changePlaceholder(statusRespMsg.cancel[res.status].translate(), xcName);
			}

			if (success) {
				if (ope == activationOpe)
					this.statusMsg = this.currencySymbol.translate() + this.formattedXCAmount + " " + this.changePlaceholder(statusDisplayMsg.success.translate(), ope.translate());
				else
					this.statusMsg = this.changePlaceholder(statusDisplayMsg.success.translate(), ope.translate())

				this.showDetailMsg = false;
				this.showButtonFailed = false;
				this.showButtonSucceed = true;
			} else {
				this.statusMsg = this.changePlaceholder(statusDisplayMsg.fail.translate(), ope.translate());
				this.detailMsg = msg;

				this.showDetailMsg = true;
				this.showButtonFailed = true;
				this.showButtonSucceed = false;
			}

			this.isLoading = false;
		},
	},
	computed: {
		largeH() {
			return this.contentWidth / this.contentHeight > 5;
		},
		smallH() {
			return this.contentWidth / this.contentHeight < 5 && this.contentWidth > this.contentHeight;
		},
		changePlaceholder() {
			return this.$options.filters.changePlaceholder;
		},
		showTransferSome() {
			return this.isNewVersionUsed && this.XCInactiveAmout > 0;
		},
		showTransferAll() {
			return this.XCInactiveAmout > 0;
		}
	},
	watch: {
		XCActiveStatus(newVal) {
			if (typeof (newVal.status) === 'undefined')
				return;

			if (newVal.status === 0 || newVal.status === 1) {
				this.goHomeTimer = setTimeout(() => this.backToApps(), 5000); //add a property to store timer variable
				this.showResult(newVal, activationOpe, true);
			} else {
				if (this.PinInvalidStatus.status == 2)
					IGTMediaElements.util.log.info("XCActiveStatus: received pin invalid status " + this.PinInvalidStatus.status);
				else
					this.showResult(newVal, activationOpe, false);
			}
		},
		XCCancelStatus(newVal) {
			if (typeof (newVal.status) === 'undefined')
				return;
			newVal.status -= Object.keys(IGTMediaElements.statuses.xtraCredit.activate).length;
			this.showResult(newVal, cancelOpe, newVal.status === 0)
		}
	}
});
