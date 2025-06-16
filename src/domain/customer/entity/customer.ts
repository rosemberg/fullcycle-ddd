import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../event/customer-created.event";
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log2.handler";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import EnviaConsoleLogHandler from "../event/handler/envia-console-log-address-changed.handler";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;
  private eventDispatcher: EventDispatcher;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();

    this.eventDispatcher = new EventDispatcher();
    const customerCreatedEvent = new CustomerCreatedEvent({
      id: this.id,
      name: this.name,
    });

    this.registerEventHandlers();
    this.eventDispatcher.notify(customerCreatedEvent);
  }

  private registerEventHandlers(): void {
    this.eventDispatcher.register("CustomerCreatedEvent", new EnviaConsoleLog1Handler());
    this.eventDispatcher.register("CustomerCreatedEvent", new EnviaConsoleLog2Handler());
    this.eventDispatcher.register("CustomerAddressChangedEvent", new EnviaConsoleLogHandler());
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: this.id,
      name: this.name,
      address: address.toString(),
    });

    this.eventDispatcher.notify(customerAddressChangedEvent);
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
