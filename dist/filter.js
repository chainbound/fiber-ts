"use strict";
//! Module responsible for building the `Filter` object used in the Transaction stream.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterBuilder = exports.from = exports.to = exports.and = exports.or = void 0;
var Operator;
(function (Operator) {
    Operator[Operator["AND"] = 1] = "AND";
    Operator[Operator["OR"] = 2] = "OR";
})(Operator || (Operator = {}));
function or(...ops) {
    return function (f, n) {
        let newNode = {
            Operator: Operator.OR,
        };
        if (!n) {
            f.Root = newNode;
        }
        else {
            if (n.Nodes) {
                n.Nodes.push(newNode);
            }
            else {
                n.Nodes = new Array(newNode);
            }
        }
        for (let op of ops) {
            op(f, newNode);
        }
    };
}
exports.or = or;
function and(...ops) {
    return function (f, n) {
        let newNode = {
            Operator: Operator.AND,
        };
        if (!n) {
            f.Root = newNode;
        }
        else {
            if (n.Nodes) {
                n.Nodes.push(newNode);
            }
            else {
                n.Nodes = new Array(newNode);
            }
        }
        for (let op of ops) {
            op(f, newNode);
        }
    };
}
exports.and = and;
function to(to) {
    return function (f, n) {
        let newNode = {
            Operand: {
                Key: "to",
                Value: hexToBase64(to),
            },
        };
        if (!n) {
            f.Root = newNode;
        }
        else {
            if (n.Nodes) {
                n.Nodes.push(newNode);
            }
            else {
                n.Nodes = new Array(newNode);
            }
        }
    };
}
exports.to = to;
function from(from) {
    return function (f, n) {
        let newNode = {
            Operand: {
                Key: "from",
                Value: hexToBase64(from),
            },
        };
        if (!n) {
            f.Root = newNode;
        }
        else {
            if (n.Nodes) {
                n.Nodes.push(newNode);
            }
            else {
                n.Nodes = new Array(newNode);
            }
        }
    };
}
exports.from = from;
class FilterBuilder {
    constructor(rootOp) {
        let f = {};
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
    toString() {
        return JSON.stringify(this._filter, null, 2);
    }
    build() {
        return new Uint8Array(Buffer.from(JSON.stringify(this._filter)));
    }
}
exports.FilterBuilder = FilterBuilder;
function hexToBase64(str) {
    if (str.substring(0, 2) == "0x") {
        str = str.slice(2);
    }
    return Buffer.from(str, "hex").toString("base64");
}
