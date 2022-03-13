export class Queue extends Array {
    constructor() {
        super()
        Object.defineProperty(this, "head", { value: 0, writable: true });
    }
    remove(index) {
        this.splice(index, 1)
        return this;
    }
    enqueue(x) {
        this.push(x);
        return this;
    }
    dequeue() {
        var first;
        return this.head < this.length ? (first = this[this.head], delete this[this.head++], first) : undefined;
    }
    peek() {
        return this[this.head];
    }
    size() {
        return this.length
    }
}