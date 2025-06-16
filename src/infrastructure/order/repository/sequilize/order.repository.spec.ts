import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    // Create customer
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    // Create products
    const productRepository = new ProductRepository();
    const product1 = new Product("123", "Product 1", 10);
    await productRepository.create(product1);
    const product2 = new Product("456", "Product 2", 20);
    await productRepository.create(product2);

    // Create order with one item
    const orderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      2
    );
    const order = new Order("123", "123", [orderItem1]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // Update order with two items
    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      3
    );
    const updatedOrderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      1
    );
    const updatedOrder = new Order("123", "123", [updatedOrderItem1, orderItem2]);
    await orderRepository.update(updatedOrder);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: updatedOrder.total(),
      items: expect.arrayContaining([
        expect.objectContaining({
          id: updatedOrderItem1.id,
          name: updatedOrderItem1.name,
          price: updatedOrderItem1.price,
          quantity: updatedOrderItem1.quantity,
          order_id: "123",
          product_id: "123",
        }),
        expect.objectContaining({
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: "123",
          product_id: "456",
        }),
      ]),
    });
  });

  it("should find an order", async () => {
    // Create customer
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    // Create product
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    // Create order
    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // Find order
    const foundOrder = await orderRepository.find("123");

    expect(foundOrder).toEqual(order);
    expect(foundOrder.id).toBe(order.id);
    expect(foundOrder.customerId).toBe(order.customerId);
    expect(foundOrder.items).toHaveLength(1);
    expect(foundOrder.items[0].id).toBe(orderItem.id);
    expect(foundOrder.items[0].name).toBe(orderItem.name);
    expect(foundOrder.items[0].price).toBe(orderItem.price);
    expect(foundOrder.items[0].quantity).toBe(orderItem.quantity);
    expect(foundOrder.items[0].productId).toBe(orderItem.productId);
    expect(foundOrder.total()).toBe(order.total());
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();

    await expect(orderRepository.find("456")).rejects.toThrow("Order not found");
  });

  it("should find all orders", async () => {
    // Create customer
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    // Create products
    const productRepository = new ProductRepository();
    const product1 = new Product("123", "Product 1", 10);
    await productRepository.create(product1);
    const product2 = new Product("456", "Product 2", 20);
    await productRepository.create(product2);

    // Create orders
    const orderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      2
    );
    const order1 = new Order("123", "123", [orderItem1]);

    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      3
    );
    const order2 = new Order("456", "123", [orderItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    // Find all orders
    const foundOrders = await orderRepository.findAll();

    expect(foundOrders).toHaveLength(2);

    const foundOrder1 = foundOrders.find(order => order.id === order1.id);
    const foundOrder2 = foundOrders.find(order => order.id === order2.id);

    expect(foundOrder1.id).toBe(order1.id);
    expect(foundOrder1.customerId).toBe(order1.customerId);
    expect(foundOrder1.items).toHaveLength(1);
    expect(foundOrder1.items[0].id).toBe(orderItem1.id);
    expect(foundOrder1.total()).toBe(order1.total());

    expect(foundOrder2.id).toBe(order2.id);
    expect(foundOrder2.customerId).toBe(order2.customerId);
    expect(foundOrder2.items).toHaveLength(1);
    expect(foundOrder2.items[0].id).toBe(orderItem2.id);
    expect(foundOrder2.total()).toBe(order2.total());
  });
});
