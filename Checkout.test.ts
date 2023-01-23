import { CheckoutService } from "./Product/CheckoutProduct";
import { FixPricePromotionRule, TotalPricePromotionRule } from "./Promotion/Promotion";

it('first test', () => {
    const fixPricePromotionRule = new FixPricePromotionRule(1, 2, new Map<string, number>([['0001', 22.99]]));
    const totalPricePromotionRule = new TotalPricePromotionRule(2, 75, 10);

    const checkout = new CheckoutService([fixPricePromotionRule, totalPricePromotionRule])
    checkout.scan(['0001', '0001', '0001'])

    expect(checkout.total()).toBe('Total Price: 74.85, Discount applied 68.97')
});


it('first test', () => {
    const fixPricePromotionRule = new FixPricePromotionRule(1, 2, new Map<string, number>([['0001', 22.99], ['0002', 60.99]]));
    const totalPricePromotionRule = new TotalPricePromotionRule(2, 75, 10);

    const checkout = new CheckoutService([fixPricePromotionRule, totalPricePromotionRule])
    checkout.scan(['0001', '0001', '0002', '0003', '0002'])

    expect(checkout.total()).toBe('Total Price: 183.89, Discount applied 154.76')
});


it('first test', () => {
    const fixPricePromotionRule = new FixPricePromotionRule(1, 2, new Map<string, number>([['0001', 22.99]]));
    const totalPricePromotionRule = new TotalPricePromotionRule(2, 75, 10);
    const totalPricePromotionRule2 = new TotalPricePromotionRule(3, 80, 10);

    const checkout = new CheckoutService([totalPricePromotionRule, fixPricePromotionRule,totalPricePromotionRule2])
    checkout.scan(['0001', '0001', '0001', '0001'])

    expect(checkout.total()).toBe('Total Price: 99.8, Discount applied 74.48')
});

it('first test', () => {
    const fixPricePromotionRule = new FixPricePromotionRule(1, 2, new Map<string, number>([['0001', 22.99]]));
    const totalPricePromotionRule = new TotalPricePromotionRule(2, 75, 10);

    const checkout = new CheckoutService([fixPricePromotionRule, totalPricePromotionRule])
    checkout.scan([])

    expect(checkout.total()).toBe('Total Price: 0, Discount applied 0')
});