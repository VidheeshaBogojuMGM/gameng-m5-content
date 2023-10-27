Copy rg folder at below path:
\reference_contents\rg

Update IPAddress on below files with m5ServerIP and rgServerIP server addresses (if using secure endpoint; use https instead of http on below files with DNS name of cert applied):
\reference_contents\rg\js\config.js
\reference_contents\rg\js\config.kiosk.js
\reference_contents\rg\js\configHoriz.js
\reference_contents\rg\js\worker\responsibleGamingWorker.js
\reference_contents\rg\js\worker\responsibleGamingWorkerHoriz.js

Verify navigate path for PlayMyWay/yourPlay button in \reference_contents\components\spa_session_compoent.htm
      yourPlay() {
        //this.$store.dispatch("waitForNavigateToVpcLas");
		if (this.isVertical) {
			navigate('./rg/index.html');
		} else {
			navigate('./rg/indexHoriz.html');
		}
      }
    },

Refresh m5 at EGM once RG is all configured and test.