//! Module responsible for building the `Filter` object used in the Transaction stream.

enum Operator {
  AND = 1,
  OR = 2,
}

interface FilterKV {
  Key: string;
  Value: string;
}

interface Node {
  Operand?: FilterKV;
  Operator?: Operator;
  Nodes?: Array<Node>;
}

interface Filter {
  Root: Node;
}

type FilterOp = (f: Filter, n?: Node) => void;

export function or(...ops: FilterOp[]): FilterOp {
  return function (f, n) {
    let newNode = {
      Operator: Operator.OR,
    };
    if (!n) {
      f.Root = newNode;
    } else {
      if (n.Nodes) {
        n.Nodes.push(newNode);
      } else {
        n.Nodes = new Array(newNode);
      }
    }

    for (let op of ops) {
      op(f, newNode);
    }
  };
}

export function and(...ops: FilterOp[]): FilterOp {
  return function (f, n) {
    let newNode = {
      Operator: Operator.AND,
    };
    if (!n) {
      f.Root = newNode;
    } else {
      if (n.Nodes) {
        n.Nodes.push(newNode);
      } else {
        n.Nodes = new Array(newNode);
      }
    }

    for (let op of ops) {
      op(f, newNode);
    }
  };
}

export function to(to: string): FilterOp {
  return function (f, n) {
    let newNode = {
      Operand: {
        Key: "to",
        Value: hexToBase64(to),
      },
    };

    if (!n) {
      f.Root = newNode;
    } else {
      if (n.Nodes) {
        n.Nodes.push(newNode);
      } else {
        n.Nodes = new Array(newNode);
      }
    }
  };
}

export function from(from: string): FilterOp {
  return function (f, n) {
    let newNode = {
      Operand: {
        Key: "from",
        Value: hexToBase64(from),
      },
    };

    if (!n) {
      f.Root = newNode;
    } else {
      if (n.Nodes) {
        n.Nodes.push(newNode);
      } else {
        n.Nodes = new Array(newNode);
      }
    }
  };
}

export class FilterBuilder {
  private _filter: Filter;
  private _next: Node | undefined;
  private _last: Node | undefined;

  public constructor(rootOp: FilterOp) {
    let f = {} as Filter;

    rootOp(f, undefined);
    this._filter = f;
  }

  // public get or(): FilterBuilder {
  //   let newNode = {
  //     Operator: Operator.OR,
  //   };

  //   if (!this._filter.Root) {
  //     this._filter.Root = newNode;
  //   } else {
  //     if (this._next!.Nodes) {
  //       this._next!.Nodes.push(newNode);
  //     } else {
  //       this._next!.Nodes = new Array();
  //       this._next!.Nodes.push(newNode);
  //     }
  //   }

  //   this._last = this._next;
  //   this._next = newNode;

  //   return this;
  // }

  // public get and(): FilterBuilder {
  //   let newNode = {
  //     Operator: Operator.AND,
  //   };

  //   if (!this._filter.Root) {
  //     this._filter.Root = newNode;
  //   } else {
  //     if (this._next!.Nodes) {
  //       this._next!.Nodes.push(newNode);
  //     } else {
  //       this._next!.Nodes = new Array();
  //       this._next!.Nodes.push(newNode);
  //     }
  //   }

  //   this._last = this._next;
  //   this._next = newNode;

  //   return this;
  // }

  // public get exit(): FilterBuilder {
  //   this._next = this._last;
  //   return this;
  // }

  // public from(address: string): FilterBuilder {
  //   address = hexToBase64(address);

  //   let newNode = {
  //     Operand: {
  //       Key: 'from',
  //       Value: address,
  //     },
  //   };

  //   // If there's no root yet, set it here
  //   if (!this._filter.Root) {
  //     this._filter.Root = newNode;
  //     this._next = newNode;
  //   } else {
  //     // Else append as a child
  //     // If we get here, we can be sure that this._next is defined
  //     if (this._next!.Nodes) {
  //       this._next!.Nodes.push(newNode);
  //     } else {
  //       this._next!.Nodes = new Array();
  //       this._next!.Nodes.push(newNode);
  //     }

  //   }

  //   return this;
  // }

  // public to(address: string): FilterBuilder {
  //   address = hexToBase64(address);

  //   let newNode = {
  //     Operand: {
  //       Key: 'to',
  //       Value: address,
  //     },
  //   };

  //   // If there's no root yet, set it here
  //   if (!this._filter.Root) {
  //     this._filter.Root = newNode;
  //     this._next = newNode;
  //   } else {
  //     // Else append as a child
  //     // If we get here, we can be sure that this._next is defined
  //     if (this._next!.Nodes) {
  //       this._next!.Nodes.push(newNode);
  //     } else {
  //       this._next!.Nodes = new Array();
  //       this._next!.Nodes.push(newNode);
  //     }

  //   }

  //   return this;
  // }

  public toString(): string {
    return JSON.stringify(this._filter, null, 2);
  }

  build(): Uint8Array {
    return new Uint8Array(Buffer.from(JSON.stringify(this._filter)));
  }
}

function hexToBase64(str: string) {
  if (str.substring(0, 2) == "0x") {
    str = str.slice(2);
  }

  return Buffer.from(str, "hex").toString("base64");
}
