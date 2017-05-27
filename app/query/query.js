function QueryProduct(userId,Product)
{
    AmazonSearch(Product);
    MercadoLibreSearch(Product);
    WalMartSearch(Product);
    return 'hola uto' + userId + Product;
}

function AmazonSearch(Product)
{
    var ProductName = '';
    return {}
}

function MercadoLibreSearch(Product)
{

}

function WalMartSearch(Product)
{

}

exports.QueryProduct = QueryProduct