Banner.mapToken("0x31", "cardId");
Banner.watch("cardId", function(cardId){
    if (cardId === "0") {
        IGTMediaElements.contentCache.deleteStateElement("pointMultiplier").catch(err => console.log(err));
    }
});