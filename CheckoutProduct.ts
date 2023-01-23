import { PromotionRule } from "../Promotion/Promotion";

export class Money {
    constructor(value:number){
        this.value = value;
    }
    value:number;
    valueOf():number{
        return Math.round(this.value.valueOf() * 100) / 100
    }
}

class Product {
    constructor(id: string, price: number) {
        this.id = id
        this.price = price
    }
    id: string;
    price: number;
    name: string;
}

const products = new Map<string, Product>([
    ['0001', { id: '0001', price: 24.95, name: 'Water Bottle' }],
    ['0002', { id: '0002', price: 65.00, name: 'Hoodie' }],
    ['0003', { id: '0003', price: 3.99, name: 'Sticker Set' }]
]);

class CheckoutProduct extends Product {
    constructor(id: string, price: number, count: number) {
        super(id,price)
        this.discountPrice = price
        this.count = count;
    }

    discountPrice: number
    count: number
}

export class Checkout {

    constructor() {
        this.products = []
        this.totalPrice = new Money(0)
        this.totalPriceBeforeDiscount = new Money(0)
    }

    products: Array<CheckoutProduct>;
    totalPrice: Money;
    totalPriceBeforeDiscount: Money;
}

export class CheckoutService {

    constructor(promotionRules: Array<PromotionRule>) {
        this.promotionRules = promotionRules.sort((rule1, rule2) => rule1.priority - rule2.priority);
        this.checkout = new Checkout()
    }

    checkout: Checkout;
    promotionRules: Array<PromotionRule>;

    scan(items: Array<string>):void {
        const checkoutProductsMap = new Map<string, CheckoutProduct>();
        items.forEach(item => {
            if (checkoutProductsMap.get(item)){
                checkoutProductsMap.get(item)!.count++;
            } else {
                const product = products.get(item);
                checkoutProductsMap.set(item, new CheckoutProduct(product!.id, product!.price, 1))
            }
        });
        this.checkout.products = Array.from(checkoutProductsMap.values());

        const totalBD = this.checkout.products.reduce((sum, product) => sum + product.price * product.count, 0);
        const total = this.checkout.products.reduce((sum, product) => sum + product.discountPrice * product.count, 0);
        this.checkout.totalPrice = new Money(total);
        this.checkout.totalPriceBeforeDiscount = new Money(totalBD);
    }

    total():string {
        this.promotionRules.forEach(rule => rule.apply(this.checkout))
        return `Total Price: ${this.checkout.totalPriceBeforeDiscount.valueOf()}, Discount applied ${this.checkout.totalPrice.valueOf()}`
    }

}