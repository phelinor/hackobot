var request = require('request');

function QueryProduct(userId,product)
{
   return Promise.all([MercadoLibreSearch(product), AmazonSearch(product), WalMartSearch(product)]);
}

function AmazonSearch(product)
{
    var productName = "EVGA GeForce GTX 1080 Ti Founders Edition GeForce GTX 1080 TI 11GB GDDR5X - Tarjeta gráfica (NVIDIA, GeForce GTX 1080 TI, 7680 x 4320 Pixeles, 1480 MHz, 1582 MHz, 11 GB)";
    var price = 15216.96;
    var store = "Amazon";
    var url = "https://www.amazon.com.mx/EVGA-GeForce-1080-Founders-GDDR5X/dp/B06XH2P8DD/ref=sr_1_1?ie=UTF8&qid=1495934665&sr=8-1&keywords=evga+1080+ti";
    return {status:"ok",product:{ProductName:productName,Price:price,Store:store,Url:url}}
}

function MercadoLibreSearch(product)
{
    return new Promise((resolve, reject) => {
         request('https://api.mercadolibre.com/sites/MLM/search?q='+product+'&sort=price_desc&limit=1', function (error, response, body) {
            if(error) reject({status:"Error",error:error});
            body = JSON.parse(body);
            if(body.results.length > 0)
                resolve({status:"ok",product:{ProductName:body.results[0].title,Price:body.results[0].price,Store:"Mercado libre",Url:body.results[0].permalink}});
            else reject({status:"Error",error:"producto no encontrado"});
        });
    });
}

function WalMartSearch(product)
{
    token = process.env.WALMART_TOKEN;
    return new Promise((resolve, reject) => {
         request('http://api.walmartlabs.com/v1/search?query=' + product + '&format=json&apiKey=' + token + '&sort=price&order=desc', function (error, response, body) {
            if(error) reject({status:"Error",error:error});
            body = JSON.parse(body);
            if(body.items && body.items.length > 0)
                resolve( {status:"ok",product:{ProductName:body.items[0].name,Price:body.items[0].salePrice * 18.51,Store:"Walt Mart"}});
            else reject({status:"Error",error:"producto no encontrado"});
        });
    });
}

exports.QueryProduct = QueryProduct