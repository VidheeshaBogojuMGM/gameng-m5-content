var mockAPI = {
  "/VDMWebPortal/api/vdm/PlayerPromoAwardsData/": {
    "PromoAwards": [{
      PromotionName: "promo1",
      PromoAwardId: 1,
      PromoAwardName: "promoAward1",
      AvailableTicketNumber: 2131,
      AvailableFreeEntryNumber: 500,
      TicketsAvailable: 20,
      TicketsUsed: 0,
      AutoRedeemServerSideEnabled: false,
      Drawings: [{
        PromoAwardId: 1,
        DrawingId: 1,
        DrawingName: "Drawing Massive award 1",
        DrawingDate: Date.now() + 10000000000,
        vip: false,
        CheckInStartTime: Date.now(),
        CheckInEndTime: Date.now() + 100000,
        TicketsUsed: 0,
        AvailableFreeEntryNumber: 500,
        TicketsAvailable: 22,
        VipDrawingTicketNumber: 11,
        AvailableTicketNumber: 10,
        IsAutoRedeemSet: false,
        IsCheckInNeeded: false,
        PlayerAlreadyCheckedIn: false,
        TicketsCountInEscrowBucket: 0
      }]
    }],
    "Success": true,
    "ErrorCode": 0,
    "ErrorMessage": ""
  }
}

window.VDM = window["com.igt.VDM"](
  "#app", {
    state: {},
    computed: {
      shouldShowInfo() {
        return this.$root.info.length > 0 || this.$root.isFetching;
      }
    },
    created() {
      // this.$store.state.mockAPI = mockAPI;
      if (this.$store.state.launchURL) {
        this.$router.push(this.$store.state.launchURL);
      }
    },
    routes: [{
        name: "message",
        path: "/",
        component: loadSkinTemplate("./components/vdm/message.htm")
      },
      {
        name: "promotion",
        path: "/promotion",
        component: loadSkinTemplate("./components/vdm/promotion.htm")
      },
      {
        name: "drawing",
        path: "/drawing",
        component: loadSkinTemplate("./components/vdm/drawing.htm")
      },
      {
        name: "award",
        path: "/award",
        component: loadSkinTemplate("./components/vdm/award.htm")
      },
      {
        name: "enterAll",
        path: "/enterAll",
        component: loadSkinTemplate("./components/vdm/enterAll.htm")
      },
      {
        name: "enterSome",
        path: "/enterSome",
        component: loadSkinTemplate("./components/vdm/enterSome.htm")
      },
      {
        name: "enteringTickets",
        path: "/enteringTickets",
        component: loadSkinTemplate("./components/vdm/enteringTickets.htm")
      },
      {
        name: "done",
        path: "/done",
        component: loadSkinTemplate("./components/vdm/done.htm")
      },
      {
        name: "claimPrize",
        path: "/claimPrize/:playerId",
        component: loadSkinTemplate("./components/vdm/sse/claimPrize.htm")
      },
      {
        name: "winnerList",
        path: "/winnerList",
        component: loadSkinTemplate("./components/vdm/sse/winnerList.htm")
      },
      {
        name: "winningTicketList",
        path: "/winningTicketList",
        component: loadSkinTemplate("./components/vdm/sse/winningTicketList.htm")
      },
      {
        name: "awardNotification",
        path: "/awardNotification",
        component: loadSkinTemplate("./components/vdm/sse/awardNotification.htm")
      },
      {
        name: "drawingComplete",
        path: "/drawingComplete",
        component: loadSkinTemplate("./components/vdm/sse/drawingComplete.htm")
      },
      {
        name: "drawingInProgress",
        path: "/drawingInProgress",
        component: loadSkinTemplate("./components/vdm/sse/drawingInProgress.htm")
      },
      {
        name: "selectionInProgress",
        path: "/selectionInProgress",
        component: loadSkinTemplate("./components/vdm/sse/selectionInProgress.htm")
      },
      {
        name: "pinpad",
        path: "/pinpad",
        component: loadSkinTemplate("./components/vdm/common/pinpad.htm")
      },
      {
        name: "redeemcomplete",
        path: "/redeemcomplete",
        component: loadSkinTemplate("./components/vdm/redeemComplete.htm")
      }
    ]
  },
  function () {
    this.component("info", loadSkinTemplate("./components/vdm/common/info.htm")),
      this.component("app", loadSkinTemplate("./components/vdm/common/app.htm")),
      this.component("bar", loadSkinTemplate("./components/vdm/common/bar.htm")),
      this.component("pinpad", loadSkinTemplate("./components/vdm/common/pinpad.htm")),
      this.component(
        "pagelist",
        loadSkinTemplate("./components/vdm/common/pageList.htm")
      ),
      this.component(
        "pagecontroller",
        loadSkinTemplate("./components/vdm/common/pageController.htm")
      ),
      this.component(
        "progressbar",
        loadSkinTemplate("./components/vdm/common/progressBar.htm")
      ),
      this.component("spinner", loadSkinTemplate("./components/vdm/common/spinner.htm")),
      this.component(
        "countdown",
        loadSkinTemplate("./components/vdm/common/countdown.htm")
      ),
      this.component(
        "commonshell",
        loadSkinTemplate("./components/vdm/sse/commonShell.htm")
      ),
      this.component(
        "notificationbar",
        loadSkinTemplate("./components/vdm/sse/bar.htm")
      ),
      this.component(
        "notificationbanner",
        loadSkinTemplate("./components/vdm/sse/banner.htm")
      ),
      this.component(
        "dotloading",
        loadSkinTemplate("./components/vdm/common/dotloading.htm")
      ),
      this.filter("formatDate", function (time) {
        let fmt = "hh:mm AP on MMM dd yyyy"; // sample formate data
        const date = new Date(time);
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
        }
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        if (/(M+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, String(months[date.getMonth()]));
        }
        const o = {
          'd+': date.getDate(),
          'h+': date.getHours() > 12 ? (date.getHours() - 12) : date.getHours(),
          'm+': date.getMinutes(),
          'AP': (date.getHours() > 12 ? "PM" : "AM"),
          's+': date.getSeconds()
        };
        Object.keys(o).forEach(index => {
          const str = String(o[index]);
          if (new RegExp(`(${index})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length));
          }
        });
        return fmt;
      })
      this.filter("formatWinnerName", function (data, fmt) {
        var name = data.trim().split(/\s+/);
        if (fmt == 0) {
          return data;
        } else if (fmt == 1) { //"FIRSTINITIAL-LAST"
          return name[0][0] + "., " + name[1];
        } else if (fmt == 2) { //"FIRST-LASTINITIAL"
          return name[0] + ", " + name[1][0] + ".";
        }
      })
  }
);