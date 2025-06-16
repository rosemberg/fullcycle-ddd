import OrderFactory from "./order.factory";
import Order from "../entity/order";

describe("Order factory unit tests", () => {
  it("should create an order", () => {
    const orderProps = {
      id: "123",
      customerId: "c123",
      items: [
        {
          id: "i1",
          name: "Item 1",
          productId: "p1",
          quantity: 2,
          price: 10
        }
      ]
    };

    const order = OrderFactory.create(orderProps);

    expect(order).toBeInstanceOf(Order);
    expect(order.id).toBe(orderProps.id);
    expect(order.customerId).toBe(orderProps.customerId);
    expect(order.items.length).toBe(1);
    expect(order.items[0].id).toBe(orderProps.items[0].id);
    expect(order.items[0].name).toBe(orderProps.items[0].name);
    expect(order.items[0].productId).toBe(orderProps.items[0].productId);
    expect(order.items[0].quantity).toBe(orderProps.items[0].quantity);
    expect(order.items[0].price).toBe(orderProps.items[0].price);
    expect(order.total()).toBe(20); // 2 * 10 = 20
  });
});