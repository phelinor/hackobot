function QueryProduct(userId,product)
{
    var result = [];
    var amazon  = AmazonSearch(product);
    var mercado = MercadoLibreSearch(product);
    var walmart = WalMartSearch(product);
    result.push(amazon);
    result.push(mercado);
    result.push(walmart);
    return result;    
}

function AmazonSearch(product)
{
    var productName = product;
    var price = "20.00";
    var store = "Amazon"
    return {ProductName:productName,Price:price,Store:store}
}

function MercadoLibreSearch(product)
{
    var productName = product;
    var price = "15.00";
    var store = "Mercado Libre"
    return {ProductName:productName,Price:price,Store:store}
}

function WalMartSearch(product)
{
    var productName = product;
    var price = "25.00";
    var store = "Wal Mart"
    return {ProductName:productName,Price:price,Store:store}
}

exports.QueryProduct = QueryProduct