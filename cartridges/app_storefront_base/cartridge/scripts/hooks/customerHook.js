module.exports.afterPOST = function (basket, res) {

    //the list can be filled programaticlly
    var additionalProductList = ["sony-nwz-s738fbnM", "samsung-ypk3M", "microsoft-zune120M", "toshiba-meu202-bkM"];
    function addBonusProduct(product) {
        var productPrice = product.priceModel.price.value;
        var isMainProduct = !additionalProductList.includes(product.ID);

        if (productPrice > 0) {
            if (productPrice >= 10 && productPrice <= 19) {
                if (isMainProduct) {
                    //add $5 product id- sony-nwz-s738fbnM 
                    basket.createProductLineItem('sony-nwz-s738fbnM', basket.shipments[0]);
                }
            }
            if (productPrice >= 20 && productPrice <= 29) {
                if (isMainProduct) {
                    // $7 product id- samsung-ypk3M
                    basket.createProductLineItem('samsung-ypk3M', basket.shipments[0]);
                }
            }
            if (productPrice >= 30 && productPrice <= 99) {
                if (isMainProduct) {
                    // $11 product id- microsoft-zune120M
                    basket.createProductLineItem('microsoft-zune120M', basket.shipments[0]);
                }
            }
            if (productPrice >= 100) {
                if (isMainProduct) {
                    // $21 product id- toshiba-meu202-bkM
                    basket.createProductLineItem('toshiba-meu202-bkM', basket.shipments[0]);
                }
            }
        }
    }

    for (let index = 0; index < basket.productLineItems.length; index++) {
        var product = basket.productLineItems[index].getProduct();
        addBonusProduct(product);
    }
}