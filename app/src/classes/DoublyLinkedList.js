export class Node {
  constructor(data=null, prev=null, next=null) {
    this.data = data;
    this.prev = prev;
    this.next = next;
  }
}
export class DoublyLinkedList {
  constructor(head=null) {
    this.head = head;
    this.tail = head;
    this.size = 0;
  }
  appendToTail(data) {
    const newNode = new Node(data);
    this.size++;

    // if the list has length >= 3
    if (this.size >= 3) {
      newNode.prev = this.tail;
      newNode.next = this.head;
      this.tail.next = newNode;
      this.head.prev = newNode;
      this.tail = newNode;
      return;
    }

    // if the list has length >= 2
    if (this.tail && this.tail !== this.head) {
      this.tail.next = newNode;
      this.tail = newNode;
      newNode.prev = this.tail;
      newNode.next = this.head;
      this.head.prev = newNode;
      return;
    }

    // if the list has length === 0
    if (!this.tail && this.tail === this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.prev = newNode;
      newNode.next = newNode;
      return;
    }

    // if the list has length === 1
    this.head.next = newNode;
    this.tail = newNode;
    newNode.prev = this.head;
    newNode.next = this.head;
    this.head.prev = newNode;
  }
  contains(data) {
    let curr = this.head;
    do {
      if (curr.data === data) return true;
      curr = curr.next;
    } while (curr !== this.head);
    return false;
  }
  print() {
    let curr = this.head;
    do {
      // console.log(curr.data);
      if (curr) // console.log(curr.data.title);
      curr = curr.next;
    } while (curr !== this.head);
  }
  length() {
    return this.size;
  }
}
