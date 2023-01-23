import { Checkout, Money } from "./CheckoutProduct";

export abstract class PromotionRule {
    priority: number;

    constructor(priority: number) {
        this.priority = priority;
    }

    abstract apply(checkout: Checkout): void;
}

export class FixPricePromotionRule extends PromotionRule {
    constructor(priority: number, minCount: number, idFixPriceMap: Map<string, number>) {
        super(priority);
        this.minCount = minCount;
        this.idFixPriceMap = idFixPriceMap;
    }
    minCount: number;
    idFixPriceMap: Map<string, number>;

    apply(checkout: Checkout) {
        const idsFor = Array.from(this.idFixPriceMap.keys());

        checkout.products.forEach(product => {
            if (idsFor.includes(product.id) && product.count >= this.minCount)
                product.discountPrice = this.idFixPriceMap.get(product.id)!
        });

        const total = checkout.products.reduce((sum, product) => sum + product.discountPrice * product.count, 0);
        checkout.totalPrice = new Money(total);
    }
}

export class TotalPricePromotionRule extends PromotionRule {
    constructor(priority: number, minAmount: number, disCountPer: number) {
        super(priority);
        this.minAmount = minAmount;
        this.disCountPer = disCountPer;
    }
    minAmount: number;
    disCountPer: number;

    apply(checkout: Checkout) {
        if (checkout.totalPrice.valueOf() > this.minAmount) {
            checkout.totalPrice = new Money(checkout.totalPrice.valueOf() * (100 - this.disCountPer) / 100);
        }
    }

}