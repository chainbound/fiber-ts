declare enum Operator {
    AND = 1,
    OR = 2
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
export declare function or(...ops: FilterOp[]): FilterOp;
export declare function and(...ops: FilterOp[]): FilterOp;
export declare function to(to: string): FilterOp;
export declare function from(from: string): FilterOp;
export declare class FilterBuilder {
    private _filter;
    private _next;
    private _last;
    constructor(rootOp: FilterOp);
    toString(): string;
    build(): Uint8Array;
}
export {};
