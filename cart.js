export class Cart {
  constructor(products) {
    this.products = products;
    this.cart = [];
  }

  getCart() {
    return this.cart;
  }

  async addToCart(productName, quantity) {
    const product = this.products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );

    if (!product) return "Product not found";
    if (product.quantity < quantity) return "Insufficient stock";

    this.cart.push({ ...product, quantity });
    product.quantity -= quantity;

    return this.cart;
  }
}
